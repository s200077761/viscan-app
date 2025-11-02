/**
 * Palm Reading System (Palmistry / Chiromancy)
 * Based on traditional Arabic palm reading knowledge
 * Independent rule-based system (AI-free diagnosis)
 */

export interface PalmSign {
  type: "line" | "mount" | "color" | "texture" | "marking";
  location: string; // e.g., "heart_line", "head_line", "life_line", "fate_line"
  characteristics: string[]; // e.g., ["deep", "long", "broken", "chained"]
  color?: string;
  severity: "mild" | "moderate" | "severe";
}

export interface PalmFinding {
  feature: string; // Arabic name of palm feature
  location: string;
  healthIndicators: string[];
  symptoms: string[];
  severity: "mild" | "moderate" | "severe";
  recommendations: string[];
}

export interface PalmAnalysis {
  overallHealth: string;
  findings: PalmFinding[];
  primaryConcerns: string[];
  recommendations: string[];
  systemsAffected: string[];
}

/**
 * Palm Lines and Their Health Meanings
 */
export const PALM_LINES = [
  {
    name: "خط الحياة",
    nameEn: "Life Line",
    location: "curves around thumb base",
    healthIndicators: {
      deep_and_clear: [
        "Strong vitality",
        "Good immune system",
        "High energy levels",
      ],
      shallow: ["Low energy", "Weak constitution", "Need for rest"],
      broken: [
        "Health disruptions",
        "Major illness periods",
        "Recovery needed",
      ],
      chained: ["Chronic health issues", "Digestive problems", "Weak immunity"],
      islands: ["Illness periods", "Hospitalization", "Health crises"],
    },
    relatedOrgans: ["Heart", "Lungs", "General vitality"],
  },
  {
    name: "خط الرأس",
    nameEn: "Head Line",
    location: "crosses palm horizontally",
    healthIndicators: {
      deep_and_straight: [
        "Clear thinking",
        "Good mental health",
        "Strong nervous system",
      ],
      wavy: ["Mental stress", "Anxiety", "Nervous tension"],
      broken: ["Mental fatigue", "Headaches", "Concentration issues"],
      chained: ["Chronic stress", "Depression risk", "Mental exhaustion"],
      drooping: ["Emotional sensitivity", "Mood swings", "Mental fatigue"],
    },
    relatedOrgans: ["Brain", "Nervous system", "Mental health"],
  },
  {
    name: "خط القلب",
    nameEn: "Heart Line",
    location: "runs below fingers",
    healthIndicators: {
      deep_and_clear: [
        "Strong heart",
        "Good circulation",
        "Emotional stability",
      ],
      shallow: ["Weak heart", "Poor circulation", "Emotional coldness"],
      broken: ["Heart problems", "Circulatory issues", "Emotional trauma"],
      chained: [
        "Heart disease risk",
        "Blood pressure issues",
        "Emotional instability",
      ],
      islands: ["Heart conditions", "Circulation problems", "Cardiac events"],
    },
    relatedOrgans: ["Heart", "Circulatory system", "Blood vessels"],
  },
  {
    name: "خط القدر",
    nameEn: "Fate Line",
    location: "runs vertically up palm center",
    healthIndicators: {
      strong: ["Good spine health", "Strong will", "Stable health"],
      weak: ["Spinal issues", "Lack of direction", "Health instability"],
      broken: ["Life disruptions", "Health setbacks", "Spinal problems"],
      absent: ["Flexible path", "Variable health", "Need for structure"],
    },
    relatedOrgans: ["Spine", "Skeletal system", "Overall stability"],
  },
  {
    name: "خط الصحة",
    nameEn: "Health Line",
    location: "runs from base to Mercury finger",
    healthIndicators: {
      absent: ["Excellent health", "Strong constitution"],
      present_and_clear: ["Health awareness needed", "Digestive sensitivity"],
      broken: ["Digestive problems", "Liver issues", "Health fluctuations"],
      wavy: [
        "Chronic digestive issues",
        "Liver problems",
        "Metabolic disorders",
      ],
    },
    relatedOrgans: ["Liver", "Digestive system", "Metabolism"],
  },
];

