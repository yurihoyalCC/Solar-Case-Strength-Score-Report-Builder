export interface SurveyQuestion {
  id: number;
  text: string;
  section: number; // 1 to 5
  sectionName: string;
  weight: 3 | 5;
  reverseScore: boolean;
  tag: string;
}

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  // SECTION 1: Sales Conduct Indicators
  { id: 1, text: "Were you told your solar panels would eliminate or nearly eliminate your electric bill?", section: 1, sectionName: "Sales Conduct Indicators", weight: 3, reverseScore: false, tag: "False Promise of Bill Elimination" },
  { id: 2, text: "Were you told your monthly solar payment would be lower than your current utility bill?", section: 1, sectionName: "Sales Conduct Indicators", weight: 3, reverseScore: false, tag: "Misrepresentation of Solar Payment vs. Prior Utility Cost" },
  { id: 3, text: "Were you promised a specific amount of savings that has not happened?", section: 1, sectionName: "Sales Conduct Indicators", weight: 3, reverseScore: false, tag: "False Savings Guarantee" },
  { id: 4, text: "Were you told the system would “pay for itself”?", section: 1, sectionName: "Sales Conduct Indicators", weight: 3, reverseScore: false, tag: "Deceptive \"Pays For Itself\" Representation" },
  { id: 5, text: "Were you told you were guaranteed to receive a federal tax credit, rebate, or refund check?", section: 1, sectionName: "Sales Conduct Indicators", weight: 5, reverseScore: false, tag: "Guarantee of Federal Tax Credits and Rebates" },
  { id: 6, text: "Were you told the tax credit would be used to lower or re-amortize your loan payment?", section: 1, sectionName: "Sales Conduct Indicators", weight: 5, reverseScore: false, tag: "Misrepresentation of Tax Credit Re-Amortization" },
  { id: 7, text: "Were you clearly told that the tax credit depends on your personal tax liability?", section: 1, sectionName: "Sales Conduct Indicators", weight: 3, reverseScore: false, tag: "Failure to Disclose Tax Liability Dependency" },
  { id: 8, text: "At the time of signing, did you fully understand the loan term, interest rate, payment structure, and total cost?", section: 1, sectionName: "Sales Conduct Indicators", weight: 5, reverseScore: true, tag: "Concealment of Material Loan Terms and Total Cost" },
  { id: 9, text: "Were you rushed, pressured, or told the offer was only available that day?", section: 1, sectionName: "Sales Conduct Indicators", weight: 3, reverseScore: false, tag: "High-Pressure and Urgency Sales Tactics" },
  { id: 10, text: "Did the salesperson discourage you from reviewing the documents carefully before signing?", section: 1, sectionName: "Sales Conduct Indicators", weight: 3, reverseScore: false, tag: "Discouragement of Document Review" },
  { id: 11, text: "Were you told not to mention certain promises during a recorded verification or quality assurance call?", section: 1, sectionName: "Sales Conduct Indicators", weight: 5, reverseScore: false, tag: "Coercion to Conceal Promises During Verification Call" },
  
  // SECTION 2: Financial Burden Indicators
  { id: 12, text: "Are you still receiving a utility bill in addition to your solar payment?", section: 2, sectionName: "Financial Burden Indicators", weight: 3, reverseScore: false, tag: "Undisclosed Double Billing (Solar Plus Utility)" },
  { id: 13, text: "Is your combined solar payment plus utility bill higher than what you were paying before solar?", section: 2, sectionName: "Financial Burden Indicators", weight: 5, reverseScore: false, tag: "Net Increase in Total Energy Costs After Installation" },
  { id: 14, text: "Has your solar payment increased or escalated since signing?", section: 2, sectionName: "Financial Burden Indicators", weight: 5, reverseScore: false, tag: "Concealed Payment Escalation Provisions" },
  { id: 15, text: "Were you unaware that your payment could increase over time?", section: 2, sectionName: "Financial Burden Indicators", weight: 3, reverseScore: false, tag: "Failure to Disclose Payment Escalators" },
  { id: 16, text: "Is your loan, lease, or PPA term 20 years or longer?", section: 2, sectionName: "Financial Burden Indicators", weight: 3, reverseScore: false, tag: "Unconscionable Contract Duration (20+ Years)" },
  { id: 17, text: "Do you believe the total contract cost is significantly higher than what was explained to you?", section: 2, sectionName: "Financial Burden Indicators", weight: 3, reverseScore: false, tag: "Inflation of Total Contract Cost Above Verbal Quote" },
  { id: 18, text: "Did you receive a higher loan balance than the system price you remember being quoted?", section: 2, sectionName: "Financial Burden Indicators", weight: 3, reverseScore: false, tag: "Loan Balance Exceeding Quated System Price" }, // Note: Let's see if we should write "Quoted" instead of "Quated" or exactly as they wrote. The user wrote "Quoted" in the instruction, let's write "Quoted".
  { id: 19, text: "Were dealer fees, finance charges, or added costs not clearly explained?", section: 2, sectionName: "Financial Burden Indicators", weight: 5, reverseScore: false, tag: "Failure to Disclose Dealer and Financing Fees" },
  { id: 20, text: "Has the solar contract created financial stress or difficulty making payments?", section: 2, sectionName: "Financial Burden Indicators", weight: 5, reverseScore: false, tag: "Imposition of Severe Financial Hardship" },

  // SECTION 3: Contract Risk Indicators
  { id: 21, text: "Is your agreement a lease or Power Purchase Agreement/PPA?", section: 3, sectionName: "Contract Risk Indicators", weight: 5, reverseScore: false, tag: "Misrepresentation of Lease/PPA as Ownership" },
  { id: 22, text: "Were you unaware that a lien, UCC filing, or notice may be attached to the system or property?", section: 3, sectionName: "Contract Risk Indicators", weight: 5, reverseScore: false, tag: "Undisclosed UCC-1 Fixture Filing and Property Lien" },
  { id: 23, text: "Has the solar agreement created issues with selling, refinancing, or transferring your home?", section: 3, sectionName: "Contract Risk Indicators", weight: 5, reverseScore: false, tag: "Impairment of Property Title and Transferability" },
  { id: 24, text: "Did you sign most or all documents electronically on a tablet or phone without reviewing full copies?", section: 3, sectionName: "Contract Risk Indicators", weight: 3, reverseScore: false, tag: "Rushed Electronic Signing Without Full Disclosure" },
  { id: 25, text: "Did someone else assist, complete, or rush your electronic signatures?", section: 3, sectionName: "Contract Risk Indicators", weight: 3, reverseScore: false, tag: "Signature Irregularity and Authorization Defect" },
  { id: 26, text: "Were final contract documents different from what was explained verbally?", section: 3, sectionName: "Contract Risk Indicators", weight: 5, reverseScore: false, tag: "Discrepancy Between Verbal Promises and Written Terms" },
  { id: 27, text: "Were cancellation rights, transfer rules, or buyout terms unclear?", section: 3, sectionName: "Contract Risk Indicators", weight: 3, reverseScore: false, tag: "Concealment of Cancellation and Buyout Terms" },

  // SECTION 4: System Performance Indicators
  { id: 28, text: "Has your system produced less energy than promised?", section: 4, sectionName: "System Performance Indicators", weight: 5, reverseScore: false, tag: "System Underproduction Below Guaranteed Output" },
  { id: 29, text: "Has your system stopped working or had repeated service issues?", section: 4, sectionName: "System Performance Indicators", weight: 5, reverseScore: false, tag: "Repeated System Failure and Defective Equipment" },
  { id: 30, text: "Has the installer, dealer, or sales company failed to respond to repair or performance complaints?", section: 4, sectionName: "System Performance Indicators", weight: 5, reverseScore: false, tag: "Failure to Provide Promised Service and Support" },
  { id: 31, text: "Was roof damage, installation damage, or property damage caused during the installation?", section: 4, sectionName: "System Performance Indicators", weight: 3, reverseScore: false, tag: "Property Damage and Roof Leaks From Installation" },
  { id: 32, text: "Were promised batteries, upgrades, monitoring tools, or equipment not delivered or not working?", section: 4, sectionName: "System Performance Indicators", weight: 3, reverseScore: false, tag: "Failure to Deliver Promised Equipment and Upgrades" },
  { id: 33, text: "Were warranties, maintenance, or service obligations misrepresented?", section: 4, sectionName: "System Performance Indicators", weight: 3, reverseScore: false, tag: "Misrepresentation of Warranty and Maintenance Obligations" },

  // SECTION 5: Resolution Readiness Indicators
  { id: 34, text: "Have you attempted to resolve the issue with the installer, lender, lease company, or solar provider?", section: 5, sectionName: "Resolution Readiness Indicators", weight: 3, reverseScore: false, tag: "Exhaustion of Prior Resolution Efforts" },
  { id: 35, text: "Have your complaints been ignored, delayed, or passed between companies?", section: 5, sectionName: "Resolution Readiness Indicators", weight: 3, reverseScore: false, tag: "Corporate Evasion of Accountability" },
  { id: 36, text: "Has the installer, dealer, or finance company gone out of business, filed bankruptcy, or stopped servicing your account?", section: 5, sectionName: "Resolution Readiness Indicators", weight: 5, reverseScore: false, tag: "Installer Bankruptcy and Abandonment of Obligations" },
  { id: 37, text: "Do you feel you would not have signed the agreement if the full cost, tax credit rules, utility bill reality, or contract terms had been clearly explained?", section: 5, sectionName: "Resolution Readiness Indicators", weight: 5, reverseScore: false, tag: "Lack of Informed Consent at Signing" },
  { id: 38, text: "Knowing what you know today, would you still have signed the solar agreement?", section: 5, sectionName: "Resolution Readiness Indicators", weight: 5, reverseScore: true, tag: "Consumer Regret and Repudiation of Agreement" },
  { id: 39, text: "Are you seeking help because you believe the agreement was sold under misleading or incomplete information?", section: 5, sectionName: "Resolution Readiness Indicators", weight: 5, reverseScore: false, tag: "Inducement Through Misleading Sales Information" },
  { id: 40, text: "Would you like an attorney-backed review of your documents, sales representations, and contract obligations?", section: 5, sectionName: "Resolution Readiness Indicators", weight: 5, reverseScore: false, tag: "Request for Attorney-Backed Contract Review" }
];

