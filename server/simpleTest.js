
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

(async () => {
  try {
    console.log("Model:", process.env.GEMINI_MODEL);

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL,
      contents: "Hello!",
    });

    console.log("SUCCESS:");
    console.log(response.text);
  } catch (e) {
    console.log("STATUS:", e.status);
    console.log("MESSAGE:", e.message);
  }
})();