import WaitlistSignup from "./WaitlistSignup";
import { Sparkles, CheckCircle, Users, MapPin, Calendar } from "lucide-react";

export default function WaitlistSection() {
  return (
    <section id="waitlist" className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-sky-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-sky-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 glass rounded-full text-sm font-medium text-white/90">
                <Sparkles className="w-4 h-4 mr-2" />
                Early Access
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Be Among the First to
              <span className="block gradient-text">
                Experience FlowCash
              </span>
            </h2>

            <p className="text-xl text-sky-200 mb-8 leading-relaxed">
              Join thousands of Africans who are ready to revolutionize their mobile payment experience. 
              Get early access to exclusive features and be notified when we launch.
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
                <span className="text-sky-200">Early access to the platform</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
                <span className="text-sky-200">Exclusive launch bonuses</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
                <span className="text-sky-200">Priority customer support</span>
              </div>
            </div>

            {/* Social proof */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">2,847</div>
                <div className="text-sm text-sky-300">Already joined</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">6</div>
                <div className="text-sm text-sky-300">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">Q1 2026</div>
                <div className="text-sm text-sky-300">Launch date</div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="glass rounded-3xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                Join the Waitlist
              </h3>
              <p className="text-sky-200">
                Get notified when FlowCash launches in your country
              </p>
            </div>

            <WaitlistSignup />
          </div>
        </div>
      </div>
    </section>
  );
} 