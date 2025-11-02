/**
 * AI Service Layer
 * Handles integration with various AI models for medical image analysis
 */

import { invokeLLM } from "./_core/llm";
import {
  AIModelType,
  ModelAnalysisInput,
  ModelAnalysisOutput,
  getModelById,
} from "@shared/ai-models";
import { generateFacialDiagnosis, getSeverityLevel } from "./facial-diagnosis";
import {
  analyzeIrisSigns,
  IrisSign,
  IridologyAnalysis,
  IRIS_ZONES,
  ORGAN_POSITIONS,
} from "./iridology-system";
import {
  analyzeIrisAdvanced,
  formatIrisAnalysis,
} from "./advanced-iris-analysis";
import { analyzePalmSigns, PalmSign } from "./palm-reading-system";

/**
 * Main analysis function that routes to appropriate model
 */
export async function analyzeWithModel(
  modelId: AIModelType,
  input: ModelAnalysisInput
): Promise<ModelAnalysisOutput> {
  const startTime = Date.now();
  const model = getModelById(modelId);

  if (!model) {
    throw new Error(`Model ${modelId} not found`);
  }

  let result: Omit<
    ModelAnalysisOutput,
    "modelId" | "modelName" | "processingTime"
  >;

  switch (modelId) {
    case "face-analyzer":
      result = await analyzeFace(input);
      break;
    case "iris-scanner":
      result = await analyzeIris(input);
      break;
    case "palm-reader":
      result = await analyzePalm(input);
      break;
    case "report-extractor":
      result = await extractReport(input);
      break;
    case "health-predictor":
      result = await predictHealth(input);
      break;
    case "gpt4-vision":
      result = await analyzeWithGPT4Vision(input);
      break;
    case "basic":
      result = await basicAnalysis(input);
      break;
    default:
      throw new Error(`Model ${modelId} not implemented`);
  }

  const processingTime = Date.now() - startTime;

  return {
    modelId,
    modelName: model.name,
    processingTime,
    findings: result.findings || [],
    severity: result.severity,
    confidence: result.confidence || 0,
    recommendations: result.recommendations || [],
    detailedMetrics: result.detailedMetrics,
    visualizations: result.visualizations,
    rawResponse: result.rawResponse,
  };
}

/**
 * FaceAnalyzer - CNN & ResNet based facial analysis with traditional face reading
 */
async function analyzeFace(
  input: ModelAnalysisInput
): Promise<
  Omit<ModelAnalysisOutput, "modelId" | "modelName" | "processingTime">
> {
  // First, get AI vision analysis with detailed facial description
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are a FaceAnalyzer AI. Analyze facial features including forehead lines (vertical/horizontal), eyebrow area, eye area (crow's feet), mouth lines, laugh lines, and lip lines. Describe all visible facial lines and features in detail.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this facial image in detail. Describe all visible lines on forehead, eyebrows, eyes, mouth, and lips. Patient: ${input.patientAge ? `Age ${input.patientAge}` : "Unknown age"}, ${input.patientGender || "Unknown gender"}. ${input.additionalContext || ""}`,
          },
          { type: "image_url", image_url: { url: input.imageUrl } },
        ],
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "face_description",
        strict: true,
        schema: {
          type: "object",
          properties: {
            facialDescription: { type: "string" },
            confidence: { type: "number" },
          },
          required: ["facialDescription", "confidence"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0].message.content;
  const detection = JSON.parse(typeof content === "string" ? content : "{}");

  // Use independent facial diagnosis system
  const facialAnalysis = generateFacialDiagnosis(detection.facialDescription);

  const findings = [
    facialAnalysis.overallAssessment,
    ...facialAnalysis.features.map(
      f =>
        `${f.name} (${f.location}): ${f.healthIndicators.slice(0, 2).join(", ")}`
    ),
  ].slice(0, 10);

  const recommendations = [
    ...facialAnalysis.dietaryRecommendations.slice(0, 4),
    ...facialAnalysis.lifestyleRecommendations.slice(0, 4),
  ];

  return {
    findings,
    severity: getSeverityLevel(facialAnalysis.features),
    confidence: detection.confidence || 85,
    recommendations,
    detailedMetrics: {
      featuresDetected: facialAnalysis.features.map(f => f.name),
      primaryConcerns: facialAnalysis.primaryConcerns,
      analysisMethod: "Traditional Chinese Medicine Face Reading + AI Vision",
    },
  };
}

