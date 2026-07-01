"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Shield, Coins, Award, CheckCircle, XCircle, 
  Clock, Share2, ExternalLink, ArrowUpRight 
} from 'lucide-react';
import ScoreRing from '@/components/ScoreRing';
import { Intent } from '@/lib/types';
import { useWeb3 } from '@/components/Web3Provider';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '@/lib/contracts';

export default function ProfilePage() {
  const { provider, address, username } = useWeb3();
  const [stats, setStats] = useState({
    username: 'Operator',
    address: 'Not Connected',
    intentScore: 0,
    balanceNXS: 0,
    totalStaked: 0,
    totalEarned: 0
  });
  const [history, setHistory] = useState<Intent[]>([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfileData = async () => {
    if (!provider || !address) return;
    try {
      setIsLoading(true);
      const intentContract = new ethers.Contract(CONTRACT_ADDRESSES.intentChain, CONTRACT_ABIS.intentChain, provider);
      const sbtContract = new ethers.Contract(CONTRACT_ADDRESSES.reputationScore, CONTRACT_ABIS.reputationScore, provider);
      const tokenContract = new ethers.Contract(CONTRACT_ADDRESSES.nexusToken, CONTRACT_ABIS.nexusToken, provider);
      
      let count = 0n;
      let sbtScore = 500n;
      let balance = 0n;
      
      try {
        count = await intentContract.intentCount();
      } catch (e) { console.warn("Failed to fetch intentCount:", e); }
      
      try {
        sbtScore = await sbtContract.getScore(address);
      } catch (e) { console.warn("Failed to fetch score:", e); }
      
      try {
        balance = await tokenContract.balanceOf(address);
      } catch (e) { console.warn("Failed to fetch balance:", e); }
      
      const userHistory: Intent[] = [];
      let totalStaked = 0;
      
      for (let i = 1; i <= Number(count); i++) {
        try {
          const intentData = await intentContract.intents(i);
          if (intentData.creator.toLowerCase() === address.toLowerCase()) {
            if (intentData.resolved) {
              userHistory.push({
                id: i.toString(),
                creatorName: "You",
                description: intentData.description,
                category: intentData.category,
                stakeAmount: Number(ethers.formatEther(intentData.stakeAmount)),
                sageScore: Number(intentData.sageScore),
                deadline: new Date(Number(intentData.deadline) * 1000).toISOString(),
                status: intentData.completed ? 'completed' : 'failed',
                resolved: true,
                completed: intentData.completed,
                yesStakes: Number(ethers.formatEther(intentData.totalYesStakes)),
                noStakes: Number(ethers.formatEther(intentData.totalNoStakes)),
                votesCount: 0,
              });
            } else {
               totalStaked += Number(ethers.formatEther(intentData.stakeAmount));
            }
          }
        } catch (e) { console.warn("Failed to fetch intent", i, e); }
      }
      
      setHistory(userHistory.reverse());
      setStats({
        username: username || 'Operator',
        address: `${address.substring(0, 6)}...${address.substring(38)}`,
        intentScore: Number(sbtScore) > 0 ? Number(sbtScore) : 500, // Default 500 if new
        balanceNXS: Number(ethers.formatEther(balance)),
        totalStaked: totalStaked,
        totalEarned: 0 // Mocked for simplicity
      });
      
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (provider && address) {
      fetchProfileData();
    } else {
      setIsLoading(false);
    }
  }, [provider, address]);

  const handleShare = () => {
    setCopied(true);
    navigator.clipboard.writeText(`My NEXUS Soulbound Reputation Score is ${stats.intentScore}. Verify my track record on-chain at: https://nexus.network/profile/${address}`);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!address) {
    return (
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10 flex flex-col items-center justify-center h-[70vh]">
        <div className="glass-panel rounded-3xl p-12 text-center max-w-md w-full border border-nexus-border">
          <Shield className="w-16 h-16 text-nexus-cyan mx-auto mb-6 opacity-50" />
          <h2 className="text-2xl font-bold text-white mb-4">Profile Not Found</h2>
          <p className="text-gray-400 mb-8">Please connect your Web3 wallet to view your decentralized track record and SBT profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
      
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 pb-8 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-primary flex items-center justify-center text-white text-2xl font-black shadow-[0_0_20px_rgba(99,102,241,0.3)] uppercase">
            {stats.username.substring(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{stats.username}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-nexus-indigo/10 border border-nexus-indigo/20 text-[10px] font-bold text-nexus-indigo font-mono-custom">
                VERIFIED TWIN
              </span>
            </div>
            <span className="text-xs text-gray-500 font-mono-custom block mt-1">{stats.address}</span>
          </div>
        </div>

        <button
          onClick={handleShare}
          disabled={!address}
          className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
        >
          <Share2 className="w-3.5 h-3.5" />
          {copied ? 'Copied Track Record!' : 'Share Soulbound Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: SOULBOUND REPUTATION TOKEN DETAILS (1 col) */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 text-center space-y-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Soulbound SBT Badge</h3>
            
            {isLoading ? (
               <div className="h-[200px] flex items-center justify-center">
                  <div className="animate-spin w-8 h-8 border-4 border-nexus-cyan rounded-full border-t-transparent"></div>
               </div>
            ) : (
                <ScoreRing score={stats.intentScore} size={200} />
            )}

            <div className="p-3.5 rounded-2xl bg-nexus-void/40 border border-nexus-border text-left space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-400">
                <span>Verification Rating:</span>
                <span className="font-bold text-white">A+ Stable</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>SBT Token ID:</span>
                <span className="font-mono-custom text-[10px] text-nexus-cyan">#SBT-8942-NXS</span>
              </div>
            </div>
          </div>

          {/* Staking & Wallet Stats */}
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-nexus-gold" />
              On-Chain Capital
            </h3>
            
            <div className="space-y-3 font-mono-custom text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-500">CURRENT BALANCE:</span>
                <span className="text-sm font-black text-nexus-gold">{stats.balanceNXS} $NXS</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-500">TOTAL STAKED:</span>
                <span className="text-sm font-bold text-white">{stats.totalStaked} $NXS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">TOTAL EARNED:</span>
                <span className="text-sm font-bold text-nexus-emerald">+{stats.totalEarned} $NXS</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TIMELINE & COMPLETED INTENTS (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-nexus-indigo" />
            Decentralized Track Record
          </h2>

          <div className="space-y-4">
            {!address ? (
               <div className="glass-panel rounded-3xl p-12 text-center text-gray-500 border border-nexus-border">
                  Connect your wallet to view your track record.
               </div>
            ) : isLoading ? (
               <div className="glass-panel rounded-3xl p-12 text-center text-gray-500 animate-pulse border border-nexus-border">
                  Loading track record from chain...
               </div>
            ) : history.length === 0 ? (
              <div className="glass-panel rounded-3xl p-12 text-center text-gray-500">
                No resolved intentions found on-chain. Complete your first goal to seed your permanent track record!
              </div>
            ) : (
              history.map((item, idx) => (
                <div 
                  key={item.id || idx}
                  className="glass-panel rounded-3xl p-5 border border-white/5 flex items-start gap-4"
                >
                  <div className="mt-1">
                    {item.completed ? (
                      <div className="p-1.5 rounded-xl bg-nexus-emerald/10 border border-nexus-emerald/20 text-nexus-emerald">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="p-1.5 rounded-xl bg-nexus-crimson/10 border border-nexus-crimson/20 text-nexus-crimson">
                        <XCircle className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-mono-custom uppercase text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                          {item.category}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1.5">
                          {item.description}
                        </h4>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-gray-500 block uppercase">STAKE</span>
                        <span className="text-xs font-bold text-white font-mono-custom">{item.stakeAmount} $NXS</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono-custom pt-2 border-t border-white/5">
                      <span>
                        Resolved: {new Date(item.deadline).toLocaleDateString()}
                      </span>
                      <a 
                        href={`#`} 
                        className="text-nexus-cyan hover:underline flex items-center gap-0.5"
                      >
                        Verify TX
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
