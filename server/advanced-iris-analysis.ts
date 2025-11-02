/**
 * Advanced Iris Analysis System
 *
 * Implements deep learning-based iris analysis using:
 * - Iris detection and segmentation
 * - 7-zone iridology mapping
 * - Pattern and texture recognition
 * - Color analysis
 * - Health correlation
 */

import { invokeLLM } from "./_core/llm";

// Iris zones based on iridology
export const IRIS_ZONES = {
  zone1: {
    name: "Stomach Zone",
    angle: [0, 51],
    organs: ["stomach", "digestive_system"],
  },
  zone2: {
    name: "Intestinal Zone",
    angle: [52, 103],
    organs: ["intestines", "colon"],
  },
  zone3: {
    name: "Kidney/Bladder Zone",
    angle: [104, 155],
    organs: ["kidneys", "bladder", "urinary_system"],
  },
  zone4: {
    name: "Heart/Lung Zone",
    angle: [156, 207],
    organs: ["heart", "lungs", "respiratory_system"],
  },
  zone5: {
    name: "Liver/Gallbladder Zone",
    angle: [208, 259],
    organs: ["liver", "gallbladder"],
  },
  zone6: {
    name: "Endocrine Zone",
    angle: [260, 311],
    organs: ["thyroid", "pituitary", "adrenal_glands"],
  },
  zone7: {
    name: "Brain/Nervous System Zone",
    angle: [312, 360],
    organs: ["brain", "nervous_system"],
  },
};

// Iris signs and their meanings
export const IRIS_SIGNS = {
  crypts: {
    description: "Small holes or gaps in iris tissue",
    health_implications: [
      "weakness in corresponding organ",
      "toxin accumulation",
      "inflammation",
    ],
  },
  furrows: {
    description: "Radial lines extending from pupil",
    health_implications: [
      "nerve stress",
      "digestive issues",
      "chronic inflammation",
    ],
  },
  spots: {
    description: "Pigmented areas",
    health_implications: ["toxin deposits", "drug residue", "metabolic waste"],
  },
  rings: {
    description: "Circular patterns",
    health_implications: [
      "stress rings indicate tension",
      "cholesterol rings",
      "nerve rings",
    ],
  },
  lacunae: {
    description: "Leaf-like openings",
    health_implications: [
      "organ weakness",
      "predisposition to disease",
      "hereditary factors",
    ],
  },
  pigmentation: {
    description: "Color variations",
    health_implications: [
      "toxin accumulation",
      "mineral deposits",
      "metabolic issues",
    ],
  },
};

// Iris colors and health implications
export const IRIS_COLORS = {
  blue: {
    constitution: "Lymphatic",
    tendencies: ["acidic conditions", "lymphatic congestion", "inflammation"],
    recommendations: [
      "alkaline diet",
      "lymphatic drainage",
      "anti-inflammatory foods",
    ],
  },
  brown: {
    constitution: "Hematogenic",
    tendencies: ["blood disorders", "liver stress", "mineral imbalances"],
    recommendations: [
      "liver support",
      "blood purification",
      "mineral supplementation",
    ],
  },
  mixed: {
    constitution: "Biliary",
    tendencies: [
      "digestive issues",
      "liver/gallbladder problems",
      "metabolic stress",
    ],
    recommendations: ["digestive enzymes", "liver cleanse", "balanced diet"],
  },
  green: {
    constitution: "Mixed Lymphatic-Hematogenic",
    tendencies: ["combination of lymphatic and blood issues"],
    recommendations: ["comprehensive detox", "balanced nutrition"],
  },
};

interface IrisAnalysisInput {
  imageUrl: string;
  eye: "left" | "right";
  patientAge?: number;
  patientGender?: string;
}

interface IrisFeature {
  type: keyof typeof IRIS_SIGNS;
  zone: string;
  location: { x: number; y: number };
  severity: "mild" | "moderate" | "severe";
  affectedOrgans: string[];
  healthImplications: string[];
}

