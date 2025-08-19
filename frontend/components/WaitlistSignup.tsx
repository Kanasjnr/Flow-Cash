"use client";

import { useState } from "react";
import { CheckCircle, Mail, User, ArrowRight } from "lucide-react";

interface WaitlistForm {
  name: string;
  email: string;
}

export default function WaitlistSignup() {
  const [formData, setFormData] = useState<WaitlistForm>({
    name: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<WaitlistForm>>({});

  const validateForm = () => {
    const newErrors: Partial<WaitlistForm> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would typically send the data to your backend
      console.log("Waitlist signup:", formData);
      
      setIsSubmitted(true);
      setFormData({ name: "", email: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof WaitlistForm]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="card bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800 p-8 text-center animate-scale-in">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
            You&apos;re on the list! 🎉
          </h3>
          <p className="text-emerald-700 dark:text-emerald-300 mb-4">
            Thank you for joining the FlowCash waitlist. We&apos;ll notify you as soon as we launch!
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors duration-200"
          >
            Add another email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <User className="w-4 h-4 mr-2 text-sky-600" />
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
              errors.name 
                ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20" 
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-sky-300 dark:hover:border-sky-600 focus:border-sky-500"
            }`}
            placeholder="Enter your full name"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <Mail className="w-4 h-4 mr-2 text-sky-600" />
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
              errors.email 
                ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20" 
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-sky-300 dark:hover:border-sky-600 focus:border-sky-500"
            }`}
            placeholder="Enter your email address"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary group flex items-center justify-center py-3 px-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Joining Waitlist...
            </div>
          ) : (
            <>
              Join the Waitlist
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Be among the first to experience the future of mobile payments in Africa
        </p>
      </form>
    </div>
  );
} 