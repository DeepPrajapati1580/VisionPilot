import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

function RoadmapSphere({ position, color, onClick }) {
  return (
    <mesh position={position} onClick={onClick}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default function Roadmap3D({ roadmaps }) {
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* 3D Canvas */}
      <div style={{ flex: 1 }}>
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          {roadmaps.map((roadmap, index) => (
            <RoadmapSphere
              key={roadmap._id}
              position={[index * 2 - roadmaps.length, 0, 0]}
              color={new THREE.Color(Math.random(), Math.random(), Math.random())}
              onClick={() => setSelectedRoadmap(roadmap)}
            />
          ))}
        </Canvas>
      </div>

      {/* Animated Sidebar */}
      <AnimatePresence>
        {selectedRoadmap && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 80 }}
            style={{
              width: "300px",
              background: "#fff",
              padding: "20px",
              boxShadow: "-2px 0 10px rgba(0,0,0,0.2)",
              overflowY: "auto",
            }}
          >
            <h2>{selectedRoadmap.title}</h2>
            <p>{selectedRoadmap.description}</p>

            {selectedRoadmap.steps?.length > 0 && (
              <>
                <h3>Steps:</h3>
                <ul>
                  {selectedRoadmap.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </>
            )}

            {selectedRoadmap.skills?.length > 0 && (
              <>
                <h3>Skills:</h3>
                <ul>
                  {selectedRoadmap.skills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </>
            )}

            <button
              onClick={() => setSelectedRoadmap(null)}
              style={{
                marginTop: "10px",
                padding: "8px",
                background: "#ff4d4d",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
