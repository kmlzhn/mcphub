# AI-Evolved Living Micro-Assemblies

A web-based visualization for genetic algorithms that evolve multicellular organisms to capture microplastics.

## Overview

This project simulates the evolution of artificial organisms using genetic algorithms. Each organism consists of specialized cell types:

- **Structural cells** (blue): Provide shape and stability
- **Adhesive cells** (red): Capture microplastic particles  
- **Cilia cells** (green): Enable movement and motility

Through natural selection over multiple generations, organisms evolve optimized structures for efficiently capturing microplastics from water.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React** - UI components

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

## Project Structure

```
bioAI/
├── app/
│   ├── globals.css       # Global styles & glassmorphism
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/
│   ├── Navbar.tsx        # Navigation bar
│   ├── Hero.tsx          # Landing section
│   └── Dashboard.tsx     # Simulation visualization
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## Features

- **Interactive Dashboard**: Real-time simulation controls
- **Parameter Tuning**: Adjust mutation rate, population size, selection pressure
- **Environment Settings**: Control water flow, temperature, pH levels
- **Visual Filters**: Toggle display of different cell types and particles
- **Cell Type Legend**: Clear visualization of organism structure

## Inspiration

Inspired by:
- Xenobot research (Kriegman et al. 2020)
- Michael Levin's bioelectric framework for morphogenesis
- Genetic algorithms for evolutionary computation

## License

MIT