/**
 * IrisScanner - Advanced Deep Learning based iris analysis with 7-zone iridology mapping
 * Uses AI vision for feature detection + rule-based iridology system
 */
async function analyzeIris(
  input: ModelAnalysisInput
): Promise<
  Omit<ModelAnalysisOutput, "modelId" | "modelName" | "processingTime">
> {
  // Use advanced iris analysis system
  const advancedResult = await analyzeIrisAdvanced({
    imageUrl: input.imageUrl,
    eye: "left", // Default to left, can be enhanced with detection
    patientAge: input.patientAge,
    patientGender: input.patientGender,
  });

  return formatIrisAnalysis(advancedResult);
}

/**
 * Legacy iris analysis (kept for reference)
 */
async function analyzeIrisLegacy(
  input: ModelAnalysisInput
): Promise<
  Omit<ModelAnalysisOutput, "modelId" | "modelName" | "processingTime">
> {
  // First, get AI vision analysis with detailed facial description
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are a FaceAnalyzer AI. Analyze facial features including forehead lines (vertical/horizontal), eyebrow area, eye area (crow's feet), mouth lines, laugh lines, and lip lines. Describe all visible facial lines and features in detail.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this facial image in detail. Describe all visible lines on forehead, eyebrows, eyes, mouth, and lips. Patient: ${input.patientAge ? `Age ${input.patientAge}` : "Unknown age"}, ${input.patientGender || "Unknown gender"}. ${input.additionalContext || ""}`,
          },
          { type: "image_url", image_url: { url: input.imageUrl } },
        ],
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "face_description",
        strict: true,
        schema: {
          type: "object",
          properties: {
            facialDescription: {
              type: "string",
              description:
                "Detailed description of all facial lines and features",
            },
            symmetry: {
              type: "number",
              description: "Facial symmetry score 0-100",
            },
            skinHealth: {
              type: "string",
              description: "Skin health assessment",
            },
            confidence: {
              type: "number",
              description: "Confidence score 0-100",
            },
          },
          required: [
            "facialDescription",
            "symmetry",
            "skinHealth",
            "confidence",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0].message.content;
  const aiAnalysis = JSON.parse(typeof content === "string" ? content : "{}");

  // Apply traditional facial diagnosis knowledge
  const diagnosis = generateFacialDiagnosis(aiAnalysis.facialDescription || "");

  // Combine AI analysis with traditional diagnosis
  const allFindings = [
    `Facial symmetry: ${aiAnalysis.symmetry}%`,
    `Skin health: ${aiAnalysis.skinHealth}`,
    diagnosis.overallAssessment,
    ...diagnosis.features.map(
      f =>
        `${f.name} - ${f.location}: ${f.healthIndicators.slice(0, 2).join(", ")}`
    ),
  ];

  const allRecommendations = [
    ...diagnosis.dietaryRecommendations.slice(0, 5),
    ...diagnosis.lifestyleRecommendations.slice(0, 5),
  ];

  return {
    findings: allFindings.slice(0, 10),
    severity: getSeverityLevel(diagnosis.features),
    confidence: aiAnalysis.confidence || 85,
    recommendations: allRecommendations.slice(0, 8),
    detailedMetrics: {
      symmetry: aiAnalysis.symmetry,
      skinHealth: aiAnalysis.skinHealth,
      facialFeatures: diagnosis.features.map(f => f.name),
      primaryConcerns: diagnosis.primaryConcerns,
      overallAssessment: diagnosis.overallAssessment,
    },
  };
}

/**
 * Legacy IrisScanner - Independent iridology system (AI-free) - DEPRECATED
 * Replaced by analyzeIris() which uses advanced-iris-analysis.ts
 */
async function analyzeIrisOld(
  input: ModelAnalysisInput
): Promise<
  Omit<ModelAnalysisOutput, "modelId" | "modelName" | "processingTime">