interface IrisAnalysisResult {
  irisColor: string;
  constitution: string;
  zones: Array<{
    zone: string;
    zoneName: string;
    signs: IrisFeature[];
    healthStatus:
      | "normal"
      | "mild_concern"
      | "moderate_concern"
      | "severe_concern";
    affectedOrgans: string[];
  }>;
  overallFindings: string[];
  recommendations: string[];
  confidence: number;
}

/**
 * Analyze iris using AI vision and iridology principles
 */
export async function analyzeIrisAdvanced(
  input: IrisAnalysisInput
): Promise<IrisAnalysisResult> {
  // Step 1: AI-powered iris feature detection
  const detectionResponse = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are an expert iridology AI system. Analyze the iris image and detect:
1. Iris color (blue, brown, mixed, green)
2. Iris signs (crypts, furrows, spots, rings, lacunae, pigmentation)
3. Location of each sign (zone 1-7, based on clock position)
4. Severity of each sign (mild, moderate, severe)
5. Pupil size and shape
6. Iris texture quality

Provide detailed analysis for each of the 7 iris zones (0-51°, 52-103°, 104-155°, 156-207°, 208-259°, 260-311°, 312-360°).`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this ${input.eye} iris image. Patient: ${input.patientAge ? `Age ${input.patientAge}` : "Unknown age"}, ${input.patientGender || "Unknown gender"}. Detect all iris signs and their locations.`,
          },
          {
            type: "image_url",
            image_url: { url: input.imageUrl },
          },
        ],
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "iris_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            irisColor: {
              type: "string",
              enum: ["blue", "brown", "mixed", "green", "gray", "hazel"],
            },
            pupilSize: {
              type: "string",
              enum: ["small", "normal", "large", "irregular"],
            },
            textureQuality: {
              type: "string",
              enum: ["fine", "medium", "coarse"],
            },
            detectedSigns: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  signType: {
                    type: "string",
                    enum: [
                      "crypts",
                      "furrows",
                      "spots",
                      "rings",
                      "lacunae",
                      "pigmentation",
                    ],
                  },
                  zoneNumber: {
                    type: "integer",
                    minimum: 1,
                    maximum: 7,
                  },
                  clockPosition: {
                    type: "integer",
                    minimum: 0,
                    maximum: 360,
                  },
                  severity: {
                    type: "string",
                    enum: ["mild", "moderate", "severe"],
                  },
                  description: {
                    type: "string",
                  },
                },
                required: [
                  "signType",
                  "zoneNumber",
                  "clockPosition",
                  "severity",
                  "description",
                ],
                additionalProperties: false,
              },
            },
            overallQuality: {
              type: "string",
              enum: ["excellent", "good", "fair", "poor"],
            },
            confidence: {
              type: "number",
              minimum: 0,
              maximum: 100,
            },
          },
          required: [
            "irisColor",
            "pupilSize",
            "textureQuality",
            "detectedSigns",
            "overallQuality",
            "confidence",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  const content = detectionResponse.choices[0].message.content;
  const detection = JSON.parse(typeof content === "string" ? content : "{}");

  // Step 2: Map detected signs to iris zones and organs
  const zoneAnalysis = Object.entries(IRIS_ZONES).map(([zoneKey, zoneInfo]) => {
    const zoneNumber = parseInt(zoneKey.replace("zone", ""));
    const signsInZone = detection.detectedSigns.filter(
      (sign: any) => sign.zoneNumber === zoneNumber
    );

    const features: IrisFeature[] = signsInZone.map((sign: any) => ({
      type: sign.signType,
      zone: zoneKey,
      location: { x: sign.clockPosition, y: 0 }, // Simplified location
      severity: sign.severity,
      affectedOrgans: zoneInfo.organs,
      healthImplications:
        IRIS_SIGNS[sign.signType as keyof typeof IRIS_SIGNS]
          ?.health_implications || [],
    }));

    // Determine health status based on signs
    const hasSevere = features.some(f => f.severity === "severe");
    const hasModerate = features.some(f => f.severity === "moderate");
    const healthStatus:
      | "normal"
      | "mild_concern"
      | "moderate_concern"
      | "severe_concern" = hasSevere
      ? "severe_concern"
      : hasModerate
        ? "moderate_concern"
        : features.length > 0
          ? "mild_concern"
          : "normal";

    return {
      zone: zoneKey,
      zoneName: zoneInfo.name,
      signs: features,
      healthStatus,
      affectedOrgans: zoneInfo.organs,
    };
  });

  // Step 3: Generate overall findings
  const colorInfo =
    IRIS_COLORS[detection.irisColor as keyof typeof IRIS_COLORS] ||
    IRIS_COLORS.mixed;

  const overallFindings = [
    `Iris Color: ${detection.irisColor} (${colorInfo.constitution} constitution)`,
    `Pupil: ${detection.pupilSize}, Texture: ${detection.textureQuality}`,
    `Total signs detected: ${detection.detectedSigns.length}`,
    `Zones with concerns: ${zoneAnalysis.filter(z => z.healthStatus !== "normal").length}/7`,
  ];

  // Add specific findings for each affected zone
  zoneAnalysis.forEach(zone => {
    if (zone.signs.length > 0) {
      const signTypes = Array.from(new Set(zone.signs.map(s => s.type))).join(
        ", "
      );
      overallFindings.push(
        `${zone.zoneName}: ${zone.signs.length} sign(s) detected (${signTypes}) - ${zone.healthStatus.replace("_", " ")}`
      );
    }
  });

  // Step 4: Generate recommendations
  const recommendations = [
    ...colorInfo.recommendations,
    "Regular eye examinations recommended",
    "Monitor changes in iris patterns over time",
  ];

  // Add zone-specific recommendations
  zoneAnalysis.forEach(zone => {
    if (zone.healthStatus !== "normal") {
      zone.affectedOrgans.forEach(organ => {
        recommendations.push(
          `Support ${organ.replace("_", " ")} health through appropriate diet and lifestyle`
        );
      });
    }
  });

  // Remove duplicates
  const uniqueRecommendations = Array.from(new Set(recommendations));

  return {
    irisColor: detection.irisColor,
    constitution: colorInfo.constitution,
    zones: zoneAnalysis,
    overallFindings,
    recommendations: uniqueRecommendations.slice(0, 10), // Limit to 10 recommendations
    confidence: detection.confidence,
  };
}

