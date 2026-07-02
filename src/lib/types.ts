export type IntentCategory = 'career' | 'health' | 'finance' | 'relationships' | 'learning' | 'custom';

export interface Intent {
  id: string;
  creatorAddress: string;
  creatorName: string;
  description: string;
  category: IntentCategory;
  deadline: string; // ISO string
  stakeAmount: number; // in $NXS
  sageScore: number; // probability of success (0-100)
  completed: boolean;
  resolved: boolean;
  createdAt: string;
  status?: 'active' | 'completed' | 'failed';
  txHash?: string;
  hasProof?: boolean;
  proofLink?: string;
  
  // Staking/voting mechanics
  yesStakes: number; // total $NXS bet on "Yes" (Completed)
  noStakes: number;  // total $NXS bet on "No" (Failed)
  votesCount: number;
  
  // Custom user interactions
  userStakeSide?: 'yes' | 'no';
  userStakedAmount?: number;
}

export interface PersonalityProfile {
  discipline: number;
  optimism: number;
  consistency: number;
  riskTolerance: number;
  creativity: number;
  socialCommitment: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'twin';
  text: string;
  timestamp: string;
}

export interface UserStats {
  address: string;
  username: string;
  intentScore: number; // 0 - 1000 Soulbound
  totalIntents: number;
  completedIntents: number;
  failedIntents: number;
  totalStaked: number;
  totalEarned: number;
  balanceNXS: number;
}
