import { GoogleGenAI } from "@google/genai";
import { getKnowledgeContext, getSystemPrompt } from "./knowledge";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface StreamChunk {
  type: "token" | "meta" | "done" | "error";
  text?: string;
  model?: string;
  error?: string;
  ttftMs?: number;
  totalMs?: number;
}

export interface AIResponse {
  success: boolean;
  message?: string;
  error?: string;
  code?:
    | "API_KEY_MISSING"
    | "RATE_LIMITED"
    | "PROVIDER_ERROR"
    | "TIMEOUT"
    | "INVALID_INPUT"
    | "SERVICE_UNAVAILABLE";
  provider?: string;
  model?: string;
  metrics?: {
    ttftMs?: number;
    totalMs?: number;
    modelUsed?: string;
  };
}

export interface ErrorClassification {
  status?: number;
  is503: boolean;
  is429: boolean;
  isQuotaExhausted: boolean;
  cleanMessage: string;
}

export function classifyError(err: unknown): ErrorClassification {
  const error = err as Error & { status?: number };
  let status = typeof error.status === "number" ? error.status : undefined;
  let rawMessage = error?.message || "";
  let cleanMessage = rawMessage;
  let isQuotaExhausted = false;

  try {
    const json = JSON.parse(rawMessage);
    if (json?.error) {
      if (typeof json.error.code === "number") status = json.error.code;
      if (json.error.message) cleanMessage = json.error.message;
      if (
        json.error.status === "RESOURCE_EXHAUSTED" ||
        rawMessage.toLowerCase().includes("quota")
      ) {
        isQuotaExhausted = true;
      }
    }
  } catch {
    // Not JSON
  }

  const lower = cleanMessage.toLowerCase();
  const is503 =
    status === 503 ||
    lower.includes("503") ||
    lower.includes("high demand") ||
    lower.includes("unavailable") ||
    error.name === "AbortError" ||
    lower.includes("timeout") ||
    lower.includes("aborted");

  const is429 =
    status === 429 ||
    lower.includes("429") ||
    lower.includes("resource_exhausted") ||
    lower.includes("rate limit") ||
    lower.includes("quota");

  return {
    status,
    is503,
    is429,
    isQuotaExhausted,
    cleanMessage,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Short jittered delay for 503 retry (300ms - 700ms)
 */
function getFastJitterMs(): number {
  return Math.floor(300 + Math.random() * 400);
}

/**
 * Generates streaming response from Gemini using official @google/genai SDK
 * with fast 503 single-retry and immediate fallback to secondary model.
 */
export async function* generateChatStream(
  messages: ChatMessage[]
): AsyncGenerator<StreamChunk, void, unknown> {
  const geminiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GEMINI_API ||
    process.env.GOOGLE_API_KEY;

  if (!geminiKey) {
    yield {
      type: "error",
      error:
        "The AI assistant is temporarily unavailable because the backend API key is not configured.",
    };
    return;
  }

  const preferredModel = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
  const fallbackModel = process.env.GEMINI_FALLBACK_MODEL || "gemini-3.5-flash";

  const ai = new GoogleGenAI({ apiKey: geminiKey });
  const { systemPrompt, maxOutputTokens, detectedDomains, isCompleteRequest } =
    getKnowledgeContext(messages);

  console.info(
    `[Gemini Stream] Detected domains: [${detectedDomains.join(", ")}], completeRequest: ${isCompleteRequest}, maxTokens: ${maxOutputTokens}`
  );

  // Keep last 8 relevant conversation messages
  const sanitizedMessages = messages.slice(-8).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content.slice(0, 1500) }],
  }));

  const requestStartTime = Date.now();
  console.info(`[Gemini Stream] Request received at ${new Date(requestStartTime).toISOString()}`);

  let activeModel = preferredModel;
  let firstTokenEmitted = false;
  let ttftMs: number | undefined;

  // Stream timeout: allow up to 55s for large streams (e.g. all 142 contests), 35s for complete lists
  const streamTimeoutMs =
    maxOutputTokens >= 4000 ? 55000 : isCompleteRequest ? 35000 : 25000;

  // Generator execution helper for a specific model
  async function* attemptModelStream(
    modelName: string,
    timeoutMs = streamTimeoutMs
  ): AsyncGenerator<string, void, unknown> {
    const stream = await ai.models.generateContentStream({
      model: modelName,
      contents: sanitizedMessages,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
        maxOutputTokens: maxOutputTokens,
        abortSignal: AbortSignal.timeout(timeoutMs),
      },
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        yield text;
      }
    }
  }

  // Attempt Preferred Model
  let primaryFailed = false;
  try {
    for await (const token of attemptModelStream(preferredModel, streamTimeoutMs)) {
      if (!firstTokenEmitted) {
        firstTokenEmitted = true;
        ttftMs = Date.now() - requestStartTime;
        console.info(
          `[Gemini Stream] TTFT (${preferredModel}): ${ttftMs}ms`
        );
        yield { type: "meta", model: preferredModel, ttftMs };
      }
      yield { type: "token", text: token };
    }
  } catch (err: unknown) {
    // If tokens were already sent to client, we cannot cleanly restart from fallback
    if (firstTokenEmitted) {
      console.error("[Gemini Stream] Error mid-stream on preferred model:", err);
      yield { type: "done", totalMs: Date.now() - requestStartTime };
      return;
    }

    primaryFailed = true;
    const classification = classifyError(err);
    console.warn(
      `[Gemini Stream] Preferred model "${preferredModel}" failed: ${classification.cleanMessage}`
    );

    // If HTTP 503 / High Demand, perform at most ONE fast retry with 300-700ms jitter
    if (classification.is503 && !classification.isQuotaExhausted) {
      const jitterDelay = getFastJitterMs();
      console.info(
        `[Gemini Stream] 503 high demand. Performing single fast retry in ${jitterDelay}ms...`
      );
      await sleep(jitterDelay);

      try {
        for await (const token of attemptModelStream(preferredModel, streamTimeoutMs)) {
          if (!firstTokenEmitted) {
            firstTokenEmitted = true;
            ttftMs = Date.now() - requestStartTime;
            console.info(
              `[Gemini Stream] TTFT after fast retry (${preferredModel}): ${ttftMs}ms`
            );
            yield { type: "meta", model: preferredModel, ttftMs };
          }
          yield { type: "token", text: token };
        }
        primaryFailed = false;
      } catch (retryErr: unknown) {
        console.warn(
          `[Gemini Stream] Fast retry on "${preferredModel}" failed. Immediately switching to fallback.`
        );
      }
    }
  }

  // Attempt Fallback Model if primary failed before emitting tokens
  if (primaryFailed && !firstTokenEmitted) {
    activeModel = fallbackModel;
    const fallbackStartTime = Date.now();
    console.warn(
      `[Gemini Stream] Activating fallback model "${fallbackModel}" at +${fallbackStartTime - requestStartTime}ms`
    );

    try {
      for await (const token of attemptModelStream(fallbackModel, streamTimeoutMs)) {
        if (!firstTokenEmitted) {
          firstTokenEmitted = true;
          ttftMs = Date.now() - requestStartTime;
          console.info(
            `[Gemini Stream] TTFT on fallback (${fallbackModel}): ${ttftMs}ms (total elapsed)`
          );
          yield {
            type: "meta",
            model: `${preferredModel} (fallback: ${fallbackModel})`,
            ttftMs,
          };
        }
        yield { type: "token", text: token };
      }
    } catch (fallbackErr: unknown) {
      console.error(
        `[Gemini Stream] Both primary and fallback models failed:`,
        fallbackErr
      );
      yield {
        type: "error",
        error:
          "Our AI assistant is temporarily unavailable. Please try again in a moment.",
      };
      return;
    }
  }

  const totalDurationMs = Date.now() - requestStartTime;
  console.info(
    `[Gemini Stream] Completed generation via ${activeModel} in ${totalDurationMs}ms (TTFT: ${ttftMs || 0}ms)`
  );
  yield { type: "done", totalMs: totalDurationMs, model: activeModel };
}

