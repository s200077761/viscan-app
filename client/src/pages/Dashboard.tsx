import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, FileText, Image, TrendingUp, Upload, Brain } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
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

          <Card>
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

          <Card>
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

          <Card>
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
              
              <Link href="/settings">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <TrendingUp className="h-4 w-4" />
                  View Reports
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        {(stats?.totalImages || 0) === 0 && (
          <Card className="mt-8 border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Get Started with Viscan</CardTitle>
              <CardDescription>Follow these steps to analyze your first medical image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Upload an Image</h4>
                  <p className="text-sm text-muted-foreground">
                    Upload an X-ray, MRI, CT scan, or other medical image
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Choose Analysis Type</h4>
                  <p className="text-sm text-muted-foreground">
                    Select the appropriate AI model for your image type
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Review Results</h4>
                  <p className="text-sm text-muted-foreground">
                    Get instant AI-powered analysis with findings and recommendations
                  </p>
                </div>
              </div>

              <Link href="/analysis">
                <Button className="w-full mt-4 gap-2">
                  <Upload className="h-4 w-4" />
                  Start Your First Analysis
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
