import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
  AUTH_SECRET: z.string().min(32).optional(),
  AUTH_COOKIE_NAME: z.string().default("bizsaathi_session"),
  PAPERCLIP_API_URL: z.string().url().optional().or(z.literal("")),
  PAPERCLIP_API_KEY: z.string().optional(),
  OLLAMA_BASE_URL: z.string().url().optional().or(z.literal("")),
  DEFAULT_MODEL_PROVIDER: z.string().default("ollama"),
  DEFAULT_MODEL_NAME: z.string().default("llama3.1:8b"),
  NEXT_PUBLIC_APP_NAME: z.string().default("BizSaathi"),
});

export const env = envSchema.parse(process.env);
