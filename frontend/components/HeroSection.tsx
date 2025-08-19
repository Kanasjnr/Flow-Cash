"use client";

import { useState, useEffect } from "react";
import { Sparkles, Shield, Zap, Globe, ArrowRight, CheckCircle } from "lucide-react";

export default function HeroSection() {
  const [currentText, setCurrentText] = useState(0);
  const texts = [
    "Send ETN instantly",
    "Buy airtime & data",
    "Pay utility bills",
    "Earn cashback rewards"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-bg-hero" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-sky-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-slide-up">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 glass rounded-2xl mb-6 animate-pulse-glow">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
              FlowCash
            </h1>
          </div>

          {/* Tagline */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              The Future of Mobile Payments in
              <span className="block gradient-text">
                Africa
              </span>
            </h2>
            
            {/* Animated text */}
            <div className="h-8 md:h-12 flex items-center justify-center mb-6">
              <span className="text-lg md:text-2xl text-sky-200 font-medium flex items-center">
                <Zap className="w-5 h-5 mr-2 text-sky-400" />
                {texts[currentText]}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Built on the Electroneum blockchain, FlowCash empowers Africa&apos;s underbanked population 
            with instant P2P transfers, airtime purchases, bill payments, and cashback rewards.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button 
              onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary group flex items-center px-8 py-4 text-lg"
            >
              <span className="relative z-10">Join the Waitlist</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button className="btn-secondary group flex items-center px-8 py-4 text-lg border-white/30 text-white hover:border-white/50">
              Watch Demo
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-slate-400">
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-sky-400" />
              <span className="text-sm font-medium">Built on Electroneum</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
              <span className="text-sm font-medium">Secure & Private</span>
            </div>
            <div className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              <span className="text-sm font-medium">Instant Transfers</span>
            </div>
            <div className="flex items-center">
              <Globe className="w-5 h-5 mr-2 text-cyan-400" />
              <span className="text-sm font-medium">Multi-Country</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowRight className="w-6 h-6 text-white/60 rotate-90" />
      </div>
    </section>
  );
} 