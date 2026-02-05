"use client";

import { useQuery, useMutation, api } from "@/lib/mock-convex";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Activity, Plus, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const preselectedExam = searchParams.get("exam");
  
  const exams = useQuery(api.exams.getExams, {});
  const results = useQuery(api.exams.getExamResults);
  const addResult = useMutation(api.exams.addExamResult);

  const [selectedExam, setSelectedExam] = useState(preselectedExam || "");
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [values, setValues] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (preselectedExam) {
      setSelectedExam(preselectedExam);
    }
  }, [preselectedExam]);

  if (exams === undefined || results === undefined) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExam || !examDate) return;

    setIsSubmitting(true);
    try {
      await addResult({
        examId: selectedExam as any,
        examDate: new Date(examDate).getTime(),
        values: values || undefined,
        notes: notes || undefined,
      });
      
      // Reset form
      setSelectedExam("");
      setValues("");
      setNotes("");
      setExamDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error("Error adding result:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <h1 className="text-xl font-bold text-white">Results</h1>
                <p className="text-xs text-slate-400">{results.length} results registered</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Result Form */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-500" />
                Register New Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Exam</label>
                  <Select value={selectedExam} onValueChange={setSelectedExam}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select an exam" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 max-h-80">
                      {exams.map((exam) => (
                        <SelectItem key={exam._id} value={exam._id}>
                          {exam.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Exam Date</label>
                  <Input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Values/Results</label>
                  <Input
                    placeholder="Ex: 120 mg/dL, Normal, etc."
                    value={values}
                    onChange={(e) => setValues(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Notes</label>
                  <Input
                    placeholder="Additional notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={!selectedExam || !examDate || isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Register Result"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recent Results */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              Recent History
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {results.length === 0 ? (
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="py-8 text-center">
                    <p className="text-slate-500">No results registered yet</p>
                    <p className="text-sm text-slate-600 mt-1">
                      Use the form on the left to add your first result
                    </p>
                  </CardContent>
                </Card>
              ) : (
                results.map((result) => (
                  <Card key={result._id} className="bg-slate-900 border-slate-800">
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-white">{result.exam?.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            <span className="text-sm text-slate-400">
                              {new Date(result.examDate).toLocaleDateString('en-US')}
                            </span>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className="border-emerald-500/50 text-emerald-400"
                        >
                          Completed
                        </Badge>
                      </div>
                      
                      {result.values && (
                        <div className="mt-3 p-2 bg-slate-800 rounded">
                          <p className="text-sm text-slate-300">
                            <span className="text-slate-500">Result:</span> {result.values}
                          </p>
                        </div>
                      )}
                      
                      {result.notes && (
                        <p className="text-sm text-slate-500 mt-2">{result.notes}</p>
                      )}
                      
                      <div className="mt-3 pt-3 border-t border-slate-800">
                        <p className="text-xs text-slate-500">
                          Next due: {new Date(result.nextDueDate).toLocaleDateString('en-US')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
