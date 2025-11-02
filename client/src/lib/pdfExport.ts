import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { format } from "date-fns";

interface Analysis {
  id: number;
  date: Date;
  type: string;
  modelName: string;
  severity: "normal" | "mild" | "moderate" | "severe" | "critical";
  confidence: number;
  findings: string[];
}

interface Recommendation {
  id: string;
  category: "diet" | "exercise" | "medical" | "lifestyle";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  actionItems: string[];
  completed?: boolean;
}

const SEVERITY_COLORS: Record<string, string> = {
  normal: "#10b981",
  mild: "#3b82f6",
  moderate: "#f59e0b",
  severe: "#ef4444",
  critical: "#dc2626",
};

export class PDFExportService {
  private pdf: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 20;
  private currentY: number = 20;
  private lineHeight: number = 7;

  constructor() {
    this.pdf = new jsPDF("p", "mm", "a4");
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
  }

  private addHeader(title: string) {
    // Logo/Title
    this.pdf.setFillColor(59, 130, 246); // Primary blue
    this.pdf.rect(0, 0, this.pageWidth, 40, "F");

    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(24);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text("ViScan", this.margin, 20);

    this.pdf.setFontSize(12);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.text("AI-Powered Medical Image Analysis", this.margin, 28);

    this.pdf.setFontSize(10);
    this.pdf.text(title, this.margin, 35);

    this.currentY = 50;
  }

  private addFooter(pageNum: number) {
    const footerY = this.pageHeight - 10;
    this.pdf.setTextColor(128, 128, 128);
    this.pdf.setFontSize(8);
    this.pdf.text(
      `Generated on ${format(new Date(), "MMM dd, yyyy HH:mm")}`,
      this.margin,
      footerY
    );
    this.pdf.text(
      `Page ${pageNum}`,
      this.pageWidth - this.margin - 10,
      footerY
    );
  }

  private checkPageBreak(requiredSpace: number = 20): boolean {
    if (this.currentY + requiredSpace > this.pageHeight - 20) {
      this.pdf.addPage();
      this.currentY = this.margin;
      return true;
    }
    return false;
  }

  private addSection(title: string) {
    this.checkPageBreak(15);
    this.pdf.setFillColor(243, 244, 246);
    this.pdf.rect(
      this.margin,
      this.currentY,
      this.pageWidth - 2 * this.margin,
      10,
      "F"
    );

    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFontSize(14);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(title, this.margin + 3, this.currentY + 7);

    this.currentY += 15;
  }

  private addText(text: string, fontSize: number = 10, bold: boolean = false) {
    this.checkPageBreak();
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont("helvetica", bold ? "bold" : "normal");
    this.pdf.setTextColor(0, 0, 0);

    const lines = this.pdf.splitTextToSize(
      text,
      this.pageWidth - 2 * this.margin - 10
    );
    lines.forEach((line: string) => {
      this.checkPageBreak();
      this.pdf.text(line, this.margin + 5, this.currentY);
      this.currentY += this.lineHeight;
    });
  }

  private addBullet(text: string) {
    this.checkPageBreak();
    this.pdf.setFontSize(10);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.setTextColor(0, 0, 0);

    // Bullet point
    this.pdf.circle(this.margin + 7, this.currentY - 2, 1, "F");

    const lines = this.pdf.splitTextToSize(
      text,
      this.pageWidth - 2 * this.margin - 15
    );
    lines.forEach((line: string, index: number) => {
      this.checkPageBreak();
      this.pdf.text(line, this.margin + 12, this.currentY);
      this.currentY += this.lineHeight;
    });
  }

