import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser, SignInButton, UserButton } from "@clerk/clerk-react";
import { Code, Plus } from 'lucide-react';
import { Button } from "./UI/button";

export default function Header() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  return (
    <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo + Home */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Code className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">VisionPilot</h1>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => navigate('/')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Home
            </button>

            {/* Only show Roadmaps & AI Chat if signed in */}
            {isSignedIn && (
              <>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Roadmaps
                </button>
                <button 
                  onClick={() => navigate('/gemini')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  AI Chat
                </button>
              </>
            )}

            <button 
              onClick={() => navigate('/about')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              About Us
            </button>
          </nav>

          {/* Right-side Auth / User Actions */}
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <Button 
                  onClick={() => navigate('/create-roadmap')}
                  className="bg-blue-600 hover:bg-blue-700 hidden md:flex"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </Button>
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-slate-700 hover:bg-slate-600"
                >
                  Dashboard
                </Button>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Login
                </button>
                <SignInButton mode="modal">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Sign Up
                  </Button>
                </SignInButton>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
