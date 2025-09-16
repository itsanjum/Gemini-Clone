// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node


// gemini.js
import { GoogleGenAI } from '@google/genai';

async function runChat(prompt) {
  const ai = new GoogleGenAI({
    apiKey: "AIzaSyCiNOW98KF1skPFqBjpsnBIlHuPeAi8Xjg", // Replace with your real key
  });

  const tools = [{ googleSearch: {} }];
  const config = { thinkingConfig: { thinkingBudget: -1 }, tools };
  const model = 'gemini-2.5-pro';

  const contents = [{ role: 'user', parts: [{ text: prompt }] }];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let output = "";
  for await (const chunk of response) {
    if (chunk.text) {
      output += chunk.text;
    }
  }
  return output;
}

// Retry wrapper
export async function retryRunChat(prompt, retries = 3, delay = 1000) {
  try {
    return await runChat(prompt);
  } catch (err) {
    if (err.code === 503 && retries > 0) {
      console.warn(`503 error: retrying in ${delay}ms...`);
      await new Promise((res) => setTimeout(res, delay));
      return retryRunChat(prompt, retries - 1, delay * 2); // exponential backoff
    }
    throw err;
  }
}

export default runChat;

  
