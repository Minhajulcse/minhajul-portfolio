import type { NextApiRequest, NextApiResponse } from "next";
import { generateChatResponse, ChatMessage, AIResponse } from "../../lib/ai-provider";

export const config = {
  maxDuration: 60,
};

// Simple in-memory sliding window rate limiter
const ipRequests = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequests.get(ip);

  // Periodic cleanup
  if (ipRequests.size > 1000) {
    ipRequests.forEach((val, key) => {
      if (now > val.resetAt) ipRequests.delete(key);
    });
  }

  if (!entry || now > entry.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  entry.count += 1;
  return false;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AIResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      code: "INVALID_INPUT",
      error: "Method not allowed. Only POST is supported.",
    });
  }

  // Rate Limiting
  const forwarded = req.headers["x-forwarded-for"];
  const clientIp =
    (typeof forwarded === "string" ? forwarded.split(",")[0] : req.socket.remoteAddress) ||
    "unknown";

  if (isRateLimited(clientIp)) {
    return res.status(429).json({
      success: false,
      code: "RATE_LIMITED",
      error: "Too many questions sent in a short time. Please wait a minute before asking again.",
    });
  }

  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        code: "INVALID_INPUT",
        error: "Invalid request: 'messages' array is required.",
      });
    }

    // Sanitize & limit conversation history to the last 8 messages
    const sanitizedMessages: ChatMessage[] = messages
      .slice(-8)
      .map((m: unknown) => {
        const item = m as { role?: unknown; content?: unknown };
        const role: "assistant" | "user" = item.role === "assistant" ? "assistant" : "user";
        const content = typeof item.content === "string" ? item.content.trim().slice(0, 800) : "";
        return { role, content };
      })
      .filter((m) => m.content.length > 0);

    if (sanitizedMessages.length === 0) {
      return res.status(400).json({
        success: false,
        code: "INVALID_INPUT",
        error: "Message content cannot be empty.",
      });
    }

    const aiResult = await generateChatResponse(sanitizedMessages);

    if (!aiResult.success) {
      const statusCode = aiResult.code === "API_KEY_MISSING" ? 503 : 500;
      return res.status(statusCode).json(aiResult);
    }

    return res.status(200).json(aiResult);
  } catch (error: unknown) {
    console.error("[API/chat handler error]:", error);
    return res.status(500).json({
      success: false,
      code: "PROVIDER_ERROR",
      error: "Internal server error occurred while processing your request.",
    });
  }
}
