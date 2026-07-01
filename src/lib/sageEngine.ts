import { IntentCategory } from './types';

export interface SageAnalysis {
  probability: number;
  optimalDeadlineOffsetDays: number;
  risks: string[];
  opportunities: string[];
  suggestedText: string;
}

export function analyzeIntention(
  text: string,
  category: IntentCategory,
  deadlineDays: number
): SageAnalysis {
  // Deterministic simulation based on text length, keywords, and parameters
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  
  // Base probability calculations
  let baseProb = 65;
  
  if (wordCount < 4) {
    baseProb -= 20; // Too vague
  } else if (wordCount > 15) {
    baseProb -= 10; // Too complex / overcommitted
  } else {
    baseProb += 10; // Good length
  }

  // Category adjustments
  switch (category) {
    case 'health':
      baseProb -= 5; // Health habits are historically harder to maintain
      break;
    case 'finance':
      baseProb += 5; // Quantifiable financial goals are easier to track
      break;
    case 'learning':
      baseProb += 0;
      break;
    case 'career':
      baseProb += 8;
      break;
  }

  // Deadline adjustments
  let optimalOffset = 0;
  if (deadlineDays < 3) {
    baseProb -= 25; // Too rushed
    optimalOffset = 4;
  } else if (deadlineDays > 30) {
    baseProb -= 15; // Parkinson's law: too much time leads to procrastination
    optimalOffset = -10;
  } else if (deadlineDays >= 7 && deadlineDays <= 14) {
    baseProb += 12; // Sweet spot for short-term intense commitments
  }

  // Ensure probability is bound between 15 and 95
  const probability = Math.max(15, Math.min(95, baseProb));

  // Generate contextual risks and opportunities
  const risks: string[] = [];
  const opportunities: string[] = [];
  
  if (text.toLowerCase().includes('every day') || text.toLowerCase().includes('daily')) {
    risks.push("Consistency fatigue: Daily streaks have an 82% failure rate after day 6.");
    opportunities.push("High neuroplasticity reward if streak exceeds 21 days.");
  } else {
    risks.push("Progress visibility: Lack of daily milestones might reduce urgency.");
  }

  if (probability < 50) {
    risks.push("Overspecified scope: The intention contains too many concurrent variables.");
    risks.push("Historical friction: Previous attempts in this category faced week-2 dropout.");
  } else {
    opportunities.push("High alignment: Goal matches your peak cognitive productivity cycles.");
  }

  opportunities.push(`Synergy bonus: Completing this increases your Soulbound Intent Score by ~15 points.`);

  // Generate suggested text
  let suggestedText = text;
  if (wordCount < 5) {
    suggestedText = `Successfully complete: ${text} by focusing on the core deliverables daily.`;
  } else if (probability < 60) {
    // Simplify it
    suggestedText = `Focus on the first milestone of "${text.substring(0, 40)}..." and establish a daily check-in.`;
  }

  return {
    probability,
    optimalDeadlineOffsetDays: optimalOffset,
    risks,
    opportunities,
    suggestedText
  };
}
