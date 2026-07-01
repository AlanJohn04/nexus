"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter, usePathname } from 'next/navigation';

interface Web3ContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  address: string | null;
  username: string | null;
  connectWallet: (isExplicit?: boolean) => Promise<void>;
  isConnecting: boolean;
  setUsername: (name: string) => void;
}

const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  address: null,
  username: null,
  connectWallet: async () => {},
  isConnecting: false,
  setUsername: () => {},
});

export const useWeb3 = () => useContext(Web3Context);

export default function Web3Provider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
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
        // Show signup modal
        setShowSignup(true);
      }
    } else {
      setUsername(null);
      setShowSignup(false);
    }
  }, [address, username]);

  useEffect(() => {
    // Check if wallet was previously connected (basic check)
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          connectWallet();
        }
      });
      
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          connectWallet();
        } else {
          setAddress(null);
          setSigner(null);
        }
      });
    }
  }, []);

  const connectWallet = async (isExplicit = false) => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install MetaMask to use NEXUS!");
      return;
    }

    try {
      setIsConnecting(true);
      const _provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access
      await _provider.send("eth_requestAccounts", []);
      
      const _signer = await _provider.getSigner();
      const _address = await _signer.getAddress();
      
      // Ensure we're on local Hardhat network (chainId 31337)
      const network = await _provider.getNetwork();
      if (network.chainId !== 31337n) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x7a69' }], // 31337 in hex
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x7a69',
                  chainName: 'Hardhat Local',
                  rpcUrls: ['http://127.0.0.1:8545/'],
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                  },
                },
              ],
            });
          }
        }
      }

      setProvider(_provider);
      setSigner(_signer);
      setAddress(_address);

      if (isExplicit) {
        router.push('/profile');
      }
    } catch (error: any) {
      console.error("Error connecting to wallet:", error.message || error);
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
    <Web3Context.Provider value={{ provider, signer, address, username, connectWallet, isConnecting, setUsername }}>
      {children}
      
      {showSignup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-nexus-void border border-nexus-border rounded-3xl p-8 max-w-md w-full shadow-[0_0_40px_rgba(34,211,238,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nexus-indigo via-nexus-cyan to-nexus-emerald" />
            
            <h2 className="text-2xl font-black text-white mb-2 text-center">Claim Your Identity</h2>
            <p className="text-sm text-gray-400 text-center mb-8">
              Link a unique username to your connected Web3 wallet.
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
