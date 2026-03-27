/**
 * Independent Iridology System
 * Rule-based iris analysis without external AI dependency
 * Based on traditional iridology principles
 */

// ============= TYPES =============

export interface IrisZone {
  id: number;
  name: string;
  location: string;
  relatedOrgans: string[];
}

export interface OrganMapping {
  organ: string;
  leftEye: { zone: number; position: string };
  rightEye: { zone: number; position: string };
  system: string;
}

export interface IrisSign {
  type: "crypt" | "furrow" | "spot" | "ring" | "arcus" | "pigment";
  color?: "light" | "brown" | "black" | "white" | "yellow";
  location: { zone: number; position: string };
  severity: "mild" | "moderate" | "severe";
}

export interface IridologyFinding {
  organ: string;
  system: string;
  signs: IrisSign[];
  symptoms: string[];
  recommendations: string[];
  severity: "normal" | "mild" | "moderate" | "severe";
}

export interface IridologyAnalysis {
  findings: IridologyFinding[];
  overallHealth: string;
  primaryConcerns: string[];
  systemsAffected: string[];
  recommendations: string[];
}

// ============= IRIS ZONES =============

export const IRIS_ZONES: IrisZone[] = [
  {
    id: 1,
    name: "Stomach Ring",
    location: "Junction of pupil and iris",
    relatedOrgans: ["stomach", "cardia", "pylorus"],
  },
  {
    id: 2,
    name: "Colon and Intestine Ring",
    location: "Outer edge of pupil to 1/3 of inner edge of iris",
    relatedOrgans: [
      "colon",
      "small intestine",
      "large intestine",
      "rectum",
      "cecum",
      "appendix",
      "duodenum",
    ],
  },
  {
    id: 3,
    name: "Autonomic Nerve Wreath (ANW)",
    location: "1/3 of iris from inner edge",
    relatedOrgans: ["autonomic nervous system", "vegetative nervous system"],
  },
  {
    id: 4,
    name: "Internal Organ Ring (4th)",
    location: "Between ANW and 2/3 of inner edge",
    relatedOrgans: [
      "heart",
      "lungs",
      "liver",
      "gallbladder",
      "pancreas",
      "spleen",
      "kidneys",
    ],
  },
  {
    id: 5,
    name: "Internal Organ Ring (5th)",
    location: "Between ANW and 2/3 of inner edge",
    relatedOrgans: [
      "heart",
      "lungs",
      "liver",
      "gallbladder",
      "pancreas",
      "spleen",
      "kidneys",
    ],
  },
  {
    id: 6,
    name: "Lymphatic Circulatory",
    location: "1/3 of iris from outermost edge",
    relatedOrgans: [
      "lymphatic system",
      "immune system",
      "lymph nodes",
      "spleen",
    ],
  },
  {
    id: 7,
    name: "Skin and Metabolism Ring",
    location: "Outermost edge of iris",
    relatedOrgans: ["skin", "metabolism", "circulation"],
  },
];

// ============= ORGAN MAPPING =============

