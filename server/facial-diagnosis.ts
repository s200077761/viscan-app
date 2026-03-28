/**
 * Facial Diagnosis Knowledge Base
 * Based on traditional face reading and health indicators
 */

export interface FacialFeature {
  name: string;
  location: string;
  healthIndicators: string[];
  recommendations: string[];
  severity: "normal" | "mild" | "moderate" | "severe";
}

export interface FacialDiagnosisResult {
  features: FacialFeature[];
  overallAssessment: string;
  primaryConcerns: string[];
  dietaryRecommendations: string[];
  lifestyleRecommendations: string[];
}

/**
 * Analyze forehead lines
 */
export function analyzeForehead(description: string): FacialFeature[] {
  const features: FacialFeature[] = [];
  const lowerDesc = description.toLowerCase();

  // Vertical lines between eyebrows
  if (
    lowerDesc.includes("vertical line") ||
    lowerDesc.includes("crease between eyebrows")
  ) {
    if (lowerDesc.includes("single") || lowerDesc.includes("one")) {
      features.push({
        name: "Single Vertical Line",
        location: "Between eyebrows",
        healthIndicators: [
          "Persistent and determined personality",
          "Possible stress accumulation",
          "May indicate liver function concerns",
        ],
        recommendations: [
          "Practice stress management techniques",
          "Add green vegetables and whole grains to diet",
          "Avoid spicy foods and excessive coffee",
          "Consider meditation or yoga",
        ],
        severity: "mild",
      });
    } else if (lowerDesc.includes("two") || lowerDesc.includes("double")) {
      features.push({
        name: "Two Vertical Lines",
        location: "Between eyebrows",
        healthIndicators: [
          "Empathetic and caring personality",
          "Good interpersonal skills",
          "Balanced emotional state",
        ],
        recommendations: [
          "Maintain current healthy lifestyle",
          "Continue social activities",
          "Regular exercise for stress relief",
        ],
        severity: "normal",
      });
    } else if (
      lowerDesc.includes("multiple") ||
      lowerDesc.includes("several")
    ) {
      features.push({
        name: "Multiple Vertical Lines",
        location: "Between eyebrows",
        healthIndicators: [
          "Perfectionist tendencies",
          "Analytical mindset",
          "Possible overthinking and stress",
        ],
        recommendations: [
          "Practice mindfulness and relaxation",
          "Set realistic goals",
          "Ensure adequate rest and sleep",
          "Consider stress-reduction activities",
        ],
        severity: "moderate",
      });
    }
  }

  // Horizontal lines on forehead
  if (
    lowerDesc.includes("horizontal line") ||
    lowerDesc.includes("worry line")
  ) {
    features.push({
      name: "Horizontal Forehead Lines",
      location: "Across forehead",
      healthIndicators: [
        "Built-up stress and worry",
        "Possible digestive issues",
        "May indicate excessive fat/sugar consumption",
        "Potential dehydration",
      ],
      recommendations: [
        "Reduce stress through relaxation techniques",
        "Decrease fat and sugar intake",
        "Drink more water (8+ glasses daily)",
        "Add fiber-rich foods to diet",
        "Practice facial exercises",
        "Get adequate sleep (7-8 hours)",
      ],
      severity: "moderate",
    });
  }

  return features;
}

/**
 * Analyze eyebrow area
 */
