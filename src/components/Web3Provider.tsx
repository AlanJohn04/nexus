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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (address) {
      const storedName = localStorage.getItem(`nexus_user_${address.toLowerCase()}`);
      if (storedName) {
        setUsername(storedName);
      } else {
        const defaultName = `User_${address.substring(2, 6).toUpperCase()}`;
        localStorage.setItem(`nexus_user_${address.toLowerCase()}`, defaultName);
        setUsername(defaultName);
      }
    } else {
      setUsername(null);
    }
  }, [address]);

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

  return (
    <Web3Context.Provider value={{ provider, signer, address, username, connectWallet, isConnecting, setUsername }}>
      {children}
    </Web3Context.Provider>
  );
}