export const ORGAN_POSITIONS: OrganMapping[] = [
  // Digestive System
  {
    organ: "Oral Cavity",
    leftEye: { zone: 2, position: "12:00" },
    rightEye: { zone: 2, position: "12:00" },
    system: "Digestive",
  },
  {
    organ: "Stomach",
    leftEye: { zone: 1, position: "center" },
    rightEye: { zone: 1, position: "center" },
    system: "Digestive",
  },
  {
    organ: "Small Intestine",
    leftEye: { zone: 2, position: "6:00-9:00" },
    rightEye: { zone: 2, position: "3:00-6:00" },
    system: "Digestive",
  },
  {
    organ: "Ascending Colon",
    leftEye: { zone: 2, position: "3:00-6:00" },
    rightEye: { zone: 2, position: "3:00-6:00" },
    system: "Digestive",
  },
  {
    organ: "Transverse Colon",
    leftEye: { zone: 2, position: "12:00-3:00" },
    rightEye: { zone: 2, position: "9:00-12:00" },
    system: "Digestive",
  },
  {
    organ: "Descending Colon",
    leftEye: { zone: 2, position: "6:00-9:00" },
    rightEye: { zone: 2, position: "6:00-9:00" },
    system: "Digestive",
  },
  {
    organ: "Pancreas Head",
    leftEye: { zone: 4, position: "7:30" },
    rightEye: { zone: 4, position: "7:30" },
    system: "Digestive",
  },
  {
    organ: "Pancreas Tail",
    leftEye: { zone: 4, position: "7:00" },
    rightEye: { zone: 4, position: "7:00" },
    system: "Digestive",
  },
  {
    organ: "Liver",
    leftEye: { zone: 4, position: "7:50" },
    rightEye: { zone: 4, position: "7:50" },
    system: "Digestive",
  },
  {
    organ: "Gallbladder",
    leftEye: { zone: 4, position: "7:50" },
    rightEye: { zone: 4, position: "7:50" },
    system: "Digestive",
  },
  {
    organ: "Spleen",
    leftEye: { zone: 4, position: "8:30" },
    rightEye: { zone: 4, position: "8:30" },
    system: "Digestive",
  },

  // Respiratory System
  {
    organ: "Nasal Cavity",
    leftEye: { zone: 6, position: "2:00-3:00" },
    rightEye: { zone: 6, position: "9:00-10:00" },
    system: "Respiratory",
  },
  {
    organ: "Paranasal Sinus",
    leftEye: { zone: 6, position: "2:00-3:00" },
    rightEye: { zone: 6, position: "9:00-10:00" },
    system: "Respiratory",
  },
  {
    organ: "Left Lung",
    leftEye: { zone: 5, position: "9:00" },
    rightEye: { zone: 5, position: "9:00" },
    system: "Respiratory",
  },
  {
    organ: "Right Lung",
    leftEye: { zone: 5, position: "3:00" },
    rightEye: { zone: 5, position: "3:00" },
    system: "Respiratory",
  },

  // Circulatory System
  {
    organ: "Heart",
    leftEye: { zone: 4, position: "3:00" },
    rightEye: { zone: 4, position: "3:00" },
    system: "Circulatory",
  },

  // Endocrine System
  {
    organ: "Thyroid",
    leftEye: { zone: 4, position: "2:00-3:00" },
    rightEye: { zone: 4, position: "9:00-10:00" },
    system: "Endocrine",
  },
  {
    organ: "Parathyroid",
    leftEye: { zone: 4, position: "2:00-3:00" },
    rightEye: { zone: 4, position: "9:00-10:00" },
    system: "Endocrine",
  },
  {
    organ: "Adrenals",
    leftEye: { zone: 4, position: "4:30" },
    rightEye: { zone: 4, position: "7:30" },
    system: "Endocrine",
  },
  {
    organ: "Pituitary",
    leftEye: { zone: 4, position: "12:00" },
    rightEye: { zone: 4, position: "12:00" },
    system: "Endocrine",
  },

  // Nervous System
  {
    organ: "Lumbar Vertebrae",
    leftEye: { zone: 5, position: "5:00-7:00" },
    rightEye: { zone: 5, position: "5:00-7:00" },
    system: "Nervous",
  },

  // Urinary System
  {
    organ: "Kidneys",
    leftEye: { zone: 4, position: "5:30" },
    rightEye: { zone: 4, position: "6:30" },
    system: "Urinary",
  },
  {
    organ: "Bladder",
    leftEye: { zone: 4, position: "6:00" },
    rightEye: { zone: 4, position: "6:00" },
    system: "Urinary",
  },
];

// ============= SIGN INTERPRETATION =============

export const SIGN_MEANINGS = {
  crypt: {
    light: {
      meaning: "Weak organ function, congenital weakness",
      severity: "moderate" as const,
      symptoms: ["Weak function", "Easy to cause problems", "Low immunity"],
    },
    brown: {
      meaning: "Organ dysfunction, toxin accumulation",
      severity: "moderate" as const,
      symptoms: ["Digestive issues", "Malnutrition", "Toxin buildup"],
    },
    black: {
      meaning: "Serious organ weakness, chronic condition",
      severity: "severe" as const,
      symptoms: ["Chronic disease", "Severe weakness", "Long-term issues"],
    },
  },
  furrow: {
    radial: {
      meaning: "Nerve tension, stress in related organ",
      severity: "mild" as const,
      symptoms: ["Stress", "Tension", "Nerve sensitivity"],
    },
  },
  spot: {
    black: {
      meaning: "Toxin accumulation, metabolic waste",
      severity: "moderate" as const,
      symptoms: ["Toxin buildup", "Poor detoxification", "Metabolic issues"],
    },
    white: {
      meaning: "Inflammation, acute condition",
      severity: "moderate" as const,
      symptoms: ["Inflammation", "Acute issues", "Active problem"],
    },
    yellow: {
      meaning: "Lymphatic congestion, immune stress",
      severity: "moderate" as const,
      symptoms: ["Lymphatic issues", "Immune weakness", "Toxin accumulation"],
    },
  },
  ring: {
    irregular: {
      meaning: "Organ weakness, functional decline",
      severity: "moderate" as const,
      symptoms: ["Weak function", "Declining health", "Organ stress"],
    },
    thick: {
      meaning: "Chronic condition, long-term weakness",
      severity: "severe" as const,
      symptoms: ["Chronic issues", "Long-term weakness", "Persistent problems"],
    },
  },
  arcus: {
    white: {
      meaning: "Cholesterol issues, circulatory problems",
      severity: "moderate" as const,
      symptoms: [
        "High cholesterol",
        "Circulation issues",
        "Cardiovascular risk",
      ],
    },
  },
  pigment: {
    brown: {
      meaning: "Toxin accumulation in organ",
      severity: "mild" as const,
      symptoms: ["Toxin buildup", "Needs detox", "Metabolic stress"],
    },
  },
};

