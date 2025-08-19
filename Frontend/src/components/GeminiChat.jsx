import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function GeminiRoadmapPresenter() {
  const [input, setInput] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  function cleanJSON(raw) {
    if (!raw) return raw;
    return raw.replace(/```json/g, "").replace(/```/g, "").trim();
  }

  async function send() {
    if (!input.trim()) return;
    setLoading(true);
    try {
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
            "resources": ["string"]
          }
        ]
      }
      Input: ${input}
      `;

      const result = await model.generateContent(prompt);

      let parsed = null;
      try {
        const raw = result.response.text();
        const cleaned = cleanJSON(raw);
        parsed = JSON.parse(cleaned);
      } catch (err) {
        parsed = { error: "Invalid JSON returned", raw: result.response.text() };
      }

      setRoadmap(parsed);
    } catch (err) {
      setRoadmap({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gemini Roadmap Generator</h1>

      {/* Input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 flex-1 rounded"
          placeholder="Example: Roadmap to become a MERN developer"
        />
        <button
          onClick={send}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Loading..." : "Generate"}
        </button>
      </div>

      {/* Show Roadmap */}
      {roadmap && !roadmap.error && (
        <div className="bg-white shadow rounded p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold">{roadmap.title}</h2>
            <p className="text-gray-600">{roadmap.description}</p>
            <p className="mt-2 text-sm text-gray-500">
              Category: <span className="font-medium">{roadmap.category}</span>
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {roadmap.tags?.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Steps:</h3>
            {roadmap.steps?.map((step, idx) => (
              <div key={idx} className="border rounded p-4 shadow-sm">
                <h4 className="font-bold text-gray-800">
                  {idx + 1}. {step.title}
                </h4>
                <p className="text-gray-600">{step.description}</p>

                {step.resources?.length > 0 && (
                  <ul className="list-disc list-inside mt-2 text-sm text-blue-600">
                    {step.resources.map((res, i) => (
                      <li key={i}>{res}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {roadmap?.error && (
        <pre className="bg-red-100 text-red-700 p-4 rounded">
          {JSON.stringify(roadmap, null, 2)}
        </pre>
      )}
    </div>
  );
}
