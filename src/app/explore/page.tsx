"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Flame, TrendingUp, Clock, AlertTriangle, 
  ChevronRight, ArrowUpRight, BrainCircuit, Wallet, CheckCircle, ExternalLink 
} from 'lucide-react';
import { Intent, IntentCategory } from '@/lib/types';
import { useWeb3 } from '@/components/Web3Provider';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '@/lib/contracts';

export default function ExplorePage() {
  const { address, connectWallet } = useWeb3();
  const [activeTab, setActiveTab] = useState<'trending' | 'new' | 'closing'>('trending');
  const [filter, setFilter] = useState<IntentCategory | 'all'>('all');
  
  const [intents, setIntents] = useState<Intent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Staking state
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState<number>(50);
  const [isStaking, setIsStaking] = useState(false);
  const [stakeSide, setStakeSide] = useState<'yes'|'no'>('yes');

  const fetchIntents = async () => {
    try {
      setIsLoading(true);
      // MOCK DATA FOR SOROBAN
      setIntents([]);
    } catch (error) {
      console.error("Error fetching intents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIntents();
  }, []);

  const filteredIntents = intents.filter(i => filter === 'all' || i.category === filter);

  const handleStake = async () => {
    if (!address || !selectedIntent) {
      alert("Please connect your wallet first!");
      await connectWallet();
      return;
    }

    setIsStaking(true);
    
    try {
      // Soroban Stub
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Successfully staked ${stakeAmount} $NXS on ${stakeSide.toUpperCase()}!`);
      setSelectedIntent(null);
      fetchIntents(); // Refresh data
      
    } catch (error) {
      console.error("Error staking:", error);
      alert("Failed to stake. Ensure you haven't already staked on the opposite side.");
    } finally {
      setIsStaking(false);
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
      
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 pb-8 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Explore Intentions</h1>
          <p className="text-gray-400 text-sm mt-1">Discover, verify, and stake on community commitments</p>
        </div>
        
        <div className="flex items-center gap-4 bg-nexus-panel p-1.5 rounded-full border border-nexus-border">
          <div className="flex rounded-full overflow-hidden">
            {['trending', 'new', 'closing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 text-xs font-bold capitalize transition-all ${
                  activeTab === tab 
                    ? 'bg-nexus-void text-nexus-cyan' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab === 'trending' && <Flame className="w-3.5 h-3.5 inline mr-1" />}
                {tab === 'closing' && <Clock className="w-3.5 h-3.5 inline mr-1" />}
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0 space-y-6">
          <div className="glass-panel rounded-3xl p-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Categories
            </h3>
            <div className="space-y-2">
              {['all', 'career', 'health', 'finance', 'relationships', 'learning', 'custom'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat as any)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    filter === cat
                      ? 'bg-nexus-indigo/20 text-white border border-nexus-indigo/30'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 bg-gradient-to-b from-nexus-indigo/10 to-transparent border border-nexus-indigo/20">
            <h3 className="text-xs font-bold text-nexus-cyan uppercase tracking-wider mb-3">Alpha Strategy</h3>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              Look for intents with high creator stakes but low SAGE probability scores. The market often misprices human willpower.
            </p>
            <button className="text-[10px] uppercase font-bold text-nexus-indigo hover:text-white flex items-center gap-1 transition-colors">
              Open Strategy Guide <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Main Feed */}
        <div className="flex-1 space-y-6">
          {/* Active Staking Panel */}
          {selectedIntent && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-3xl p-6 border-nexus-cyan/40 bg-nexus-cyan/5 mb-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-nexus-cyan" />
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-white">Place Your Stake</h3>
                <button onClick={() => setSelectedIntent(null)} className="text-gray-500 hover:text-white text-sm">Cancel</button>
              </div>
              
              <div className="flex gap-4 mb-6">
                <button 
                  onClick={() => setStakeSide('yes')}
                  className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${
                    stakeSide === 'yes' ? 'border-nexus-emerald bg-nexus-emerald/10 text-nexus-emerald' : 'border-white/5 text-gray-500 hover:border-white/20'
                  }`}
                >
                  Bet YES (Will Complete)
                </button>
                <button 
                  onClick={() => setStakeSide('no')}
                  className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${
                    stakeSide === 'no' ? 'border-nexus-crimson bg-nexus-crimson/10 text-nexus-crimson' : 'border-white/5 text-gray-500 hover:border-white/20'
                  }`}
                >
                  Bet NO (Will Fail)
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Amount ($NXS)</span>
                  <span className="font-bold text-nexus-gold">{stakeAmount} $NXS</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={1000}
                  step={10}
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(Number(e.target.value))}
                  className="w-full accent-nexus-gold bg-nexus-void/50 h-2 rounded-lg appearance-none cursor-pointer border border-nexus-border"
                />
                
                <div className="text-[10px] font-mono-custom text-gray-500 leading-relaxed bg-nexus-void/50 p-3 rounded-xl border border-white/5">
                   <p className="text-nexus-cyan font-bold mb-1">Decentralized Payout Rules:</p>
                   • If YES wins: Creator takes 10% of voter pool, YES voters split 90% of pool.<br/>
                   • If NO wins: NO voters split 50% of the Creator's initial stake (Penalty).<br/>
                   • Voting starts after deadline passes. Majority decides outcome.
                </div>

                <button 
                  onClick={handleStake}
                  disabled={isStaking}
                  className="w-full py-3 rounded-full bg-gradient-cyan text-nexus-void font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)] disabled:opacity-50"
                >
                  <Wallet className="w-4 h-4" />
                  {isStaking ? 'Confirming in Wallet...' : 'Confirm Stake on IntentChain'}
                </button>
              </div>
            </motion.div>
          )}

          {isLoading ? (
            <div className="glass-panel rounded-3xl p-12 text-center text-gray-500 animate-pulse">
              Fetching intents from Hardhat node...
            </div>
          ) : filteredIntents.length === 0 ? (
             <div className="glass-panel rounded-3xl p-12 text-center text-gray-500">
               No active intentions found.
             </div>
          ) : (
            filteredIntents.map((intent) => {
              const totalPool = intent.yesStakes + intent.noStakes;
              const yesRatio = totalPool > 0 ? (intent.yesStakes / totalPool) * 100 : 50;
              const daysLeft = intent.deadline ? Math.max(0, Math.ceil((new Date(intent.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;
              
              return (
                <motion.div
                  key={intent.id}
                  layout
                  className="glass-panel rounded-3xl p-6 group hover:border-white/10 transition-colors"
                >
                  {/* Top Bar: User & Proof */}
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-[10px] font-black text-white">
                        {intent.creatorName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white">{intent.creatorName}</span>
                        <span className="text-[10px] text-gray-500 block uppercase tracking-wider">Soulbound Rank: Operator</span>
                      </div>
                    </div>
                    {intent.hasProof ? (
                       <a href={intent.proofLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-nexus-emerald/10 border border-nexus-emerald/30 text-nexus-emerald text-[10px] font-bold hover:bg-nexus-emerald/20 transition-colors">
                          <CheckCircle className="w-3.5 h-3.5" /> View Submitted Proof
                          <ExternalLink className="w-3 h-3 ml-1" />
                       </a>
                    ) : (
                       <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-500 uppercase">
                          No Proof Yet
                       </span>
                    )}
                  </div>

                  {/* Description & Category */}
                  <div className="mb-6">
                    <span className="px-2 py-0.5 rounded bg-nexus-indigo/10 text-nexus-indigo text-[9px] uppercase font-bold tracking-widest mb-2 inline-block">
                      {intent.category}
                    </span>
                    <h3 className="text-xl font-bold text-white leading-snug">
                      "{intent.description}"
                    </h3>
                  </div>

                  {/* SAGE & Deadline */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-left">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Creator Stake</span>
                      <span className="text-lg font-black text-nexus-gold font-mono-custom">{intent.stakeAmount} $NXS</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                        SAGE Probability <BrainCircuit className="w-3 h-3 text-nexus-cyan" />
                      </span>
                      <span className="text-lg font-black text-nexus-cyan font-mono-custom">{intent.sageScore}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Total Pool</span>
                      <span className="text-lg font-bold text-white font-mono-custom">{totalPool.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Time Left</span>
                      <span className="text-sm font-bold text-nexus-rose flex items-center gap-1 h-7">
                        <Clock className="w-4 h-4" /> {daysLeft} Days
                      </span>
                    </div>
                  </div>

                  {/* Sentiment Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-[10px] font-bold font-mono-custom mb-1.5">
                      <span className="text-nexus-emerald">YES ({Math.round(yesRatio)}%)</span>
                      <span className="text-nexus-crimson">NO ({100 - Math.round(yesRatio)}%)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-nexus-crimson overflow-hidden flex">
                      <div className="h-full bg-nexus-emerald" style={{ width: `${yesRatio}%` }} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end pt-4 border-t border-white/5">
                    <button
                      onClick={() => setSelectedIntent(intent.id)}
                      className="px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center gap-2 transition-all"
                    >
                      Stake on Outcome <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
