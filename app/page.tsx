"use client";

import { useQuery, api } from "@/lib/mock-convex";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, AlertCircle, Activity } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const exams = useQuery(api.exams.getExams, {});
  const results = useQuery(api.exams.getExamResults);
  const upcoming = useQuery(api.exams.getUpcomingExams);

  if (exams === undefined || results === undefined || upcoming === undefined) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  const totalExams = exams.length;
  const completedExams = results.length;
  const overdueExams = upcoming.length;

  const categoryStats = exams.reduce<Record<string, number>>((acc, exam) => {
    acc[exam.category] = (acc[exam.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Longevity Tracker</h1>
                <p className="text-xs text-slate-400">Health Exam Plan 2026</p>
              </div>
            </div>
            <nav className="flex gap-2">
              <Link href="/exams">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                  Exams
                </Button>
              </Link>
              <Link href="/results">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                  Results
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Total Exams
              </CardTitle>
              <Activity className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalExams}</div>
              <p className="text-xs text-slate-500 mt-1">in plan</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Completed
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{completedExams}</div>
              <p className="text-xs text-slate-500 mt-1">
                {totalExams > 0 ? Math.round((completedExams / totalExams) * 100) : 0}% complete
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Upcoming/Overdue
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{overdueExams}</div>
              <p className="text-xs text-slate-500 mt-1">need attention</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Categories
              </CardTitle>
              <Calendar className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{Object.keys(categoryStats).length}</div>
              <p className="text-xs text-slate-500 mt-1">health areas</p>
            </CardContent>
          </Card>
        </div>

        {/* Overdue Exams Section */}
        {upcoming.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Upcoming or Overdue Exams
            </h2>
            <div className="grid gap-3">
              {upcoming.slice(0, 5).map((item) => (
                <Card key={item._id} className="bg-slate-900 border-slate-800 border-l-4 border-l-amber-500">
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <h3 className="font-medium text-white">{item.exam?.name}</h3>
                      <p className="text-sm text-slate-400">
                        Due: {new Date(item.nextDueDate).toLocaleDateString('en-US')}
                      </p>
                    </div>
                    <Link href={`/results?exam=${item.examId}`}>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        Register
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Categories Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Exam Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(categoryStats).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-slate-700 text-slate-300">
                        {getCategoryLabel(category)}
                      </Badge>
                    </div>
                    <span className="text-slate-400">{count} exams</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/exams">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Activity className="w-4 h-4 mr-2" />
                  View All Exams
                </Button>
              </Link>
              <Link href="/results">
                <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Register Result
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
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
