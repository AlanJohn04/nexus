"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Target, Calendar, ShieldCheck, ArrowRight, ArrowLeft, 
  Cpu, Sparkles, BrainCircuit, Wallet, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { analyzeIntention, SageAnalysis } from '@/lib/sageEngine';
import { generateTwinFeedback, TwinFeedback } from '@/lib/parallelMind';
import { IntentCategory } from '@/lib/types';
import { useWeb3 } from '@/components/Web3Provider';
import { signTransaction } from '@stellar/freighter-api';

const SOROBAN_CONTRACT_ID = "CANB4HBVEPY3N4T5JZ2WTPHADAB3GGVIXMF6H7SGU3ZSEL2WITIZ4KR2";

export default function ComposePage() {
  const router = useRouter();
  const { address, connectWallet } = useWeb3();
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IntentCategory>('career');
  const [deadlineDays, setDeadlineDays] = useState(7);
  const [stakeAmount, setStakeAmount] = useState(100);
  
  // Simulation states
  const [isAnalyzingSage, setIsAnalyzingSage] = useState(false);
  const [sageResult, setSageResult] = useState<SageAnalysis | null>(null);
  const [isAnalyzingTwin, setIsAnalyzingTwin] = useState(false);
  const [twinResult, setTwinResult] = useState<TwinFeedback | null>(null);
  const [isCommitting, setIsCommitting] = useState(false);
  const [txHash, setTxHash] = useState('');

  // SAGE analysis trigger
  const runSageAnalysis = async () => {
    if (!description) return;
    setIsAnalyzingSage(true);
    setStep(2);
    
    const result = await analyzeIntention(description, category, deadlineDays);
    setSageResult(result);
    setIsAnalyzingSage(false);
  };

  // Twin analysis trigger
  const runTwinAnalysis = () => {
    setIsAnalyzingTwin(true);
    setStep(3);
    setTimeout(() => {
      if (sageResult) {
        const result = generateTwinFeedback(description, sageResult.probability);
        setTwinResult(result);
      }
      setIsAnalyzingTwin(false);
    }, 2000);
  };

  // Commit to chain
  const commitToChain = async () => {
    if (!address) {
      alert("Please connect your Freighter wallet first!");
      await connectWallet();
      return;
    }

    setIsCommitting(true);
    
    try {
      // Soroban/Freighter Transaction Logic Stub
      // Here we would use @stellar/stellar-sdk to build the XDR for publish_intent
      // and sign it with Freighter.
      console.log(`Submitting intent to Soroban Contract: ${SOROBAN_CONTRACT_ID}`);
      
      // Simulate network delay for Soroban RPC
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setTxHash("soroban_tx_" + Math.random().toString(36).substring(7));
      
      setIsCommitting(false);
    } catch (error) {
      console.error("Error committing to Soroban chain:", error);
      alert("Failed to commit intention to the Stellar network.");
      setIsCommitting(false);
    }
  };

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 flex flex-col justify-center relative z-10">
      
      {/* Progress Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-white tracking-tight">Compose Intention</h1>
        <p className="text-gray-400 text-sm mt-1">Formulate, optimize, and lock your next goal on-chain</p>
        
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= i 
                  ? 'bg-gradient-primary text-white border-none shadow-[0_0_10px_rgba(99,102,241,0.5)]' 
                  : 'bg-nexus-panel border border-nexus-border text-gray-500'
              }`}>
                {i}
              </div>
              {i < 4 && (
                <div className={`w-12 h-0.5 mx-1 transition-all ${step > i ? 'bg-nexus-indigo' : 'bg-nexus-border'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Wizard Content */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          {/* STEP 1: Enter Intent */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">What do you intend to achieve?</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="I will launch the beta version of my app, write 2 research articles, or run a half marathon..."
                  rows={4}
                  className="w-full bg-nexus-void/50 border border-nexus-border rounded-2xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-nexus-indigo focus:ring-1 focus:ring-nexus-indigo transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['career', 'health', 'finance', 'relationships', 'learning', 'custom'] as IntentCategory[]).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold capitalize border transition-all ${
                          category === cat
                            ? 'bg-nexus-indigo/20 border-nexus-indigo text-white'
                            : 'bg-nexus-void/35 border-nexus-border text-gray-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Deadline: {deadlineDays} Days</label>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    value={deadlineDays}
                    onChange={(e) => setDeadlineDays(Number(e.target.value))}
                    className="w-full accent-nexus-cyan bg-nexus-void/50 h-2 rounded-lg appearance-none cursor-pointer border border-nexus-border"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono-custom">
                    <span>1 Day</span>
                    <span>15 Days</span>
                    <span>30 Days</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button
                  disabled={!description}
                  onClick={runSageAnalysis}
                  className="px-6 py-3 rounded-full bg-gradient-cyan text-nexus-void font-bold text-sm flex items-center gap-2 disabled:opacity-50 transition-all"
                >
                  Analyze with SAGE
                  <ChevronRight className="w-4 h-4 text-nexus-void" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: SAGE Analysis */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {isAnalyzingSage ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <Cpu className="w-12 h-12 text-nexus-cyan animate-spin" />
                  <p className="text-nexus-cyan font-mono-custom text-sm tracking-wider">SAGE LIFE OS IS SIMULATING OUTCOMES...</p>
                  <span className="text-xs text-gray-500">Calculating historical consistency & probability cycles</span>
                </div>
              ) : (
                sageResult && (
                  <div className="space-y-6">
                    <div className="flex items-start justify-between border-b border-nexus-border pb-4">
                      <div>
                        <span className="text-xs text-nexus-cyan font-mono-custom tracking-wider font-semibold">SAGE ANALYSIS COMPLETE</span>
                        <h3 className="text-xl font-bold text-white mt-1">Probability of Success</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-4xl font-black text-nexus-cyan font-mono-custom">{sageResult.probability}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-nexus-crimson uppercase tracking-wider">Risk Factors Detected</h4>
                        <ul className="space-y-2">
                          {sageResult.risks.map((risk, i) => (
                            <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                              <span className="text-nexus-crimson mt-1">•</span>
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-nexus-emerald uppercase tracking-wider">Opportunities</h4>
                        <ul className="space-y-2">
                          {sageResult.opportunities.map((opp, i) => (
                            <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                              <span className="text-nexus-emerald mt-1">•</span>
                              <span>{opp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {sageResult.optimalDeadlineOffsetDays !== 0 && (
                      <div className="p-4 rounded-xl bg-nexus-cyan/5 border border-nexus-cyan/25 text-sm text-nexus-cyan">
                        💡 <strong>SAGE Recommendation:</strong> Setting the deadline to{' '}
                        <strong>{deadlineDays + sageResult.optimalDeadlineOffsetDays} days</strong> instead of {deadlineDays} days increases success probability by 18%.
                      </div>
                    )}

                    <div className="p-4 rounded-xl bg-white/5 border border-nexus-border">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Optimized Formulation</h4>
                      <p className="text-sm text-gray-200 italic">"{sageResult.suggestedText}"</p>
                      <button
                         type="button"
                        onClick={() => {
                          setDescription(sageResult.suggestedText);
                          if (sageResult.optimalDeadlineOffsetDays) {
                            setDeadlineDays(prev => prev + sageResult.optimalDeadlineOffsetDays);
                          }
                        }}
                        className="mt-3 text-xs text-nexus-cyan hover:underline font-bold flex items-center gap-1"
                      >
                        Apply SAGE Formulation & Deadline Adjustment
                      </button>
                    </div>

                    <div className="flex justify-between pt-4">
                      <button
                        onClick={() => setStep(1)}
                        className="px-5 py-2 rounded-full border border-nexus-border text-gray-400 hover:text-white text-sm flex items-center gap-1"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        onClick={runTwinAnalysis}
                        className="px-6 py-3 rounded-full bg-gradient-primary text-white font-bold text-sm flex items-center gap-2"
                      >
                        Consult ParallelMind AI Twin
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              )}
            </motion.div>
          )}

          {/* STEP 3: ParallelMind AI Twin */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {isAnalyzingTwin ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <BrainCircuit className="w-12 h-12 text-nexus-rose animate-pulse" />
                  <p className="text-nexus-rose font-mono-custom text-sm tracking-wider">PARALLELMIND IS ALIGNING PSYCHOLOGICAL PATTERNS...</p>
                  <span className="text-xs text-gray-500">Retrieving user cognitive models & behavior history</span>
                </div>
              ) : (
                twinResult && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-nexus-border pb-4">
                      <div className="w-10 h-10 rounded-xl bg-nexus-rose/10 border border-nexus-rose/20 flex items-center justify-center text-nexus-rose">
                        <BrainCircuit className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-nexus-rose font-mono-custom tracking-wider font-semibold">PARALLELMIND COUNSEL</span>
                        <h3 className="text-lg font-bold text-white">Advice From Your AI Twin</h3>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-nexus-rose/5 border border-nexus-rose/20 relative">
                      <div className="absolute top-3 right-4 text-nexus-rose/30 font-mono-custom text-xs">AI TWIN DOUBLE</div>
                      <p className="text-gray-300 leading-relaxed italic">
                        "{twinResult.advice}"
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-nexus-border">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Twin's Suggested Revision</h4>
                      <p className="text-sm text-gray-200">"{twinResult.suggestedRevision}"</p>
                      <button
                         type="button"
                        onClick={() => setDescription(twinResult.suggestedRevision)}
                        className="mt-3 text-xs text-nexus-rose hover:underline font-bold"
                      >
                        Adopt Twin's Suggestion
                      </button>
                    </div>

                    <div className="flex justify-between pt-4">
                      <button
                        onClick={() => setStep(2)}
                        className="px-5 py-2 rounded-full border border-nexus-border text-gray-400 hover:text-white text-sm flex items-center gap-1"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        onClick={() => setStep(4)}
                        className="px-6 py-3 rounded-full bg-gradient-primary text-white font-bold text-sm flex items-center gap-2"
                      >
                        Proceed to Chain Commit
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              )}
            </motion.div>
          )}

          {/* STEP 4: Commit on Chain */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {isCommitting ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <ShieldCheck className="w-12 h-12 text-nexus-violet animate-bounce" />
                  <p className="text-nexus-violet font-mono-custom text-sm tracking-wider">MINING INTENT ON HARDHAT LOCAL BLOCKCHAIN...</p>
                  <span className="text-xs text-gray-500">Broadcasting transaction & deploying Soulbound metadata</span>
                </div>
              ) : txHash ? (
                <div className="text-center py-8 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-nexus-emerald/10 border border-nexus-emerald/30 flex items-center justify-center text-nexus-emerald mx-auto shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Intention Locked On-Chain!</h3>
                    <p className="text-gray-400 text-sm mt-1">Your commitment is now permanent and accountability is active.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-nexus-panel border border-nexus-border max-w-md mx-auto text-left space-y-2 font-mono-custom text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">TX HASH:</span>
                      <span className="text-nexus-cyan">{txHash.substring(0, 18)}...{txHash.substring(58)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">STAKED AMOUNT:</span>
                      <span className="text-nexus-gold">{stakeAmount} $NXS</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">SAGE SCORE:</span>
                      <span className="text-nexus-cyan">{sageResult?.probability}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">STATUS:</span>
                      <span className="text-nexus-emerald font-bold">ACTIVE & BETTABLE</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="px-8 py-3 rounded-full bg-gradient-primary text-white font-bold text-sm"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="border-b border-nexus-border pb-4">
                    <span className="text-xs text-nexus-violet font-mono-custom tracking-wider font-semibold">FINAL PHASE</span>
                    <h3 className="text-xl font-bold text-white mt-1">Lock Commitment & Stake Tokens</h3>
                  </div>

                  <div className="p-5 rounded-2xl bg-nexus-panel border border-nexus-border space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-300">Staking Amount ($NXS)</span>
                      <span className="text-2xl font-black text-nexus-gold font-mono-custom">{stakeAmount} $NXS</span>
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

                    <div className="p-4 rounded-xl bg-nexus-gold/5 border border-nexus-gold/20 text-xs text-nexus-gold leading-relaxed space-y-2">
                      <p>
                        ⚠️ <strong>Decentralized Accountability Payout Mechanism:</strong>
                      </p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>You stake <strong>{stakeAmount} $NXS</strong>.</li>
                        <li>Other people will vote and bet on whether you complete this.</li>
                        <li>On deadline, the <strong>majority of votes</strong> decides the outcome.</li>
                        <li>If the majority votes <strong>Completed</strong>: You receive your staked coins back <strong>plus 10%</strong> of the total coins people betted.</li>
                        <li>If the majority votes <strong>Failed</strong>: The voters receive their exact stakes back.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setStep(3)}
                      disabled={isCommitting}
                      className="px-5 py-2 rounded-full border border-nexus-border text-gray-400 hover:text-white text-sm flex items-center gap-1 disabled:opacity-50"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      onClick={commitToChain}
                      disabled={isCommitting}
                      className="px-8 py-3 rounded-full bg-gradient-primary text-white font-bold text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(168,85,247,0.3)] disabled:opacity-50"
                    >
                      <Wallet className="w-4 h-4" />
                      {isCommitting ? 'Confirming in Wallet...' : 'Lock Intention on IntentChain'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
