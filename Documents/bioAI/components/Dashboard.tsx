"use client";

import { useState } from "react";

export default function Dashboard() {
  const [generation, setGeneration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [generations, setGenerations] = useState(60);
  const [populationSize, setPopulationSize] = useState(20);
  const [mutationRate, setMutationRate] = useState(0.15);
  const [bestFitness, setBestFitness] = useState(0);
  const [avgFitness, setAvgFitness] = useState(0);

  return (
    <section id="dashboard" className="py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="mx-auto h-full">
        {/* Top Filters Bar */}
        <div className="glass rounded-xl p-4 mb-4 max-w-[1800px] mx-auto">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-400 whitespace-nowrap">View:</label>
                <select className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-teal-500">
                  <option>3D Visualization</option>
                  <option>Data Graph</option>
                  <option>Statistics</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-400 whitespace-nowrap">Time:</label>
                <select className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-teal-500">
                  <option>Last 100 Gen</option>
                  <option>Last 500 Gen</option>
                  <option>Last 1000 Gen</option>
                  <option>All Time</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-400 whitespace-nowrap">Display:</label>
                <select className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-teal-500">
                  <option>All Elements</option>
                  <option>Organisms Only</option>
                  <option>Microplastics Only</option>
                  <option>Capture Zones</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-400 whitespace-nowrap">Quality:</label>
                <select className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-teal-500">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">
                Gen: <span className="text-teal-400 font-semibold">{generation}</span> / <span className="text-white font-semibold">{generations}</span>
              </span>
              {isRunning && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400">Running</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid with Side Filters */}
        <div className="grid lg:grid-cols-5 gap-4 max-w-[1800px] mx-auto" style={{ height: 'calc(100vh - 250px)' }}>
          {/* Side Filter Panel - Left */}
          <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 250px)' }}>
            {/* Simulation Controls */}
            <div className="glass rounded-xl p-4">
              <h3 className="text-base font-semibold text-white mb-3">Evolution Controls</h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  disabled={isRunning}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 text-sm ${
                    isRunning
                      ? "bg-gray-600 cursor-not-allowed text-gray-400"
                      : "bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg shadow-teal-500/50"
                  }`}
                >
                  {isRunning ? "🧬 Evolution Running..." : "▶ Run Evolution"}
                </button>

                <button 
                  className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all duration-200 text-sm"
                  onClick={() => {
                    setGeneration(0);
                    setBestFitness(0);
                    setAvgFitness(0);
                  }}
                >
                  ⟲ Reset Simulation
                </button>
              </div>
            </div>

            {/* Parameters */}
            <div className="glass rounded-xl p-4">
              <h3 className="text-base font-semibold text-white mb-3">Evolution Parameters</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1.5">
                    Generations
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={generations}
                    onChange={(e) => setGenerations(parseInt(e.target.value))}
                    className="w-full accent-teal-500"
                    disabled={isRunning}
                  />
                  <div className="text-xs text-teal-400 font-medium mt-1">{generations}</div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1.5">
                    Population Size
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={populationSize}
                    onChange={(e) => setPopulationSize(parseInt(e.target.value))}
                    className="w-full accent-teal-500"
                    disabled={isRunning}
                  />
                  <div className="text-xs text-teal-400 font-medium mt-1">{populationSize} organisms</div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1.5">
                    Mutation Rate
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={mutationRate * 100}
                    onChange={(e) => setMutationRate(parseInt(e.target.value) / 100)}
                    className="w-full accent-teal-500"
                    disabled={isRunning}
                  />
                  <div className="text-xs text-teal-400 font-medium mt-1">{(mutationRate * 100).toFixed(0)}%</div>
                </div>
              </div>
            </div>

            {/* Fitness Stats */}
            <div className="glass rounded-xl p-4 border border-teal-500/20">
              <h3 className="text-base font-semibold text-white mb-3">Fitness Stats</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Best Fitness</span>
                  <span className="text-sm text-orange-400 font-bold">{bestFitness.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Avg Fitness</span>
                  <span className="text-sm text-teal-400 font-bold">{avgFitness.toFixed(1)}</span>
                </div>
                <div className="border-t border-white/10 my-2 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Current Gen</span>
                    <span className="text-sm text-white font-bold">{generation} / {generations}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cell Type Stats */}
            <div className="glass rounded-xl p-4">
              <h3 className="text-base font-semibold text-white mb-3">Cell Counts</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#4A90D9' }}></div>
                    <span className="text-xs text-gray-400">Structural</span>
                  </div>
                  <span className="text-xs text-white font-medium">32</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#E74C3C' }}></div>
                    <span className="text-xs text-gray-400">Adhesive</span>
                  </div>
                  <span className="text-xs text-white font-medium">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#2ECC71' }}></div>
                    <span className="text-xs text-gray-400">Cilia</span>
                  </div>
                  <span className="text-xs text-white font-medium">12</span>
                </div>
                <div className="border-t border-white/10 my-1 pt-1"></div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Total Cells</span>
                  <span className="text-xs text-teal-400 font-bold">62</span>
                </div>
              </div>
            </div>

            {/* Display Filters */}
            <div className="glass rounded-xl p-4">
              <h3 className="text-base font-semibold text-white mb-3">Display</h3>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-teal-500" />
                  <span className="text-xs text-gray-400">Organisms</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-teal-500" />
                  <span className="text-xs text-gray-400">Microplastics</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-teal-500" />
                  <span className="text-xs text-gray-400">Cell Labels</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="accent-teal-500" />
                  <span className="text-xs text-gray-400">Grid Lines</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="accent-teal-500" />
                  <span className="text-xs text-gray-400">Animations</span>
                </label>
              </div>
            </div>
          </div>

          {/* Simulation Viewport - Large Center Area */}
          <div className="lg:col-span-4">
            <div className="glass rounded-xl p-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-white">
                  Evolution Viewport
                </h3>
                <button className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg transition-all">
                  ⛶ Fullscreen
                </button>
              </div>

              {/* Visualization Area - Takes up remaining space */}
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl flex-1 border border-teal-500/20 overflow-hidden shadow-2xl shadow-teal-500/10">
                {/* Enhanced Grid background */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxMywgMTQ4LCAxMzYsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

                {/* Ambient glow effects */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>

                {/* Simulated organisms - Based on actual simulation */}
                <div className="relative z-10 w-full h-full p-8">
                  {/* Central organism - multicellular structure */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative w-48 h-48">
                      {/* Structural cells (blue) - provide shape */}
                      {[
                        [0, 0], [1, 0], [2, 0], [0, 1], [2, 1],
                        [0, 2], [1, 2], [2, 2], [1, 3], [1, 4]
                      ].map((pos, i) => (
                        <div
                          key={`struct-${i}`}
                          className="absolute w-12 h-12 rounded-sm animate-float"
                          style={{
                            backgroundColor: '#4A90D9',
                            top: `${pos[0] * 48}px`,
                            left: `${pos[1] * 48}px`,
                            animationDelay: `${i * 0.1}s`,
                            opacity: 0.8,
                            boxShadow: '0 0 10px rgba(74, 144, 217, 0.4)',
                          }}
                        />
                      ))}
                      
                      {/* Adhesive cells (red) - capture microplastics */}
                      {[
                        [1, 1], [3, 1], [0, 3], [2, 3], [3, 2]
                      ].map((pos, i) => (
                        <div
                          key={`adhesive-${i}`}
                          className="absolute w-12 h-12 rounded-sm animate-float"
                          style={{
                            backgroundColor: '#E74C3C',
                            top: `${pos[0] * 48}px`,
                            left: `${pos[1] * 48}px`,
                            animationDelay: `${i * 0.15}s`,
                            opacity: 0.9,
                            boxShadow: '0 0 12px rgba(231, 76, 60, 0.5)',
                          }}
                        />
                      ))}
                      
                      {/* Cilia cells (green) - provide motility */}
                      {[
                        [4, 0], [4, 2], [3, 0], [2, 4]
                      ].map((pos, i) => (
                        <div
                          key={`cilia-${i}`}
                          className="absolute w-12 h-12 rounded-sm animate-float"
                          style={{
                            backgroundColor: '#2ECC71',
                            top: `${pos[0] * 48}px`,
                            left: `${pos[1] * 48}px`,
                            animationDelay: `${i * 0.2}s`,
                            opacity: 0.8,
                            boxShadow: '0 0 10px rgba(46, 204, 113, 0.4)',
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Additional smaller organisms scattered */}
                  {[
                    { top: '15%', left: '20%' },
                    { top: '70%', left: '15%' },
                    { top: '25%', left: '75%' },
                    { top: '75%', left: '70%' }
                  ].map((pos, clusterIdx) => (
                    <div
                      key={`cluster-${clusterIdx}`}
                      className="absolute"
                      style={pos}
                    >
                      <div className="relative w-24 h-24">
                        {/* Small structural cells */}
                        {[[0, 0], [1, 0], [0, 1]].map((cellPos, i) => (
                          <div
                            key={i}
                            className="absolute w-8 h-8 rounded-sm animate-float"
                            style={{
                              backgroundColor: '#4A90D9',
                              top: `${cellPos[0] * 8}px`,
                              left: `${cellPos[1] * 8}px`,
                              opacity: 0.6,
                              animationDelay: `${(clusterIdx * 3 + i) * 0.1}s`,
                            }}
                          />
                        ))}
                        {/* Small adhesive cell */}
                        <div
                          className="absolute w-8 h-8 rounded-sm animate-float"
                          style={{
                            backgroundColor: '#E74C3C',
                            top: '8px',
                            left: '8px',
                            opacity: 0.7,
                            animationDelay: `${clusterIdx * 0.3}s`,
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Microplastic particles (orange) */}
                  {[...Array(45)].map((_, i) => {
                    const x = Math.random() * 100;
                    const y = Math.random() * 100;
                    // Avoid center where organism is
                    const isCaptured = (x > 35 && x < 65 && y > 35 && y < 65) && Math.random() > 0.3;
                    
                    return (
                      <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                          width: isCaptured ? '3px' : '4px',
                          height: isCaptured ? '3px' : '4px',
                          backgroundColor: isCaptured ? '#BDC3C7' : '#F39C12',
                          top: `${y}%`,
                          left: `${x}%`,
                          animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                          animationDelay: `${Math.random() * 2}s`,
                          opacity: isCaptured ? 0.3 : 0.8,
                          boxShadow: isCaptured ? 'none' : '0 0 6px rgba(243, 156, 18, 0.6)',
                        }}
                      />
                    );
                  })}
                </div>

                {/* Stats overlay */}
                <div className="absolute top-4 right-4 glass rounded-lg px-4 py-2 z-20">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#4A90D9' }}></div>
                      <span className="text-gray-400">Structural: <span className="text-white font-semibold">32</span></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#E74C3C' }}></div>
                      <span className="text-gray-400">Adhesive: <span className="text-white font-semibold">18</span></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#2ECC71' }}></div>
                      <span className="text-gray-400">Cilia: <span className="text-white font-semibold">12</span></span>
                    </div>
                    <div className="border-t border-white/10 my-1 pt-1"></div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F39C12' }}></div>
                      <span className="text-gray-400">Free: <span className="text-white font-semibold">28</span></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span className="text-gray-400">Captured: <span className="text-teal-400 font-semibold">17</span></span>
                    </div>
                  </div>
                </div>

                {/* Legend overlay */}
                <div className="absolute bottom-4 left-4 glass rounded-lg px-4 py-2 z-20">
                  <div className="text-xs text-gray-400">
                    <div className="font-semibold text-white mb-1">Cell Types:</div>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#4A90D9' }}></div>
                        <span>Structural</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#E74C3C' }}></div>
                        <span>Adhesive</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#2ECC71' }}></div>
                        <span>Cilia</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
