import type { NextApiRequest, NextApiResponse } from "next";
import {
  generateChatStream,
  generateChatResponse,
  ChatMessage,
  AIResponse,
} from "../../lib/ai-provider";

export const config = {
  maxDuration: 60,
};

// Simple in-memory sliding window rate limiter
const ipRequests = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

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
    const { messages, stream = true } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        code: "INVALID_INPUT",
        error: "Invalid request: 'messages' array is required.",
      });
    }

    // Sanitize & limit conversation history to the last 6-8 messages
    const sanitizedMessages: ChatMessage[] = messages
      .slice(-8)
      .map((m: unknown) => {
        const item = m as { role?: unknown; content?: unknown };
        const role: "assistant" | "user" = item.role === "assistant" ? "assistant" : "user";
        const content = typeof item.content === "string" ? item.content.trim().slice(0, 500) : "";
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

    // Streaming mode (SSE)
    if (stream) {
      res.writeHead(200, {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      });

      for await (const chunk of generateChatStream(sanitizedMessages)) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
      res.write("data: [DONE]\n\n");
      res.end();
      return;
    }

    // Non-streaming fallback mode
    const aiResult = await generateChatResponse(sanitizedMessages);

    if (!aiResult.success) {
      const statusCode =
        aiResult.code === "API_KEY_MISSING" || aiResult.code === "SERVICE_UNAVAILABLE"
          ? 503
          : aiResult.code === "RATE_LIMITED"
          ? 429
          : 500;
      return res.status(statusCode).json(aiResult);
    }

    return res.status(200).json(aiResult);
  } catch (error: unknown) {
    console.error("[API/chat handler error]:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        code: "PROVIDER_ERROR",
        error: "Our AI assistant is temporarily unavailable. Please try again in a moment.",
      });
    }
    res.end();
  }
}