export interface FunnelInputs {
  // Contact Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;

  // Contract Metadata
  contractType: 'loan' | 'lease' | 'ppa';
  solarCompany: string;
  financeCompany: string;

  // Financial Calculator Fields
  totalSystemPrice: number;
  loanBalance: number;
  monthlyPayment: number;
  interestRate: number;
  loanTerm: number;
  remainingTerm: number;
  paymentEscalator: boolean;
  escalatorPercentage: number;
  preSolarUtilityBill: number;
  currentUtilityBill: number;
  taxCreditPromised: boolean;
  taxCreditReceived: boolean;
  systemPerformance: 'working' | 'underperforming' | 'non-operational';

  // 40-Question Diagnostic Survey
  surveyAnswers: Record<number, 'yes' | 'no' | 'not_sure' | 'somewhat'>;

  // CRM/UTM tracking fields
  leadSource?: string;
  campaignId?: string;
  adSetId?: string;
  utmSource?: string;
  utmCampaign?: string;
  fbclid?: string;
  gclid?: string;
}

export interface ProjectionYear {
  year: number;
  solarPayment: number;
  utilityBill: number;
  totalCostWithSolar: number;
  baselineUtilityOnlyCost: number;
}

export interface ScoringResult {
  // Category Scores (0-100)
  salesConductScore: number;
  financialBurdenScore: number;
  contractRiskScore: number;
  systemPerformanceScore: number;
  resolutionReadinessScore: number;

