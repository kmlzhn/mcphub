export default function Metrics() {
  const metrics = [
    {
      title: "Capture Efficiency",
      value: "94.2%",
      change: "+12.4%",
      positive: true,
      icon: "🎯",
      description: "Microplastic capture rate",
    },
    {
      title: "Biodegradability",
      value: "100%",
      change: "Stable",
      positive: true,
      icon: "♻️",
      description: "Fully biodegradable materials",
    },
    {
      title: "Energy Efficiency",
      value: "87.3%",
      change: "+5.2%",
      positive: true,
      icon: "⚡",
      description: "Low energy consumption",
    },
    {
      title: "Water Quality",
      value: "98.1%",
      change: "+8.9%",
      positive: true,
      icon: "💧",
      description: "Improvement in clarity",
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{metric.icon}</div>
                <div
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    metric.positive
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {metric.change}
                </div>
              </div>

              <h3 className="text-sm text-gray-400 mb-2">{metric.title}</h3>
              <div className="text-3xl font-bold text-white mb-2">
                {metric.value}
              </div>
              <p className="text-xs text-gray-500">{metric.description}</p>

              {/* Progress bar */}
              <div className="mt-4 w-full bg-slate-800 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: metric.value }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
