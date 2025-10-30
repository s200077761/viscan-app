import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, FileText, Image, TrendingUp, Upload, Brain, MessageSquare, History } from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import AnalysisHistory from "@/components/AnalysisHistory";
import PersonalizedRecommendations from "@/components/PersonalizedRecommendations";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function DashboardEnhanced() {
  const { user } = useAuth();
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();
  
  // Mock data for analysis history (replace with real data from API)
  const mockAnalyses = [
    {
      id: 1,
      date: new Date(2025, 9, 25, 14, 30),
      type: "iris",
      modelName: "Iris Scanner - Advanced",
      severity: "mild" as const,
      confidence: 92,
      findings: [
        "Constitution: Lymphatic (Blue iris)",
        "Stomach Zone: 2 sign(s) detected (crypts, spots) - mild concern",
        "Kidney/Bladder Zone: 1 sign(s) detected (furrows) - mild concern"
      ]
    },
    {
      id: 2,
      date: new Date(2025, 9, 24, 10, 15),
      type: "face",
      modelName: "Face Analyzer - TCM",
      severity: "moderate" as const,
      confidence: 88,
      findings: [
        "Facial symmetry: 85%",
        "Single Vertical Line (Between eyebrows): Persistent and determined personality, Possible stress accumulation",
        "Horizontal Forehead Lines (Forehead): Digestive system concerns, Possible stomach issues"
      ]
    },
    {
      id: 3,
      date: new Date(2025, 9, 23, 16, 45),
      type: "palm",
      modelName: "Palm Reader",
      severity: "normal" as const,
      confidence: 85,
      findings: [
        "Overall palm health: Good",
        "Life line: Strong and clear",
        "Heart line: Balanced emotional health"
      ]
    },
    {
      id: 4,
      date: new Date(2025, 9, 22, 9, 20),
      type: "xray",
      modelName: "GPT-4 Vision",
      severity: "severe" as const,
      confidence: 95,
      findings: [
        "Chest X-ray analysis shows potential abnormality",
        "Recommend immediate consultation with specialist",
        "Further imaging may be required"
      ]
    },
    {
      id: 5,
      date: new Date(2025, 9, 21, 13, 10),
      type: "iris",
      modelName: "Iris Scanner - Advanced",
      severity: "mild" as const,
      confidence: 90,
      findings: [
        "Constitution: Hematogenic (Brown iris)",
        "Liver/Gallbladder Zone: 1 sign(s) detected (spots) - mild concern",
        "Overall health status: Good"
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading dashboard..." fullScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.name || 'User'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/chat">
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                AI Chat
              </Button>
            </Link>
            <Link href="/analysis">
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                New Analysis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              <TrendingUp className="h-4 w-4 mr-2" />
              Recommendations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="animate-fadeIn hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Documents
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalDocuments || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Medical records and cases
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-fadeIn animate-stagger-1 hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Images
                  </CardTitle>
                  <Image className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalImages || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Uploaded medical images
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-fadeIn animate-stagger-2 hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Analyses Completed
                  </CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalAnalyses || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    AI-powered diagnostics
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-fadeIn animate-stagger-3 hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Analysis
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.pendingAnalyses || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting processing
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Subscription Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Subscription</CardTitle>
                  <CardDescription>Current plan and usage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Plan</p>
                      <p className="text-2xl font-bold capitalize">{stats?.subscription?.plan || 'Free'}</p>
                    </div>
                    <Link href="/settings">
                      <Button variant="outline" size="sm">Upgrade</Button>
                    </Link>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Analyses Used</span>
                      <span className="text-sm text-muted-foreground">
                        {stats?.subscription?.analysesUsed || 0} / {stats?.subscription?.analysesLimit || 10}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ 
                          width: `${Math.min(100, ((stats?.subscription?.analysesUsed || 0) / (stats?.subscription?.analysesLimit || 10)) * 100)}%` 
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {stats?.subscription?.analysesRemaining || 10} analyses remaining this month
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/analysis">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Upload className="h-4 w-4" />
                      Upload & Analyze Image
                    </Button>
                  </Link>
                  
                  <Link href="/chat">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Start AI Chat
                    </Button>
                  </Link>
                  
                  <Link href="/documents">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <FileText className="h-4 w-4" />
                      View All Documents
                    </Button>
                  </Link>
                  
                  <Link href="/images">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Image className="h-4 w-4" />
                      Browse Images
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <AnalysisHistory analyses={mockAnalyses} />
          </TabsContent>

          <TabsContent value="recommendations">
            <PersonalizedRecommendations
              severity="moderate"
              findings={[
                "Stomach Zone: 2 sign(s) detected",
                "Stress indicators present",
                "Liver function concerns"
              ]}
              affectedSystems={["Digestive", "Liver", "Nervous System"]}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
