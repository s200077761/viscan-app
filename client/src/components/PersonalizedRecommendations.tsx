import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Apple,
  Activity,
  Stethoscope,
  AlertCircle,
  CheckCircle2,
  Clock,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  Lightbulb,
  Download,
} from "lucide-react";
import { PDFExportService } from "@/lib/pdfExport";

interface Recommendation {
  id: string;
  category: "diet" | "exercise" | "medical" | "lifestyle";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  actionItems: string[];
  completed?: boolean;
  bookmarked?: boolean;
  basedOn: string[];
}

interface PersonalizedRecommendationsProps {
  severity: "normal" | "mild" | "moderate" | "severe" | "critical";
  findings: string[];
  affectedSystems?: string[];
}

const CATEGORY_ICONS = {
  diet: Apple,
  exercise: Activity,
  medical: Stethoscope,
  lifestyle: Heart,
};

const CATEGORY_COLORS = {
  diet: "bg-green-500/10 text-green-700 border-green-500/20",
  exercise: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  medical: "bg-red-500/10 text-red-700 border-red-500/20",
  lifestyle: "bg-purple-500/10 text-purple-700 border-purple-500/20",
};

const PRIORITY_COLORS = {
  high: "destructive",
  medium: "default",
  low: "secondary",
} as const;

