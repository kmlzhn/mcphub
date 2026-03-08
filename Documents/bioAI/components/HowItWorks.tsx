export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Data Collection",
      description:
        "Gather environmental data including water flow patterns, microplastic distribution, and chemical compositions to inform the simulation parameters.",
      icon: "📊",
    },
    {
      number: "02",
      title: "AI Evolution",
      description:
        "Deploy machine learning algorithms to evolve multicellular structures across thousands of generations, optimizing for microplastic capture efficiency.",
      icon: "🧬",
    },
    {
      number: "03",
      title: "Structure Optimization",
      description:
        "Analyze evolved structures for biodegradability, stability, and performance. Select the most promising candidates for further refinement.",
      icon: "🔬",
    },
    {
      number: "04",
      title: "Real-World Testing",
      description:
        "Deploy optimized structures in controlled environments, monitor performance, and iterate based on real-world feedback and results.",
      icon: "🌊",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-slate-900/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our AI-driven approach combines evolutionary algorithms with synthetic
            biology to create optimized microplastic capture solutions
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              {/* Connector line (desktop only) */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
              )}

              {/* Card */}
              <div className="glass rounded-xl p-6 h-full hover:bg-white/10 transition-all duration-300 relative z-10">
                {/* Number badge */}
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg mb-4">
                  <span className="text-xl font-bold text-white">
                    {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div className="text-4xl mb-4">{step.icon}</div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <a
            href="#dashboard"
            className="inline-flex items-center space-x-2 px-6 py-3 glass hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <span className="text-white">Try the simulation</span>
            <svg
              className="w-5 h-5 text-cyan-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
