import React, { useState, useEffect } from "react";
import RoadmapCard from "../components/RoadmapCard";

const dummyRoadmaps = [
  {
    _id: "1",
    title: "Frontend Developer",
    description: "Learn HTML, CSS, JavaScript, React, and more to become a frontend engineer."
  },
  {
    _id: "2",
    title: "Backend Developer",
    description: "Master Node.js, Express, databases, and APIs for backend development."
  },
  {
    _id: "3",
    title: "Fullstack Developer",
    description: "Combine frontend and backend skills for full application development."
  }
];

const HomePage = () => {
  const [roadmaps, setRoadmaps] = useState([]);

  useEffect(() => {
    // Simulate API load
    setTimeout(() => {
      setRoadmaps(dummyRoadmaps);
    }, 500);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🚀 Roadmap App</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roadmaps.map(r => (
          <RoadmapCard
            key={r._id}
            title={r.title}
            description={r.description}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