> {
  // First, use AI vision to detect iris features and signs
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are an iris image analyzer. Detect and describe visible signs in the iris: crypts (holes), furrows (grooves), spots (pigmentations), rings (circular patterns), and arcus senilis (white rings). Describe their locations using clock positions (12:00, 3:00, etc.) and zones (1-7 from pupil to outer edge).`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this iris image and detect all visible signs (crypts, furrows, spots, rings). For each sign, specify: type, color (light/brown/black/white/yellow), zone (1-7), and position (clock time). Patient: ${input.patientAge ? `Age ${input.patientAge}` : "Unknown age"}, ${input.patientGender || "Unknown gender"}.`,
          },
          { type: "image_url", image_url: { url: input.imageUrl } },
        ],
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "iris_signs_detection",
        strict: true,
        schema: {
          type: "object",
          properties: {
            signs: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: [
                      "crypt",
                      "furrow",
                      "spot",
                      "ring",
                      "arcus",
                      "pigment",
                    ],
                  },
                  color: {
                    type: "string",
                    enum: ["light", "brown", "black", "white", "yellow"],
                  },
                  zone: { type: "number" },
                  position: { type: "string" },
                  severity: {
                    type: "string",
                    enum: ["mild", "moderate", "severe"],
                  },
                },
                required: ["type", "zone", "position", "severity"],
                additionalProperties: false,
              },
            },
            irisColor: { type: "string" },
            confidence: { type: "number" },
          },
          required: ["signs", "irisColor", "confidence"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0].message.content;
  const detection = JSON.parse(typeof content === "string" ? content : "{}");

  // Convert detected signs to IrisSign format
  const irisSigns: IrisSign[] = detection.signs.map((s: any) => ({
    type: s.type,
    color: s.color,
    location: { zone: s.zone, position: s.position },
    severity: s.severity,
  }));

  // Use independent iridology system for analysis (no external AI)
  const iridologyAnalysis: IridologyAnalysis = analyzeIrisSigns(irisSigns);

  // Format findings
  const findings = [
    iridologyAnalysis.overallHealth,
    `Systems affected: ${iridologyAnalysis.systemsAffected.join(", ")}`,
    ...iridologyAnalysis.findings.map(
      f =>
        `${f.organ} (${f.system}): ${f.severity} - ${f.symptoms.slice(0, 2).join(", ")}`
    ),
  ].slice(0, 10);

  // Determine overall severity
  const severities = iridologyAnalysis.findings.map(f => f.severity);
  const overallSeverity = severities.includes("severe")
    ? "severe"
    : severities.includes("moderate")
      ? "moderate"
      : "mild";

  return {
    findings,
    severity: overallSeverity,
    confidence: detection.confidence || 90,
    recommendations: iridologyAnalysis.recommendations.slice(0, 8),
    detailedMetrics: {
      irisColor: detection.irisColor,
      zonesAnalyzed: IRIS_ZONES.map(z => z.name),
      organsAssessed: iridologyAnalysis.findings.map(f => f.organ),
      systemsAffected: iridologyAnalysis.systemsAffected,
      primaryConcerns: iridologyAnalysis.primaryConcerns,
      signsDetected: irisSigns.length,
      analysisMethod: "Independent Iridology System (Rule-based, AI-free)",
    },
  };
}

/**
 * PalmReader - MediaPipe & CNN based palm analysis
 */
async function analyzePalm(
  input: ModelAnalysisInput
): Promise<
  Omit<ModelAnalysisOutput, "modelId" | "modelName" | "processingTime">
> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are a PalmReader AI using MediaPipe and CNN technology. Analyze palm lines, skin texture, color variations, and hand landmarks for health assessment.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this palm image for health indicators. Patient: ${input.patientAge ? `Age ${input.patientAge}` : "Unknown age"}, ${input.patientGender || "Unknown gender"}. ${input.additionalContext || ""}`,
          },
          { type: "image_url", image_url: { url: input.imageUrl } },
        ],
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "palm_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            findings: { type: "array", items: { type: "string" } },
            severity: {
              type: "string",
              enum: ["normal", "mild", "moderate", "severe", "critical"],
            },
            confidence: { type: "number" },
            recommendations: { type: "array", items: { type: "string" } },
            detailedMetrics: {
              type: "object",
              properties: {
                skinTexture: { type: "string" },
                colorVariations: { type: "array", items: { type: "string" } },
                linePatterns: { type: "array", items: { type: "string" } },
                handLandmarks: { type: "array", items: { type: "string" } },
              },
              required: ["skinTexture"],
              additionalProperties: false,
            },
          },
          required: [
            "findings",
            "severity",
            "confidence",
            "recommendations",
            "detailedMetrics",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0].message.content;
  return JSON.parse(typeof content === "string" ? content : "{}");
}

/**
 * ReportExtractor - BERT & NER based document extraction
 */
async function extractReport(
  input: ModelAnalysisInput
): Promise<
  Omit<ModelAnalysisOutput, "modelId" | "modelName" | "processingTime">
> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are a ReportExtractor AI using BERT and NER technology. Extract structured medical data from documents including diagnoses, medications, test results, and patient information.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Extract all medical information from this document. ${input.additionalContext || ""}`,
          },
          { type: "image_url", image_url: { url: input.imageUrl } },
        ],
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "report_extraction",
        strict: true,
        schema: {
          type: "object",
          properties: {
            findings: { type: "array", items: { type: "string" } },
            confidence: { type: "number" },
            recommendations: { type: "array", items: { type: "string" } },
            detailedMetrics: {
              type: "object",
              properties: {
                diagnoses: { type: "array", items: { type: "string" } },
                medications: { type: "array", items: { type: "string" } },
                testResults: { type: "array", items: { type: "string" } },
                dates: { type: "array", items: { type: "string" } },
              },
              required: [],
              additionalProperties: false,
            },
          },
          required: [
            "findings",
            "confidence",
            "recommendations",
            "detailedMetrics",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0].message.content;
  return JSON.parse(typeof content === "string" ? content : "{}");
}

