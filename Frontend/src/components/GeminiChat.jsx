import { useState } from "react";
import axios from "axios";

export default function GeminiChat() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await axios.post("http://localhost:5000/api/gemini/generate", {
        prompt,
      });
      setResponse(res.data.output);
    } catch (err) {
      console.error(err);
      setResponse("⚠️ Error: Could not get response from Gemini API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>💬 Gemini AI Chat</h2>
      <textarea
        rows={4}
        style={{ width: "100%", padding: "10px", fontSize: "16px" }}
        placeholder="Ask Gemini something..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      ></textarea>
      <br />
      <button
        onClick={handleSend}
        disabled={loading}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          backgroundColor: "#4cafef",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Thinking..." : "Send"}
      </button>

      {response && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#f9f9f9",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
        >
          <strong>Gemini:</strong> {response}
        </div>
      )}
    </div>
  );
}
