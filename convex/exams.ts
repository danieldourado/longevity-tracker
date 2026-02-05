import { v } from "convex/values";
import { internalMutation, query, mutation } from "./_generated/server";

// Seed the database with all exams from PLANO_DE_LONGEVIDADE.md
export const seedExams = internalMutation({
  handler: async (ctx) => {
    const exams = [
      // Checkup Base Anual (Required)
      { name: "Hemograma completo", category: "checkup_base", frequency: "annual", priority: "required" },
      { name: "Glicemia em jejum", category: "checkup_base", frequency: "annual", priority: "required" },
      { name: "HbA1c (glicada)", category: "checkup_base", frequency: "annual", priority: "required" },
      { name: "Perfil lipídico completo", category: "checkup_base", frequency: "annual", priority: "required" },
      { name: "Creatinina e ureia", category: "checkup_base", frequency: "annual", priority: "required" },
      { name: "TSH e T4 livre", category: "checkup_base", frequency: "annual", priority: "required" },
      { name: "AST/TGO e ALT/TGP", category: "checkup_base", frequency: "annual", priority: "required" },
      { name: "Ácido úrico", category: "checkup_base", frequency: "annual", priority: "required" },
      { name: "Eletrocardiograma (ECG)", category: "checkup_base", frequency: "annual", priority: "required" },
      { name: "Consulta cardiologista", category: "checkup_base", frequency: "annual", priority: "required" },
      { name: "Consulta clínico geral", category: "checkup_base", frequency: "annual", priority: "required" },

      // Exames a cada 2 anos
      { name: "Ecocardiograma", category: "checkup_biennial", frequency: "biennial", priority: "required" },
      { name: "Teste de esforço/ergometria", category: "checkup_biennial", frequency: "biennial", priority: "required" },
      { name: "Densitometria óssea", category: "checkup_biennial", frequency: "biennial", priority: "required" },
      { name: "Colonoscopia", category: "checkup_biennial", frequency: "biennial", priority: "required", startAge: 45 },
      { name: "Endoscopia digestiva alta", category: "checkup_biennial", frequency: "biennial", priority: "required" },

      // Exames a cada 3-5 anos
      { name: "Tomografia/Angiotomografia coronariana", category: "checkup_3_5_years", frequency: "quinquennial", priority: "recommended" },
      { name: "Ressonância magnética cerebral", category: "checkup_3_5_years", frequency: "quinquennial", priority: "recommended", startAge: 40 },

      // Rastreamento de Câncer
      { name: "PSA total e livre", category: "cancer_screening", frequency: "annual", priority: "required", gender: "male", startAge: 40 },
      { name: "TOQUE RETAL", category: "cancer_screening", frequency: "annual", priority: "required", gender: "male", startAge: 45 },
      { name: "Mapeamento de pele", category: "cancer_screening", frequency: "annual", priority: "required" },

      // Marcadores Avançados de Longevidade (Alta Prioridade)
      { name: "Apolipoproteína B (ApoB)", category: "longevity_advanced", frequency: "annual", priority: "recommended" },
      { name: "Lipoproteína (a) - Lp(a)", category: "longevity_advanced", frequency: "once", priority: "recommended" },
      { name: "LDL-P (número de partículas)", category: "longevity_advanced", frequency: "annual", priority: "recommended" },
      { name: "PCR ultra-sensível", category: "longevity_advanced", frequency: "annual", priority: "recommended" },
      { name: "Homocisteína", category: "longevity_advanced", frequency: "annual", priority: "recommended" },
      { name: "Vitamina D", category: "longevity_advanced", frequency: "annual", priority: "recommended" },
      { name: "Ferritina", category: "longevity_advanced", frequency: "annual", priority: "recommended" },
      { name: "Insulina em jejum", category: "longevity_advanced", frequency: "annual", priority: "recommended" },
      { name: "Testosterona total e livre", category: "longevity_advanced", frequency: "annual", priority: "recommended" },
      { name: "SHBG", category: "longevity_advanced", frequency: "annual", priority: "recommended" },
      { name: "Estradiol", category: "longevity_advanced", frequency: "annual", priority: "recommended" },
      { name: "Cortisol", category: "longevity_advanced", frequency: "annual", priority: "recommended" },

      // Marcadores Adicionais (Opcionais)
      { name: "LDL oxidado (oxLDL)", category: "longevity_optional", frequency: "annual", priority: "optional" },
      { name: "Fosfolipídios oxidados (oxPL)", category: "longevity_optional", frequency: "annual", priority: "optional" },
      { name: "Fibrinogênio", category: "longevity_optional", frequency: "annual", priority: "optional" },
      { name: "Lp-PLA2", category: "longevity_optional", frequency: "annual", priority: "optional" },
      { name: "ADMA e SDMA", category: "longevity_optional", frequency: "annual", priority: "optional" },
      { name: "IL-6 e TNF-alfa", category: "longevity_optional", frequency: "annual", priority: "optional" },
      { name: "Genótipo APOE", category: "longevity_optional", frequency: "once", priority: "optional" },

      // Saúde Metabólica
      { name: "GGT", category: "metabolic", frequency: "annual", priority: "recommended" },
      { name: "Fosfatase alcalina", category: "metabolic", frequency: "annual", priority: "recommended" },
      { name: "Bilirrubinas", category: "metabolic", frequency: "annual", priority: "recommended" },
      { name: "Teste Oral de Tolerância à Glicose", category: "metabolic", frequency: "annual", priority: "recommended" },

      // Saúde Ocular
      { name: "Oftalmologista (tonometria, fundo)", category: "ocular", frequency: "annual", priority: "required" },

      // Saúde Bucal
      { name: "Dentista + limpeza", category: "dental", frequency: "semi_annual", priority: "required" },
    ];

    for (const exam of exams) {
      await ctx.db.insert("exams", exam);
    }

    return { count: exams.length };
  },
});

