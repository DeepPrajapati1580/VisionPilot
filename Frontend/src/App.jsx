// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import About from "./components/About";
import RoadmapView from "./components/RoadmapView";

function App() {
  const { isSignedIn } = useUser();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/roadmap/:id" element={<RoadmapView />} />
      <Route 
        path="/dashboard" 
        element={isSignedIn ? <Dashboard /> : <Home />} 
      />
    </Routes>
  );
}

export default App;
