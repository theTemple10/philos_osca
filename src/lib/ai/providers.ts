import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGroq } from "@ai-sdk/groq";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export type AIProvider = "openai" | "anthropic" | "groq" | "gemini";

export interface AIProviderConfig {
  provider: AIProvider;
  model?: string;
  apiKey?: string;
}

/**
 * Get an AI provider instance based on configuration
 */
export function getAIProvider(config: AIProviderConfig) {
  switch (config.provider) {
    case "openai":
      return createOpenAI({
        apiKey: config.apiKey || process.env.OPENAI_API_KEY,
      })(config.model || "gpt-4o");

    case "anthropic":
      return createAnthropic({
        apiKey: config.apiKey || process.env.ANTHROPIC_API_KEY,
      })(config.model || "claude-sonnet-4-20250514");

    case "groq":
      return createGroq({
        apiKey: config.apiKey || process.env.GROQ_API_KEY,
      })(config.model || "llama-3.3-70b-versatile");

    case "gemini":
      return createGoogleGenerativeAI({
        apiKey: config.apiKey || process.env.GEMINI_API_KEY,
      })(config.model || "gemini-2.0-flash");

    default:
      throw new Error(`Unsupported AI provider: ${config}`);
  }
}

/**
 * Get the default AI provider from environment or user preferences
 */
export function getDefaultProvider(
  userProvider?: string | null,
  userModel?: string | null
): AIProviderConfig {
  const provider = (userProvider as AIProvider) || "openai";
  const model = userModel || undefined;

  return { provider, model };
}

/**
 * Available models per provider
 */
export const AVAILABLE_MODELS: Record<AIProvider, { id: string; name: string; description: string }[]> = {
  openai: [
    { id: "gpt-4o", name: "GPT-4o", description: "Best for complex code generation and analysis" },
    { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "Fast and cost-effective for simpler tasks" },
    { id: "o3-mini", name: "o3-mini", description: "Reasoning model for complex problems" },
  ],
  anthropic: [
    { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4", description: "Balanced performance and speed" },
    { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku", description: "Fast and efficient" },
  ],
  groq: [
    { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", description: "Fast inference, great for code tasks" },
    { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B", description: "Ultra-fast for simple tasks" },
    { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", description: "Good balance of speed and quality" },
  ],
  gemini: [
    { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", description: "Fast and capable, free tier available" },
    { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", description: "Latest Gemini with thinking capabilities" },
    { id: "gemini-2.0-flash-lite", name: "Gemini 2.0 Flash Lite", description: "Lightweight and extremely fast" },
  ],
};
