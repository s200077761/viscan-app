/**
 * AI Models Configuration for Viscan Platform
 * Specialized models for different types of medical and biometric analysis
 */

export type AIModelType =
  | "face-analyzer"
  | "iris-scanner"
  | "palm-reader"
  | "report-extractor"
  | "health-predictor"
  | "gpt4-vision"
  | "basic";

export interface AIModel {
  id: AIModelType;
  name: string;
  description: string;
  purpose: string;
  technologies: string[];
  initialAccuracy: number;
  expectedAccuracy: number;
  supportedImageTypes: string[];
  processingTime: string;
  requiredFields?: string[];
  outputFormat: {
    findings: boolean;
    severity: boolean;
    confidence: boolean;
    detailedMetrics?: boolean;
    visualizations?: boolean;
  };
}

export const AI_MODELS: Record<AIModelType, AIModel> = {
  "face-analyzer": {
    id: "face-analyzer",
    name: "FaceAnalyzer",
    description: "Advanced facial feature analysis using deep learning",
    purpose: "Analysis of facial features, symmetry, and health markers",
    technologies: ["CNN", "ResNet-50", "FaceNet"],
    initialAccuracy: 82,
    expectedAccuracy: 92,
    supportedImageTypes: ["photo", "other"],
    processingTime: "2-5 seconds",
    requiredFields: ["bodyPart"],
    outputFormat: {
      findings: true,
      severity: true,
      confidence: true,
      detailedMetrics: true,
      visualizations: true,
    },
  },

  "iris-scanner": {
    id: "iris-scanner",
    name: "IrisScanner",
    description: "Iris texture and color analysis for health assessment",
    purpose:
      "Analysis of iris patterns, colors, and potential health indicators",
    technologies: ["VGG-16", "U-Net", "Iridology AI"],
    initialAccuracy: 84,
    expectedAccuracy: 93,
    supportedImageTypes: ["photo", "other"],
    processingTime: "3-6 seconds",
    requiredFields: ["bodyPart"],
    outputFormat: {
      findings: true,
      severity: true,
      confidence: true,
      detailedMetrics: true,
      visualizations: true,
    },
  },

  "palm-reader": {
    id: "palm-reader",
    name: "PalmReader",
    description: "Palm line and color analysis using computer vision",
    purpose: "Analysis of palm lines, skin texture, and color variations",
    technologies: ["MediaPipe", "CNN", "Hand Landmark Detection"],
    initialAccuracy: 80,
    expectedAccuracy: 90,
    supportedImageTypes: ["photo", "other"],
    processingTime: "2-4 seconds",
    requiredFields: ["bodyPart"],
    outputFormat: {
      findings: true,
      severity: true,
      confidence: true,
      detailedMetrics: true,
      visualizations: true,
    },
  },

  "report-extractor": {
    id: "report-extractor",
    name: "ReportExtractor",
    description: "Intelligent data extraction from medical documents",
    purpose: "Extract structured data from medical reports and documents",
    technologies: ["BERT", "NER", "OCR", "Medical NLP"],
    initialAccuracy: 88,
    expectedAccuracy: 95,
    supportedImageTypes: ["document", "photo", "other"],
    processingTime: "3-8 seconds",
    outputFormat: {
      findings: true,
      severity: false,
      confidence: true,
      detailedMetrics: true,
    },
  },

  "health-predictor": {
    id: "health-predictor",
    name: "HealthPredictor",
    description: "Comprehensive health indicator inference",
    purpose:
      "Predict health indicators and potential conditions from multiple data sources",
    technologies: [
      "Ensemble Models",
      "Random Forest",
      "XGBoost",
      "Neural Networks",
    ],
    initialAccuracy: 79,
    expectedAccuracy: 91,
    supportedImageTypes: [
      "xray",
      "mri",
      "ct",
      "ultrasound",
      "photo",
      "document",
      "other",
    ],
    processingTime: "5-10 seconds",
    outputFormat: {
      findings: true,
      severity: true,
      confidence: true,
      detailedMetrics: true,
    },
  },

  "gpt4-vision": {
    id: "gpt4-vision",
    name: "GPT-4 Vision",
    description: "Advanced AI-powered image analysis using OpenAI GPT-4",
    purpose:
      "General-purpose medical image analysis with natural language understanding",
    technologies: ["GPT-4 Vision", "OpenAI API", "Multimodal AI"],
    initialAccuracy: 90,
    expectedAccuracy: 95,
    supportedImageTypes: [
      "xray",
      "mri",
      "ct",
      "ultrasound",
      "photo",
      "document",
      "other",
    ],
    processingTime: "5-15 seconds",
    outputFormat: {
      findings: true,
      severity: true,
      confidence: true,
      detailedMetrics: true,
    },
  },

  basic: {
    id: "basic",
    name: "Basic Analysis",
    description: "Quick preliminary analysis for basic diagnostics",
    purpose: "Fast initial assessment and image quality check",
    technologies: ["Traditional CV", "Basic ML"],
    initialAccuracy: 75,
    expectedAccuracy: 85,
    supportedImageTypes: [
      "xray",
      "mri",
      "ct",
      "ultrasound",
      "photo",
      "document",
      "other",
    ],
    processingTime: "1-2 seconds",
    outputFormat: {
      findings: true,
      severity: true,
      confidence: true,
    },
  },
};

export interface ModelAnalysisInput {
  imageUrl: string;
  imageType: string;
  bodyPart?: string;
  patientAge?: number;
  patientGender?: string;
  additionalContext?: string;
}

export type DetailedMetrics = Record<string, string | number | boolean | null | undefined | string[] | number[] | Record<string, unknown> | Record<string, unknown>[]>;

export interface VisualizationData {
  [key: string]: string | number | boolean | null | undefined | VisualizationData | VisualizationData[];
}

export interface ModelAnalysisOutput {
  modelId: AIModelType;
  modelName: string;
  findings: string[];
  severity?: "normal" | "mild" | "moderate" | "severe" | "critical";
  confidence: number;
  processingTime: number;
  detailedMetrics?: DetailedMetrics;
  visualizations?: {
    type: string;
    data: VisualizationData;
  }[];
  recommendations: string[];
  rawResponse?: Record<string, unknown>;
}

export function getModelById(modelId: AIModelType): AIModel | undefined {
  return AI_MODELS[modelId];
}

export function getModelsForImageType(imageType: string): AIModel[] {
  return Object.values(AI_MODELS).filter(model =>
    model.supportedImageTypes.includes(imageType)
  );
}

export function getRecommendedModel(
  imageType: string,
  bodyPart?: string
): AIModelType {
  // Face analysis
  if (
    bodyPart?.toLowerCase().includes("face") ||
    bodyPart?.toLowerCase().includes("head")
  ) {
    return "face-analyzer";
  }

  // Eye/Iris analysis
  if (
    bodyPart?.toLowerCase().includes("eye") ||
    bodyPart?.toLowerCase().includes("iris")
  ) {
    return "iris-scanner";
  }

  // Hand/Palm analysis
  if (
    bodyPart?.toLowerCase().includes("hand") ||
    bodyPart?.toLowerCase().includes("palm")
  ) {
    return "palm-reader";
  }

  // Document analysis
  if (imageType === "document") {
    return "report-extractor";
  }

  // Medical imaging (X-ray, MRI, CT)
  if (["xray", "mri", "ct", "ultrasound"].includes(imageType)) {
    return "health-predictor";
  }

  // Default to GPT-4 Vision for general cases
  return "gpt4-vision";
}
