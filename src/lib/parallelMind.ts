import { ChatMessage } from './types';

export interface TwinFeedback {
  advice: string;
  suggestedRevision: string;
  personalityImpact: {
    trait: string;
    value: number;
  }[];
}

export function generateTwinFeedback(
  intentText: string,
  sageProbability: number
): TwinFeedback {
  let advice = "";
  let suggestedRevision = "";

  if (sageProbability < 50) {
    advice = `Look, knowing myself, I'm setting myself up for failure here. I always get super excited in the first 48 hours and then lose steam. We need to be realistic. Let's chop this goal in half. Instead of trying to do it all at once, let's lock in a smaller, guaranteed win first. We need to build up our momentum.`;
    suggestedRevision = `Complete phase 1 of: ${intentText} and verify the initial setup.`;
  } else if (sageProbability >= 50 && sageProbability < 75) {
    advice = `This is a solid goal, and it's right in our comfort zone. But I know my habits: I tend to procrastinate unless there is immediate stakes. I highly recommend staking at least 300 $NXS on this. It will force me to stay accountable when the week-3 slump hits. Also, let's make sure we have a clear definition of 'done'.`;
    suggestedRevision = `${intentText} with clear daily progress logged.`;
  } else {
    advice = `Awesome. This is highly achievable and we've got the discipline for it. Let's make it official on-chain. Since the success rate is high, this is a great opportunity to boost our Soulbound Reputation Score. Let's publish this immediately and invite our accountability group to watch.`;
    suggestedRevision = intentText;
  }

  return {
    advice,
    suggestedRevision,
    personalityImpact: [
      { trait: 'discipline', value: sageProbability > 70 ? 5 : -2 },
      { trait: 'consistency', value: 4 },
      { trait: 'riskTolerance', value: sageProbability < 50 ? -5 : 10 }
    ]
  };
}

const mockConversations = [
  {
    trigger: "should i quit my job",
    response: "Honestly? We've been thinking about this for 6 months. SAGE says our financial runway is stable for 4 months, but our risk tolerance is currently moderate. If we quit now without a solid freelance contract, we'll trigger high stress by month 2. Let's secure 1 recurring client first, then make the jump. That's how we operate best."
  },
  {
    trigger: "how can i be more disciplined",
    response: "We both know we can't rely on raw motivation. Every time we try a '90-day challenge', we quit by day 12. Our ParallelMind data shows we respond best to financial stakes. We need to lock our daily goals on IntentChain. Staking $NXS tokens is literally the only thing that gets us out of bed at 6 AM."
  },
  {
    trigger: "hello",
    response: "Hey! I'm your ParallelMind. I've analyzed your writing style, calendar patterns, and history on IntentChain. I'm ready to simulate your choices or give you advice. What decision are we facing today?"
  },
  {
    trigger: "hi",
    response: "Hey! I'm your ParallelMind. I've analyzed your writing style, calendar patterns, and history on IntentChain. I'm ready to simulate your choices or give you advice. What decision are we facing today?"
  }
];

export function getTwinChatResponse(messageText: string): string {
  const cleanText = messageText.toLowerCase().trim();
  
  const matched = mockConversations.find(c => cleanText.includes(c.trigger));
  if (matched) {
    return matched.response;
  }

  return `Interesting question. Looking at our past decisions, we usually lean towards security over high risk, but we get restless if we stay comfortable for too long. If we do this, SAGE predicts a 68% chance of short-term satisfaction but a potential bottleneck in our career growth in 6 months. What do you think is our biggest bottleneck right now?`;
}
