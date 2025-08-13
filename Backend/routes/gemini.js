import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ output: text });
  } catch (error) {
    console.error(
      "Gemini API Error:",
      error.response?.data || error.message || error
    );
    res.status(500).json({ error: "Failed to generate content" });
  }
});

export default router;