/**
 * Palm Mounts and Their Health Meanings
 */
export const PALM_MOUNTS = [
  {
    name: "تل المشتري",
    nameEn: "Mount of Jupiter",
    location: "below index finger",
    healthIndicators: {
      well_developed: ["Good digestion", "Strong liver", "Leadership energy"],
      overdeveloped: ["Liver stress", "Overindulgence", "Digestive excess"],
      flat: ["Weak digestion", "Low confidence", "Liver weakness"],
    },
    relatedOrgans: ["Liver", "Stomach", "Digestive system"],
  },
  {
    name: "تل زحل",
    nameEn: "Mount of Saturn",
    location: "below middle finger",
    healthIndicators: {
      well_developed: ["Strong bones", "Good structure", "Discipline"],
      overdeveloped: ["Bone issues", "Melancholy", "Joint problems"],
      flat: ["Weak bones", "Lack of structure", "Skeletal weakness"],
    },
    relatedOrgans: ["Bones", "Joints", "Skeletal system"],
  },
  {
    name: "تل الشمس",
    nameEn: "Mount of Apollo/Sun",
    location: "below ring finger",
    healthIndicators: {
      well_developed: ["Good circulation", "Healthy heart", "Vitality"],
      overdeveloped: ["Heart stress", "Overexertion", "Burnout risk"],
      flat: ["Weak circulation", "Low energy", "Heart weakness"],
    },
    relatedOrgans: ["Heart", "Circulation", "Energy levels"],
  },
  {
    name: "تل عطارد",
    nameEn: "Mount of Mercury",
    location: "below little finger",
    healthIndicators: {
      well_developed: [
        "Good communication",
        "Healthy nervous system",
        "Quick mind",
      ],
      overdeveloped: ["Nervous tension", "Anxiety", "Restlessness"],
      flat: ["Poor communication", "Nervous weakness", "Slow thinking"],
    },
    relatedOrgans: ["Nervous system", "Brain", "Communication organs"],
  },
  {
    name: "تل الزهرة",
    nameEn: "Mount of Venus",
    location: "thumb base (inside life line)",
    healthIndicators: {
      well_developed: [
        "Strong vitality",
        "Good reproductive health",
        "Passion",
      ],
      overdeveloped: ["Overindulgence", "Sexual excess", "Energy depletion"],
      flat: ["Low vitality", "Reproductive weakness", "Low libido"],
    },
    relatedOrgans: ["Reproductive system", "Vitality", "Energy reserves"],
  },
  {
    name: "تل القمر",
    nameEn: "Mount of Moon",
    location: "opposite thumb base",
    healthIndicators: {
      well_developed: [
        "Good imagination",
        "Healthy kidneys",
        "Emotional balance",
      ],
      overdeveloped: ["Kidney issues", "Water retention", "Emotional excess"],
      flat: ["Weak kidneys", "Lack of imagination", "Emotional dryness"],
    },
    relatedOrgans: ["Kidneys", "Bladder", "Lymphatic system"],
  },
];

/**
 * Palm Color Indicators
 */
export const PALM_COLORS = {
  pink: {
    health: "Excellent circulation",
    meaning: "Good health",
    severity: "normal",
  },
  red: {
    health: "High blood pressure",
    meaning: "Excess heat, anger",
    severity: "moderate",
  },
  pale: {
    health: "Anemia, poor circulation",
    meaning: "Blood deficiency",
    severity: "moderate",
  },
  yellow: {
    health: "Liver problems",
    meaning: "Bile issues, jaundice",
    severity: "severe",
  },
  blue: {
    health: "Poor circulation",
    meaning: "Heart or lung issues",
    severity: "severe",
  },
  white: {
    health: "Severe anemia",
    meaning: "Blood loss, weakness",
    severity: "critical",
  },
};

/**
 * Palm Texture Indicators
 */
