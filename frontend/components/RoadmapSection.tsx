import { CheckCircle, Clock, Calendar } from "lucide-react";

const roadmapItems = [
  {
    quarter: "Q3 2025",
    title: "PWA MVP Launch",
    description: "Launch Progressive Web App in Nigeria and Kenya with core features",
    status: "completed",
    features: ["P2P ETN transfers", "Airtime purchases", "Basic wallet functionality"]
  },
  {
    quarter: "Q4 2025",
    title: "Expand & Enhance",
    description: "Expand to Ghana and Uganda, add bill payment features",
    status: "current",
    features: ["Bill payments", "Multi-country support", "Enhanced security"]
  },
  {
    quarter: "Q1 2026",
    title: "Mobile App Development",
    description: "React Native mobile app with native features",
    status: "upcoming",
    features: ["Native contact sync", "QR payments", "Offline mode"]
  },
  {
    quarter: "Q2 2026",
    title: "Fiat Integration",
    description: "ETN-to-fiat conversion and Android app launch",
    status: "upcoming",
    features: ["Fiat on/off ramps", "Android app", "10 countries"]
  },
  {
    quarter: "Q3 2026",
    title: "Scale & Optimize",
    description: "Expand to 10 African countries with USSD support",
    status: "upcoming",
    features: ["USSD integration", "Enterprise partnerships", "Advanced analytics"]
  }
];

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Development
            <span className="block gradient-text">
              Roadmap
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We&apos;re building the future of mobile payments in Africa, one quarter at a time
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-500 to-cyan-500"></div>

          <div className="space-y-12">
            {roadmapItems.map((item, index) => (
              <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                {/* Timeline dot */}
                <div className={`absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 rounded-full border-4 border-white dark:border-gray-800 ${
                  item.status === 'completed' ? 'bg-emerald-500' :
                  item.status === 'current' ? 'bg-sky-500 animate-pulse' :
                  'bg-gray-300 dark:bg-gray-600'
                }`}></div>

                {/* Content */}
                <div className={`ml-16 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                  <div className="card p-6 hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${
                        item.status === 'completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' :
                        item.status === 'current' ? 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {item.status === 'completed' ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </>
                        ) : item.status === 'current' ? (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            In Progress
                          </>
                        ) : (
                          <>
                            <Calendar className="w-3 h-3 mr-1" />
                            Upcoming
                          </>
                        )}
                      </span>
                      <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">
                        {item.quarter}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {item.description}
                    </p>
                    
                    <ul className="space-y-2">
                      {item.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 