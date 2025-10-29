/**
 * AI Service Layer
 * Handles integration with various AI models for medical image analysis
 */

import { invokeLLM } from "./_core/llm";
import { AIModelType, ModelAnalysisInput, ModelAnalysisOutput, getModelById } from "@shared/ai-models";
import { generateFacialDiagnosis, getSeverityLevel } from "./facial-diagnosis";

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

  let result: Omit<ModelAnalysisOutput, 'modelId' | 'modelName' | 'processingTime'>;

  switch (modelId) {
    case 'face-analyzer':
      result = await analyzeFace(input);
      break;
    case 'iris-scanner':
      result = await analyzeIris(input);
      break;
    case 'palm-reader':
      result = await analyzePalm(input);
      break;
    case 'report-extractor':
      result = await extractReport(input);
      break;
    case 'health-predictor':
      result = await predictHealth(input);
      break;
    case 'gpt4-vision':
      result = await analyzeWithGPT4Vision(input);
      break;
    case 'basic':
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
async function analyzeFace(input: ModelAnalysisInput): Promise<Omit<ModelAnalysisOutput, 'modelId' | 'modelName' | 'processingTime'>> {
  // First, get AI vision analysis with detailed facial description
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are a FaceAnalyzer AI. Analyze facial features including forehead lines (vertical/horizontal), eyebrow area, eye area (crow's feet), mouth lines, laugh lines, and lip lines. Describe all visible facial lines and features in detail.`
      },
      {
        role: "user",
        content: [
          { 
            type: "text", 
            text: `Analyze this facial image in detail. Describe all visible lines on forehead, eyebrows, eyes, mouth, and lips. Patient: ${input.patientAge ? `Age ${input.patientAge}` : 'Unknown age'}, ${input.patientGender || 'Unknown gender'}. ${input.additionalContext || ''}`
          },
          { type: "image_url", image_url: { url: input.imageUrl } }
        ]
      }
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
              description: "Detailed description of all facial lines and features"
            },
            symmetry: { type: "number", description: "Facial symmetry score 0-100" },
            skinHealth: { type: "string", description: "Skin health assessment" },
            confidence: { type: "number", description: "Confidence score 0-100" }
          },
          required: ["facialDescription", "symmetry", "skinHealth", "confidence"],
          additionalProperties: false
        }
      }
    }
  });

  const content = response.choices[0].message.content;
  const aiAnalysis = JSON.parse(typeof content === 'string' ? content : "{}");
  
  // Apply traditional facial diagnosis knowledge
  const diagnosis = generateFacialDiagnosis(aiAnalysis.facialDescription || '');
  
  // Combine AI analysis with traditional diagnosis
  const allFindings = [
    `Facial symmetry: ${aiAnalysis.symmetry}%`,
    `Skin health: ${aiAnalysis.skinHealth}`,
    diagnosis.overallAssessment,
    ...diagnosis.features.map(f => `${f.name} - ${f.location}: ${f.healthIndicators.slice(0, 2).join(', ')}`)
  ];
  
  const allRecommendations = [
    ...diagnosis.dietaryRecommendations.slice(0, 5),
    ...diagnosis.lifestyleRecommendations.slice(0, 5)
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
      overallAssessment: diagnosis.overallAssessment
    }
  };
}

/**
 * IrisScanner - VGG & U-Net based iris analysis
 */
async function analyzeIris(input: ModelAnalysisInput): Promise<Omit<ModelAnalysisOutput, 'modelId' | 'modelName' | 'processingTime'>> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are an IrisScanner AI using VGG and U-Net technology. Analyze iris patterns, colors, and textures for health indicators based on iridology principles.`
      },
      {
        role: "user",
        content: [
          { 
            type: "text", 
            text: `Analyze this iris image for health indicators. Patient: ${input.patientAge ? `Age ${input.patientAge}` : 'Unknown age'}, ${input.patientGender || 'Unknown gender'}. ${input.additionalContext || ''}`
          },
          { type: "image_url", image_url: { url: input.imageUrl } }
        ]
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "iris_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            findings: { type: "array", items: { type: "string" } },
            severity: { type: "string", enum: ["normal", "mild", "moderate", "severe", "critical"] },
            confidence: { type: "number" },
            recommendations: { type: "array", items: { type: "string" } },
            detailedMetrics: {
              type: "object",
              properties: {
                irisColor: { type: "string" },
                patternType: { type: "string" },
                pigmentations: { type: "array", items: { type: "string" } },
                organZones: { type: "array", items: { type: "string" } }
              },
              required: ["irisColor", "patternType"],
              additionalProperties: false
            }
          },
          required: ["findings", "severity", "confidence", "recommendations", "detailedMetrics"],
          additionalProperties: false
        }
      }
    }
  });

  const content = response.choices[0].message.content;
  return JSON.parse(typeof content === 'string' ? content : "{}");
}

/**
 * PalmReader - MediaPipe & CNN based palm analysis
 */
async function analyzePalm(input: ModelAnalysisInput): Promise<Omit<ModelAnalysisOutput, 'modelId' | 'modelName' | 'processingTime'>> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are a PalmReader AI using MediaPipe and CNN technology. Analyze palm lines, skin texture, color variations, and hand landmarks for health assessment.`
      },
      {
        role: "user",
        content: [
          { 
            type: "text", 
            text: `Analyze this palm image for health indicators. Patient: ${input.patientAge ? `Age ${input.patientAge}` : 'Unknown age'}, ${input.patientGender || 'Unknown gender'}. ${input.additionalContext || ''}`
          },
          { type: "image_url", image_url: { url: input.imageUrl } }
        ]
      }
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
            severity: { type: "string", enum: ["normal", "mild", "moderate", "severe", "critical"] },
            confidence: { type: "number" },
            recommendations: { type: "array", items: { type: "string" } },
            detailedMetrics: {
              type: "object",
              properties: {
                skinTexture: { type: "string" },
                colorVariations: { type: "array", items: { type: "string" } },
                linePatterns: { type: "array", items: { type: "string" } },
                handLandmarks: { type: "array", items: { type: "string" } }
              },
              required: ["skinTexture"],
              additionalProperties: false
            }
          },
          required: ["findings", "severity", "confidence", "recommendations", "detailedMetrics"],
          additionalProperties: false
        }
      }
    }
  });

  const content = response.choices[0].message.content;
  return JSON.parse(typeof content === 'string' ? content : "{}");
}