// ============= SYSTEM SYMPTOMS =============

export const SYSTEM_SYMPTOMS = {
  Digestive: {
    stomach: {
      normal: ["Good digestion", "Healthy appetite", "No discomfort"],
      mild: ["Occasional indigestion", "Mild bloating", "Slight discomfort"],
      moderate: [
        "Frequent indigestion",
        "Acid reflux",
        "Stomach pain",
        "Bloating",
      ],
      severe: [
        "Chronic pain",
        "Severe reflux",
        "Ulcer symptoms",
        "Malnutrition",
      ],
    },
    intestine: {
      normal: ["Regular bowel movements", "Good absorption", "No pain"],
      mild: ["Occasional constipation", "Mild bloating", "Gas"],
      moderate: [
        "Irregular bowel",
        "Chronic constipation",
        "Diarrhea",
        "Malabsorption",
      ],
      severe: [
        "Severe pain",
        "Chronic diarrhea",
        "Intestinal dysfunction",
        "Malnutrition",
      ],
    },
    liver: {
      normal: ["Good detoxification", "Healthy metabolism", "No fatigue"],
      mild: ["Mild fatigue", "Occasional nausea", "Slight discomfort"],
      moderate: ["Detox issues", "Fatigue", "Nausea", "Right rib pain"],
      severe: [
        "Severe fatigue",
        "Jaundice",
        "Liver dysfunction",
        "Poor absorption",
      ],
    },
    pancreas: {
      normal: ["Stable blood sugar", "Good digestion", "No pain"],
      mild: ["Mild blood sugar fluctuation", "Occasional digestive issues"],
      moderate: [
        "Blood sugar instability",
        "Digestive problems",
        "Abdominal pain",
      ],
      severe: ["Diabetes risk", "Severe digestive issues", "Chronic pain"],
    },
  },
  Respiratory: {
    nasal: {
      normal: ["Clear breathing", "No congestion", "Good sense of smell"],
      mild: ["Occasional congestion", "Mild allergies", "Runny nose"],
      moderate: ["Chronic congestion", "Frequent allergies", "Sinus issues"],
      severe: [
        "Severe congestion",
        "Chronic sinusitis",
        "Breathing difficulty",
      ],
    },
    lungs: {
      normal: ["Clear breathing", "Good lung capacity", "No cough"],
      mild: ["Occasional cough", "Mild shortness of breath"],
      moderate: ["Frequent cough", "Chest tightness", "Reduced capacity"],
      severe: ["Chronic cough", "Severe breathing issues", "Lung dysfunction"],
    },
  },
  Circulatory: {
    heart: {
      normal: ["Regular heartbeat", "Good circulation", "No chest pain"],
      mild: ["Occasional palpitations", "Mild fatigue"],
      moderate: ["Irregular heartbeat", "Chest discomfort", "Poor circulation"],
      severe: ["Severe palpitations", "Chest pain", "Heart dysfunction"],
    },
    circulation: {
      normal: ["Warm extremities", "Good blood flow", "No swelling"],
      mild: ["Cold hands/feet", "Mild fatigue"],
      moderate: ["Poor circulation", "Swelling", "Varicose veins"],
      severe: [
        "Severe circulation issues",
        "Chronic swelling",
        "Cardiovascular problems",
      ],
    },
  },
  Endocrine: {
    thyroid: {
      normal: ["Stable metabolism", "Good energy", "Healthy weight"],
      mild: ["Mild fatigue", "Slight weight changes"],
      moderate: [
        "Metabolic issues",
        "Fatigue",
        "Weight problems",
        "Temperature sensitivity",
      ],
      severe: [
        "Thyroid dysfunction",
        "Severe metabolic issues",
        "Chronic fatigue",
      ],
    },
    adrenals: {
      normal: [
        "Good stress response",
        "Stable energy",
        "Healthy blood pressure",
      ],
      mild: ["Mild fatigue", "Occasional stress"],
      moderate: [
        "Chronic fatigue",
        "Stress sensitivity",
        "Blood pressure issues",
      ],
      severe: ["Adrenal exhaustion", "Severe fatigue", "Hormonal imbalance"],
    },
  },
  Nervous: {
    autonomic: {
      normal: ["Good regulation", "Stable functions", "No pain"],
      mild: ["Mild stress", "Occasional tension"],
      moderate: ["Chronic stress", "Autonomic dysfunction", "Pain"],
      severe: ["Severe dysfunction", "Chronic pain", "Systemic issues"],
    },
    central: {
      normal: ["Good cognition", "No pain", "Stable mood"],
      mild: ["Occasional headaches", "Mild stress"],
      moderate: ["Frequent headaches", "Back pain", "Mood issues"],
      severe: ["Chronic pain", "Neurological issues", "Severe dysfunction"],
    },
  },
  Urinary: {
    kidneys: {
      normal: ["Good filtration", "Normal urination", "No swelling"],
      mild: ["Mild fatigue", "Occasional swelling"],
      moderate: ["Frequent urination", "Swelling", "Back pain", "Fatigue"],
      severe: ["Kidney dysfunction", "Severe swelling", "Urinary issues"],
    },
  },
};

