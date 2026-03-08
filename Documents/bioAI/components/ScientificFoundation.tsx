export default function ScientificFoundation() {
  const foundations = [
    {
      title: "Evolutionary Algorithms",
      description:
        "Genetic algorithms simulate natural selection to evolve optimal structures over thousands of generations, each iteration improving capture efficiency.",
      topics: ["Natural Selection", "Genetic Operators", "Fitness Functions"],
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Synthetic Biology",
      description:
        "Engineer biodegradable organisms using CRISPR and genetic circuits to create self-assembling structures that naturally break down in aquatic environments.",
      topics: ["CRISPR Engineering", "Genetic Circuits", "Biodegradability"],
      color: "from-cyan-500 to-blue-600",
    },
    {
      title: "Machine Learning",
      description:
        "Neural networks predict structural performance and optimize material properties, accelerating the discovery of effective microplastic capture mechanisms.",
      topics: ["Neural Networks", "Reinforcement Learning", "Predictive Models"],
      color: "from-green-500 to-emerald-600",
    },
  ];

  return (
    <section id="science" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Scientific Foundation
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Built on cutting-edge research at the intersection of artificial
            intelligence, synthetic biology, and environmental science
          </p>
        </div>

        {/* Foundation Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {foundations.map((foundation, idx) => (
            <div
              key={idx}
              className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Gradient header */}
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${foundation.color} mb-6`}
              ></div>

              <h3 className="text-2xl font-semibold text-white mb-4">
                {foundation.title}
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {foundation.description}
              </p>

              {/* Topics */}
              <div className="flex flex-wrap gap-2">
                {foundation.topics.map((topic, topicIdx) => (
                  <span
                    key={topicIdx}
                    className="text-xs px-3 py-1 bg-white/5 text-gray-300 rounded-full border border-white/10"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Research Papers Section */}
        <div className="glass rounded-xl p-8">
          <h3 className="text-2xl font-semibold text-white mb-6">
            Key Research & Publications
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title:
                  "Evolutionary Algorithms for Biodegradable Structure Design",
                journal: "Nature Biotechnology",
                year: "2025",
              },
              {
                title: "AI-Driven Microplastic Capture: A Novel Approach",
                journal: "Science",
                year: "2025",
              },
              {
                title: "Synthetic Biology Applications in Water Remediation",
                journal: "Cell",
                year: "2024",
              },
              {
                title: "Machine Learning for Environmental Solutions",
                journal: "Environmental Science & Technology",
                year: "2024",
              },
            ].map((paper, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white/5 transition-all duration-200"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">📄</span>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">{paper.title}</h4>
                  <p className="text-sm text-gray-400">
                    {paper.journal} • {paper.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {[
            { value: "15+", label: "Research Partners" },
            { value: "50+", label: "Publications" },
            { value: "$2.5M", label: "Research Funding" },
            { value: "3", label: "Patents Filed" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