export const PALM_TEXTURES = {
  soft: {
    health: "Sedentary lifestyle",
    meaning: "Need more activity",
    severity: "mild",
  },
  firm: {
    health: "Good muscle tone",
    meaning: "Active lifestyle",
    severity: "normal",
  },
  hard: {
    health: "Overwork, tension",
    meaning: "Need relaxation",
    severity: "moderate",
  },
  dry: { health: "Dehydration", meaning: "Need more fluids", severity: "mild" },
  moist: {
    health: "Good hydration",
    meaning: "Balanced fluids",
    severity: "normal",
  },
  sweaty: {
    health: "Nervous system stress",
    meaning: "Anxiety, thyroid issues",
    severity: "moderate",
  },
};

/**
 * Analyze palm signs and generate health diagnosis
 */
export function analyzePalmSigns(signs: PalmSign[]): PalmAnalysis {
  const findings: PalmFinding[] = [];
  const systemsAffected: Set<string> = new Set();
  const primaryConcerns: string[] = [];
  const allRecommendations: string[] = [];

  // Analyze each sign
  for (const sign of signs) {
    if (sign.type === "line") {
      analyzePalmLine(
        sign,
        findings,
        systemsAffected,
        primaryConcerns,
        allRecommendations
      );
    } else if (sign.type === "mount") {
      analyzePalmMount(
        sign,
        findings,
        systemsAffected,
        primaryConcerns,
        allRecommendations
      );
    } else if (sign.type === "color") {
      analyzePalmColor(
        sign,
        findings,
        systemsAffected,
        primaryConcerns,
        allRecommendations
      );
    } else if (sign.type === "texture") {
      analyzePalmTexture(
        sign,
        findings,
        systemsAffected,
        primaryConcerns,
        allRecommendations
      );
    }
  }

  // Determine overall health
  const severeConcerns = findings.filter(f => f.severity === "severe").length;
  const moderateConcerns = findings.filter(
    f => f.severity === "moderate"
  ).length;

  let overallHealth = "صحة جيدة بشكل عام";
  if (severeConcerns > 2) {
    overallHealth = "تحتاج إلى اهتمام طبي فوري - عدة مؤشرات خطيرة";
  } else if (severeConcerns > 0) {
    overallHealth = "بعض المؤشرات الصحية تحتاج إلى متابعة طبية";
  } else if (moderateConcerns > 3) {
    overallHealth = "صحة متوسطة - يُنصح بتحسين نمط الحياة";
  } else if (moderateConcerns > 0) {
    overallHealth = "صحة جيدة مع بعض النقاط التي تحتاج إلى تحسين";
  }

  return {
    overallHealth,
    findings: findings.slice(0, 15),
    primaryConcerns: Array.from(new Set(primaryConcerns)).slice(0, 5),
    recommendations: Array.from(new Set(allRecommendations)).slice(0, 10),
    systemsAffected: Array.from(systemsAffected),
  };
}

function analyzePalmLine(
  sign: PalmSign,
  findings: PalmFinding[],
  systemsAffected: Set<string>,
  primaryConcerns: string[],
  recommendations: string[]
) {
  const line = PALM_LINES.find(l =>
    sign.location.includes(l.nameEn.toLowerCase().replace(" ", "_"))
  );

  if (!line) return;

  const characteristic = sign.characteristics[0] || "normal";
  const indicators = (line.healthIndicators as any)[characteristic] || [];

  if (indicators.length > 0) {
    findings.push({
      feature: line.name,
      location: line.nameEn,
      healthIndicators: indicators,
      symptoms: indicators,
      severity: sign.severity,
      recommendations: getRecommendationsForLine(line.nameEn, characteristic),
    });

    line.relatedOrgans.forEach(organ => systemsAffected.add(organ));

    if (sign.severity === "severe" || sign.severity === "moderate") {
      primaryConcerns.push(`${line.name}: ${indicators[0]}`);
    }

    const lineRecs = getRecommendationsForLine(line.nameEn, characteristic);
    lineRecs.forEach(r => recommendations.push(r));
  }
}