export function analyzeEyebrows(description: string): FacialFeature[] {
  const features: FacialFeature[] = [];
  const lowerDesc = description.toLowerCase();

  // Right eyebrow line - Liver
  if (
    lowerDesc.includes("right eyebrow") ||
    lowerDesc.includes("line slants right")
  ) {
    features.push({
      name: "Right Eyebrow Line",
      location: "Right eyebrow area",
      healthIndicators: [
        "Possible liver function concerns",
        "May indicate need for liver support",
        "Toxin accumulation possible",
      ],
      recommendations: [
        "Add more fruits to diet",
        "Increase green vegetable consumption",
        "Eat whole grains",
        "Avoid spicy foods",
        "Reduce coffee and salt intake",
        "Consider liver-supporting supplements (milk thistle)",
        "Consult doctor if symptoms present",
      ],
      severity: "moderate",
    });
  }

  // Left eyebrow line - Spleen
  if (
    lowerDesc.includes("left eyebrow") ||
    lowerDesc.includes("line slants left")
  ) {
    features.push({
      name: "Left Eyebrow Line",
      location: "Left eyebrow area",
      healthIndicators: [
        "Possible spleen weakness",
        "Digestive system concerns",
        "May need better nutrition",
      ],
      recommendations: [
        "Add natural sweets (dried fruits)",
        "Avoid refined sugar",
        "Eat small, frequent meals",
        "Include root vegetables",
        "Add warming spices (ginger, cinnamon)",
        "Stay hydrated",
      ],
      severity: "mild",
    });
  }

  return features;
}

/**
 * Analyze eye area (crow's feet)
 */
export function analyzeEyeArea(description: string): FacialFeature[] {
  const features: FacialFeature[] = [];
  const lowerDesc = description.toLowerCase();

  if (
    lowerDesc.includes("crow's feet") ||
    lowerDesc.includes("eye wrinkles") ||
    lowerDesc.includes("lines around eyes")
  ) {
    const severity =
      lowerDesc.includes("deep") || lowerDesc.includes("prominent")
        ? "moderate"
        : "mild";

    features.push({
      name: "Crow's Feet",
      location: "Outer eye corners",
      healthIndicators: [
        "Possible eyesight concerns (squinting)",
        "May indicate liver health",
        "Could relate to stomach function",
        "Possible kidney health indicator",
      ],
      recommendations: [
        "Get eye examination",
        "Wear sunglasses outdoors",
        "Use eye moisturizer",
        "Eat healthier diet",
        "Increase exercise",
        "Add omega-3 fatty acids",
        "Stay hydrated",
        "Get adequate sleep",
      ],
      severity,
    });
  }

  return features;
}

/**
 * Analyze mouth area
 */
export function analyzeMouthArea(description: string): FacialFeature[] {
  const features: FacialFeature[] = [];
  const lowerDesc = description.toLowerCase();

  // Vertical mouth lines - Colon
  if (
    lowerDesc.includes("mouth line") ||
    lowerDesc.includes("lines around mouth") ||
    lowerDesc.includes("vertical lines near mouth")
  ) {
    const severity = lowerDesc.includes("deep") ? "moderate" : "mild";

    features.push({
      name: "Mouth Lines",
      location: "Sides of mouth",
      healthIndicators: [
        "Colon health indicator",
        "Possible digestive issues",
        "May need more fiber",
      ],
      recommendations: [
        "Add vitamin D to diet",
        "Increase fiber intake",
        "Eat more vegetables",
        "Exercise regularly",
        "Drink more fluids",
        "Consider probiotics",
        "Reduce processed foods",
      ],
      severity,
    });
  }

  // Laugh lines - Pancreas
  if (
    lowerDesc.includes("laugh line") ||
    lowerDesc.includes("smile line") ||
    lowerDesc.includes("nasolabial")
  ) {
    const hasLaughter =
      lowerDesc.includes("laughs a lot") || lowerDesc.includes("happy");

    if (!hasLaughter) {
      features.push({
        name: "Laugh Lines (without frequent laughter)",
        location: "From nose to mouth corners",
        healthIndicators: [
          "Possible weak pancreas",
          "Blood sugar regulation concerns",
          "May need pancreatic support",
        ],
        recommendations: [
          "Add cherries to diet",
          "Eat blueberries regularly",
          "Include spinach",
          "Add grapes",
          "Eat garlic",
          "Reduce refined sugars",
          "Maintain stable blood sugar",
          "Consider pancreatic enzymes",
        ],
        severity: "moderate",
      });
    }
  }

  // Upper lip lines - Spleen
  if (
    lowerDesc.includes("upper lip line") ||
    lowerDesc.includes("vertical lines above lip")
  ) {
    features.push({
      name: "Upper Lip Lines",
      location: "Above upper lip",
      healthIndicators: [
        "Possible spleen weakness",
        "Digestive concerns",
        "May indicate smoking history",
      ],
      recommendations: [
        "Eat small, frequent meals",
        "Add root vegetables",
        "Include sweet potatoes",
        "Eat carrots and beets",
        "Avoid cold, raw foods",
        "Add warming spices",
        "Quit smoking if applicable",
      ],
      severity: "mild",
    });
  }

  // Lower lip line - Emotional
  if (
    lowerDesc.includes("lower lip line") ||
    lowerDesc.includes("chin crease")
  ) {
    const severity = lowerDesc.includes("deep") ? "moderate" : "mild";

    features.push({
      name: "Lower Lip Line",
      location: "Below lower lip/chin",
      healthIndicators: [
        "Bottled up negative emotions",
        "Emotional stress",
        "Need for emotional release",
      ],
      recommendations: [
        "Find positive emotional outlets",
        "Practice journaling",
        "Consider counseling or therapy",
        "Engage in creative activities",
        "Exercise for stress relief",
        "Practice meditation",
        "Talk to trusted friends/family",
      ],
      severity,
    });
  }

  return features;
}

