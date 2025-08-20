import FeatureCard from "./FeatureCard";
import { Send, Phone, CreditCard, DollarSign, Globe, Smartphone } from "lucide-react";

const features = [
  {
    icon: Send,
    title: "Instant P2P Transfers",
    description: "Send ETN to anyone using just their phone number. No complex wallet addresses needed.",
    gradient: "from-emerald-500 to-green-600"
  },
  {
    icon: Phone,
    title: "Airtime & Data",
    description: "Buy airtime and data bundles for MTN, Airtel, Safaricom, and Glo instantly.",
    gradient: "from-blue-500 to-sky-600"
  },
  {
    icon: CreditCard,
    title: "Bill Payments",
    description: "Pay electricity bills and TV subscriptions (DStv, StarTimes, GOtv) with ETN.",
    gradient: "from-purple-500 to-violet-600"
  },
  {
    icon: DollarSign,
    title: "Cashback Rewards",
    description: "Earn 0.5% cashback on every transaction. More ETN for you to spend.",
    gradient: "from-amber-500 to-orange-600"
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Available in English, French, Swahili, Hausa, Yoruba, and Zulu.",
    gradient: "from-cyan-500 to-teal-600"
  },
  {
    icon: Smartphone,
    title: "PWA Ready",
    description: "Progressive Web App with offline capabilities and add-to-home-screen support.",
    gradient: "from-rose-500 to-pink-600"
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need for
            <span className="block gradient-text">
              Mobile Payments
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            FlowCash combines the power of blockchain technology with the simplicity of mobile money 
            to create the ultimate payment experience for Africa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
              />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-full text-sm font-semibold hover:shadow-lg transition-shadow duration-300">
            <Smartphone className="w-4 h-4 mr-2" />
            Coming Soon to Your Mobile Device
          </div>
        </div>
      </div>
    </section>
  );
} 