// Get all exams
export const getExams = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.category) {
      return await ctx.db
        .query("exams")
        .filter((q) => q.eq(q.field("category"), args.category))
        .collect();
    }
    return await ctx.db.query("exams").collect();
  },
});

// Get exam by ID
export const getExamById = query({
  args: { examId: v.id("exams") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.examId);
  },
});

// Get all exam results
export const getExamResults = query({
  handler: async (ctx) => {
    const results = await ctx.db.query("examResults").order("desc").take(100);
    const enriched = [];
    for (const result of results) {
      const exam = await ctx.db.get(result.examId);
      enriched.push({ ...result, exam });
    }
    return enriched;
  },
});

// Get upcoming/overdue exams
export const getUpcomingExams = query({
  handler: async (ctx) => {
    const now = Date.now();
    const results = await ctx.db
      .query("examResults")
      .filter((q) => q.lte(q.field("nextDueDate"), now))
      .collect();
    
    const enriched = [];
    for (const result of results) {
      const exam = await ctx.db.get(result.examId);
      enriched.push({ ...result, exam });
    }
    return enriched;
  },
});

// Add exam result
export const addExamResult = mutation({
  args: {
    examId: v.id("exams"),
    examDate: v.number(),
    values: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const exam = await ctx.db.get(args.examId);
    if (!exam) throw new Error("Exam not found");

    // Calculate next due date based on frequency
    const frequencyMap: Record<string, number> = {
      semi_annual: 1000 * 60 * 60 * 24 * 180, // 6 months
      annual: 1000 * 60 * 60 * 24 * 365, // 1 year
      biennial: 1000 * 60 * 60 * 24 * 365 * 2, // 2 years
      triennial: 1000 * 60 * 60 * 24 * 365 * 3, // 3 years
      quinquennial: 1000 * 60 * 60 * 24 * 365 * 5, // 5 years
      once: 1000 * 60 * 60 * 24 * 365 * 100, // 100 years (essentially never)
    };

    const duration = frequencyMap[exam.frequency] || frequencyMap.annual;
    const nextDueDate = args.examDate + duration;

    return await ctx.db.insert("examResults", {
      examId: args.examId,
      examDate: args.examDate,
      nextDueDate,
      values: args.values,
      notes: args.notes,
      status: "completed",
    });
  },
});
