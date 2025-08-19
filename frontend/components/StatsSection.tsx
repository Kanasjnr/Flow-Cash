"use client";

import { useState, useEffect } from "react";
import { Users, Smartphone, CreditCard, DollarSign } from "lucide-react";

interface StatItem {
  value: string;
  label: string;
  suffix?: string;
  icon: any;
}

const stats: StatItem[] = [
  { value: "1.4", label: "Billion People", suffix: "B", icon: Users },
  { value: "500", label: "Million Mobile Users", suffix: "M", icon: Smartphone },
  { value: "350", label: "Million Underbanked", suffix: "M", icon: CreditCard },
  { value: "40", label: "Billion Airtime Market", suffix: "B", icon: DollarSign },
];

export default function StatsSection() {
  const [animatedStats, setAnimatedStats] = useState<number[]>([0, 0, 0, 0]);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateNumbers();
          }
        });
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById("about");
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateNumbers = () => {
    const targetValues = [1.4, 500, 350, 40];
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      const newValues = targetValues.map((target, index) => {
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        return Math.round(target * easeOutQuart * 10) / 10;
      });

      setAnimatedStats(newValues);

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);
  };

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-sky-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            The African Opportunity
          </h2>
          <p className="text-lg text-sky-200 max-w-2xl mx-auto">
            FlowCash is positioned to serve the world&apos;s fastest-growing mobile market
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center group">
                <div className="card bg-white/10 backdrop-blur-sm border-white/20 p-6 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {animatedStats[index]}{stat.suffix}
                  </div>
                  <p className="text-sm text-sky-200 font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full text-sm font-semibold shadow-lg">
            <DollarSign className="w-4 h-4 mr-2" />
            Market Ready for Disruption
          </div>
        </div>
      </div>
    </section>
  );
} 