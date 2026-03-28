import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  BookOpen,
  Pill,
  Leaf,
  Microscope,
  FileText,
  ExternalLink,
  Star,
  AlertCircle,
} from "lucide-react";
import { Link } from "wouter";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  source?: string;
  url?: string;
}

interface Drug {
  id: string;
  name: string;
  genericName: string;
  category: string;
  description: string;
  dosage: string;
  sideEffects: string[];
  interactions: string[];
}

interface Herb {
  id: string;
  name: string;
  scientificName: string;
  chemicalComposition: string[];
  uses: string[];
  research: string;
}

export default function MedicalLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("diseases");

  // Mock drug database
  const drugs: Drug[] = [
    {
      id: "1",
      name: "Aspirin",
      genericName: "Acetylsalicylic Acid",
      category: "Analgesic, Anti-inflammatory",
      description: "Used to reduce pain, fever, or inflammation",
      dosage: "325-650 mg every 4-6 hours",
      sideEffects: ["Stomach upset", "Heartburn", "Drowsiness"],
      interactions: ["Warfarin", "Ibuprofen", "Alcohol"],
    },
    {
      id: "2",
      name: "Metformin",
      genericName: "Metformin Hydrochloride",
      category: "Antidiabetic",
      description: "Used to treat type 2 diabetes",
      dosage: "500-2000 mg daily",
      sideEffects: ["Nausea", "Diarrhea", "Stomach pain"],
      interactions: ["Alcohol", "Contrast dye", "Insulin"],
    },
    {
      id: "3",
      name: "Lisinopril",
      genericName: "Lisinopril",
      category: "ACE Inhibitor",
      description: "Used to treat high blood pressure",
      dosage: "10-40 mg once daily",
      sideEffects: ["Dizziness", "Cough", "Headache"],
      interactions: ["Potassium supplements", "NSAIDs", "Lithium"],
    },
  ];

  // Mock herb database
  const herbs: Herb[] = [
    {
      id: "1",
      name: "Turmeric",
      scientificName: "Curcuma longa",
      chemicalComposition: [
        "Curcumin",
        "Demethoxycurcumin",
        "Bisdemethoxycurcumin",
      ],
      uses: ["Anti-inflammatory", "Antioxidant", "Pain relief"],
      research: "Multiple studies show anti-inflammatory properties",
    },
    {
      id: "2",
      name: "Ginger",
      scientificName: "Zingiber officinale",
      chemicalComposition: ["Gingerol", "Shogaol", "Paradol"],
      uses: ["Nausea relief", "Digestive aid", "Anti-inflammatory"],
      research: "Effective for nausea and motion sickness",
    },
    {
      id: "3",
      name: "Ginseng",
      scientificName: "Panax ginseng",
      chemicalComposition: ["Ginsenosides", "Polysaccharides", "Peptides"],
      uses: ["Energy boost", "Immune support", "Cognitive function"],
      research: "Studies suggest benefits for fatigue and cognition",
    },
  ];

  // Mock disease database
  const diseases = [
    {
      id: "1",
      name: "Diabetes Mellitus Type 2",
      category: "Metabolic",
      symptoms: ["Increased thirst", "Frequent urination", "Fatigue"],
      treatments: ["Metformin", "Lifestyle changes", "Insulin therapy"],
      research: "Ongoing research on prevention and management",
    },
    {
      id: "2",
      name: "Hypertension",
      category: "Cardiovascular",
      symptoms: ["Headache", "Shortness of breath", "Nosebleeds"],
      treatments: ["ACE inhibitors", "Diet modification", "Exercise"],
      research: "Multiple studies on lifestyle interventions",
    },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    // Simulate API call
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: "1",
          title: `Research on ${searchQuery}`,
          description: "Latest research findings and clinical studies",
          category: "Research",
          source: "PubMed",
          url: `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(searchQuery)}`,
        },
        {
          id: "2",
          title: `Treatment options for ${searchQuery}`,
          description: "Evidence-based treatment guidelines",
          category: "Treatment",
          source: "MedlinePlus",
          url: `https://medlineplus.gov/search.html?query=${encodeURIComponent(searchQuery)}`,
        },
        {
          id: "3",
          title: `Clinical trials for ${searchQuery}`,
          description: "Ongoing clinical trials and studies",
          category: "Clinical Trials",
          source: "ClinicalTrials.gov",
          url: `https://clinicaltrials.gov/search?term=${encodeURIComponent(searchQuery)}`,
        },
      ];

      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                ← Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Medical Library</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Search Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Medical Information</CardTitle>
            <CardDescription>
              Search for diseases, drugs, herbs, research papers, and treatments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Search diseases, drugs, herbs, or research..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyPress={e => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                <Search className="h-4 w-4 mr-2" />
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="font-semibold">Search Results</h3>
                {searchResults.map(result => (
                  <Card
                    key={result.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{result.title}</h4>
                            <Badge variant="outline">{result.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {result.description}
                          </p>
                          {result.source && (
                            <p className="text-xs text-muted-foreground">
                              Source: {result.source}
                            </p>
                          )}
                        </div>
                        {result.url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(result.url, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Library Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="diseases">
              <AlertCircle className="h-4 w-4 mr-2" />
              Diseases
            </TabsTrigger>
            <TabsTrigger value="drugs">
              <Pill className="h-4 w-4 mr-2" />
              Drugs
            </TabsTrigger>
            <TabsTrigger value="herbs">
              <Leaf className="h-4 w-4 mr-2" />
              Herbs
            </TabsTrigger>
          </TabsList>

          {/* Diseases Tab */}
          <TabsContent value="diseases" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Disease Database</CardTitle>
                <CardDescription>
                  Comprehensive information about diseases and conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {diseases.map(disease => (
                    <Card
                      key={disease.id}
                      className="border-l-4 border-l-red-500"
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {disease.name}
                            </h3>
                            <Badge variant="outline" className="mt-1">
                              {disease.category}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Star className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium mb-1">
                              Symptoms:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {disease.symptoms.map((symptom, idx) => (
                                <Badge key={idx} variant="secondary">
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium mb-1">
                              Treatments:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {disease.treatments.map((treatment, idx) => (
                                <Badge key={idx} variant="outline">
                                  {treatment}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium mb-1">
                              Research:
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {disease.research}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drugs Tab */}
          <TabsContent value="drugs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Drug Database</CardTitle>
                <CardDescription>
                  Detailed information about medications and pharmaceuticals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {drugs.map(drug => (
                    <Card
                      key={drug.id}
                      className="border-l-4 border-l-blue-500"
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {drug.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {drug.genericName}
                            </p>
                            <Badge variant="outline" className="mt-1">
                              {drug.category}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Star className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium mb-1">
                              Description:
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {drug.description}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium mb-1">Dosage:</p>
                            <p className="text-sm text-muted-foreground">
                              {drug.dosage}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium mb-1">
                              Side Effects:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {drug.sideEffects.map((effect, idx) => (
                                <Badge key={idx} variant="destructive">
                                  {effect}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium mb-1">
                              Drug Interactions:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {drug.interactions.map((interaction, idx) => (
                                <Badge key={idx} variant="outline">
                                  {interaction}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Herbs Tab */}
          <TabsContent value="herbs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Herbal Medicine Library</CardTitle>
                <CardDescription>
                  Information about herbs, chemical composition, and research
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {herbs.map(herb => (
                    <Card
                      key={herb.id}
                      className="border-l-4 border-l-green-500"
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {herb.name}
                            </h3>
                            <p className="text-sm italic text-muted-foreground">
                              {herb.scientificName}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Star className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium mb-1 flex items-center gap-2">
                              <Microscope className="h-4 w-4" />
                              Chemical Composition:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {herb.chemicalComposition.map((compound, idx) => (
                                <Badge key={idx} variant="secondary">
                                  {compound}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium mb-1">
                              Medicinal Uses:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {herb.uses.map((use, idx) => (
                                <Badge key={idx} variant="outline">
                                  {use}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium mb-1 flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Research:
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {herb.research}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
