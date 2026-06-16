import OpenAI from "openai";

console.log("KEY:", process.env.OPENAI_API_KEY?.slice(0, 10));
console.log("BASE URL:", process.env.OPENAI_BASE_URL);
console.log("MODEL:", process.env.OPENAI_MODEL);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL
});

export default openai;