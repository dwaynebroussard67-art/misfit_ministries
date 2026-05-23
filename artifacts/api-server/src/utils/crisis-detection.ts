const CRISIS_KEYWORDS = [
  'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die',
  'overdose', 'od', 'heroin', 'fentanyl', 'opioid', 'meth', 'crystal', 'too many pills',
  'cutting', 'self harm', 'self-harm', 'hurt myself',
  'abusing', 'abuse', 'beaten', 'assault', 'rape', 'molested',
  'hopeless', 'worthless', 'no point', 'give up',
  'emergency', 'urgent', 'immediate help', 'right now',
  'crisis', 'danger', 'threat', 'violent', 'violence',
];

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

export function shouldRefer988(text: string): boolean {
  const crisisIndicators = [
    'suicide', 'suicidal', 'kill myself', 'end my life',
    'overdose', 'od', 'immediate danger', 'emergency', 'too many pills',
  ];

  const lowerText = text.toLowerCase();
  return crisisIndicators.some(indicator => lowerText.includes(indicator));
}
