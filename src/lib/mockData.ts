import { Intent, UserStats, PersonalityProfile } from './types';

export const mockUserStats: UserStats = {
  address: '0x71C...894a',
  username: 'FutureBuilder',
  intentScore: 785, // out of 1000
  totalIntents: 14,
  completedIntents: 11,
  failedIntents: 3,
  totalStaked: 4500,
  totalEarned: 1250,
  balanceNXS: 1250
};

export const mockPersonalityProfile: PersonalityProfile = {
  discipline: 75,
  optimism: 85,
  consistency: 60,
  riskTolerance: 70,
  creativity: 90,
  socialCommitment: 80
};

export const mockActiveIntents: Intent[] = [
  {
    id: 'active-1',
    creatorAddress: '0x71C...894a',
    creatorName: 'FutureBuilder',
    description: 'Launch the MVP of my decentralized application on Hardhat local network',
    category: 'career',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    stakeAmount: 500,
    sageScore: 74,
    completed: false,
    resolved: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    txHash: '0x3a4b9c...f8e2',
    yesStakes: 1200,
    noStakes: 400,
    votesCount: 8
  },
  {
    id: 'active-2',
    creatorAddress: '0x71C...894a',
    creatorName: 'FutureBuilder',
    description: 'Maintain a 500-calorie deficit and run 5km every morning',
    category: 'health',
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days from now
    stakeAmount: 300,
    sageScore: 62,
    completed: false,
    resolved: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    txHash: '0x7d8e9a...a1c3',
    yesStakes: 450,
    noStakes: 600,
    votesCount: 11
  }
];

export const mockExploreIntents: Intent[] = [
  {
    id: 'explore-1',
    creatorAddress: '0x9a2...3f1d',
    creatorName: 'AIEngineer_Sam',
    description: 'Write and publish a 30-page research paper on Multi-Agent Reinforcement Learning',
    category: 'learning',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    stakeAmount: 1000,
    sageScore: 48,
    completed: false,
    resolved: false,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    txHash: '0xef8c9d...2b1a',
    yesStakes: 3200,
    noStakes: 4500,
    votesCount: 42
  },
  {
    id: 'explore-2',
    creatorAddress: '0x4b7...9e2c',
    creatorName: 'Alice_Crypto',
    description: 'Deploy a multi-sig treasury wallet for our DAO and migrate $50k in funds',
    category: 'finance',
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    stakeAmount: 1500,
    sageScore: 91,
    completed: false,
    resolved: false,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    txHash: '0x5c3d9a...e4b2',
    yesStakes: 8000,
    noStakes: 500,
    votesCount: 38
  },
  {
    id: 'explore-3',
    creatorAddress: '0x8f2...7c1a',
    creatorName: 'ZenRunner',
    description: 'Complete a 10-day silent meditation retreat without touching any screens',
    category: 'health',
    deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    stakeAmount: 800,
    sageScore: 55,
    completed: false,
    resolved: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    txHash: '0x1a2b3c...4d5e',
    yesStakes: 1100,
    noStakes: 1300,
    votesCount: 19
  },
  {
    id: 'explore-4',
    creatorAddress: '0x3d9...8f4b',
    creatorName: 'BetaTester',
    description: 'Record and upload 5 video tutorials explaining advanced Next.js server actions',
    category: 'learning',
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Ended yesterday
    stakeAmount: 400,
    sageScore: 80,
    completed: true,
    resolved: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    txHash: '0x9e8d7c...6b5a',
    yesStakes: 1500,
    noStakes: 200,
    votesCount: 15
  }
];

export const mockLeaderboard = [
  { rank: 1, name: 'Satoshi_Twin', score: 985, completed: 42, earnings: 12450 },
  { rank: 2, name: 'Alice_Crypto', score: 942, completed: 29, earnings: 8900 },
  { rank: 3, name: 'ReputationMax', score: 895, completed: 31, earnings: 5400 },
  { rank: 4, name: 'FutureBuilder', score: 785, completed: 11, earnings: 1250 },
  { rank: 5, name: 'AIEngineer_Sam', score: 740, completed: 18, earnings: 3100 }
];
