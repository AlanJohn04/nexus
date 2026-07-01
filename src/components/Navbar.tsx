"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Activity, Compass, BrainCircuit, User, PlusCircle, CheckCircle2 } from 'lucide-react';
import { useWeb3 } from '@/components/Web3Provider';

export default function Navbar() {
  const pathname = usePathname();
  const { address, username, connectWallet, isConnecting } = useWeb3();
  const [balance, setBalance] = useState(1000); // Mock starting balance of $NXS, to be fetched later

  // Listen for custom events to update balance from staking/completions
  useEffect(() => {
    const handleBalanceChange = (e: CustomEvent) => {
      setBalance(prev => prev + e.detail);
    };
    window.addEventListener('update-nxs-balance' as any, handleBalanceChange);
    return () => window.removeEventListener('update-nxs-balance' as any, handleBalanceChange);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Activity className="w-4 h-4" /> },
    { name: 'Explore', path: '/explore', icon: <Compass className="w-4 h-4" /> },
    { name: 'Twin Lab', path: '/twin', icon: <BrainCircuit className="w-4 h-4" /> },
    { name: 'Profile', path: '/profile', icon: <User className="w-4 h-4" /> },
  ];

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-nexus-border bg-nexus-void/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            <span className="font-bold text-white text-sm tracking-tighter font-mono-custom">N</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-nexus-cyan transition-colors">
            NEXUS
          </span>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path} className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors hover:text-white text-gray-400 flex items-center gap-2">
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-white/5 border border-white/10 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={isActive ? 'text-nexus-cyan' : 'text-gray-400 group-hover:text-white'}>
                  {item.icon}
                </span>
                <span className={isActive ? 'text-white' : ''}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons / Wallet Connect */}
        <div className="flex items-center gap-3">
          <Link href="/compose">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-full bg-gradient-cyan text-nexus-void font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              New Intent
            </motion.button>
          </Link>

          {address && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-nexus-panel border border-nexus-border text-xs">
              <span className="text-nexus-gold font-bold">{balance.toLocaleString()} $NXS</span>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => connectWallet(true)}
            disabled={isConnecting}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 border transition-all ${
              address
                ? 'bg-nexus-panel border-nexus-emerald text-nexus-emerald shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                : 'bg-nexus-void border-nexus-indigo text-nexus-indigo hover:bg-nexus-indigo/10'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>{isConnecting ? 'Connecting...' : address ? (username || formatAddress(address)) : 'Connect Wallet'}</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
