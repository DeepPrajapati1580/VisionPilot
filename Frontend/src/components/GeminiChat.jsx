import React, { useState, useRef } from "react";
import Header from "./Header";

export default function GeminiRoadmapPresenter() {
  const [input, setInput] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const topRef = useRef(null);

  // --- Utility functions ---
  function cleanJSON(raw) {
    if (!raw) return raw;
    const withoutFences = raw.replace(/```json|```/g, "");
    return withoutFences.trim();
  }

  function extractLikelyJSON(text) {
    if (!text) return text;
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      return text.slice(start, end + 1);
    }
    return text;
  }

  async function send() {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/gemini/roadmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();
      let parsed = null;

      try {
        const cleaned = cleanJSON(data.response);
        const likely = extractLikelyJSON(cleaned);
        parsed = JSON.parse(likely);
      } catch (err) {
        parsed = { error: "Invalid JSON returned", raw: data.response };
      }

      setRoadmap(parsed);
    } catch (err) {
      setRoadmap({ error: err.message });
    } finally {
      setLoading(false);
      setShowRaw(false);
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  }

  function copyJSON() {
    if (!roadmap) return;
    const text = JSON.stringify(roadmap, null, 2);
    navigator.clipboard.writeText(text).catch(() => {});
  }

  function downloadJSON() {
    if (!roadmap) return;
    const blob = new Blob([JSON.stringify(roadmap, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${
      roadmap?.title?.toLowerCase()?.replace(/\s+/g, "-") || "roadmap"
    }.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const samples = [
    "Roadmap to become a SOC Analyst",
    "Roadmap to learn React for beginners",
    "Roadmap to master data structures in Python",
    "Roadmap for becoming a Cloud Security Engineer",
  ];

  function normalizeUrl(resource) {
    if (!resource || typeof resource !== "string") return undefined;
    const trimmed = resource.trim();
    const mdMatch = trimmed.match(/\[[^\]]*\]\(([^)]+)\)/);
    const candidateText = mdMatch?.[1] || trimmed;
    const httpMatch = candidateText.match(/https?:\/\/[^\s)]+/i);
    if (httpMatch) return httpMatch[0];
    if (/^www\./i.test(candidateText)) return `https://${candidateText}`;
    if (/^[\w-]+(\.[\w-]+)+([\/#$?].*)?$/i.test(candidateText))
      return `https://${candidateText}`;
    return undefined;
  }
  return (
    <div className="dark">
      <div className="min-h-screen bg-gray-950 transition-colors duration-300">
        <Header />
        <div ref={topRef} />
        <div className="max-w-4xl mx-auto px-4 pt-8 pb-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">G</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-100">Gemini Roadmap Generator</h1>
              <p className="text-sm text-gray-400">Describe what you want to learn or become. Get a structured, clickable roadmap.</p>
            </div>
          </div>

          {/* Samples */}
          <div className="flex flex-wrap gap-2 mb-6">
            {samples.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInput(s)}
                className="text-xs md:text-sm rounded-full px-3 py-1 border border-gray-800 text-gray-300 hover:bg-gray-900/60 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading && (
            <div className="bg-gray-900 shadow rounded p-6 mb-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-800 rounded w-2/3" />
                <div className="h-4 bg-gray-800 rounded w-full" />
                <div className="h-4 bg-gray-800 rounded w-5/6" />
                <div className="flex gap-2 mt-2">
                  <div className="h-6 w-16 bg-gray-800 rounded-full" />
                  <div className="h-6 w-20 bg-gray-800 rounded-full" />
                  <div className="h-6 w-24 bg-gray-800 rounded-full" />
                </div>
                <div className="space-y-3 mt-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 border border-gray-800 rounded">
                      <div className="h-4 bg-gray-800 rounded w-1/2 mb-2" />
                      <div className="h-3 bg-gray-800 rounded w-5/6" />
                      <div className="h-3 bg-gray-800 rounded w-2/3 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Show Roadmap */}
          {roadmap && !roadmap.error && !loading && (
            <div className="bg-gray-900 shadow rounded-lg p-6 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-100">{roadmap.title}</h2>
                  <p className="text-gray-300">{roadmap.description}</p>
                  <p className="mt-2 text-sm text-gray-400">
                    Category: <span className="font-medium">{roadmap.category}</span>
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {roadmap.tags?.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 rounded-full text-xs bg-blue-900/30 text-blue-300 border border-blue-800">#{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button onClick={copyJSON} className="text-xs px-3 py-1.5 rounded border border-gray-800 text-gray-300 hover:bg-gray-900">Copy JSON</button>
                  <button onClick={downloadJSON} className="text-xs px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white">Download</button>
                  <button onClick={() => setShowRaw((s) => !s)} className="text-xs px-3 py-1.5 rounded border border-gray-800 text-gray-300 hover:bg-gray-900">{showRaw ? "Hide Raw" : "Show Raw"}</button>
                </div>
              </div>

              {showRaw && (
                <pre className="text-xs bg-gray-900/60 text-gray-200 p-4 rounded overflow-auto max-h-96">{JSON.stringify(roadmap, null, 2)}</pre>
              )}

              {/* Steps */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-100">Steps</h3>
                <div className="relative pl-8">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800" />
                  {roadmap.steps?.map((step, idx) => (
                    <div key={idx} className="relative pl-6 mb-4">
                      <div className="absolute -left-1 top-2 h-6 w-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white ring-4 ring-gray-900">{idx + 1}</div>
                      <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/60 hover:bg-gray-900 transition">
                        <h4 className="font-semibold text-gray-100">{step.title}</h4>
                        <p className="text-gray-300 mt-1">{step.description}</p>
                        {step.resources?.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-200 mb-2">Resources</p>
                            <div className="flex flex-wrap gap-2">
                              {step.resources.map((res, i) => {
                                const url = normalizeUrl(res);
                                return (
                                  <a
                                    key={i}
                                    href={url || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`max-w-full truncate inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border ${url ? "bg-blue-900/30 text-blue-300 border-blue-800 hover:bg-blue-900/50" : "bg-gray-800 text-gray-400 border-gray-700 cursor-not-allowed"}`}
                                    onClick={(e) => { if (!url) e.preventDefault(); }}
                                    title={url ? url : "Invalid URL"}
                                  >
                                    <span className="inline-block">🔗</span>
                                    <span className="truncate">{res}</span>
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {roadmap?.error && !loading && (
            <div className="mb-6 border border-red-800 bg-red-900/30 text-red-200 p-4 rounded">
              <div className="font-semibold mb-1">Something went wrong</div>
              <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(roadmap, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Sticky input */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-gray-950/90 backdrop-blur supports-[backdrop-filter]:bg-gray-950/70">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              placeholder="Example: Roadmap to become a SOC Engineer"
              className="w-full resize-none rounded-md border border-gray-800 bg-gray-900 text-gray-100 placeholder-gray-400 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={send}
                disabled={loading}
                className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate"}
              </button>
              <button
                onClick={() => { setInput(""); setRoadmap(null); setShowRaw(false); }}
                disabled={loading}
                className="whitespace-nowrap border border-gray-800 text-gray-300 hover:bg-gray-900 px-4 py-2 rounded-md disabled:opacity-50"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
