import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Image as ImageIcon,
  Brain,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { ScanningLoader, LoadingSpinner } from "@/components/LoadingSpinner";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";
import { AI_MODELS, AIModelType, getRecommendedModel } from "@shared/ai-models";

export default function Analysis() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageType, setImageType] = useState<string>("xray");
  const [bodyPart, setBodyPart] = useState<string>("");
  const [modelType, setModelType] = useState<AIModelType>("basic");
  const [autoSelectModel, setAutoSelectModel] = useState(true);
  const [recommendedModel, setRecommendedModel] = useState<AIModelType | null>(
    null
  );
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const uploadMutation = trpc.images.upload.useMutation();
  const analyzeMutation = trpc.analysis.analyze.useMutation();

  // Update recommended model when image type or body part changes
  useEffect(() => {
    if (autoSelectModel && imageType) {
      const recommended = getRecommendedModel(imageType, bodyPart);
      setRecommendedModel(recommended);
    }
  }, [imageType, bodyPart, autoSelectModel]);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          toast.error("Please select an image file");
          return;
        }

        if (file.size > 10 * 1024 * 1024) {
          toast.error("File size must be less than 10MB");
          return;
        }

        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setAnalysisResult(null);
      }
    },
    []
  );

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setAnalysisResult(null);
    }
  }, []);

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);

      reader.onload = async () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(",")[1];

        toast.info("Uploading image...");

        // Upload image
        const uploadResult = await uploadMutation.mutateAsync({
          originalName: selectedFile.name,
          fileData: base64Data,
          mimeType: selectedFile.type,
          imageType: imageType as any,
          bodyPart: bodyPart || undefined,
        });

        toast.info("Analyzing image...");

        // Analyze image
        const result = await analyzeMutation.mutateAsync({
          imageId: uploadResult.id,
          modelType: autoSelectModel ? undefined : modelType,
          autoSelect: autoSelectModel,
        });

        setAnalysisResult(result);
        toast.success("Analysis complete!");
      };

      reader.onerror = () => {
        toast.error("Failed to read file");
      };
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Analysis failed");
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "normal":
        return "text-green-600 bg-green-50 border-green-200";
      case "mild":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "moderate":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "severe":
        return "text-red-600 bg-red-50 border-red-200";
      case "critical":
        return "text-purple-600 bg-purple-50 border-purple-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const isAnalyzing = uploadMutation.isPending || analyzeMutation.isPending;
  const isUploading = uploadMutation.isPending;
  const isProcessing = analyzeMutation.isPending;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Image Analysis</h1>
            <p className="text-sm text-muted-foreground">
              Upload and analyze medical images with specialized AI models
            </p>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Image</CardTitle>
                <CardDescription>
                  Select a medical image for AI-powered analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Drag & Drop Area */}
                <div
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  {previewUrl ? (
                    <div className="space-y-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <p className="text-sm text-muted-foreground">
                        {selectedFile?.name}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          Drop image here or click to browse
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Supports: JPG, PNG, DICOM (Max 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Image Details */}
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Image Type</Label>
                    <Select value={imageType} onValueChange={setImageType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="xray">X-Ray</SelectItem>
                        <SelectItem value="mri">MRI</SelectItem>
                        <SelectItem value="ct">CT Scan</SelectItem>
                        <SelectItem value="ultrasound">Ultrasound</SelectItem>
                        <SelectItem value="photo">Photo</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Body Part (Optional)</Label>
                    <Select value={bodyPart} onValueChange={setBodyPart}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select body part" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="face">Face</SelectItem>
                        <SelectItem value="eye">Eye/Iris</SelectItem>
                        <SelectItem value="hand">Hand/Palm</SelectItem>
                        <SelectItem value="chest">Chest</SelectItem>
                        <SelectItem value="brain">Brain</SelectItem>
                        <SelectItem value="abdomen">Abdomen</SelectItem>
                        <SelectItem value="spine">Spine</SelectItem>
                        <SelectItem value="limbs">Limbs</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Analysis Model</Label>
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoSelectModel}
                          onChange={e => setAutoSelectModel(e.target.checked)}
                          className="rounded"
                        />
                        Auto-select best model
                      </label>
                    </div>

                    {autoSelectModel && recommendedModel ? (
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <p className="text-sm font-medium text-primary mb-1">
                          ✨ Recommended: {AI_MODELS[recommendedModel].name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {AI_MODELS[recommendedModel].description}
                        </p>
                        <div className="flex gap-4 mt-2 text-xs">
                          <span className="text-muted-foreground">
                            Accuracy:{" "}
                            {AI_MODELS[recommendedModel].initialAccuracy}%
                          </span>
                          <span className="text-muted-foreground">
                            Time: {AI_MODELS[recommendedModel].processingTime}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <Select
                        value={modelType}
                        onValueChange={v => setModelType(v as AIModelType)}
                        disabled={autoSelectModel}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic Analysis</SelectItem>
                          <SelectItem value="gpt4-vision">
                            GPT-4 Vision (Advanced)
                          </SelectItem>
                          <SelectItem value="face-analyzer">
                            FaceAnalyzer (CNN, ResNet)
                          </SelectItem>
                          <SelectItem value="iris-scanner">
                            IrisScanner (VGG, U-Net)
                          </SelectItem>
                          <SelectItem value="palm-reader">
                            PalmReader (MediaPipe)
                          </SelectItem>
                          <SelectItem value="report-extractor">
                            ReportExtractor (BERT, NER)
                          </SelectItem>
                          <SelectItem value="health-predictor">
                            HealthPredictor (Ensemble)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}

                    {!autoSelectModel && AI_MODELS[modelType] && (
                      <p className="text-xs text-muted-foreground">
                        {AI_MODELS[modelType].description} • Accuracy:{" "}
                        {AI_MODELS[modelType].initialAccuracy}%
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || isAnalyzing}
                  className="w-full gap-2"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4" />
                      Analyze Image
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-900">
                    <p className="font-medium mb-1">Medical Disclaimer</p>
                    <p className="text-amber-800">
                      This AI analysis is for informational purposes only and
                      should not replace professional medical diagnosis. Always
                      consult with a qualified healthcare provider.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div>
            {analysisResult ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Analysis Complete
                    </CardTitle>
                    <CardDescription>
                      AI-powered diagnostic results using{" "}
                      {analysisResult.modelName || "AI Model"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Severity */}
                    {analysisResult.severity && (
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Severity Level
                        </Label>
                        <div
                          className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(analysisResult.severity)}`}
                        >
                          {analysisResult.severity?.toUpperCase() || "UNKNOWN"}
                        </div>
                      </div>
                    )}

                    {/* Confidence */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm text-muted-foreground">
                          Confidence Score
                        </Label>
                        <span className="text-sm font-medium">
                          {analysisResult.confidence}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${analysisResult.confidence}%` }}
                        />
                      </div>
                    </div>

                    {/* Findings */}
                    {analysisResult.findings &&
                      analysisResult.findings.length > 0 && (
                        <div>
                          <Label className="text-sm text-muted-foreground mb-2 block">
                            Findings
                          </Label>
                          <ul className="space-y-2">
                            {analysisResult.findings.map(
                              (finding: string, index: number) => (
                                <li key={index} className="flex gap-2 text-sm">
                                  <span className="text-primary">•</span>
                                  <span>{finding}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {/* Detailed Metrics */}
                    {analysisResult.detailedMetrics &&
                      Object.keys(analysisResult.detailedMetrics).length >
                        0 && (
                        <div>
                          <Label className="text-sm text-muted-foreground mb-2 block">
                            Detailed Metrics
                          </Label>
                          <div className="space-y-2 text-sm">
                            {Object.entries(analysisResult.detailedMetrics).map(
                              ([key, value]: [string, any]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-muted-foreground capitalize">
                                    {key.replace(/([A-Z])/g, " $1").trim()}:
                                  </span>
                                  <span className="font-medium">
                                    {typeof value === "object"
                                      ? JSON.stringify(value)
                                      : String(value)}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Recommendations */}
                    {analysisResult.recommendations &&
                      analysisResult.recommendations.length > 0 && (
                        <div>
                          <Label className="text-sm text-muted-foreground mb-2 block">
                            Recommendations
                          </Label>
                          <ul className="space-y-2">
                            {analysisResult.recommendations.map(
                              (rec: string, index: number) => (
                                <li key={index} className="flex gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                  <span>{rec}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {/* Processing Time */}
                    {analysisResult.processingTime && (
                      <div className="text-xs text-muted-foreground pt-4 border-t">
                        Analysis completed in{" "}
                        {(analysisResult.processingTime / 1000).toFixed(2)}s
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1">
                    Export Report
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setAnalysisResult(null);
                    }}
                  >
                    New Analysis
                  </Button>
                </div>
              </div>
            ) : isAnalyzing ? (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center">
                  {isUploading ? (
                    <LoadingSpinner size="lg" text="جاري رفع الصورة..." />
                  ) : isProcessing ? (
                    <ScanningLoader text="جاري تحليل الصورة بواسطة الذكاء الاصطناعي..." />
                  ) : (
                    <LoadingSpinner size="lg" text="جاري المعالجة..." />
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 animate-pulse">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-2">No Analysis Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Upload an image and click "Analyze Image" to see AI-powered
                    diagnostic results here
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
