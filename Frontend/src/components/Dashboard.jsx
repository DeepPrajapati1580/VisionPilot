import React, { useEffect, useState } from "react";
import api from "../api";
import Roadmap3D from "./Roadmap3D";

export default function Dashboard() {
  const [roadmaps, setRoadmaps] = useState([]);

  useEffect(() => {
    api.get("/roadmaps")
      .then((res) => setRoadmaps(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Roadmap3D roadmaps={roadmaps} />
    </div>
  );
}
