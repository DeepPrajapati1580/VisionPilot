import React, { useEffect, useState, useRef } from "react";
import RoadmapCard from "../components/RoadmapCard";
import Roadmap3D from "../components/Roadmap3D";
import api from "../api";

const HomePage = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const cardRefs = useRef({});

  useEffect(() => {
    api.get("/roadmaps")
      .then(res => setRoadmaps(res.data))
      .catch(err => console.error("Error fetching roadmaps:", err));
  }, []);

  const handleNodeClick = (title) => {
    const card = cardRefs.current[title];
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.classList.add("ring-4", "ring-yellow-400");
      setTimeout(() => card.classList.remove("ring-4", "ring-yellow-400"), 2000);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🚀 Roadmap App</h1>

      {/* 3D Roadmap Viewer */}
      <div className="h-[500px] w-full mb-10 border border-gray-200 rounded-lg overflow-hidden">
        <Roadmap3D data={roadmaps} onNodeClick={handleNodeClick} />
      </div>

      {/* Roadmap List View */}
      <h2 className="text-2xl font-semibold mb-4">📋 Roadmap List</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roadmaps.map(r => (
          <div
            key={r._id}
            ref={(el) => (cardRefs.current[r.title] = el)}
          >
            <RoadmapCard title={r.title} description={r.description} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