function analyzePalmMount(
  sign: PalmSign,
  findings: PalmFinding[],
  systemsAffected: Set<string>,
  primaryConcerns: string[],
  recommendations: string[]
) {
  const mount = PALM_MOUNTS.find(m =>
    sign.location.includes(
      m.nameEn.toLowerCase().replace(" ", "_").replace("/", "_")
    )
  );

  if (!mount) return;

  const characteristic = sign.characteristics[0] || "well_developed";
  const indicators = (mount.healthIndicators as any)[characteristic] || [];

  if (indicators.length > 0) {
    findings.push({
      feature: mount.name,
      location: mount.nameEn,
      healthIndicators: indicators,
      symptoms: indicators,
      severity: sign.severity,
      recommendations: getRecommendationsForMount(mount.nameEn, characteristic),
    });

    mount.relatedOrgans.forEach(organ => systemsAffected.add(organ));

    if (sign.severity === "severe" || sign.severity === "moderate") {
      primaryConcerns.push(`${mount.name}: ${indicators[0]}`);
    }

    const mountRecs = getRecommendationsForMount(mount.nameEn, characteristic);
    mountRecs.forEach(r => recommendations.push(r));
  }
}

function analyzePalmColor(
  sign: PalmSign,
  findings: PalmFinding[],
  systemsAffected: Set<string>,
  primaryConcerns: string[],
  recommendations: string[]
) {
  const color = sign.color?.toLowerCase() || "pink";
  const colorInfo = (PALM_COLORS as any)[color];

  if (colorInfo) {
    findings.push({
      feature: `لون الكف: ${color}`,
      location: "Overall palm",
      healthIndicators: [colorInfo.health, colorInfo.meaning],
      symptoms: [colorInfo.health],
      severity: colorInfo.severity as any,
      recommendations: getRecommendationsForColor(color),
    });

    if (colorInfo.severity !== "normal") {
      primaryConcerns.push(`لون الكف ${color}: ${colorInfo.health}`);
      systemsAffected.add("Circulatory system");
    }

    const colorRecs = getRecommendationsForColor(color);
    colorRecs.forEach(r => recommendations.push(r));
  }
}

function analyzePalmTexture(
  sign: PalmSign,
  findings: PalmFinding[],
  systemsAffected: Set<string>,
  primaryConcerns: string[],
  recommendations: string[]
) {
  const texture = sign.characteristics[0] || "firm";
  const textureInfo = (PALM_TEXTURES as any)[texture];

  if (textureInfo) {
    findings.push({
      feature: `ملمس الكف: ${texture}`,
      location: "Overall palm",
      healthIndicators: [textureInfo.health, textureInfo.meaning],
      symptoms: [textureInfo.health],
      severity: textureInfo.severity as any,
      recommendations: getRecommendationsForTexture(texture),
    });

    if (textureInfo.severity !== "normal") {
      systemsAffected.add("General health");
    }

    const textureRecs = getRecommendationsForTexture(texture);
    textureRecs.forEach(r => recommendations.push(r));
  }
}

function getRecommendationsForLine(
  line: string,
  characteristic: string
): string[] {
  const recommendations: Record<string, Record<string, string[]>> = {
    "Life Line": {
      shallow: ["Increase rest", "Boost immune system", "Take vitamins"],
      broken: ["Consult doctor", "Focus on recovery", "Avoid stress"],
      chained: [
        "Improve digestion",
        "Strengthen immunity",
        "Regular check-ups",
      ],
    },
    "Head Line": {
      wavy: ["Reduce stress", "Practice meditation", "Get adequate sleep"],
      broken: [
        "Rest your mind",
        "Avoid overwork",
        "Consult neurologist if needed",
      ],
      chained: ["Mental health support", "Stress management", "Regular breaks"],
    },
    "Heart Line": {
      shallow: [
        "Cardiovascular exercise",
        "Heart-healthy diet",
        "Check blood pressure",
      ],
      broken: [
        "Cardiology consultation",
        "Monitor heart health",
        "Reduce stress",
      ],
      chained: ["Heart health priority", "Regular ECG", "Healthy lifestyle"],
    },
    "Fate Line": {
      weak: ["Spine exercises", "Posture correction", "Chiropractic care"],
      broken: ["Spinal health check", "Physical therapy", "Core strengthening"],
    },
    "Health Line": {
      present_and_clear: ["Digestive care", "Liver support", "Healthy diet"],
      broken: ["Liver function test", "Digestive enzymes", "Avoid alcohol"],
      wavy: [
        "Gastroenterology consultation",
        "Metabolic panel",
        "Dietary changes",
      ],
    },
  };

  return (
    recommendations[line]?.[characteristic] || ["Maintain healthy lifestyle"]
  );
}

