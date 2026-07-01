"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, Send, Sparkles, BookOpen, 
  Activity, Shield, CheckCircle, Database, HelpCircle 
} from 'lucide-react';
import { getTwinChatResponse } from '@/lib/parallelMind';
import { mockPersonalityProfile } from '@/lib/mockData';
import { ChatMessage } from '@/lib/types';
import { useWeb3 } from '@/components/Web3Provider';

export default function TwinLabPage() {
  const { address } = useWeb3();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'twin',
      text: "Hey! I'm your ParallelMind. I've analyzed your writing style, calendar patterns, and history on IntentChain. I'm ready to simulate your choices or give you advice. What decision are we facing today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Training State
  const [trainingText, setTrainingText] = useState('');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingSuccess, setTrainingSuccess] = useState(false);
  const [datasetSize, setDatasetSize] = useState(1240); // Mock data points

  // Personality State
  const [profile, setProfile] = useState(mockPersonalityProfile);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responseText = getTwinChatResponse(userMsg.text);
      const twinMsg: ChatMessage = {
        id: `twin-${Date.now()}`,
        sender: 'twin',
        text: responseText,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, twinMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleTrainTwin = () => {
    if (!trainingText.trim()) return;
    setIsTraining(true);
    setTimeout(() => {
      setDatasetSize(prev => prev + trainingText.split(/\s+/).length);
      setIsTraining(false);
      setTrainingSuccess(true);
      setTrainingText('');
      
      // Slightly shift personality based on training input
      setProfile(prev => ({
        ...prev,
        discipline: Math.min(100, prev.discipline + 2),
        creativity: Math.min(100, prev.creativity + 3)
      }));

      setTimeout(() => setTrainingSuccess(false), 3000);
    }, 2000);
  };

  if (!address) {
    return (
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10 flex flex-col items-center justify-center h-[70vh]">
        <div className="glass-panel rounded-3xl p-12 text-center max-w-md w-full border border-nexus-border">
          <BrainCircuit className="w-16 h-16 text-nexus-rose mx-auto mb-6 opacity-50" />
          <h2 className="text-2xl font-bold text-white mb-4">Twin Not Synced</h2>
          <p className="text-gray-400 mb-8">Please connect your Web3 wallet to interact with your ParallelMind and cognitive profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
      
      {/* Header */}
      <div className="mb-10">
        <span className="text-xs text-nexus-rose font-mono-custom tracking-wider font-semibold">COGNITIVE SIMULATOR</span>
        <h1 className="text-3xl font-black text-white tracking-tight mt-1">ParallelMind Lab</h1>
        <p className="text-gray-400 text-sm mt-1">Interact with and train your AI digital double.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: INTERACTIVE CHAT (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-[600px] glass-panel rounded-3xl overflow-hidden border border-white/5">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-nexus-rose animate-pulse" />
              <div>
                <h3 className="text-sm font-bold text-white">ParallelMind-v1.0</h3>
                <span className="text-[10px] text-nexus-emerald font-mono-custom font-semibold">SYNCED & READY</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 font-mono-custom">
              Dataset: {datasetSize.toLocaleString()} tokens
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed relative group ${
                  msg.sender === 'user'
                    ? 'bg-gradient-primary text-white rounded-br-none'
                    : 'bg-nexus-panel border border-nexus-border text-gray-300 rounded-bl-none'
                }`}>
                  <p>{msg.text}</p>
                  <span className="text-[9px] text-gray-500 block mt-1 text-right font-mono-custom">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-nexus-panel border border-nexus-border rounded-2xl rounded-bl-none p-4 text-sm text-gray-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-nexus-rose animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-nexus-rose animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-nexus-rose animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-nexus-void/50 flex gap-2">
            <input
              type="text"
              placeholder="Ask your twin: 'How can I be more disciplined?' or 'Should I quit my job?'"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-nexus-void border border-nexus-border rounded-xl px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-nexus-rose"
            />
            <button
              type="submit"
              className="p-3 rounded-xl bg-nexus-rose text-white hover:opacity-90 transition-all flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.3)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: TRAINING & PERSONALITY (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Personality Traits Grid */}
          <div className="glass-panel rounded-3xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-nexus-rose" />
              Cognitive Profile
            </h3>

            <div className="space-y-4">
              {Object.entries(profile).map(([trait, val]) => (
                <div key={trait} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold capitalize text-gray-400">
                    <span>{trait.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-nexus-rose font-mono-custom">{val}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-nexus-void rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-nexus-rose rounded-full"
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Train Your Twin */}
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-nexus-cyan" />
              Train Cognitive Model
            </h3>
            
            <p className="text-xs text-gray-400 leading-relaxed">
              Paste journal entries, essays, or decision histories below to train your digital double to think and write exactly like you.
            </p>

            <div className="space-y-3">
              <textarea
                placeholder="Yesterday, I realized my biggest bottleneck is context switching. I need to focus on deep work blocks..."
                value={trainingText}
                onChange={(e) => setTrainingText(e.target.value)}
                rows={3}
                className="w-full bg-nexus-void/50 border border-nexus-border rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-nexus-cyan"
              />
              
              <button
                disabled={isTraining || !trainingText.trim()}
                onClick={handleTrainTwin}
                className="w-full py-2.5 rounded-full bg-nexus-cyan/10 hover:bg-nexus-cyan/20 border border-nexus-cyan/30 text-nexus-cyan font-bold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                {isTraining ? (
                  <>
                    <Database className="w-3.5 h-3.5 animate-spin" />
                    Fine-tuning weights...
                  </>
                ) : trainingSuccess ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    Twin Synced successfully!
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Inject Cognitive Training Data
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