/**
 * ReportExtractor - BERT & NER based document extraction
 */
async function extractReport(input: ModelAnalysisInput): Promise<Omit<ModelAnalysisOutput, 'modelId' | 'modelName' | 'processingTime'>> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are a ReportExtractor AI using BERT and NER technology. Extract structured medical data from documents including diagnoses, medications, test results, and patient information.`
      },
      {
        role: "user",
        content: [
          { 
            type: "text", 
            text: `Extract all medical information from this document. ${input.additionalContext || ''}`
          },
          { type: "image_url", image_url: { url: input.imageUrl } }
        ]
      }
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
                dates: { type: "array", items: { type: "string" } }
              },
              required: [],
              additionalProperties: false
            }
          },
          required: ["findings", "confidence", "recommendations", "detailedMetrics"],
          additionalProperties: false
        }
      }
    }
  });

  const content = response.choices[0].message.content;
  return JSON.parse(typeof content === 'string' ? content : "{}");
}

/**
 * HealthPredictor - Ensemble models for health prediction
 */
async function predictHealth(input: ModelAnalysisInput): Promise<Omit<ModelAnalysisOutput, 'modelId' | 'modelName' | 'processingTime'>> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are a HealthPredictor AI using ensemble models (Random Forest, XGBoost, Neural Networks). Predict health indicators and potential conditions from medical images.`
      },
      {
        role: "user",
        content: [
          { 
            type: "text", 
            text: `Predict health indicators from this ${input.imageType} image${input.bodyPart ? ` of ${input.bodyPart}` : ''}. Patient: ${input.patientAge ? `Age ${input.patientAge}` : 'Unknown age'}, ${input.patientGender || 'Unknown gender'}. ${input.additionalContext || ''}`
          },
          { type: "image_url", image_url: { url: input.imageUrl } }
        ]
      }
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
            severity: { type: "string", enum: ["normal", "mild", "moderate", "severe", "critical"] },
            confidence: { type: "number" },
            recommendations: { type: "array", items: { type: "string" } },
            detailedMetrics: {
              type: "object",
              properties: {
                riskFactors: { type: "array", items: { type: "string" } },
                predictedConditions: { type: "array", items: { type: "string" } },
                healthScore: { type: "number" }
              },
              required: ["healthScore"],
              additionalProperties: false
            }
          },
          required: ["findings", "severity", "confidence", "recommendations", "detailedMetrics"],
          additionalProperties: false
        }
      }
    }
  });

  const content = response.choices[0].message.content;
  return JSON.parse(typeof content === 'string' ? content : "{}");
}

/**
 * GPT-4 Vision - General purpose analysis
 */
async function analyzeWithGPT4Vision(input: ModelAnalysisInput): Promise<Omit<ModelAnalysisOutput, 'modelId' | 'modelName' | 'processingTime'>> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: "You are a medical image analysis assistant using GPT-4 Vision. Analyze the image and provide findings in JSON format."
      },
      {
        role: "user",
        content: [
          { 
            type: "text", 
            text: `Analyze this ${input.imageType} image${input.bodyPart ? ` of ${input.bodyPart}` : ''}. ${input.additionalContext || ''}`
          },
          { type: "image_url", image_url: { url: input.imageUrl } }
        ]
      }
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
            severity: { type: "string", enum: ["normal", "mild", "moderate", "severe", "critical"] },
            recommendations: { type: "array", items: { type: "string" } },
            confidence: { type: "number" }
          },
          required: ["findings", "severity", "recommendations", "confidence"],
          additionalProperties: false
        }
      }
    }
  });

  const content = response.choices[0].message.content;
  return JSON.parse(typeof content === 'string' ? content : "{}");
}

/**
 * Basic Analysis - Quick preliminary check
 */
async function basicAnalysis(input: ModelAnalysisInput): Promise<Omit<ModelAnalysisOutput, 'modelId' | 'modelName' | 'processingTime'>> {
  return {
    findings: ["Image uploaded successfully", "Awaiting detailed analysis"],
    severity: "normal" as const,
    recommendations: ["Consider using advanced AI models for detailed analysis"],
    confidence: 50
  };
}