function getRecommendationsForMount(
  mount: string,
  characteristic: string
): string[] {
  const recommendations: Record<string, Record<string, string[]>> = {
    "Mount of Jupiter": {
      overdeveloped: ["Reduce rich foods", "Liver detox", "Moderate eating"],
      flat: ["Digestive enzymes", "Probiotic foods", "Liver support"],
    },
    "Mount of Saturn": {
      overdeveloped: ["Joint care", "Calcium supplement", "Bone density check"],
      flat: ["Bone strengthening", "Vitamin D", "Weight-bearing exercise"],
    },
    "Mount of Apollo/Sun": {
      overdeveloped: [
        "Rest and recovery",
        "Stress reduction",
        "Heart monitoring",
      ],
      flat: [
        "Cardiovascular exercise",
        "Energy boosting foods",
        "Iron supplement",
      ],
    },
    "Mount of Mercury": {
      overdeveloped: [
        "Nervous system support",
        "Magnesium supplement",
        "Relaxation techniques",
      ],
      flat: ["Brain foods", "Mental stimulation", "B-complex vitamins"],
    },
    "Mount of Venus": {
      overdeveloped: [
        "Energy conservation",
        "Balanced lifestyle",
        "Adequate rest",
      ],
      flat: ["Vitality boosting", "Reproductive health check", "Energy foods"],
    },
    "Mount of Moon": {
      overdeveloped: ["Kidney support", "Reduce salt", "Hydration balance"],
      flat: ["Kidney function test", "Increase water intake", "Bladder health"],
    },
  };

  return recommendations[mount]?.[characteristic] || ["Balanced lifestyle"];
}

function getRecommendationsForColor(color: string): string[] {
  const recommendations: Record<string, string[]> = {
    red: [
      "Blood pressure check",
      "Reduce stress",
      "Cooling foods",
      "Avoid spicy food",
    ],
    pale: ["Iron supplement", "Blood test", "Iron-rich foods", "Vitamin B12"],
    yellow: [
      "Liver function test",
      "Avoid alcohol",
      "Liver detox",
      "Consult hepatologist",
    ],
    blue: [
      "Circulation improvement",
      "Cardiovascular check",
      "Warm foods",
      "Exercise",
    ],
    white: [
      "Urgent blood test",
      "Iron infusion may be needed",
      "Medical consultation",
    ],
    pink: ["Maintain current health", "Balanced diet", "Regular exercise"],
  };

  return recommendations[color] || ["Maintain healthy lifestyle"];
}

function getRecommendationsForTexture(texture: string): string[] {
  const recommendations: Record<string, string[]> = {
    soft: [
      "Increase physical activity",
      "Strength training",
      "Active lifestyle",
    ],
    hard: ["Relaxation techniques", "Massage therapy", "Reduce overwork"],
    dry: ["Increase water intake", "Moisturize", "Hydrating foods"],
    sweaty: [
      "Stress management",
      "Thyroid check",
      "Anxiety treatment if needed",
    ],
    firm: ["Maintain current activity level", "Balanced exercise"],
    moist: ["Continue good hydration", "Maintain balance"],
  };

  return recommendations[texture] || ["Balanced lifestyle"];
}
