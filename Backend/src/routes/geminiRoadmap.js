// backend/routes/geminiRoadmap.js
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

router.post("/roadmap", async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ error: "Input is required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    Generate a roadmap in JSON format only.
    Schema:
    {
      "title": "string",
      "description": "string",
      "category": "string",
      "tags": ["string"],
      "steps": [
        { 
          "title": "string", 
          "description": "string",
          "resources": ["string (should include clickable links when possible)"]
        }
      ]
    }
    Input: ${input}
    `;

    const result = await model.generateContent(prompt);

    const rawText = result.response.text();
    return res.json({ response: rawText });
  } catch (err) {
    console.error("Gemini API Error:", err);
    return res.status(500).json({ error: "Failed to generate roadmap" });
  }
});

export default router;