/**
 * Format iris analysis for display
 */
export function formatIrisAnalysis(result: IrisAnalysisResult) {
  const findings = [
    `Constitution: ${result.constitution}`,
    `Iris Color: ${result.irisColor}`,
    ...result.overallFindings,
  ];

  const detailedMetrics = {
    irisColor: result.irisColor,
    constitution: result.constitution,
    zonesAnalyzed: result.zones.length,
    zonesWithConcerns: result.zones.filter(z => z.healthStatus !== "normal")
      .length,
    totalSignsDetected: result.zones.reduce(
      (sum, z) => sum + z.signs.length,
      0
    ),
    zoneDetails: result.zones.map(z => ({
      zone: z.zoneName,
      status: z.healthStatus,
      signsCount: z.signs.length,
      affectedOrgans: z.affectedOrgans,
    })),
    analysisMethod: "Advanced AI-Powered Iridology with 7-Zone Mapping",
  };

  // Determine overall severity
  const hasSevere = result.zones.some(z => z.healthStatus === "severe_concern");
  const hasModerate = result.zones.some(
    z => z.healthStatus === "moderate_concern"
  );
  const severity: "normal" | "mild" | "moderate" | "severe" | "critical" =
    hasSevere ? "severe" : hasModerate ? "moderate" : "mild";

  return {
    findings,
    severity,
    confidence: result.confidence,
    recommendations: result.recommendations,
    detailedMetrics,
  };
}
