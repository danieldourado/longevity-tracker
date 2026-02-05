"use client";

import { ReactNode, createContext, useContext, useState, useEffect } from "react";

// Mock data based on health exam plan with Grokipedia content
const mockExams = [
  { 
    _id: "1", 
    name: "Complete Blood Count", 
    category: "checkup_base", 
    frequency: "annual", 
    priority: "required",
    grokipediaUrl: "https://grokipedia.com/page/Complete_blood_count",
    description: "A complete blood count (CBC) is a common laboratory test that evaluates overall health by measuring the number, size, and proportions of various blood cells, including red blood cells, white blood cells, and platelets. It helps detect anemia, infections, inflammation, and blood cancers.",
    normalRange: "RBC: 4.2-5.9 million/μL, Hemoglobin: 12-18 g/dL, Hematocrit: 36-54%, WBC: 4,500-11,000/μL, Platelets: 150,000-400,000/μL"
  },
  { 
    _id: "2", 
    name: "Fasting Blood Glucose", 
    category: "checkup_base", 
    frequency: "annual", 
    priority: "required",
    grokipediaUrl: "https://grokipedia.com/page/Random_glucose_test",
    description: "Fasting blood glucose measures the amount of glucose in your blood after you haven't eaten for at least eight hours. It's a fundamental test used to screen for and monitor diabetes, offering critical insights into how well your body is regulating blood sugar.",
    normalRange: "70-100 mg/dL (normal), 100-125 mg/dL (prediabetes), >126 mg/dL (diabetes)"
  },
  { 
    _id: "3", 
    name: "HbA1c", 
    category: "checkup_base", 
    frequency: "annual", 
    priority: "required",
    grokipediaUrl: "https://grokipedia.com/page/Diabetes_management",
    description: "Hemoglobin A1c (HbA1c) is a blood test that measures your average blood sugar level over the past 2-3 months. It reflects the percentage of hemoglobin proteins that have glucose attached to them, providing a long-term view of blood glucose control.",
    normalRange: "<5.7% (normal), 5.7-6.4% (prediabetes), ≥6.5% (diabetes)"
  },
  { 
    _id: "4", 
    name: "Complete Lipid Profile", 
    category: "checkup_base", 
    frequency: "annual", 
    priority: "required",
    grokipediaUrl: "https://grokipedia.com/page/Lipoprotein(a)",
    description: "A lipid profile measures the amount of cholesterol and other fats in your blood, including total cholesterol, LDL ('bad') cholesterol, HDL ('good') cholesterol, and triglycerides. This panel helps predict your risk for heart disease and stroke.",
    normalRange: "Total Cholesterol: <200 mg/dL, LDL: <100 mg/dL, HDL: >40 mg/dL (men), >50 mg/dL (women), Triglycerides: <150 mg/dL"
  },
  { 
    _id: "5", 
    name: "Creatinine and Urea", 
    category: "checkup_base", 
    frequency: "annual", 
    priority: "required",
    grokipediaUrl: "https://grokipedia.com/page/Creatinine",
    description: "Creatinine is a chemical waste product derived from muscle metabolism that the kidneys filter from the blood. Measuring creatinine and urea levels helps assess kidney function and detect kidney disease.",
    normalRange: "Creatinine: 0.7-1.3 mg/dL (men), 0.6-1.1 mg/dL (women), BUN: 7-20 mg/dL"
  },
  { _id: "6", name: "TSH and Free T4", category: "checkup_base", frequency: "annual", priority: "required", description: "Thyroid function tests measure thyroid-stimulating hormone (TSH) and free thyroxine (T4) to evaluate thyroid gland function and detect hypothyroidism or hyperthyroidism.", normalRange: "TSH: 0.4-4.0 mIU/L, Free T4: 0.8-1.8 ng/dL" },
  { _id: "7", name: "AST and ALT", category: "checkup_base", frequency: "annual", priority: "required", description: "Liver enzymes AST and ALT are measured to assess liver function and detect liver damage or disease.", normalRange: "AST: 10-40 U/L, ALT: 7-56 U/L" },
  { _id: "8", name: "Uric Acid", category: "checkup_base", frequency: "annual", priority: "required", description: "Uric acid is a waste product from purine metabolism. High levels can indicate gout or kidney problems.", normalRange: "3.5-7.2 mg/dL (men), 2.6-6.0 mg/dL (women)" },
  { _id: "9", name: "Electrocardiogram (ECG)", category: "checkup_base", frequency: "annual", priority: "required", description: "ECG records the electrical activity of the heart to detect arrhythmias, heart disease, and other cardiac conditions." },
  { _id: "10", name: "Cardiologist Consultation", category: "checkup_base", frequency: "annual", priority: "required", description: "Annual consultation with a cardiologist to assess cardiovascular health and risk factors." },
  { _id: "11", name: "General Practitioner Consultation", category: "checkup_base", frequency: "annual", priority: "required", description: "Annual checkup with a primary care physician for overall health assessment." },
  { _id: "12", name: "Echocardiogram", category: "checkup_biennial", frequency: "biennial", priority: "required", description: "Ultrasound imaging of the heart to evaluate heart structure and function, including chambers, valves, and blood flow." },
  { _id: "13", name: "Stress Test", category: "checkup_biennial", frequency: "biennial", priority: "required", description: "Exercise stress test to evaluate how the heart performs during physical activity and detect coronary artery disease." },
  { _id: "14", name: "Bone Densitometry", category: "checkup_biennial", frequency: "biennial", priority: "required", description: "DEXA scan to measure bone mineral density and assess osteoporosis risk." },
  { _id: "15", name: "Colonoscopy", category: "checkup_biennial", frequency: "biennial", priority: "required", startAge: 45, description: "Endoscopic examination of the colon to detect polyps, cancer, and other abnormalities." },
  { _id: "16", name: "Upper Endoscopy", category: "checkup_biennial", frequency: "biennial", priority: "required", description: "Examination of the upper digestive tract including esophagus, stomach, and duodenum." },
  { _id: "17", name: "CT Coronary Angiography", category: "checkup_3_5_years", frequency: "quinquennial", priority: "recommended", description: "CT scan to visualize coronary arteries and assess for plaque buildup and stenosis." },
  { _id: "18", name: "Brain MRI", category: "checkup_3_5_years", frequency: "quinquennial", priority: "recommended", startAge: 40, description: "Magnetic resonance imaging of the brain to detect tumors, strokes, and neurodegenerative changes." },
  { _id: "19", name: "PSA Total and Free", category: "cancer_screening", frequency: "annual", priority: "required", gender: "male", startAge: 40, description: "Prostate-specific antigen test to screen for prostate cancer and monitor prostate health." },
  { _id: "20", name: "Digital Rectal Exam", category: "cancer_screening", frequency: "annual", priority: "required", gender: "male", startAge: 45, description: "Physical examination to detect abnormalities in the prostate and rectum." },
  { _id: "21", name: "Dermatologist Skin Mapping", category: "cancer_screening", frequency: "annual", priority: "required", description: "Full-body skin examination to detect melanoma and other skin cancers." },
  { 
    _id: "22", 
    name: "Apolipoprotein B (ApoB)", 
    category: "longevity_advanced", 
    frequency: "annual", 
    priority: "recommended",
    grokipediaUrl: "https://grokipedia.com/page/Lipoprotein(a)",
    description: "ApoB is the primary protein component of LDL cholesterol and other atherogenic particles. Measuring ApoB provides a more accurate assessment of cardiovascular risk than LDL-C alone, as each atherogenic particle contains one ApoB molecule.",
    normalRange: "<90 mg/dL (optimal), 90-120 mg/dL (borderline), >120 mg/dL (high risk)"
  },
  { 
    _id: "23", 
    name: "Lipoprotein(a) - Lp(a)", 
    category: "longevity_advanced", 
    frequency: "once", 
    priority: "recommended",
    grokipediaUrl: "https://grokipedia.com/page/Lipoprotein(a)",
    description: "Lipoprotein(a) is a genetically inherited lipoprotein particle consisting of an LDL-like core linked to apolipoprotein(a). It's an independent risk factor for atherosclerotic cardiovascular disease, including coronary artery disease and stroke.",
    normalRange: "<30 mg/dL (normal), 30-50 mg/dL (borderline), >50 mg/dL (high risk)"
  },
  { _id: "24", name: "LDL-P (Particle Number)", category: "longevity_advanced", frequency: "annual", priority: "recommended", description: "Measures the actual number of LDL particles, which is more predictive of cardiovascular risk than LDL cholesterol concentration alone." },
  { _id: "25", name: "hs-CRP", category: "longevity_advanced", frequency: "annual", priority: "recommended", description: "High-sensitivity C-reactive protein measures low levels of inflammation in the body, a risk factor for cardiovascular disease.", normalRange: "<1.0 mg/L (low risk), 1.0-3.0 mg/L (moderate risk), >3.0 mg/L (high risk)" },
  { _id: "26", name: "Homocysteine", category: "longevity_advanced", frequency: "annual", priority: "recommended", description: "Homocysteine is an amino acid that, when elevated, is associated with increased risk of cardiovascular disease and cognitive decline.", normalRange: "5-15 μmol/L" },
  { _id: "27", name: "Vitamin D", category: "longevity_advanced", frequency: "annual", priority: "recommended", description: "Vitamin D is essential for bone health, immune function, and has been linked to various aspects of longevity and disease prevention.", normalRange: "30-100 ng/mL (sufficient), 20-29 ng/mL (insufficient), <20 ng/mL (deficient)" },
  { _id: "28", name: "Ferritin", category: "longevity_advanced", frequency: "annual", priority: "recommended", description: "Ferritin measures iron stores in the body and can indicate iron deficiency or iron overload conditions.", normalRange: "30-400 ng/mL (men), 15-150 ng/mL (women)" },
  { _id: "29", name: "Fasting Insulin", category: "longevity_advanced", frequency: "annual", priority: "recommended", description: "Fasting insulin levels help assess insulin sensitivity and detect insulin resistance, a precursor to type 2 diabetes.", normalRange: "2.6-24.9 μIU/mL" },
  { _id: "30", name: "Total and Free Testosterone", category: "longevity_advanced", frequency: "annual", priority: "recommended", description: "Testosterone levels are important for muscle mass, bone density, energy levels, and overall vitality in both men and women.", normalRange: "300-1000 ng/dL (men), 15-70 ng/dL (women)" },
  { _id: "31", name: "SHBG", category: "longevity_advanced", frequency: "annual", priority: "recommended", description: "Sex hormone-binding globulin binds to sex hormones and affects their availability. Abnormal levels can indicate hormonal imbalances." },
  { _id: "32", name: "Estradiol", category: "longevity_advanced", frequency: "annual", priority: "recommended", description: "Estradiol is the primary estrogen hormone, important for bone health, cardiovascular health, and metabolic function in both men and women." },
  { _id: "33", name: "Cortisol", category: "longevity_advanced", frequency: "annual", priority: "recommended", description: "Cortisol is the primary stress hormone. Chronic elevation can indicate adrenal dysfunction and contribute to various health problems.", normalRange: "6-23 μg/dL (morning)" },
  { _id: "34", name: "Oxidized LDL (oxLDL)", category: "longevity_optional", frequency: "annual", priority: "optional", description: "Oxidized LDL is a more atherogenic form of LDL cholesterol that promotes inflammation and plaque formation in arteries." },
  { _id: "35", name: "Oxidized Phospholipids (oxPL)", category: "longevity_optional", frequency: "annual", priority: "optional", description: "Oxidized phospholipids are markers of oxidative stress and inflammation associated with cardiovascular disease." },
  { _id: "36", name: "Fibrinogen", category: "longevity_optional", frequency: "annual", priority: "optional", description: "Fibrinogen is a blood clotting factor. Elevated levels are associated with increased cardiovascular risk and inflammation." },
  { _id: "37", name: "Lp-PLA2", category: "longevity_optional", frequency: "annual", priority: "optional", description: "Lipoprotein-associated phospholipase A2 is an enzyme found in atherosclerotic plaques and is a specific marker for vascular inflammation." },
  { _id: "38", name: "ADMA and SDMA", category: "longevity_optional", frequency: "annual", priority: "optional", description: "Asymmetric dimethylarginine and symmetric dimethylarginine are markers of endothelial dysfunction and cardiovascular risk." },
  { _id: "39", name: "IL-6 and TNF-alpha", category: "longevity_optional", frequency: "annual", priority: "optional", description: "Interleukin-6 and tumor necrosis factor-alpha are inflammatory cytokines that play roles in chronic inflammation and aging." },
  { _id: "40", name: "APOE Genotype", category: "longevity_optional", frequency: "once", priority: "optional", description: "APOE genetic testing identifies variants associated with Alzheimer's disease risk and cardiovascular disease." },
  { _id: "41", name: "GGT", category: "metabolic", frequency: "annual", priority: "recommended", description: "Gamma-glutamyl transferase is a liver enzyme that can indicate liver disease and is also associated with oxidative stress.", normalRange: "9-48 U/L" },
  { _id: "42", name: "Alkaline Phosphatase", category: "metabolic", frequency: "annual", priority: "recommended", description: "Alkaline phosphatase is an enzyme found in liver and bone. Elevated levels can indicate liver or bone disorders.", normalRange: "44-147 U/L" },
  { _id: "43", name: "Bilirubin", category: "metabolic", frequency: "annual", priority: "recommended", description: "Bilirubin is a yellow pigment produced during the breakdown of red blood cells. Elevated levels can indicate liver dysfunction or hemolysis.", normalRange: "0.1-1.2 mg/dL" },
  { _id: "44", name: "Oral Glucose Tolerance Test", category: "metabolic", frequency: "annual", priority: "recommended", description: "OGTT measures the body's ability to process glucose over time, providing a more comprehensive assessment than fasting glucose alone." },
  { _id: "45", name: "Ophthalmologist (Tonometry, Fundus)", category: "ocular", frequency: "annual", priority: "required", description: "Comprehensive eye exam including intraocular pressure measurement and retina examination to detect glaucoma and retinal diseases." },
  { _id: "46", name: "Dentist + Cleaning", category: "dental", frequency: "semi_annual", priority: "required", description: "Regular dental checkups and professional cleaning to maintain oral health and detect dental problems early." },
];