/**
 * Generate comprehensive facial diagnosis
 */
export function generateFacialDiagnosis(
  facialDescription: string
): FacialDiagnosisResult {
  const allFeatures: FacialFeature[] = [
    ...analyzeForehead(facialDescription),
    ...analyzeEyebrows(facialDescription),
    ...analyzeEyeArea(facialDescription),
    ...analyzeMouthArea(facialDescription),
  ];

  // Collect all health indicators (kept for potential future use)
  const _allHealthIndicators = allFeatures.flatMap(f => f.healthIndicators);

  // Identify primary concerns (moderate or severe)
  const primaryConcerns = allFeatures
    .filter(f => f.severity === "moderate" || f.severity === "severe")
    .map(f => f.name);

  // Collect dietary recommendations
  const dietaryRecs = new Set<string>();
  const lifestyleRecs = new Set<string>();

  allFeatures.forEach(feature => {
    feature.recommendations.forEach(rec => {
      if (
        rec.toLowerCase().includes("diet") ||
        rec.toLowerCase().includes("eat") ||
        rec.toLowerCase().includes("food") ||
        rec.toLowerCase().includes("drink")
      ) {
        dietaryRecs.add(rec);
      } else {
        lifestyleRecs.add(rec);
      }
    });
  });

  // Generate overall assessment
  let overallAssessment = "";
  if (primaryConcerns.length === 0) {
    overallAssessment =
      "Overall facial analysis shows good health indicators with minor areas for improvement.";
  } else if (primaryConcerns.length <= 2) {
    overallAssessment = `Facial analysis reveals ${primaryConcerns.length} area(s) requiring attention. Focus on the recommended lifestyle and dietary changes.`;
  } else {
    overallAssessment = `Facial analysis indicates multiple areas requiring attention. Consider comprehensive lifestyle changes and consult with healthcare professionals.`;
  }

  return {
    features: allFeatures,
    overallAssessment,
    primaryConcerns,
    dietaryRecommendations: Array.from(dietaryRecs),
    lifestyleRecommendations: Array.from(lifestyleRecs),
  };
}

/**
 * Get severity color for UI
 */
export function getSeverityLevel(
  features: FacialFeature[]
): "normal" | "mild" | "moderate" | "severe" | "critical" {
  const severities = features.map(f => f.severity);

  if (severities.includes("severe")) return "severe";
  if (severities.filter(s => s === "moderate").length >= 3) return "severe";
  if (severities.includes("moderate")) return "moderate";
  if (severities.includes("mild")) return "mild";
  return "normal";
}
