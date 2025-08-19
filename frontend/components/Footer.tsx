import { Sparkles, Twitter, Linkedin, Github, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-sky-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">FlowCash</span>
            </div>
            <p className="text-sky-200 mb-6 max-w-md leading-relaxed">
              The future of mobile payments in Africa. Built on Electroneum blockchain for instant, 
              secure, and affordable transactions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-sky-300 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-sky-300 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-sky-300 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-sky-300 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sky-200 hover:text-white transition-colors duration-200">Features</a></li>
              <li><a href="#" className="text-sky-200 hover:text-white transition-colors duration-200">Pricing</a></li>
              <li><a href="#" className="text-sky-200 hover:text-white transition-colors duration-200">Security</a></li>
              <li><a href="#" className="text-sky-200 hover:text-white transition-colors duration-200">Roadmap</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sky-200 hover:text-white transition-colors duration-200">About</a></li>
              <li><a href="#" className="text-sky-200 hover:text-white transition-colors duration-200">Blog</a></li>
              <li><a href="#" className="text-sky-200 hover:text-white transition-colors duration-200">Careers</a></li>
              <li><a href="#" className="text-sky-200 hover:text-white transition-colors duration-200">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sky-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sky-300 text-sm">
              © 2025 FlowCash. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sky-300 hover:text-white text-sm transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-sky-300 hover:text-white text-sm transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-sky-300 hover:text-white text-sm transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 