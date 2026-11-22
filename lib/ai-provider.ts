import { getSystemPrompt } from "./knowledge";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  success: boolean;
  message?: string;
  error?: string;
  code?: "API_KEY_MISSING" | "RATE_LIMITED" | "PROVIDER_ERROR" | "TIMEOUT" | "INVALID_INPUT";
  provider?: string;
  model?: string;
}

/**
 * Execute a single request to the Google Gemini generateContent REST API
 */
async function callSingleGeminiModel(
  apiKey: string,
  messages: ChatMessage[],
  modelName: string,
  timeoutMs = 15000
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  // Map conversation messages to Gemini contents structure
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const systemPrompt = getSystemPrompt();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents,
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 1000,
      },
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg =
      errorData?.error?.message || `Gemini API returned HTTP ${response.status}`;
    const err = new Error(errorMsg) as Error & { status?: number };
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  const candidate = data?.candidates?.[0];
  const parts = candidate?.content?.parts || [];

  // Extract user-facing text parts (filtering out internal thinking blocks if present)
  const textParts = parts
    .filter((p: { text?: string; thought?: boolean }) => typeof p.text === "string" && !p.thought)
    .map((p: { text: string }) => p.text);

  const text =
    textParts.join("\n").trim() ||
    parts[0]?.text ||
    "I'm sorry, I could not generate a response at this time.";

  return text;
}

/**
 * Calls Google Gemini API with gemini-3.8-flash and automatic resilient fallback
 */
async function callGemini(
  apiKey: string,
  messages: ChatMessage[],
  preferredModel = process.env.GEMINI_MODEL || "gemini-3.5-flash"
): Promise<{ text: string; modelUsed: string }> {
  try {
    const text = await callSingleGeminiModel(apiKey, messages, preferredModel, 7000);
    return { text, modelUsed: preferredModel };
  } catch (err: unknown) {
    const error = err as Error & { status?: number };
    console.warn(`[Gemini API] Primary model "${preferredModel}" failed or timed out:`, error.message);

    // Resilient fallback: if primary model experiences high demand (503), rate limiting (429), not found (404), or timeout
    const fallbackModel = "gemini-flash-lite-latest";
    if (preferredModel !== fallbackModel) {
      console.info(`[Gemini API] Gracefully falling back to resilient model: "${fallbackModel}"`);
      const fallbackText = await callSingleGeminiModel(apiKey, messages, fallbackModel, 15000);
      return { text: fallbackText, modelUsed: `${preferredModel} (fallback: ${fallbackModel})` };
    }

    throw err;
  }
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
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API || process.env.GOOGLE_API_KEY;
  const openAIKey = process.env.OPENAI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  if (!geminiKey && !openAIKey && !groqKey) {
    return {
      success: false,
      code: "API_KEY_MISSING",
      error:
        "The AI assistant backend is not configured with an API key. Please configure GEMINI_API_KEY or OPENAI_API_KEY in your environment variables (.env.local) to enable intelligent AI responses.",
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
    const error = err as Error;
    console.error("[AI Chat Provider Error]:", error);

    if (error.name === "TimeoutError" || error.message.includes("timeout")) {
      return {
        success: false,
        code: "TIMEOUT",
        error: "The AI request timed out. Please try asking again in a moment.",
      };
    }

    return {
      success: false,
      code: "PROVIDER_ERROR",
      error: error.message || "An unexpected error occurred while communicating with the AI service.",
    };
  }
}