export default function PersonalizedRecommendations({
  severity,
  findings,
  affectedSystems = [],
}: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    generateRecommendations(severity, findings, affectedSystems)
  );

  const toggleBookmark = (id: string) => {
    setRecommendations(prev =>
      prev.map(rec =>
        rec.id === id ? { ...rec, bookmarked: !rec.bookmarked } : rec
      )
    );
  };

  const toggleCompleted = (id: string) => {
    setRecommendations(prev =>
      prev.map(rec =>
        rec.id === id ? { ...rec, completed: !rec.completed } : rec
      )
    );
  };

  const completedCount = recommendations.filter(r => r.completed).length;
  const completionPercentage = (completedCount / recommendations.length) * 100;

  const highPriorityCount = recommendations.filter(
    r => r.priority === "high" && !r.completed
  ).length;

  // Memoize category counts to avoid repeated filtering on every render
  const categoryCounts = useMemo(() => {
    return recommendations.reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [recommendations]);

  const handleExportPDF = async () => {
    const pdfService = new PDFExportService();
    await pdfService.exportRecommendations(
      recommendations,
      severity,
      "Patient Name"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Personalized Health Recommendations
              </CardTitle>
              <CardDescription>
                Based on your recent analysis results
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {highPriorityCount > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {highPriorityCount} High Priority
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedCount} / {recommendations.length} completed
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(CATEGORY_ICONS).map(([category, Icon]) => {
              const count = categoryCounts[category as keyof typeof CATEGORY_ICONS] || 0;
              return (
                <div key={category} className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-lg ${CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground capitalize">
                      {category}
                    </p>
                    <p className="text-sm font-semibold">{count}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="diet">Diet</TabsTrigger>
          <TabsTrigger value="exercise">Exercise</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
        </TabsList>

        {["all", "diet", "exercise", "medical", "lifestyle"].map(tab => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {recommendations
              .filter(rec => tab === "all" || rec.category === tab)
              .sort((a, b) => {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
              })
              .map(rec => {
                const Icon = CATEGORY_ICONS[rec.category];
                return (
                  <Card
                    key={rec.id}
                    className={`transition-all hover:shadow-md ${
                      rec.completed ? "opacity-60" : ""
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`p-2 rounded-lg ${CATEGORY_COLORS[rec.category]}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4
                                className={`font-semibold ${rec.completed ? "line-through" : ""}`}
                              >
                                {rec.title}
                              </h4>
                              <Badge
                                variant={PRIORITY_COLORS[rec.priority]}
                                className="text-xs"
                              >
                                {rec.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {rec.description}
                            </p>

                            {rec.basedOn.length > 0 && (
                              <div className="mb-3">
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                  Based on:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {rec.basedOn.map((finding, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {finding}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="space-y-2">
                              <p className="text-xs font-medium">
                                Action Steps:
                              </p>
                              <ul className="space-y-1">
                                {rec.actionItems.map((item, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 text-sm"
                                  >
                                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleBookmark(rec.id)}
                            className="h-8 w-8"
                          >
                            {rec.bookmarked ? (
                              <BookmarkCheck className="h-4 w-4 text-primary" />
                            ) : (
                              <Bookmark className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant={rec.completed ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleCompleted(rec.id)}
                            className="gap-1"
                          >
                            {rec.completed ? (
                              <>
                                <CheckCircle2 className="h-3 w-3" />
                                Done
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3" />
                                Mark Done
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </TabsContent>
        ))}
      </Tabs>

      {/* Summary Card */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
              <span>Focus on high-priority recommendations first</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary mt-0.5" />
              <span>Track your progress by marking items as completed</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <Bookmark className="h-4 w-4 text-primary mt-0.5" />
              <span>Bookmark important recommendations for quick access</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <Stethoscope className="h-4 w-4 text-primary mt-0.5" />
              <span>
                Consult with healthcare professionals for medical
                recommendations
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function generateRecommendations(
  severity: string,
  findings: string[],
  affectedSystems: string[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  let idCounter = 1;

  // High priority medical recommendations for severe cases
  if (severity === "severe" || severity === "critical") {
    recommendations.push({
      id: `rec-${idCounter++}`,
      category: "medical",
      priority: "high",
      title: "Schedule Immediate Medical Consultation",
      description:
        "Your analysis indicates concerns that require professional medical evaluation.",
      actionItems: [
        "Contact your healthcare provider within 24-48 hours",
        "Prepare a summary of your symptoms and concerns",
        "Bring your analysis results to the appointment",
        "Consider getting a second opinion if needed",
      ],
      basedOn: findings.slice(0, 2),
      completed: false,
      bookmarked: false,
    });
  }

  // Dietary recommendations based on affected systems
  if (
    affectedSystems.includes("Digestive") ||
    findings.some(f => f.toLowerCase().includes("stomach"))
  ) {
    recommendations.push({
      id: `rec-${idCounter++}`,
      category: "diet",
      priority: severity === "severe" ? "high" : "medium",
      title: "Optimize Digestive Health Through Diet",
      description:
        "Support your digestive system with targeted nutritional choices.",
      actionItems: [
        "Increase fiber intake with whole grains and vegetables",
        "Stay hydrated with 8-10 glasses of water daily",
        "Avoid spicy, fried, and processed foods",
        "Consider probiotic-rich foods like yogurt and kefir",
        "Eat smaller, more frequent meals",
      ],
      basedOn: findings.filter(
        f =>
          f.toLowerCase().includes("stomach") ||
          f.toLowerCase().includes("digest")
      ),
      completed: false,
      bookmarked: false,
    });
  }

  // Liver/Detox recommendations
  if (
    affectedSystems.includes("Liver") ||
    findings.some(f => f.toLowerCase().includes("liver"))
  ) {
    recommendations.push({
      id: `rec-${idCounter++}`,
      category: "diet",
      priority: "medium",
      title: "Support Liver Function",
      description: "Help your liver with detoxifying foods and healthy habits.",
      actionItems: [
        "Add green leafy vegetables to your diet",
        "Limit alcohol consumption",
        "Include cruciferous vegetables (broccoli, cauliflower)",
        "Drink green tea regularly",
        "Avoid excessive processed foods",
      ],
      basedOn: findings.filter(f => f.toLowerCase().includes("liver")),
      completed: false,
      bookmarked: false,
    });
  }

  // Exercise recommendations
  recommendations.push({
    id: `rec-${idCounter++}`,
    category: "exercise",
    priority: severity === "normal" ? "medium" : "low",
    title: "Maintain Regular Physical Activity",
    description: "Exercise supports overall health and helps manage stress.",
    actionItems: [
      "Aim for 30 minutes of moderate exercise daily",
      "Include both cardio and strength training",
      "Try yoga or tai chi for stress management",
      "Take regular breaks from sitting",
      "Start slowly and gradually increase intensity",
    ],
    basedOn: ["Overall health maintenance"],
    completed: false,
    bookmarked: false,
  });

  // Stress management
  if (
    findings.some(
      f =>
        f.toLowerCase().includes("stress") ||
        f.toLowerCase().includes("anxiety")
    )
  ) {
    recommendations.push({
      id: `rec-${idCounter++}`,
      category: "lifestyle",
      priority: "high",
      title: "Implement Stress Management Techniques",
      description:
        "Chronic stress can impact your health. Take steps to manage it effectively.",
      actionItems: [
        "Practice daily meditation or deep breathing exercises",
        "Ensure 7-8 hours of quality sleep",
        "Set boundaries between work and personal time",
        "Engage in hobbies and activities you enjoy",
        "Consider professional counseling if needed",
      ],
      basedOn: findings.filter(f => f.toLowerCase().includes("stress")),
      completed: false,
      bookmarked: false,
    });
  }

  // Sleep recommendations
  recommendations.push({
    id: `rec-${idCounter++}`,
    category: "lifestyle",
    priority: "medium",
    title: "Optimize Sleep Quality",
    description: "Quality sleep is essential for healing and overall health.",
    actionItems: [
      "Maintain a consistent sleep schedule",
      "Create a relaxing bedtime routine",
      "Avoid screens 1 hour before bed",
      "Keep your bedroom cool and dark",
      "Limit caffeine after 2 PM",
    ],
    basedOn: ["General health optimization"],
    completed: false,
    bookmarked: false,
  });

  // Follow-up recommendation
  recommendations.push({
    id: `rec-${idCounter++}`,
    category: "medical",
    priority: "low",
    title: "Schedule Regular Follow-up Analysis",
    description: "Monitor your progress with periodic health assessments.",
    actionItems: [
      "Schedule a follow-up analysis in 3-6 months",
      "Keep a health journal to track changes",
      "Document any new symptoms or improvements",
      "Compare results to track progress",
    ],
    basedOn: ["Ongoing health monitoring"],
    completed: false,
    bookmarked: false,
  });

  return recommendations;
}
