import { GoogleGenAI } from "@google/genai";
import { getSystemPrompt } from "./knowledge";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
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
}

export interface ErrorClassification {
  status?: number;
  is503: boolean;
  is429: boolean;
  isQuotaExhausted: boolean;
  retryAfterMs?: number;
  cleanMessage: string;
}

/**
 * Classifies API errors into actionable categories (503 high demand, 429 rate limit/quota, etc.)
 * and sanitizes error messages so raw JSON/keys are never leaked.
 */
export function classifyError(err: unknown): ErrorClassification {
  const error = err as Error & { status?: number; code?: number | string };
  let status = typeof error.status === "number" ? error.status : undefined;
  let rawMessage = error?.message || "";
  let cleanMessage = rawMessage;
  let isQuotaExhausted = false;
  let retryAfterMs: number | undefined;

  // Try parsing JSON error strings (e.g. from Google API: {"error":{"code":503,...}})
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
    // Not JSON string
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
    lower.includes("too many requests") ||
    lower.includes("resource_exhausted") ||
    lower.includes("rate limit") ||
    lower.includes("quota");

  // Check for Retry-After hints (e.g. "retry after 3s")
  const match = lower.match(/retry(?:-|\s+)after\s+(\d+)/);
  if (match) {
    const seconds = parseInt(match[1], 10);
    if (!isNaN(seconds) && seconds > 0) {
      retryAfterMs = seconds * 1000;
    }
  }

  return {
    status,
    is503,
    is429,
    isQuotaExhausted,
    retryAfterMs,
    cleanMessage,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculates exponential backoff with small random jitter:
 * Attempt 0 -> ~1000ms
 * Attempt 1 -> ~2000ms
 * Attempt 2 -> ~4000ms
 */
function calculateBackoffWithJitter(attempt: number, baseMs = 1000): number {
  const exponential = baseMs * Math.pow(2, attempt);
  const jitter = Math.floor(Math.random() * 500); // 0-500ms random jitter
  return exponential + jitter;
}

/**
 * Executes a single generateContent request against the official @google/genai SDK
 * with an individual per-attempt abort timeout.
 */
async function generateWithSingleModel(
  ai: GoogleGenAI,
  model: string,
  contents: { role: string; parts: { text: string }[] }[],
  systemPrompt: string,
  timeoutMs = 10000
): Promise<string> {
  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.35,
      maxOutputTokens: 1000,
      abortSignal: AbortSignal.timeout(timeoutMs),
    },
  });

  const text = response.text?.trim();
  if (!text) {
    throw new Error("No text response received from model.");
  }
  return text;
}

/**
 * Calls Google Gemini API with automatic exponential retry on HTTP 503/high-demand
 * and automatic fallback to a resilient secondary model if primary fails.
 */
async function callGemini(
  apiKey: string,
  messages: ChatMessage[],
  preferredModel = process.env.GEMINI_MODEL || "gemini-3.8-flash",
  fallbackModel = process.env.GEMINI_FALLBACK_MODEL || "gemini-3.5-flash-lite"
): Promise<{ text: string; modelUsed: string }> {
  const ai = new GoogleGenAI({ apiKey });
  const systemPrompt = getSystemPrompt();

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  let lastError: unknown;

  // Step 1: Attempt Preferred Model with up to 3 retries for 503 / high demand
  const maxPreferredRetries = 3;
  for (let attempt = 0; attempt < maxPreferredRetries; attempt++) {
    try {
      console.info(
        `[Gemini API] Requesting preferred model "${preferredModel}" (attempt ${attempt + 1}/${maxPreferredRetries})`
      );
      const text = await generateWithSingleModel(
        ai,
        preferredModel,
        contents,
        systemPrompt,
        10000
      );
      return { text, modelUsed: preferredModel };
    } catch (err: unknown) {
      lastError = err;
      const classification = classifyError(err);
      console.warn(
        `[Gemini API] Preferred model "${preferredModel}" attempt ${attempt + 1} failed: ${classification.cleanMessage}`
      );

      // Handle 429 Rate limits / Quota
      if (classification.is429) {
        if (classification.isQuotaExhausted) {
          console.warn(
            `[Gemini API] Quota exhausted for "${preferredModel}". Bypassing retries and falling back immediately.`
          );
          break;
        }

        // Per-minute rate limit: wait if Retry-After is short, otherwise move to fallback
        const delay =
          classification.retryAfterMs || calculateBackoffWithJitter(attempt);
        if (delay <= 5000 && attempt < maxPreferredRetries - 1) {
          console.info(
            `[Gemini API] Rate limit encountered. Waiting ${delay}ms before retry...`
          );
          await sleep(delay);
          continue;
        } else {
          break;
        }
      }

      // Handle 503 / High Demand / Timeout
      if (classification.is503) {
        if (attempt < maxPreferredRetries - 1) {
          const delay = calculateBackoffWithJitter(attempt);
          console.info(
            `[Gemini API] Model "${preferredModel}" returned 503/high demand. Backing off for ${delay}ms before retry ${attempt + 2}...`
          );
          await sleep(delay);
          continue;
        }
      } else {
        // Non-transient error (e.g. 400 bad request, 404 model not found)
        break;
      }
    }
  }

  // Step 2: Automatic Model Fallback
  // If primary model continues failing, attempt the configured fallback model(s)
  const candidateFallbacks = [
    fallbackModel,
    // If preferred was 3.8 and fallback was 3.5-flash-lite, 3.5-flash is also a strong candidate
    fallbackModel !== "gemini-3.5-flash" ? "gemini-3.5-flash" : "gemini-3.5-flash-lite",
  ].filter((m, idx, arr) => m && m !== preferredModel && arr.indexOf(m) === idx);

  for (const fallback of candidateFallbacks) {
    console.warn(
      `[Gemini API] Primary model "${preferredModel}" exhausted retries. Automatically falling back to "${fallback}"...`
    );

    const maxFallbackAttempts = 2;
    for (let fAttempt = 0; fAttempt < maxFallbackAttempts; fAttempt++) {
      try {
        const text = await generateWithSingleModel(
          ai,
          fallback,
          contents,
          systemPrompt,
          12000
        );
        return {
          text,
          modelUsed: `${preferredModel} (fallback: ${fallback})`,
        };
      } catch (fallbackErr: unknown) {
        lastError = fallbackErr;
        const fallbackClass = classifyError(fallbackErr);
        console.warn(
          `[Gemini API] Fallback model "${fallback}" attempt ${fAttempt + 1} failed: ${fallbackClass.cleanMessage}`
        );

        if (fallbackClass.is503 && fAttempt < maxFallbackAttempts - 1) {
          const delay = calculateBackoffWithJitter(fAttempt);
          console.info(
            `[Gemini API] Fallback model "${fallback}" 503. Retrying in ${delay}ms...`
          );
          await sleep(delay);
          continue;
        }
        break;
      }
    }
  }

  // If both preferred model and all fallback attempts fail, throw the classified error
  throw lastError;
}

