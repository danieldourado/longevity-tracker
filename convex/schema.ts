import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Exam templates - based on PLANO_DE_LONGEVIDADE.md
  exams: defineTable({
    name: v.string(),
    category: v.union(
      v.literal("checkup_base"),
      v.literal("checkup_biennial"),
      v.literal("checkup_3_5_years"),
      v.literal("cancer_screening"),
      v.literal("longevity_advanced"),
      v.literal("longevity_optional"),
      v.literal("metabolic"),
      v.literal("ocular"),
      v.literal("dental")
    ),
    frequency: v.union(
      v.literal("annual"),
      v.literal("biennial"),
      v.literal("triennial"),
      v.literal("quinquennial"),
      v.literal("once"),
      v.literal("semi_annual")
    ),
    priority: v.union(v.literal("required"), v.literal("recommended"), v.literal("optional")),
    description: v.optional(v.string()),
    unit: v.optional(v.string()),
    normalRange: v.optional(v.string()),
    startAge: v.optional(v.number()),
    gender: v.optional(v.union(v.literal("male"), v.literal("female"), v.literal("both"))),
  }),

  // Exam results - user's actual exam data
  examResults: defineTable({
    examId: v.id("exams"),
    examDate: v.number(), // Unix timestamp
    nextDueDate: v.number(), // Calculated based on frequency
    values: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.union(v.literal("completed"), v.literal("pending")),
  })
    .index("by_exam", ["examId"])
    .index("by_date", ["examDate"])
    .index("by_next_due", ["nextDueDate"]),

  // User profile for age-based calculations
  userProfile: defineTable({
    birthDate: v.optional(v.number()),
    gender: v.optional(v.union(v.literal("male"), v.literal("female"))),
    familyHistory: v.optional(v.array(v.string())),
  }),
});
