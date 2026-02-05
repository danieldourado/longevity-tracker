"use client";

import { useQuery, api } from "@/lib/mock-convex";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Activity, Search, Filter, ExternalLink, BookOpen } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ExamsPage() {
  const exams = useQuery(api.exams.getExams, {});
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedExam, setSelectedExam] = useState<any>(null);

  if (exams === undefined) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  const filteredExams = exams.filter((exam) => {
    const matchesSearch = exam.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || exam.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(exams.map((e) => e.category))];

  const groupedExams = filteredExams.reduce<Record<string, typeof exams[number][]>>(
    (acc, exam) => {
      if (!acc[exam.category]) acc[exam.category] = [];
      acc[exam.category].push(exam);
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Exams</h1>
                <p className="text-xs text-slate-400">{exams.length} exams in plan</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
            <Input
              placeholder="Search exam..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
          <div className="w-full sm:w-64">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                <Filter className="w-4 h-4 mr-2 text-slate-500" />
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {getCategoryLabel(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Exam Detail Modal */}
        {selectedExam && (
          <Card className="bg-slate-900 border-slate-700 mb-8 border-l-4 border-l-emerald-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white text-xl">{selectedExam.name}</CardTitle>
                  <CardDescription className="text-slate-400 mt-1">
                    {getCategoryLabel(selectedExam.category)} • {getFrequencyLabel(selectedExam.frequency)}
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSelectedExam(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedExam.description && (
                <div>
                  <h4 className="text-sm font-medium text-emerald-400 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    About this exam
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {selectedExam.description}
                  </p>
                </div>
              )}
              
              {selectedExam.normalRange && (
                <div>
                  <h4 className="text-sm font-medium text-emerald-400 mb-2">Normal Range</h4>
                  <p className="text-slate-300 text-sm">{selectedExam.normalRange}</p>
                </div>
              )}
              
              <div className="flex gap-3 pt-2">
                {selectedExam.grokipediaUrl && (
                  <a 
                    href={selectedExam.grokipediaUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Read on Grokipedia
                    </Button>
                  </a>
                )}
                <Link href={`/results?exam=${selectedExam._id}`}>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Register Result
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exams by Category */}
        <div className="space-y-8">
          {Object.entries(groupedExams).map(([category, categoryExams]) => (
            <div key={category}>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">
                  {getCategoryLabel(category)}
                </Badge>
                <span className="text-sm text-slate-500">({categoryExams.length} exams)</span>
              </h2>
              <div className="grid gap-3">
                {categoryExams.map((exam) => (
                  <Card 
                    key={exam._id} 
                    className="bg-slate-900 border-slate-800 hover:border-slate-600 transition-all cursor-pointer"
                    onClick={() => setSelectedExam(exam)}
                  >
                    <CardContent className="flex items-center justify-between py-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-white">{exam.name}</h3>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              exam.priority === 'required' ? 'border-emerald-500/50 text-emerald-400' :
                              exam.priority === 'recommended' ? 'border-amber-500/50 text-amber-400' :
                              'border-slate-500/50 text-slate-400'
                            }`}
                          >
                            {exam.priority === 'required' ? 'Required' :
                             exam.priority === 'recommended' ? 'Recommended' : 'Optional'}
                          </Badge>
                          {exam.grokipediaUrl && (
                            <Badge variant="outline" className="border-blue-500/50 text-blue-400 text-xs">
                              <BookOpen className="w-3 h-3 mr-1" />
                              Grokipedia
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          Frequency: {getFrequencyLabel(exam.frequency)}
                          {exam.startAge && ` • From age ${exam.startAge}`}
                          {exam.gender && exam.gender !== 'both' && ` • ${exam.gender === 'male' ? 'Male' : 'Female'}`}
                        </p>
                        {exam.description && (
                          <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                            {exam.description}
                          </p>
                        )}
                      </div>
                      <Link 
                        href={`/results?exam=${exam._id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          Register
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredExams.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500">No exams found</p>
          </div>
        )}
      </main>
    </div>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    checkup_base: "Annual Checkup",
    checkup_biennial: "Biennial Checkup",
    checkup_3_5_years: "3-5 Year Checkup",
    cancer_screening: "Cancer Screening",
    longevity_advanced: "Advanced Longevity",
    longevity_optional: "Optional Longevity",
    metabolic: "Metabolic Health",
    ocular: "Eye Health",
    dental: "Dental Health",
  };
  return labels[category] || category;
}

function getFrequencyLabel(frequency: string): string {
  const labels: Record<string, string> = {
    semi_annual: "Every 6 months",
    annual: "Annual",
    biennial: "Every 2 years",
    triennial: "Every 3 years",
    quinquennial: "Every 5 years",
    once: "Once in a lifetime",
  };
  return labels[frequency] || frequency;
}
