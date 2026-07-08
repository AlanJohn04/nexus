"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Calendar, Activity, AlertTriangle, Coins, 
  ArrowUpRight, BrainCircuit, CheckCircle, PlayCircle, Loader2, Award, Paperclip
} from 'lucide-react';
import ScoreRing from '@/components/ScoreRing';
import { Intent } from '@/lib/types';
import { useWeb3 } from '@/components/Web3Provider';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '@/lib/contracts';

export default function DashboardPage() {
  const { address } = useWeb3();
  const [intents, setIntents] = useState<Intent[]>([]);
  
  const [stats, setStats] = useState({
    completedIntents: 0,
    failedIntents: 0,
    intentScore: 0,
    totalEarned: 0
  });

  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionStep, setResolutionStep] = useState(0);
  const [payoutDetails, setPayoutDetails] = useState<{
    userReturned: number;
    userBonus: number;
    majorityYes: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Proof state
  const [submittingProofId, setSubmittingProofId] = useState<string | null>(null);
  const [proofLinkInput, setProofLinkInput] = useState('');

  const fetchUserData = async () => {
    if (!address) return;
    try {
      setIsLoading(true);
      
      // MOCK DATA FOR SOROBAN MIGRATION
      setIntents([]);
      setStats({
        completedIntents: 0,
        failedIntents: 0,
        intentScore: 500,
        totalEarned: 0
      });
      
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [address]);

  // Submit Proof to chain
  const handleSubmitProof = async (intentId: string) => {
    if (!proofLinkInput) return;
    try {
      setSubmittingProofId(intentId);
      
      // Soroban Stub
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert("Proof submitted successfully!");
      setProofLinkInput('');
      fetchUserData();
    } catch (error) {
      console.error("Proof submission failed:", error);
      alert("Failed to submit proof. See console for details.");
    } finally {
      setSubmittingProofId(null);
    }
  };

  // Execute Voting Resolution on chain
  const handleResolveIntent = async (intent: Intent) => {
    setResolvingId(intent.id);
    setResolutionStep(1); // "Verifying on-chain..."
    setPayoutDetails(null);

    try {
      // Soroban Stub
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResolutionStep(2); // "Waiting for block..."
      
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Refetch to see result
      const isCompleted = true; // stub
      
      // Calculate display numbers
      let userReturned = 0;
      let userBonus = 0;

      if (isCompleted) {
         userReturned = intent.stakeAmount;
         const totalPool = intent.yesStakes + intent.noStakes;
         userBonus = totalPool * 0.1;
      } else {
         // Failure penalty: User gets 50% back
         userReturned = intent.stakeAmount / 2;
         userBonus = 0;
      }
      
      setPayoutDetails({
        userReturned: userReturned,
        userBonus: userBonus,
        majorityYes: isCompleted
      });
      
      setResolutionStep(3); // "Resolved!"
      
      fetchUserData(); // Refresh stats
      
    } catch (error) {
      console.error("Resolution failed:", error);
      alert("Resolution failed. The deadline may not have passed yet.");
      closeResolutionModal();
    }
  };

  const closeResolutionModal = () => {
    setResolvingId(null);
    setResolutionStep(0);
    setPayoutDetails(null);
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <span className="text-xs text-nexus-cyan font-mono-custom tracking-wider font-semibold">WELCOME BACK, OPERATOR</span>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            NEXUS Mission Control
          </h1>
        </div>
        <Link href="/compose">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 rounded-full bg-gradient-cyan text-nexus-void font-bold text-sm shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          >
            Compose New Intention
          </motion.button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: ACTIVE INTENTS & FEED (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-nexus-indigo" />
              Active Commitments
            </h2>
            <span className="text-xs text-gray-500 font-mono-custom">{intents.filter(i => !i.resolved).length} Pending</span>
          </div>

          <div className="space-y-4">
            {!address ? (
               <div className="glass-panel rounded-3xl p-12 text-center space-y-4 border border-nexus-border">
                  <p className="text-gray-400">Please connect your wallet to view your intentions.</p>
               </div>
            ) : isLoading ? (
                <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
                  <p className="text-gray-500 font-mono-custom animate-pulse">Loading intentions from blockchain...</p>
                </div>
            ) : intents.filter(i => !i.resolved).length === 0 ? (
              <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
                <Target className="w-12 h-12 text-gray-600 mx-auto" />
                <p className="text-gray-400">No active commitments found. Ready to lock your next intention?</p>
                <Link href="/compose" className="inline-block text-nexus-cyan font-bold hover:underline text-sm">
                  Create one now →
                </Link>
              </div>
            ) : (
              intents.filter(i => !i.resolved).map((intent) => {
                const daysLeft = intent.deadline ? Math.max(0, Math.ceil((new Date(intent.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;
                return (
                  <motion.div
                    key={intent.id}
                    layoutId={intent.id}
                    className="glass-panel rounded-3xl p-6 relative overflow-hidden group border border-white/5 hover:border-nexus-indigo/20 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase font-bold tracking-widest text-nexus-cyan font-mono-custom">
                          {intent.category}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-3 leading-snug pr-8">
                          {intent.description}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500 block">STAKE</span>
                        <span className="text-lg font-black text-nexus-gold font-mono-custom">{intent.stakeAmount} $NXS</span>
                      </div>
                    </div>

                    {/* SAGE Probability indicator */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 py-4 border-y border-white/5">
                      <div>
                        <span className="text-xs text-gray-500 block">SAGE SUCCESS PROBABILITY</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-full bg-nexus-void h-1.5 rounded-full overflow-hidden border border-white/5">
                            <div 
                              className="h-full bg-gradient-cyan rounded-full" 
                              style={{ width: `${intent.sageScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-nexus-cyan font-mono-custom">{intent.sageScore}%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xs text-gray-500 block">VOTES / BETS</span>
                          <span className="text-xs text-gray-300 font-bold font-mono-custom">
                            ({(intent.yesStakes + intent.noStakes).toLocaleString()} $NXS)
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500 block">DEADLINE</span>
                          <span className="text-xs font-bold text-nexus-rose font-mono-custom flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {daysLeft} Days Left
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Proof Submission Section */}
                    <div className="my-4 pt-2 border-t border-white/5">
                       {intent.hasProof ? (
                          <div className="flex items-center gap-2 p-3 rounded-xl bg-nexus-emerald/10 border border-nexus-emerald/20">
                             <CheckCircle className="w-4 h-4 text-nexus-emerald" />
                             <div>
                                <span className="text-xs font-bold text-nexus-emerald block">Proof Submitted</span>
                                <a href={intent.proofLink} target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-400 hover:text-white hover:underline truncate block max-w-[250px]">
                                  {intent.proofLink}
                                </a>
                             </div>
                          </div>
                       ) : (
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-nexus-cyan uppercase tracking-wider block">Submit Proof for Voters</label>
                             <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Link to proof (Twitter, Github, etc.)"
                                  value={submittingProofId === intent.id ? proofLinkInput : ''}
                                  onChange={(e) => {
                                     setSubmittingProofId(intent.id);
                                     setProofLinkInput(e.target.value);
                                  }}
                                  className="flex-1 bg-nexus-void/50 border border-nexus-border rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-nexus-cyan transition-all"
                                />
                                <button
                                  onClick={() => handleSubmitProof(intent.id!)}
                                  disabled={submittingProofId === intent.id && !proofLinkInput}
                                  className="px-4 py-2 bg-nexus-cyan/20 hover:bg-nexus-cyan/40 border border-nexus-cyan/30 text-nexus-cyan rounded-lg text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1"
                                >
                                  {submittingProofId === intent.id && proofLinkInput ? 'Upload' : <Paperclip className="w-3.5 h-3.5" />}
                                </button>
                             </div>
                          </div>
                       )}
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="text-[10px] text-gray-600 font-mono-custom">
                        ID: {intent.id}
                      </div>
                      
                      <button
                        onClick={() => handleResolveIntent(intent)}
                        className="px-4 py-2 rounded-full bg-nexus-indigo/20 hover:bg-nexus-indigo/40 border border-nexus-indigo/40 text-nexus-indigo hover:text-white font-bold text-xs transition-all"
                      >
                        Verify Completion On-Chain
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SOULBOUND REPUTATION & TWIN NUDGE (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Soulbound reputation panel */}
          <div className="glass-panel rounded-3xl p-6 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-3 left-4 text-gray-600 font-mono-custom text-[10px]">SOULBOUND ID</div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Reputation Profile</h3>
            
            <ScoreRing score={stats.intentScore} />

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 text-left font-mono-custom text-xs">
              <div>
                <span className="text-gray-500 block">COMPLETED</span>
                <span className="text-sm font-bold text-nexus-emerald">{stats.completedIntents} Goals</span>
              </div>
              <div>
                <span className="text-gray-500 block">FAILED</span>
                <span className="text-sm font-bold text-nexus-crimson">{stats.failedIntents} Goals</span>
              </div>
              <div className="col-span-2 pt-2">
                <span className="text-gray-500 block">TOTAL BONUS EARNED</span>
                <span className="text-sm font-bold text-nexus-gold">+{stats.totalEarned.toLocaleString()} $NXS</span>
              </div>
            </div>
          </div>

          {/* ParallelMind Daily Nudge */}
          <div className="glass-panel rounded-3xl p-6 space-y-4 relative overflow-hidden">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-nexus-rose" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">ParallelMind Nudge</h3>
            </div>
            
            <p className="text-sm text-gray-300 leading-relaxed italic">
              "We've got 5 days left to launch the Hardhat MVP. Historically, our focus drops by 30% in the final stretch. Let's block out 2 hours today to complete the deploy scripts. I know we can finish this."
            </p>

            <Link href="/twin" className="block text-xs text-nexus-rose hover:underline font-bold">
              Open Twin Lab Chat →
            </Link>
          </div>

        </div>
      </div>

      {/* Resolution & Payout Modal */}
      <AnimatePresence>
        {resolvingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nexus-void/95 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel border-nexus-indigo/30 p-8 rounded-3xl max-w-md w-full text-center space-y-6 relative"
            >
              {resolutionStep === 1 && (
                <div className="space-y-4 py-8">
                  <Loader2 className="w-12 h-12 text-nexus-cyan animate-spin mx-auto" />
                  <h3 className="text-xl font-bold text-white">Broadcasting Resolution</h3>
                  <p className="text-sm text-gray-400">Executing IntentChain resolveIntent method...</p>
                </div>
              )}

              {resolutionStep === 2 && (
                <div className="space-y-4 py-8">
                  <Loader2 className="w-12 h-12 text-nexus-violet animate-spin mx-auto" />
                  <h3 className="text-xl font-bold text-white">Verifying Block</h3>
                  <p className="text-sm text-gray-400">Waiting for local Hardhat node confirmation...</p>
                </div>
              )}

              {resolutionStep === 3 && payoutDetails && (
                <div className="space-y-6">
                  {payoutDetails.majorityYes ? (
                    <div className="w-16 h-16 rounded-full bg-nexus-emerald/10 border border-nexus-emerald/30 flex items-center justify-center text-nexus-emerald mx-auto shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-bounce">
                      <Award className="w-8 h-8" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-nexus-crimson/10 border border-nexus-crimson/30 flex items-center justify-center text-nexus-crimson mx-auto shadow-[0_0_20px_rgba(220,38,38,0.2)] animate-bounce">
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-2xl font-black text-white">
                       {payoutDetails.majorityYes ? "Resolution Approved!" : "Resolution Failed"}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {payoutDetails.majorityYes 
                        ? "The majority of community votes confirmed your completion."
                        : "The community voted failure, or tied with no proof submitted. 50% penalty applied."}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-nexus-void/50 border border-nexus-border text-left space-y-3 font-mono-custom text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">YOUR STAKE RETURNED:</span>
                      <span className={payoutDetails.majorityYes ? "text-nexus-gold" : "text-nexus-crimson"}>
                        {payoutDetails.majorityYes ? "+" : ""}{payoutDetails.userReturned} $NXS
                      </span>
                    </div>
                    {payoutDetails.majorityYes && (
                       <div className="flex justify-between border-b border-white/5 pb-2">
                         <span className="text-gray-500">10% COMMUNITY BONUS:</span>
                         <span className="text-nexus-gold">+{payoutDetails.userBonus} $NXS</span>
                       </div>
                    )}
                    <div className="flex justify-between pt-1">
                      <span className="text-gray-400 font-bold">TOTAL PAYOUT:</span>
                      <span className={payoutDetails.majorityYes ? "text-nexus-emerald font-black" : "text-nexus-crimson font-black"}>
                        +{payoutDetails.userReturned + payoutDetails.userBonus} $NXS
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={closeResolutionModal}
                    className="w-full py-3 rounded-full bg-gradient-primary text-white font-bold text-sm"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