/**
 * Calls OpenAI or OpenAI-compatible REST API (e.g., Groq, Together, OpenRouter)
 */
async function callOpenAICompatible(
  apiKey: string,
  messages: ChatMessage[],
  baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
  model = process.env.OPENAI_MODEL || "gpt-4o-mini"
): Promise<{ text: string; modelUsed: string }> {
  const systemPrompt = getSystemPrompt();

  const formattedMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    })),
  ];

  const response = await fetch(`${baseUrl.replace(/\/+$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: formattedMessages,
      temperature: 0.35,
      max_tokens: 1000,
    }),
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg =
      errorData?.error?.message || `API returned HTTP ${response.status}`;
    throw new Error(errorMsg);
  }

  const data = await response.json();
  const text =
    data?.choices?.[0]?.message?.content ||
    "I'm sorry, I could not generate a response at this time.";

  return { text, modelUsed: model };
}

/**
 * Generate AI Response using whichever provider is configured
 */
export async function generateChatResponse(
  messages: ChatMessage[]
): Promise<AIResponse> {
  const geminiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GEMINI_API ||
    process.env.GOOGLE_API_KEY;
  const openAIKey = process.env.OPENAI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  if (!geminiKey && !openAIKey && !groqKey) {
    return {
      success: false,
      code: "API_KEY_MISSING",
      error:
        "The AI assistant is temporarily unavailable because the server API key is not configured. Please ensure GEMINI_API_KEY is configured in your deployment environment.",
    };
  }

  try {
    let replyText = "";
    let providerName = "";
    let modelName = "";

    if (geminiKey) {
      providerName = "Gemini";
      const result = await callGemini(geminiKey, messages);
      replyText = result.text;
      modelName = result.modelUsed;
    } else if (openAIKey) {
      providerName = "OpenAI";
      const result = await callOpenAICompatible(openAIKey, messages);
      replyText = result.text;
      modelName = result.modelUsed;
    } else if (groqKey) {
      providerName = "Groq";
      const result = await callOpenAICompatible(
        groqKey,
        messages,
        "https://api.groq.com/openai/v1",
        process.env.GROQ_MODEL || "llama-3.1-8b-instant"
      );
      replyText = result.text;
      modelName = result.modelUsed;
    }

    return {
      success: true,
      message: replyText.trim(),
      provider: providerName,
      model: modelName,
    };
  } catch (err: unknown) {
    console.error("[AI Chat Provider Error]:", err);
    const classification = classifyError(err);

    if (classification.is503) {
      return {
        success: false,
        code: "SERVICE_UNAVAILABLE",
        error:
          "Our AI assistant is temporarily unavailable. Please try again in a moment.",
      };
    }

    if (classification.is429) {
      return {
        success: false,
        code: "RATE_LIMITED",
        error:
          "Our AI assistant is currently experiencing high traffic. Please wait a moment before asking again.",
      };
    }

    return {
      success: false,
      code: "PROVIDER_ERROR",
      error:
        "Our AI assistant is temporarily unavailable. Please try again in a moment.",
    };
  }
}