/**
 * Non-streaming fallback generation with single fast retry and fallback.
 */
export async function generateChatResponse(
  messages: ChatMessage[]
): Promise<AIResponse> {
  const geminiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GEMINI_API ||
    process.env.GOOGLE_API_KEY;

  if (!geminiKey) {
    return {
      success: false,
      code: "API_KEY_MISSING",
      error:
        "The AI assistant is temporarily unavailable because the backend API key is not configured.",
    };
  }

  const preferredModel = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
  const fallbackModel = process.env.GEMINI_FALLBACK_MODEL || "gemini-3.5-flash";

  const t0 = Date.now();
  let accumulatedText = "";
  let modelUsed = preferredModel;
  let ttftMs: number | undefined;

  try {
    for await (const chunk of generateChatStream(messages)) {
      if (chunk.type === "meta") {
        modelUsed = chunk.model || modelUsed;
        ttftMs = chunk.ttftMs;
      } else if (chunk.type === "token" && chunk.text) {
        accumulatedText += chunk.text;
      } else if (chunk.type === "error") {
        return {
          success: false,
          code: "SERVICE_UNAVAILABLE",
          error: chunk.error,
        };
      }
    }

    return {
      success: true,
      message: accumulatedText.trim(),
      provider: "Gemini",
      model: modelUsed,
      metrics: {
        ttftMs,
        totalMs: Date.now() - t0,
        modelUsed,
      },
    };
  } catch (err: unknown) {
    console.error("[generateChatResponse Error]:", err);
    return {
      success: false,
      code: "SERVICE_UNAVAILABLE",
      error:
        "Our AI assistant is temporarily unavailable. Please try again in a moment.",
    };
  }
}
