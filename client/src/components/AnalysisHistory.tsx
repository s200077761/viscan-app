import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import {
  Calendar,
  Download,
  Filter,
  Search,
  TrendingUp,
  FileText,
  Eye,
  Activity
} from "lucide-react";
import { format } from "date-fns";
import { PDFExportService } from "@/lib/pdfExport";

interface Analysis {
  id: number;
  date: Date;
  type: string;
  modelName: string;
  severity: "normal" | "mild" | "moderate" | "severe" | "critical";
  confidence: number;
  findings: string[];
}

interface AnalysisHistoryProps {
  analyses: Analysis[];
}

const SEVERITY_COLORS = {
  normal: "#10b981",
  mild: "#3b82f6",
  moderate: "#f59e0b",
  severe: "#ef4444",
  critical: "#dc2626"
};

const SEVERITY_LABELS = {
  normal: "Normal",
  mild: "Mild",
  moderate: "Moderate",
  severe: "Severe",
  critical: "Critical"
};

export default function AnalysisHistory({ analyses }: AnalysisHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  // Filter analyses
  const filteredAnalyses = analyses.filter(analysis => {
    const matchesSearch = searchTerm === "" || 
      analysis.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.findings.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSeverity = !filterSeverity || analysis.severity === filterSeverity;
    const matchesType = !filterType || analysis.type === filterType;
    
    return matchesSearch && matchesSeverity && matchesType;
  });

  // Prepare chart data
  const severityData = Object.entries(
    analyses.reduce((acc, a) => {
      acc[a.severity] = (acc[a.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({
    name: SEVERITY_LABELS[name as keyof typeof SEVERITY_LABELS],
    value,
    color: SEVERITY_COLORS[name as keyof typeof SEVERITY_COLORS]
  }));

  const typeData = Object.entries(
    analyses.reduce((acc, a) => {
      const type = a.modelName.split(" ")[0];
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // Trend data (last 7 analyses)
  const trendData = analyses
    .slice(-7)
    .map((a, i) => ({
      index: i + 1,
      confidence: a.confidence,
      date: format(new Date(a.date), "MMM dd")
    }));

  const handleExportPDF = async () => {
    const pdfService = new PDFExportService();
    await pdfService.exportAnalysisHistory(analyses, "Patient Name");
  };

  const handleExportCSV = () => {
    const csv = [
      ["Date", "Type", "Model", "Severity", "Confidence", "Findings"],
      ...analyses.map(a => [
        format(new Date(a.date), "yyyy-MM-dd HH:mm"),
        a.type,
        a.modelName,
        a.severity,
        a.confidence.toString(),
        a.findings.join("; ")
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analysis-history-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analysis History</h2>
          <p className="text-muted-foreground">
            {filteredAnalyses.length} of {analyses.length} analyses
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search analyses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filterSeverity ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterSeverity(filterSeverity ? null : "severe")}
          >
            <Filter className="h-4 w-4 mr-2" />
            Severity
          </Button>
          <Button
            variant={filterType ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType(filterType ? null : "xray")}
          >
            <Filter className="h-4 w-4 mr-2" />
            Type
          </Button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Severity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Severity Distribution</CardTitle>
            <CardDescription>Analysis results by severity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Analysis Types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Analysis Types</CardTitle>
            <CardDescription>Distribution by model type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Confidence Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Confidence Trend</CardTitle>
            <CardDescription>Last 7 analyses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="confidence" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Analysis List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Analyses</CardTitle>
          <CardDescription>Detailed history of all analyses</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {filteredAnalyses.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No analyses found matching your filters</p>
                </div>
              ) : (
                filteredAnalyses.map((analysis) => (
                  <Card key={analysis.id} className="hover:bg-accent transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Eye className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{analysis.modelName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(analysis.date), "MMM dd, yyyy 'at' HH:mm")}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            style={{
                              borderColor: SEVERITY_COLORS[analysis.severity],
                              color: SEVERITY_COLORS[analysis.severity]
                            }}
                          >
                            {SEVERITY_LABELS[analysis.severity]}
                          </Badge>
                          <Badge variant="secondary">
                            {analysis.confidence}% confidence
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Key Findings:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {analysis.findings.slice(0, 3).map((finding, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Activity className="h-3 w-3 mt-1 flex-shrink-0" />
                              <span>{finding}</span>
                            </li>
                          ))}
                        </ul>
                        {analysis.findings.length > 3 && (
                          <Button variant="link" size="sm" className="p-0 h-auto">
                            View {analysis.findings.length - 3} more findings
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