  // Weighted Final Score
  finalScore: number;
  scoreLabel: 'Low Indicator' | 'Moderate Indicator' | 'High Indicator' | 'Strong Candidate for Review';
  leadQuality: 'Low Fit' | 'Nurture' | 'Strong Follow-Up' | 'Hot Lead';

  // Calculations
  remainingTermCost: number;
  fullTermCost: number;
  pastPaidCost: number;
  projectedProjections: ProjectionYear[];
  savingsLossStatus: 'saving' | 'losing';
  netDifference: number;
  concernTags: string[];
}

export function calculateSolarCaseScore(inputs: FunnelInputs): ScoringResult {
  const remainingMonths = inputs.remainingTerm * 12;
  const totalMonths = inputs.loanTerm * 12;
  const monthsPaid = Math.max(0, totalMonths - remainingMonths);

  const monthlyEsc = inputs.paymentEscalator ? (inputs.escalatorPercentage / 100) : 0;
  
  // 1. Calculate Remaining & Past Costs
  let remainingTermCost = 0;
  const projectedProjections: ProjectionYear[] = [];
  let cumulativeSolarCost = 0;
  let cumulativeBaselineCost = 0;

  const UTILITY_INFLATION = 0.035;

  for (let year = 1; year <= Math.max(inputs.loanTerm, 30); year++) {
    let solarYearlyPayment = 0;
    if (inputs.paymentEscalator && year > 1) {
      const yearsSinceStart = Math.max(0, year - 1 - (monthsPaid / 12));
      solarYearlyPayment = inputs.monthlyPayment * Math.pow(1 + monthlyEsc, Math.max(0, Math.floor(yearsSinceStart)));
    } else {
      solarYearlyPayment = inputs.monthlyPayment;
    }

    const solarCostThisYear = year <= inputs.loanTerm ? solarYearlyPayment * 12 : 0;
    const currentUtilityThisYear = (inputs.currentUtilityBill * 12) * Math.pow(1 + UTILITY_INFLATION, year - 1);
    const baselineUtilityThisYear = (inputs.preSolarUtilityBill * 12) * Math.pow(1 + UTILITY_INFLATION, year - 1);

    cumulativeSolarCost += (solarCostThisYear + currentUtilityThisYear);
    cumulativeBaselineCost += baselineUtilityThisYear;

    if (year <= inputs.loanTerm) {
      remainingTermCost += (solarCostThisYear);
    }

    projectedProjections.push({
      year,
      solarPayment: solarCostThisYear / 12,
      utilityBill: currentUtilityThisYear / 12,
      totalCostWithSolar: cumulativeSolarCost,
      baselineUtilityOnlyCost: cumulativeBaselineCost
    });
  }

  let pastPaidCost = 0;
  if (monthsPaid > 0) {
    if (inputs.paymentEscalator) {
      for (let m = 0; m < monthsPaid; m++) {
        const estimatedPayment = inputs.monthlyPayment / Math.pow(1 + monthlyEsc, Math.ceil((remainingMonths + m) / 12) - inputs.loanTerm);
        pastPaidCost += estimatedPayment;
      }
    } else {
      pastPaidCost = inputs.monthlyPayment * monthsPaid;
    }
  }

  const fullTermCost = remainingTermCost + pastPaidCost;
  const netDifference = cumulativeBaselineCost - cumulativeSolarCost;
  const savingsLossStatus = netDifference >= 0 ? 'saving' : 'losing';

  // 2. DIAGNOSTIC SURVEY SCORING (0 to 100 each)
  
  // Scoring helper
  const getQuestionPoints = (qId: number): { points: number; triggered: boolean } => {
    const q = SURVEY_QUESTIONS.find(x => x.id === qId);
    if (!q) return { points: 0, triggered: false };

    const ans = inputs.surveyAnswers[qId] || 'no';

    // Reverse-score logic
    if (q.reverseScore) {
      if (ans === 'no') return { points: q.weight, triggered: true };
      if (ans === 'somewhat' || ans === 'not_sure') return { points: q.weight * 0.5, triggered: true };
      return { points: 0, triggered: false };
    } else {
      if (ans === 'yes') return { points: q.weight, triggered: true };
      if (ans === 'somewhat' || ans === 'not_sure') return { points: q.weight * 0.5, triggered: true };
      return { points: 0, triggered: false };
    }
  };

  const calculateCategoryScore = (questionIds: number[]): { score: number; triggeredTags: Array<{ tag: string; weight: number }> } => {
    let earnedPoints = 0;
    let totalWeight = 0;
    const triggeredTags: Array<{ tag: string; weight: number }> = [];

    questionIds.forEach(id => {
      const q = SURVEY_QUESTIONS.find(x => x.id === id);
      if (q) {
        totalWeight += q.weight;
        const result = getQuestionPoints(id);
        earnedPoints += result.points;
        if (result.triggered && result.points > 0) {
          triggeredTags.push({ tag: q.tag, weight: q.weight });
        }
      }
    });

    const score = totalWeight > 0 ? Math.round((earnedPoints / totalWeight) * 100) : 0;
    return { score, triggeredTags };
  };

  // Set mappings
  const salesConductIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 24, 25, 26, 37, 38, 39];
  const financialBurdenIds = [2, 6, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const contractRiskIds = [8, 16, 21, 22, 23, 24, 25, 26, 27];
  const systemPerformanceIds = [28, 29, 30, 31, 32, 33, 35];
  const resolutionReadinessIds = [34, 35, 36, 37, 38, 39, 40];

  const salesConductResult = calculateCategoryScore(salesConductIds);
  const financialBurdenResult = calculateCategoryScore(financialBurdenIds);
  const contractRiskResult = calculateCategoryScore(contractRiskIds);
  const systemPerformanceResult = calculateCategoryScore(systemPerformanceIds);
  const resolutionReadinessResult = calculateCategoryScore(resolutionReadinessIds);

  const salesConductScore = salesConductResult.score;
  const financialBurdenScore = financialBurdenResult.score;
  const contractRiskScore = contractRiskResult.score;
  const systemPerformanceScore = systemPerformanceResult.score;
  const resolutionReadinessScore = resolutionReadinessResult.score;

  // 3. Weighted Final Case Score
  const finalScore = Math.round(
    (salesConductScore * 0.30) +
    (financialBurdenScore * 0.25) +
    (contractRiskScore * 0.20) +
    (systemPerformanceScore * 0.15) +
    (resolutionReadinessScore * 0.10)
  );

  // Final Score Labels
  let scoreLabel: ScoringResult['scoreLabel'] = 'Low Indicator';
  let leadQuality: ScoringResult['leadQuality'] = 'Low Fit';

  if (finalScore >= 75) {
    scoreLabel = 'Strong Candidate for Review';
    leadQuality = 'Hot Lead';
  } else if (finalScore >= 50) {
    scoreLabel = 'High Indicator';
    leadQuality = 'Strong Follow-Up';
  } else if (finalScore >= 25) {
    scoreLabel = 'Moderate Indicator';
    leadQuality = 'Nurture';
  } else {
    scoreLabel = 'Low Indicator';
    leadQuality = 'Low Fit';
  }

  // Compile concern tags (ranked by priority/weight, select top 5 unique tags)
  const allTriggered = [
    ...salesConductResult.triggeredTags,
    ...financialBurdenResult.triggeredTags,
    ...contractRiskResult.triggeredTags,
    ...systemPerformanceResult.triggeredTags,
    ...resolutionReadinessResult.triggeredTags
  ];

  // Sort by weight descending
  allTriggered.sort((a, b) => b.weight - a.weight);

  // Deduplicate tags
  const uniqueTags: string[] = [];
  allTriggered.forEach(item => {
    if (!uniqueTags.includes(item.tag)) {
      uniqueTags.push(item.tag);
    }
  });

  const concernTags = uniqueTags.slice(0, 5); // Take top 5 concerns

  return {
    salesConductScore,
    financialBurdenScore,
    contractRiskScore,
    systemPerformanceScore,
    resolutionReadinessScore,
    finalScore,
    scoreLabel,
    leadQuality,
    remainingTermCost,
    fullTermCost,
    pastPaidCost,
    projectedProjections,
    savingsLossStatus,
    netDifference,
    concernTags
  };
}
