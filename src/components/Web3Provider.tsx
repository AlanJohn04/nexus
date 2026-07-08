"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  isConnected,
  requestAccess,
  getAddress,
} from "@stellar/freighter-api";
import { useRouter, usePathname } from 'next/navigation';

interface Web3ContextType {
  address: string | null;
  username: string | null;
  connectWallet: (isExplicit?: boolean) => Promise<void>;
  isConnecting: boolean;
  setUsername: (name: string) => void;
}

const Web3Context = createContext<Web3ContextType>({
  address: null,
  username: null,
  connectWallet: async () => {},
  isConnecting: false,
  setUsername: () => {},
});

export const useWeb3 = () => useContext(Web3Context);

export default function Web3Provider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [tempUsername, setTempUsername] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (address) {
      const storedName = localStorage.getItem(`nexus_user_${address.toLowerCase()}`);
      if (storedName) {
        setUsername(storedName);
      } else if (!username) {
        setShowSignup(true);
      }
    } else {
      setUsername(null);
      setShowSignup(false);
    }
  }, [address, username]);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connectionInfo = await isConnected();
        if (connectionInfo && connectionInfo.isConnected) {
          const { address, error } = await getAddress();
          if (address && !error) {
            setAddress(address);
          }
        }
      } catch (e) {
        console.error("Freighter check error", e);
      }
    };
    checkConnection();
  }, []);

  const connectWallet = async (isExplicit = false) => {
    try {
      setIsConnecting(true);
      
      const connectionInfo = await isConnected();
      if (!connectionInfo || !connectionInfo.isConnected) {
        alert("Please install Freighter wallet to use NEXUS on Stellar!");
        setIsConnecting(false);
        return;
      }

      const { address, error } = await requestAccess();
      if (address && !error) {
        setAddress(address);
        
        if (isExplicit) {
          router.push('/profile');
        }
      } else {
        console.error("User denied access to Freighter.", error);
      }
    } catch (error: any) {
      console.error("Error connecting to Freighter:", error.message || error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUsername.trim() || !address) return;
    
    const finalName = tempUsername.trim();
    localStorage.setItem(`nexus_user_${address.toLowerCase()}`, finalName);
    setUsername(finalName);
    setShowSignup(false);
    router.push('/profile');
  };

  return (
    <Web3Context.Provider value={{ address, username, connectWallet, isConnecting, setUsername }}>
      {children}
      
      {showSignup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-nexus-void border border-nexus-border rounded-3xl p-8 max-w-md w-full shadow-[0_0_40px_rgba(34,211,238,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nexus-indigo via-nexus-cyan to-nexus-emerald" />
            
            <h2 className="text-2xl font-black text-white mb-2 text-center">Claim Your Identity</h2>
            <p className="text-sm text-gray-400 text-center mb-8">
              Link a unique username to your connected Freighter wallet.
            </p>
            
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Connected Wallet
                </label>
                <div className="bg-black/50 border border-nexus-border rounded-xl p-3 text-xs text-gray-500 font-mono-custom break-all">
                  {address}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Choose Username
                </label>
                <input
                  type="text"
                  required
                  maxLength={20}
                  placeholder="e.g. Satoshi_21"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="w-full bg-black/50 border border-nexus-border rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-nexus-cyan transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={!tempUsername.trim()}
                className="w-full py-3 rounded-xl bg-gradient-cyan text-nexus-void font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
              >
                Create Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </Web3Context.Provider>
  );
}