  async exportAnalysisHistory(
    analyses: Analysis[],
    patientName?: string
  ): Promise<void> {
    this.addHeader("Analysis History Report");

    // Patient Info
    if (patientName) {
      this.addSection("Patient Information");
      this.addText(`Name: ${patientName}`, 10, true);
      this.addText(`Report Date: ${format(new Date(), "MMMM dd, yyyy")}`, 10);
      this.currentY += 5;
    }

    // Summary Statistics
    this.addSection("Summary Statistics");
    const totalAnalyses = analyses.length;
    const severityCounts = analyses.reduce(
      (acc, a) => {
        acc[a.severity] = (acc[a.severity] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    this.addText(`Total Analyses: ${totalAnalyses}`, 10, true);
    Object.entries(severityCounts).forEach(([severity, count]) => {
      this.addBullet(
        `${severity.charAt(0).toUpperCase() + severity.slice(1)}: ${count}`
      );
    });
    this.currentY += 5;

    // Detailed Analysis List
    this.addSection("Detailed Analysis Records");

    analyses.forEach((analysis, index) => {
      this.checkPageBreak(40);

      // Analysis header
      this.pdf.setFillColor(249, 250, 251);
      this.pdf.rect(
        this.margin,
        this.currentY,
        this.pageWidth - 2 * this.margin,
        8,
        "F"
      );

      this.pdf.setFontSize(11);
      this.pdf.setFont("helvetica", "bold");
      this.pdf.text(
        `${index + 1}. ${analysis.modelName}`,
        this.margin + 3,
        this.currentY + 5
      );

      // Severity badge
      const severityColor = SEVERITY_COLORS[analysis.severity];
      this.pdf.setFillColor(
        parseInt(severityColor.slice(1, 3), 16),
        parseInt(severityColor.slice(3, 5), 16),
        parseInt(severityColor.slice(5, 7), 16)
      );
      this.pdf.roundedRect(
        this.pageWidth - this.margin - 30,
        this.currentY + 1,
        25,
        6,
        2,
        2,
        "F"
      );
      this.pdf.setTextColor(255, 255, 255);
      this.pdf.setFontSize(8);
      this.pdf.text(
        analysis.severity.toUpperCase(),
        this.pageWidth - this.margin - 27,
        this.currentY + 5
      );

      this.currentY += 12;

      // Analysis details
      this.pdf.setTextColor(0, 0, 0);
      this.addText(
        `Date: ${format(new Date(analysis.date), "MMM dd, yyyy HH:mm")}`,
        9
      );
      this.addText(`Confidence: ${analysis.confidence}%`, 9);
      this.currentY += 2;

      this.addText("Key Findings:", 10, true);
      analysis.findings.slice(0, 5).forEach(finding => {
        this.addBullet(finding);
      });

      this.currentY += 5;
    });

    // Add footer to all pages
    const pageCount = this.pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i);
      this.addFooter(i);
    }

    this.pdf.save(`analysis-history-${format(new Date(), "yyyy-MM-dd")}.pdf`);
  }

  async exportRecommendations(
    recommendations: Recommendation[],
    severity: string,
    patientName?: string
  ): Promise<void> {
    this.addHeader("Health Recommendations Report");

    // Patient Info
    if (patientName) {
      this.addSection("Patient Information");
      this.addText(`Name: ${patientName}`, 10, true);
      this.addText(`Report Date: ${format(new Date(), "MMMM dd, yyyy")}`, 10);
      this.addText(
        `Overall Severity: ${severity.charAt(0).toUpperCase() + severity.slice(1)}`,
        10
      );
      this.currentY += 5;
    }

    // Summary
    this.addSection("Recommendations Summary");
    const categoryCounts = recommendations.reduce(
      (acc, r) => {
        acc[r.category] = (acc[r.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const priorityCounts = recommendations.reduce(
      (acc, r) => {
        acc[r.priority] = (acc[r.priority] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    this.addText("By Category:", 10, true);
    Object.entries(categoryCounts).forEach(([category, count]) => {
      this.addBullet(
        `${category.charAt(0).toUpperCase() + category.slice(1)}: ${count}`
      );
    });

    this.currentY += 3;
    this.addText("By Priority:", 10, true);
    Object.entries(priorityCounts).forEach(([priority, count]) => {
      this.addBullet(
        `${priority.charAt(0).toUpperCase() + priority.slice(1)}: ${count}`
      );
    });

    this.currentY += 5;

    // Detailed Recommendations
    const sortedRecs = [...recommendations].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    ["high", "medium", "low"].forEach(priority => {
      const recs = sortedRecs.filter(r => r.priority === priority);
      if (recs.length === 0) return;

      this.addSection(
        `${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority Recommendations`
      );

      recs.forEach((rec, index) => {
        this.checkPageBreak(35);

        this.pdf.setFontSize(11);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.text(
          `${index + 1}. ${rec.title}`,
          this.margin + 3,
          this.currentY
        );
        this.currentY += 7;

        this.pdf.setFontSize(9);
        this.pdf.setFont("helvetica", "italic");
        this.pdf.setTextColor(100, 100, 100);
        this.pdf.text(
          `Category: ${rec.category.charAt(0).toUpperCase() + rec.category.slice(1)}`,
          this.margin + 5,
          this.currentY
        );
        this.currentY += 7;

        this.pdf.setTextColor(0, 0, 0);
        this.pdf.setFont("helvetica", "normal");
        this.addText(rec.description, 9);
        this.currentY += 2;

        this.addText("Action Steps:", 9, true);
        rec.actionItems.forEach(item => {
          this.addBullet(item);
        });

        this.currentY += 5;
      });
    });

    // Add footer to all pages
    const pageCount = this.pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i);
      this.addFooter(i);
    }

    this.pdf.save(
      `health-recommendations-${format(new Date(), "yyyy-MM-dd")}.pdf`
    );
  }

  async exportCombinedReport(
    analyses: Analysis[],
    recommendations: Recommendation[],
    severity: string,
    patientName?: string
  ): Promise<void> {
    this.addHeader("Complete Health Report");

    // Patient Info
    if (patientName) {
      this.addSection("Patient Information");
      this.addText(`Name: ${patientName}`, 10, true);
      this.addText(`Report Date: ${format(new Date(), "MMMM dd, yyyy")}`, 10);
      this.addText(
        `Overall Severity: ${severity.charAt(0).toUpperCase() + severity.slice(1)}`,
        10
      );
      this.currentY += 5;
    }

    // Executive Summary
    this.addSection("Executive Summary");
    this.addText(`Total Analyses Performed: ${analyses.length}`, 10);
    this.addText(`Total Recommendations: ${recommendations.length}`, 10);
    this.addText(
      `High Priority Items: ${recommendations.filter(r => r.priority === "high").length}`,
      10
    );
    this.currentY += 10;

    // Recent Analyses (last 5)
    this.addSection("Recent Analysis Results");
    analyses
      .slice(-5)
      .reverse()
      .forEach((analysis, index) => {
        this.checkPageBreak(25);
        this.addText(`${index + 1}. ${analysis.modelName}`, 10, true);
        this.addText(
          `   Date: ${format(new Date(analysis.date), "MMM dd, yyyy")} | Severity: ${analysis.severity} | Confidence: ${analysis.confidence}%`,
          9
        );
        this.addText(`   Key Finding: ${analysis.findings[0]}`, 9);
        this.currentY += 3;
      });

    this.currentY += 5;

    // High Priority Recommendations
    const highPriorityRecs = recommendations.filter(r => r.priority === "high");
    if (highPriorityRecs.length > 0) {
      this.addSection("High Priority Recommendations");
      highPriorityRecs.forEach((rec, index) => {
        this.checkPageBreak(20);
        this.addText(`${index + 1}. ${rec.title}`, 10, true);
        this.addText(rec.description, 9);
        this.currentY += 2;
      });
    }

    // Add footer to all pages
    const pageCount = this.pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i);
      this.addFooter(i);
    }

    this.pdf.save(
      `complete-health-report-${format(new Date(), "yyyy-MM-dd")}.pdf`
    );
  }
}
