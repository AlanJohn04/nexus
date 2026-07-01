import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ParticleBackground from "@/components/ParticleBackground";
import Web3Provider from "@/components/Web3Provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "NEXUS | AI-Guided Decentralized Accountability",
  description: "Publish your intentions, let your AI Twin guide you, and get held accountable on-chain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-nexus-void text-gray-100 overflow-x-hidden relative font-sans">
        <Web3Provider>
          {/* Cosmos background */}
          <ParticleBackground />
          
          {/* Radial Ambient Orbs */}
          <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] glow-orb-purple pointer-events-none z-0 rounded-full" />
          <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] glow-orb-cyan pointer-events-none z-0 rounded-full" />
          <div className="fixed top-[40%] left-[30%] w-[40vw] h-[40vw] glow-orb-rose pointer-events-none z-0 rounded-full" />

          {/* Global Navigation */}
          <Navbar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
            {children}
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}
