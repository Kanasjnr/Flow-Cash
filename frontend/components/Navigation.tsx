"use client";

import { useState } from "react";
import { Sparkles, Menu, X } from "lucide-react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">FlowCash</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sky-200 hover:text-white transition-colors duration-200 font-medium">
              Features
            </a>
            <a href="#about" className="text-sky-200 hover:text-white transition-colors duration-200 font-medium">
              About
            </a>
            <a href="#roadmap" className="text-sky-200 hover:text-white transition-colors duration-200 font-medium">
              Roadmap
            </a>
            <button 
              onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary px-6 py-2 text-sm font-semibold"
            >
              Join Waitlist
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-sky-200 hover:text-white focus:outline-none focus:text-white transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/10 backdrop-blur-md border-t border-white/20">
              <a href="#features" className="block px-3 py-2 text-sky-200 hover:text-white transition-colors duration-200 font-medium">
                Features
              </a>
              <a href="#about" className="block px-3 py-2 text-sky-200 hover:text-white transition-colors duration-200 font-medium">
                About
              </a>
              <a href="#roadmap" className="block px-3 py-2 text-sky-200 hover:text-white transition-colors duration-200 font-medium">
                Roadmap
              </a>
              <button 
                onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full mt-4 btn-primary px-6 py-2 text-sm font-semibold"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 