"use client";

import { motion } from 'framer-motion';

interface ScoreRingProps {
  score: number; // 0 to 1000
  size?: number;
}

export default function ScoreRing({ score, size = 180 }: ScoreRingProps) {
  const percentage = Math.min(100, Math.max(0, (score / 1000) * 100));
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  // Determine tier
  let tier = "Bronze";
  let colorClass = "text-nexus-crimson";
  let glowClass = "shadow-[0_0_20px_rgba(239,68,68,0.3)]";

  if (score >= 900) {
    tier = "Legend";
    colorClass = "text-nexus-cyan font-black";
    glowClass = "shadow-[0_0_30px_rgba(34,211,238,0.5)]";
  } else if (score >= 800) {
    tier = "Platinum";
    colorClass = "text-nexus-violet";
    glowClass = "shadow-[0_0_25px_rgba(168,85,247,0.4)]";
  } else if (score >= 650) {
    tier = "Gold";
    colorClass = "text-nexus-gold";
    glowClass = "shadow-[0_0_20px_rgba(245,158,11,0.3)]";
  } else if (score >= 500) {
    tier = "Silver";
    colorClass = "text-gray-300";
    glowClass = "shadow-[0_0_15px_rgba(255,255,255,0.15)]";
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`relative flex items-center justify-center rounded-full bg-nexus-void/50 border border-white/5 ${glowClass}`} 
        style={{ width: size, height: size }}
      >
        {/* SVG Gauge */}
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-nexus-border"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#scoreGradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
          {/* Gradients */}
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>

        {/* Value Overlay */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black text-white font-mono-custom tracking-tighter">{score}</span>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">SBT SCORE</span>
        </div>
      </div>
      <div className="mt-4">
        <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 border border-white/10 ${colorClass}`}>
          Tier: {tier}
        </span>
      </div>
    </div>
  );
}
