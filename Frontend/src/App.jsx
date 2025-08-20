import { Routes, Route } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard1";
import RoadmapView from "./components/RoadmapView";
import CreateRoadmap from "./components/CreateRoadmap";
import EditRoadmap from "./components/EditRoadmap";
import Login from "./components/Login";
import Register from "./components/Register";
import About from "./components/About";
import GeminiChat from "./components/GeminiChat";
import Goals from "./components/Goals";

function App() {
  const { isSignedIn } = useUser();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/roadmap/:id" element={<RoadmapView />} />
      <Route path="/create-roadmap" element={<CreateRoadmap />} />
      <Route path="/edit-roadmap/:id" element={<EditRoadmap />} />
      <Route path="/about" element={<About/>}/>
      <Route path="/dashboard" element={isSignedIn ? <Dashboard /> : <Home />} />
      <Route path="/gemini" element={<GeminiChat />} />
      <Route path="/Goals" element={<Goals />} />
    </Routes>
  );
}

export default App;