interface MockDataContextType {
  exams: typeof mockExams;
  results: any[];
  addResult: (result: any) => void;
}

const MockDataContext = createContext<MockDataContextType>({
  exams: mockExams,
  results: [],
  addResult: () => {},
});

export function MockProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load from localStorage
    const saved = localStorage.getItem("longevity-results");
    if (saved) {
      setResults(JSON.parse(saved));
    }
  }, []);

  const addResult = (result: any) => {
    const newResult = {
      ...result,
      _id: Date.now().toString(),
      exam: mockExams.find(e => e._id === result.examId),
    };
    const updated = [newResult, ...results];
    setResults(updated);
    localStorage.setItem("longevity-results", JSON.stringify(updated));
  };

  if (!isClient) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  return (
    <MockDataContext.Provider value={{ exams: mockExams, results, addResult }}>
      {children}
    </MockDataContext.Provider>
  );
}

export function useQuery(queryFn: any, args?: any) {
  const { exams, results } = useContext(MockDataContext);
  
  if (queryFn === api.exams.getExams) {
    return exams;
  }
  if (queryFn === api.exams.getExamResults) {
    return results;
  }
  if (queryFn === api.exams.getUpcomingExams) {
    const now = Date.now();
    return results.filter((r: any) => r.nextDueDate < now);
  }
  return [];
}

export function useMutation(mutationFn: any) {
  const { addResult } = useContext(MockDataContext);
  
  if (mutationFn === api.exams.addExamResult) {
    return async (args: any) => {
      const exam = mockExams.find(e => e._id === args.examId);
      const frequencyMap: Record<string, number> = {
        semi_annual: 1000 * 60 * 60 * 24 * 180,
        annual: 1000 * 60 * 60 * 24 * 365,
        biennial: 1000 * 60 * 60 * 24 * 365 * 2,
        triennial: 1000 * 60 * 60 * 24 * 365 * 3,
        quinquennial: 1000 * 60 * 60 * 24 * 365 * 5,
        once: 1000 * 60 * 60 * 24 * 365 * 100,
      };
      const duration = frequencyMap[exam?.frequency || 'annual'];
      addResult({
        ...args,
        nextDueDate: args.examDate + duration,
        status: "completed",
      });
    };
  }
  return async () => {};
}

export const api = {
  exams: {
    getExams: "getExams" as any,
    getExamResults: "getExamResults" as any,
    getUpcomingExams: "getUpcomingExams" as any,
    addExamResult: "addExamResult" as any,
  },
};