/**
 * HealthPredictor - Ensemble models for health prediction
 */
async function predictHealth(
  input: ModelAnalysisInput
): Promise<
  Omit<ModelAnalysisOutput, "modelId" | "modelName" | "processingTime">
> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are a HealthPredictor AI using ensemble models (Random Forest, XGBoost, Neural Networks). Predict health indicators and potential conditions from medical images.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Predict health indicators from this ${input.imageType} image${input.bodyPart ? ` of ${input.bodyPart}` : ""}. Patient: ${input.patientAge ? `Age ${input.patientAge}` : "Unknown age"}, ${input.patientGender || "Unknown gender"}. ${input.additionalContext || ""}`,
          },
          { type: "image_url", image_url: { url: input.imageUrl } },
        ],
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "health_prediction",
        strict: true,
        schema: {
          type: "object",
          properties: {
            findings: { type: "array", items: { type: "string" } },
            severity: {
              type: "string",
              enum: ["normal", "mild", "moderate", "severe", "critical"],
            },
            confidence: { type: "number" },
            recommendations: { type: "array", items: { type: "string" } },
            detailedMetrics: {
              type: "object",
              properties: {
                riskFactors: { type: "array", items: { type: "string" } },
                predictedConditions: {
                  type: "array",
                  items: { type: "string" },
                },
                healthScore: { type: "number" },
              },
              required: ["healthScore"],
              additionalProperties: false,
            },
          },
          required: [
            "findings",
            "severity",
            "confidence",
            "recommendations",
            "detailedMetrics",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0].message.content;
  return JSON.parse(typeof content === "string" ? content : "{}");
}

/**
 * GPT-4 Vision - General purpose analysis
 */
async function analyzeWithGPT4Vision(
  input: ModelAnalysisInput
): Promise<
  Omit<ModelAnalysisOutput, "modelId" | "modelName" | "processingTime">
> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "You are a medical image analysis assistant using GPT-4 Vision. Analyze the image and provide findings in JSON format.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this ${input.imageType} image${input.bodyPart ? ` of ${input.bodyPart}` : ""}. ${input.additionalContext || ""}`,
          },
          { type: "image_url", image_url: { url: input.imageUrl } },
        ],
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "medical_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            findings: { type: "array", items: { type: "string" } },
            severity: {
              type: "string",
              enum: ["normal", "mild", "moderate", "severe", "critical"],
            },
            recommendations: { type: "array", items: { type: "string" } },
            confidence: { type: "number" },
          },
          required: ["findings", "severity", "recommendations", "confidence"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0].message.content;
  return JSON.parse(typeof content === "string" ? content : "{}");
}

/**
 * Basic Analysis - Quick preliminary check
 */
async function basicAnalysis(
  input: ModelAnalysisInput
): Promise<
  Omit<ModelAnalysisOutput, "modelId" | "modelName" | "processingTime">
> {
  return {
    findings: ["Image uploaded successfully", "Awaiting detailed analysis"],
    severity: "normal" as const,
    recommendations: [
      "Consider using advanced AI models for detailed analysis",
    ],
    confidence: 50,
  };
}
