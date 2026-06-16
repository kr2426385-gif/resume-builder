import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY. Set it in Render environment variables.");
}

const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY,
};

if (process.env.OPENAI_BASE_URL) {
  openaiConfig.baseURL = process.env.OPENAI_BASE_URL;
}

const openai = new OpenAI(openaiConfig);

export default openai;