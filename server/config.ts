import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 3001,
  AI_PROVIDER: (process.env.AI_PROVIDER || 'demo').toLowerCase() as 'gemini' | 'openai' | 'groq' | 'demo',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  HINDSIGHT_API_KEY: process.env.HINDSIGHT_API_KEY || '',
  HINDSIGHT_BASE_URL: process.env.HINDSIGHT_BASE_URL || 'https://hindsight.vectorize.io/api/v1',
};
