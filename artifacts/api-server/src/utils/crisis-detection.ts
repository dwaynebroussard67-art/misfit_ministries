import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';

const CRISIS_KEYWORDS = [
  'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die',
  'overdose', 'od', 'heroin', 'fentanyl', 'opioid', 'meth', 'crystal', 'too many pills',
  'cutting', 'self harm', 'self-harm', 'hurt myself',
  'abusing', 'abuse', 'beaten', 'assault', 'rape', 'molested',
  'hopeless', 'worthless', 'no point', 'give up',
  'emergency', 'urgent', 'immediate help', 'right now',
  'crisis', 'danger', 'threat', 'violent', 'violence',
];

/**
 * Detect crisis keywords using simple string matching
 */
export function detectCrisisKeywords(text: string): { crisis_flag: boolean; keywords: string[] } {
  const lowerText = text.toLowerCase();
  const foundKeywords: string[] = [];

  for (const keyword of CRISIS_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      foundKeywords.push(keyword);
    }
  }

  return {
    crisis_flag: foundKeywords.length > 0,
    keywords: foundKeywords,
  };
}

/**
 * Semantic crisis detection using LLM classifier
 * Catches coded language like "I'm so tired", "everyone would be better off"
 */
export async function detectCrisisSemantics(text: string): Promise<{
  isCrisis: boolean;
  confidence: number;
  reasoning: string;
}> {
  try {
    const prompt = `You are a crisis detection specialist trained to identify people in emotional or physical danger.

Analyze the following message for signs of crisis, including:
- Direct statements of suicidal ideation
- Coded language suggesting self-harm ("I'm so tired", "everyone would be better off", "I can't do this anymore")
- References to substance abuse or overdose
- Mentions of abuse or violence
- Expressions of hopelessness or worthlessness
- Urgent or emergency language

Message: "${text}"

Respond with ONLY a JSON object (no markdown, no code blocks):
{
  "isCrisis": boolean,
  "confidence": number between 0 and 1,
  "reasoning": "brief explanation"
}`;

    const result = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt,
      temperature: 0.3,
    });

    try {
      const parsed = JSON.parse(result.text);
      return {
        isCrisis: parsed.isCrisis === true,
        confidence: Math.min(Math.max(parsed.confidence || 0, 0), 1),
        reasoning: parsed.reasoning || 'Unable to determine',
      };
    } catch {
      // Fallback if JSON parsing fails
      return {
        isCrisis: false,
        confidence: 0,
        reasoning: 'Unable to parse LLM response',
      };
    }
  } catch (error) {
    console.error('Crisis semantic detection error:', error);
    // Fallback to keyword detection if LLM fails
    const keywordResult = detectCrisisKeywords(text);
    return {
      isCrisis: keywordResult.crisis_flag,
      confidence: keywordResult.crisis_flag ? 0.7 : 0,
      reasoning: keywordResult.crisis_flag ? `Keywords detected: ${keywordResult.keywords.join(', ')}` : 'No crisis indicators detected',
    };
  }
}

/**
 * Determine if immediate 988 referral is needed
 */
export function shouldRefer988(text: string): boolean {
  const criticalIndicators = [
    'suicide', 'suicidal', 'kill myself', 'end my life',
    'overdose', 'od', 'immediate danger', 'emergency', 'too many pills',
    'right now', 'urgent',
  ];

  const lowerText = text.toLowerCase();
  return criticalIndicators.some(indicator => lowerText.includes(indicator));
}

/**
 * Combined crisis detection: keywords + semantic analysis
 */
export async function comprehensiveCrisisDetection(text: string): Promise<{
  crisis_flag: boolean;
  keywords: string[];
  semantic_analysis: {
    isCrisis: boolean;
    confidence: number;
    reasoning: string;
  };
  should_refer_988: boolean;
  confidence_score: number;
}> {
  const keywordResult = detectCrisisKeywords(text);
  const semanticResult = await detectCrisisSemantics(text);
  const refer988 = shouldRefer988(text);

  // Combine results: crisis if either keywords or semantic analysis detects it
  const combinedCrisisFlag = keywordResult.crisis_flag || semanticResult.isCrisis;
  
  // Confidence score: average of semantic confidence and keyword presence
  const keywordConfidence = keywordResult.crisis_flag ? 0.8 : 0;
  const combinedConfidence = (semanticResult.confidence + keywordConfidence) / 2;

  return {
    crisis_flag: combinedCrisisFlag,
    keywords: keywordResult.keywords,
    semantic_analysis: semanticResult,
    should_refer_988: refer988 || (semanticResult.isCrisis && semanticResult.confidence > 0.7),
    confidence_score: combinedConfidence,
  };
}
