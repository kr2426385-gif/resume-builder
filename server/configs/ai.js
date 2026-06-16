import { GoogleGenAI } from "@google/genai";

const normalizeEnvValue = (value = "") =>
  value.trim().replace(/^["']|["']$/g, "");

export const getApiKey = () =>
  normalizeEnvValue(
    process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.OPENAI_API_KEY
  );

export const aiModel =
  process.env.GEMINI_MODEL ||
  process.env.OPENAI_MODEL ||
  "gemini-2.0-flash";

const apiKey = getApiKey();

if (!apiKey) {
  console.error(
    "Missing GEMINI_API_KEY (or OPENAI_API_KEY). Set it in Render environment variables."
  );
}

const client = apiKey ? new GoogleGenAI({ apiKey }) : null;

const buildPrompt = (messages) => {
  let systemInstruction;
  const conversation = [];

  for (const message of messages) {
    if (message.role === "system") {
      systemInstruction = message.content;
      continue;
    }

    conversation.push(`${message.role}: ${message.content}`);
  }

  return {
    systemInstruction,
    prompt: conversation.join("\n\n"),
  };
};

export const chatCompletion = async ({ model, messages }) => {
  if (!client) {
    throw new Error("AI API key is not configured");
  }

  const { systemInstruction, prompt } = buildPrompt(messages);

  const response = await client.models.generateContent({
    model: model || aiModel,
    contents: prompt,
    config: systemInstruction ? { systemInstruction } : undefined,
  });

  const text = response.text?.trim();
  if (!text) {
    throw new Error("AI returned an empty response");
  }

  return {
    choices: [{ message: { content: text } }],
  };
};

const ai = {
  chat: {
    completions: {
      create: chatCompletion,
    },
  },
};

export default ai;
