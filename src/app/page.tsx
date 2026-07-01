"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BrainCircuit, ShieldCheck, Cpu, Coins, Award, Target } from 'lucide-react';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stats = [
    { label: "Intentions Locked", value: "48,921", icon: <Target className="w-4 h-4 text-nexus-cyan" /> },
    { label: "Total $NXS Staked", value: "2,451,900", icon: <Coins className="w-4 h-4 text-nexus-gold" /> },
    { label: "SAGE Accuracy", value: "94.2%", icon: <Cpu className="w-4 h-4 text-nexus-indigo" /> },
    { label: "Success Rate", value: "88.6%", icon: <Award className="w-4 h-4 text-nexus-emerald" /> }
  ];

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative overflow-hidden">
      
      {/* Hero Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-4xl mx-auto z-10"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-xs text-nexus-cyan mb-8 border border-nexus-cyan/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
        >
          <BrainCircuit className="w-4 h-4 animate-pulse" />
          <span>SAGE 1.0 & ParallelMind AI Engines Live on Hardhat Testnet</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-8xl font-black tracking-tight leading-none mb-6"
        >
          Your AI Twin. <br />
          Your Future. <br />
          <span className="text-gradient-primary">On-Chain.</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Before you commit to anything, NEXUS makes sure it's the right thing to commit to. Simulate your decisions, consult your AI Twin, and lock your intentions on-chain with decentralized accountability.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/compose">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-cyan text-nexus-void font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] transition-all"
            >
              Compose First Intent
              <ArrowRight className="w-4 h-4 text-nexus-void" />
            </motion.button>
          </Link>
          
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-nexus-panel border border-nexus-border text-white hover:border-nexus-indigo/40 font-bold text-sm transition-all"
            >
              Enter Dashboard
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Realtime Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="w-full max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20 z-10"
      >
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-32 relative group overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">{stat.label}</span>
              <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:border-nexus-indigo/20 transition-all">
                {stat.icon}
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-black text-white font-mono-custom tracking-tight">
              {stat.value}
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-primary w-0 group-hover:w-full transition-all duration-500" />
          </div>
        ))}
      </motion.div>

      {/* The Three Pillars Section */}
      <div className="w-full max-w-5xl mx-auto z-10 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">The NEXUS Life Engine</h2>
          <p className="text-gray-400 mt-2">A fully integrated loop of decision intelligence and accountability.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: SAGE */}
          <motion.div
            whileHover={{ y: -4 }}
            className="glass-panel p-8 rounded-3xl border border-nexus-cyan/10 hover:border-nexus-cyan/30 transition-all relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-nexus-cyan/10 border border-nexus-cyan/20 flex items-center justify-center text-nexus-cyan mb-6 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">1. SAGE Life OS</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Simulates your choices before you make them. Analyzes your history, predicts risk points, and suggests optimal timing to maximize your success probability.
            </p>
            <div className="text-xs text-nexus-cyan font-mono-custom flex items-center gap-1">
              <span>PROBABILITY MODELING ACTIVE</span>
            </div>
          </motion.div>

          {/* Pillar 2: ParallelMind */}
          <motion.div
            whileHover={{ y: -4 }}
            className="glass-panel p-8 rounded-3xl border border-nexus-rose/10 hover:border-nexus-rose/30 transition-all relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-nexus-rose/10 border border-nexus-rose/20 flex items-center justify-center text-nexus-rose mb-6 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">2. ParallelMind AI Twin</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Your digital double that thinks like you. It learns your writing style, analyzes your blind spots, and guides you to frame intentions based on your psychological profile.
            </p>
            <div className="text-xs text-nexus-rose font-mono-custom flex items-center gap-1">
              <span>COGNITIVE SIMULATION RUNNING</span>
            </div>
          </motion.div>

          {/* Pillar 3: IntentChain */}
          <motion.div
            whileHover={{ y: -4 }}
            className="glass-panel p-8 rounded-3xl border border-nexus-violet/10 hover:border-nexus-violet/30 transition-all relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-nexus-violet/10 border border-nexus-violet/20 flex items-center justify-center text-nexus-violet mb-6 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">3. IntentChain Web3</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Decentralized accountability. Stake $NXS tokens, lock goals on-chain, and let the community vote on completion. Winners receive their stake back plus 10% of the voter pool.
            </p>
            <div className="text-xs text-nexus-violet font-mono-custom flex items-center gap-1">
              <span>HARDHAT SMART CONTRACTS LOADED</span>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