// ============= RECOMMENDATIONS =============

export const HEALTH_RECOMMENDATIONS = {
  Digestive: {
    stomach: [
      "Eat smaller, frequent meals",
      "Avoid spicy and acidic foods",
      "Reduce coffee and alcohol",
      "Practice mindful eating",
      "Consider probiotics",
      "Stay hydrated",
    ],
    intestine: [
      "Increase fiber intake",
      "Drink plenty of water",
      "Exercise regularly",
      "Add probiotics",
      "Eat fermented foods",
      "Reduce processed foods",
    ],
    liver: [
      "Limit alcohol consumption",
      "Eat green vegetables",
      "Add fruits and whole grains",
      "Avoid fatty foods",
      "Stay hydrated",
      "Consider milk thistle supplement",
    ],
    pancreas: [
      "Control blood sugar",
      "Eat low glycemic foods",
      "Add berries and leafy greens",
      "Avoid refined sugars",
      "Exercise regularly",
      "Maintain healthy weight",
    ],
  },
  Respiratory: [
    "Practice deep breathing exercises",
    "Avoid smoking and pollutants",
    "Use humidifier if needed",
    "Stay hydrated",
    "Exercise for lung capacity",
    "Consider steam inhalation",
  ],
  Circulatory: [
    "Exercise regularly",
    "Reduce sodium intake",
    "Eat heart-healthy foods",
    "Manage stress",
    "Maintain healthy weight",
    "Monitor blood pressure",
  ],
  Endocrine: [
    "Balance diet and nutrition",
    "Manage stress levels",
    "Get adequate sleep",
    "Exercise regularly",
    "Avoid endocrine disruptors",
    "Consider hormone-balancing foods",
  ],
  Nervous: [
    "Practice stress management",
    "Get adequate sleep",
    "Exercise regularly",
    "Practice meditation or yoga",
    "Reduce caffeine",
    "Consider magnesium supplements",
  ],
  Urinary: [
    "Drink plenty of water",
    "Reduce sodium intake",
    "Limit caffeine and alcohol",
    "Eat kidney-friendly foods",
    "Monitor blood pressure",
    "Exercise regularly",
  ],
};

// ============= ANALYSIS ENGINE =============

/**
 * Analyze iris signs and generate findings
 */
export function analyzeIrisSigns(signs: IrisSign[]): IridologyAnalysis {
  const findings: IridologyFinding[] = [];
  const systemsAffected = new Set<string>();

  // Group signs by organ
  const signsByOrgan = new Map<string, IrisSign[]>();

  signs.forEach(sign => {
    // Find which organ this sign affects
    const organ = findOrganByPosition(
      sign.location.zone,
      sign.location.position
    );
    if (organ) {
      if (!signsByOrgan.has(organ.organ)) {
        signsByOrgan.set(organ.organ, []);
      }
      signsByOrgan.get(organ.organ)!.push(sign);
      systemsAffected.add(organ.system);
    }
  });

  // Generate findings for each affected organ
  signsByOrgan.forEach((organSigns, organName) => {
    const organ = ORGAN_POSITIONS.find(o => o.organ === organName);
    if (!organ) return;

    const finding = generateOrganFinding(organ, organSigns);
    findings.push(finding);
  });

  // Generate overall assessment
  const severeConcerns = findings.filter(f => f.severity === "severe");
  const moderateConcerns = findings.filter(f => f.severity === "moderate");

  let overallHealth = "";
  if (severeConcerns.length > 0) {
    overallHealth = `Iridology analysis reveals ${severeConcerns.length} serious concern(s) requiring immediate attention. Consult healthcare professional.`;
  } else if (moderateConcerns.length > 0) {
    overallHealth = `Analysis shows ${moderateConcerns.length} area(s) needing attention. Lifestyle changes recommended.`;
  } else {
    overallHealth =
      "Overall iris analysis shows good health indicators with minor areas for improvement.";
  }

  const primaryConcerns = [...severeConcerns, ...moderateConcerns]
    .slice(0, 5)
    .map(f => `${f.organ} (${f.system} System)`);

  const recommendations: string[] = [];
  Array.from(systemsAffected).forEach(system => {
    const systemRecs =
      HEALTH_RECOMMENDATIONS[system as keyof typeof HEALTH_RECOMMENDATIONS];
    if (Array.isArray(systemRecs)) {
      recommendations.push(...systemRecs);
    } else if (systemRecs && typeof systemRecs === "object") {
      // For nested structures like Digestive
      Object.values(systemRecs).forEach(recs => {
        if (Array.isArray(recs)) {
          recommendations.push(...recs);
        }
      });
    }
  });

  return {
    findings,
    overallHealth,
    primaryConcerns,
    systemsAffected: Array.from(systemsAffected),
    recommendations,
  };
}

function findOrganByPosition(
  zone: number,
  position: string
): OrganMapping | undefined {
  // Simplified position matching - in real implementation, use precise angle calculations
  return ORGAN_POSITIONS.find(
    organ => organ.leftEye.zone === zone || organ.rightEye.zone === zone
  );
}

function generateOrganFinding(
  organ: OrganMapping,
  signs: IrisSign[]
): IridologyFinding {
  const severities = signs.map(s => s.severity);
  const maxSeverity = severities.includes("severe")
    ? "severe"
    : severities.includes("moderate")
      ? "moderate"
      : "mild";

  const symptoms: string[] = [];
  const organKey = organ.organ.toLowerCase().replace(/\s+/g, "");
  const systemSymptoms =
    SYSTEM_SYMPTOMS[organ.system as keyof typeof SYSTEM_SYMPTOMS];

  if (systemSymptoms && typeof systemSymptoms === "object") {
    type SeverityLevel = "normal" | "mild" | "moderate" | "severe";
    type OrganSymptoms = Record<SeverityLevel, string[]>;
    
    const organSymptoms = Object.values(systemSymptoms).find(
      (s): s is OrganSymptoms => typeof s === "object" && maxSeverity in s
    );
    if (organSymptoms && maxSeverity in organSymptoms) {
      symptoms.push(...organSymptoms[maxSeverity as SeverityLevel]);
    }
  }

  let recommendations: string[] = [];
  const systemRecs =
    HEALTH_RECOMMENDATIONS[organ.system as keyof typeof HEALTH_RECOMMENDATIONS];

  if (Array.isArray(systemRecs)) {
    recommendations = systemRecs;
  } else if (systemRecs && typeof systemRecs === "object") {
    // For Digestive system with nested structure
    const organKey = organ.organ.toLowerCase();
    if (organKey.includes("stomach") && "stomach" in systemRecs) {
      recommendations = systemRecs.stomach;
    } else if (organKey.includes("intestine") && "intestine" in systemRecs) {
      recommendations = systemRecs.intestine;
    } else if (organKey.includes("liver") && "liver" in systemRecs) {
      recommendations = systemRecs.liver;
    } else if (organKey.includes("pancreas") && "pancreas" in systemRecs) {
      recommendations = systemRecs.pancreas;
    }
  }

  return {
    organ: organ.organ,
    system: organ.system,
    signs,
    symptoms: symptoms.slice(0, 5),
    recommendations: recommendations.slice(0, 5),
    severity: maxSeverity,
  };
}

/**
 * Get severity color for UI
 */
export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "severe":
      return "#dc2626";
    case "moderate":
      return "#f59e0b";
    case "mild":
      return "#3b82f6";
    default:
      return "#10b981";
  }
}
