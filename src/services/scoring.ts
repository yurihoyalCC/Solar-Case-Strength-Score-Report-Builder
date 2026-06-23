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
  { id: 18, text: "Did you receive a higher loan balance than the system price you remember being quoted?", section: 2, sectionName: "Financial Burden Indicators", weight: 3, reverseScore: false, tag: "Loan Balance Exceeding Quoted System Price" },
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

export const RECOMMENDED_ACTIONS: Record<string, string> = {
  "False Promise of Bill Elimination": "File a formal complaint with the FTC and your State Attorney General documenting the specific verbal representation that the system would eliminate your utility bills. Preserve all marketing materials, text messages, and recorded calls in which this promise was made, alongside post-installation utility statements that disprove it. Submit a written demand to the seller and finance company under the FTC Holder Rule (16 C.F.R. §433) asserting the deceptive inducement and requesting contract rescission and restitution within a stated deadline.",
  "Misrepresentation of Solar Payment vs. Prior Utility Cost": "Compile a side-by-side comparison of your pre-solar utility costs against the solar payment plus any remaining utility charges to document the cost increase. Submit this comparison to the CFPB and your State Attorney General as evidence of deceptive payment representations under the FTC Act §5. Send a written demand to the finance company invoking the Holder Rule, citing the specific quoted figure versus actual costs, and request remediation within a defined timeframe.",
  "False Savings Guarantee": "Gather the written or verbal savings figure promised at point of sale and document actual realized savings using utility bills and payment records across the period since installation. File complaints with the FTC and State Attorney General identifying the unrealized guarantee as a deceptive act under FTC Act §5. Preserve all communications referencing the savings promise and prepare this documentation for potential individual legal review by WHM Law.",
  "Deceptive \"Pays For Itself\" Representation": "Document the exact \"pays for itself\" language used during the sales process, including who made the statement and when. File a deceptive-practices complaint with the FTC and your State Attorney General, attaching financial records that demonstrate the system has not offset its own cost. Issue a written demand to the seller and assignee finance company under the Holder Rule seeking rescission and restitution with a specific response deadline.",
  "Guarantee of Federal Tax Credits and Rebates": "Preserve all materials in which the federal Investment Tax Credit, rebates, or refunds were guaranteed without qualification. File a complaint with the FTC and State Attorney General citing misrepresentation under FTC Act §5 and IRS Code §25D, noting that the credit was presented as guaranteed regardless of personal tax liability. Submit a written Holder Rule demand to the finance company referencing the specific guarantee language and request appropriate remediation.",
  "Misrepresentation of Tax Credit Re-Amortization": "Collect documentation showing you were told the tax credit would automatically re-amortize or lower your payments, and obtain your current loan schedule showing whether that occurred. File complaints with the CFPB and State Attorney General identifying this as a deceptive representation of loan terms under TILA (15 U.S.C. §§1601 et seq.) and FTC Act §5. Demand in writing that the finance company correct or rescind the agreement under the Holder Rule, with a firm deadline for response.",
  "Failure to Disclose Tax Liability Dependency": "Preserve any sales materials and statements that presented the tax credit as universally available without explaining it depends on personal tax liability. File a complaint with the FTC and State Attorney General asserting an omission of material fact under FTC Act §5 and IRS Code §25D. Submit a written demand to the seller and finance company documenting the inadequate disclosure and requesting restitution within a defined period.",
  "Concealment of Material Loan Terms and Total Cost": "Request and preserve your complete loan documentation, including the term length, interest rate, finance charges, and total-of-payments disclosures required under TILA. File a complaint with the CFPB and State Attorney General citing the failure to clearly disclose material loan terms under TILA (15 U.S.C. §§1601 et seq.). Send a written Holder Rule demand to the finance company identifying the undisclosed terms and seeking rescission or correction with a stated deadline.",
  "High-Pressure and Urgency Sales Tactics": "Document the specific pressure or \"today only\" tactics used, including dates, the representative's name, and any recordings or messages conveying urgency. File complaints with the FTC and State Attorney General citing unfair practices under FTC Act §5 and any applicable state cooling-off protections (FTC Cooling-Off Rule, 16 CFR Part 429). Preserve all evidence and prepare the documentation for individual legal review by WHM Law to evaluate rescission rights.",
  "Discouragement of Document Review": "Record in detail any instance where the representative discouraged you from reading or reviewing documents before signing, including witnesses present. File a complaint with the FTC and your State Attorney General asserting an unfair and deceptive practice under FTC Act §5. Preserve the original signing documents and any communications, and submit a written demand to the finance company under the Holder Rule requesting remediation.",
  "Coercion to Conceal Promises During Verification Call": "Preserve the recorded verification or compliance call and any instructions you received to withhold information about sales promises during that call. File complaints with the FTC, CFPB, and State Attorney General, emphasizing that coached verification calls conceal deceptive conduct in violation of FTC Act §5. Submit a written Holder Rule demand to the finance company describing the coercion and requesting rescission and restitution within a firm deadline.",
  "Undisclosed Double Billing (Solar Plus Utility)": "Assemble copies of both your ongoing utility bills and your solar payment statements to document that you are paying both simultaneously. File a complaint with the FTC and State Attorney General demonstrating that the represented bill replacement did not occur, in violation of FTC Act §5. Send a written demand to the finance company under the Holder Rule citing the double-billing and requesting restitution within a defined timeframe.",
  "Net Increase in Total Energy Costs After Installation": "Prepare a documented cost analysis comparing your total pre-solar energy spending to your current combined solar-plus-utility costs. Submit this analysis to the CFPB and State Attorney General as evidence of a deceptive net-savings representation under FTC Act §5. Issue a written Holder Rule demand to the finance company referencing the cost increase and requesting rescission or restitution with a stated deadline.",
  "Concealed Payment Escalation Provisions": "Obtain your contract's escalator clause and a record of all payment increases since signing to document the escalation. File a complaint with the CFPB and State Attorney General citing inadequate disclosure of escalating payment terms under TILA and FTC Act §5. Submit a written demand to the finance company under the Holder Rule identifying the concealed escalator and requesting correction or rescission within a firm deadline.",
  "Failure to Disclose Payment Escalators": "Preserve the original sales presentation and contract to demonstrate that the escalator provision was never explained to you. File complaints with the FTC, CFPB, and State Attorney General asserting omission of a material payment term under TILA and FTC Act §5. Send a written Holder Rule demand to the finance company documenting the nondisclosure and requesting remediation within a defined period.",
  "Unconscionable Contract Duration (20+ Years)": "Document the full contract term and any representations made about its length relative to the system's expected life and your circumstances. File a complaint with your State Attorney General raising the extended duration as a potentially unconscionable term under applicable state consumer protection law. Preserve all documents and prepare the file for individual legal review by WHM Law to evaluate enforceability and rescission options.",
  "Inflation of Total Contract Cost Above Verbal Quote": "Gather any written or verbal quote provided at the point of sale and compare it against the executed contract's total cost. File complaints with the FTC and State Attorney General citing the discrepancy as a deceptive practice under FTC Act §5. Submit a written Holder Rule demand to the finance company identifying the inflated total and requesting restitution within a stated deadline.",
  "Loan Balance Exceeding Quoted System Price": "Obtain the quoted system price and the final financed loan balance to document the difference, including any embedded dealer fees. File a complaint with the CFPB and State Attorney General asserting undisclosed financing charges under TILA (15 U.S.C. §§1601 et seq.) and FTC Act §5. Send a written demand to the finance company under the Holder Rule referencing the excess balance and requesting correction or rescission.",
  "Failure to Disclose Dealer and Financing Fees": "Request an itemized breakdown of the financed amount to identify dealer fees, finance charges, and add-on costs that were not clearly disclosed. File complaints with the CFPB and State Attorney General citing a TILA disclosure violation and deceptive conduct under FTC Act §5. Issue a written Holder Rule demand to the finance company identifying the undisclosed fees and requesting restitution within a firm deadline.",
  "Imposition of Severe Financial Hardship": "Document how the solar payments have created direct financial hardship, including bank records, missed obligations, or related stress, while continuing to make payments to preserve your credit and legal standing. File complaints with the FTC, CFPB, and State Attorney General describing the hardship caused by the misrepresented agreement. Preserve all financial records and prepare the file for individual legal review by WHM Law to evaluate rescission and restitution remedies.",
  "Misrepresentation of Lease/PPA as Ownership": "Preserve your agreement and any sales materials that led you to believe you were purchasing rather than leasing or entering a PPA. File complaints with the FTC and State Attorney General asserting a material misrepresentation of the agreement type under FTC Act §5. Submit a written demand to the seller and finance company seeking rescission and restitution with a specific response deadline.",
  "Undisclosed UCC-1 Fixture Filing and Property Lien": "Obtain a copy of any UCC-1 fixture filing recorded against your property and document that it was never disclosed to you. File a complaint with your State Attorney General citing the undisclosed lien as a deceptive and unfair practice under FTC Act §5 and applicable state law. Preserve the filing and contract documents and prepare the file for individual legal review by WHM Law to address removal or rescission.",
  "Impairment of Property Title and Transferability": "Document the specific problems the agreement has caused with selling, refinancing, or transferring your home, including communications from title companies or lenders. File complaints with the FTC and State Attorney General describing the title impairment and any failure to disclose it. Submit a written demand to the seller and finance company seeking rescission and a clear release, with a stated deadline for response.",
  "Rushed Electronic Signing Without Full Disclosure": "Document the circumstances of the tablet or electronic signing, including what terms you were shown versus what you later discovered in the executed contract. File a complaint with the FTC and State Attorney General asserting deceptive signing practices and inadequate disclosure under FTC Act §5. Preserve the signed documents and device records, and submit a written Holder Rule demand to the finance company requesting rescission.",
  "Signature Irregularity and Authorization Defect": "Identify and document each instance where a signature was assisted, completed by another person, or otherwise irregular, including who was present. File a complaint with your State Attorney General citing the signature defect and potential contract formation issues under applicable state law. Preserve all signed documents and prepare the file for individual legal review by WHM Law to evaluate the validity and enforceability of the agreement.",
  "Discrepancy Between Verbal Promises and Written Terms": "Create a documented comparison of the verbal promises made during the sale against the actual written contract terms. File complaints with the FTC and State Attorney General citing the discrepancy as a deceptive practice under FTC Act §5. Submit a written Holder Rule demand to the finance company identifying each inconsistency and requesting rescission or restitution within a defined period.",
  "Concealment of Cancellation and Buyout Terms": "Request the complete cancellation, transfer, and buyout provisions of your agreement and document where these were unclear or withheld at signing. File a complaint with your State Attorney General and the FTC asserting failure to disclose material exit terms under FTC Act §5 and any applicable cooling-off rule (16 CFR Part 429). Preserve all related documents and prepare the file for individual legal review by WHM Law.",
  "System Underproduction Below Guaranteed Output": "Gather the production guarantee from your contract or sales materials and compare it against actual generation data from your monitoring system or utility records. File complaints with the FTC and State Attorney General citing breach of the production guarantee and deceptive representations under FTC Act §5 and UCC Article 2 warranty provisions. Submit a written demand to the seller, installer, and finance company documenting the shortfall and requesting remediation within a firm deadline.",
  "Repeated System Failure and Defective Equipment": "Document each instance of system shutdown or hardware failure with dates, photos, and service records. File a complaint with your State Attorney General and the FTC citing breach of warranty for non-functional goods under UCC Article 2 and deceptive practices under FTC Act §5. Submit a written demand to the installer and finance company requesting repair, replacement, or rescission, and preserve all records for individual legal review by WHM Law.",
  "Failure to Provide Promised Service and Support": "Compile a log of every service or repair request you submitted and the installer's, dealer's, or finance company's failure to respond. File complaints with the FTC and State Attorney General documenting the unresponsiveness and breach of service obligations. Submit a written demand to the responsible parties referencing the ignored complaints and requesting resolution within a stated deadline.",
  "Property Damage and Roof Leaks From Installation": "Document all roof leaks or physical property damage caused by the installation with photographs, repair estimates, and inspection reports. File a complaint with your State Attorney General citing property damage and breach of the installation's implied warranties under UCC Article 2 and state law. Submit a written demand to the installer and finance company seeking repair costs and remediation, and preserve all evidence for individual legal review by WHM Law.",
  "Failure to Deliver Promised Equipment and Upgrades": "Document the batteries, monitoring tools, or equipment promised at sale that were never delivered or are non-functional. File complaints with the FTC and State Attorney General citing failure to deliver contracted goods under FTC Act §5 and UCC Article 2. Submit a written demand to the seller and finance company under the Holder Rule requesting delivery, restitution, or rescission within a firm deadline.",
  "Misrepresentation of Warranty and Maintenance Obligations": "Preserve all warranty and maintenance representations made at sale and compare them against the actual written warranty terms and the parties' performance. File a complaint with the FTC and State Attorney General citing misrepresentation of warranty obligations under FTC Act §5 and UCC Article 2. Submit a written demand to the seller and finance company documenting the misrepresentation and requesting remediation within a defined period.",
  "Exhaustion of Prior Resolution Efforts": "Compile a complete record of every prior attempt you made to resolve the issues with the provider, including dates, contacts, and responses. Submit this history with complaints to the FTC, CFPB, and State Attorney General to demonstrate the provider's failure to remedy documented problems. Preserve all correspondence and prepare the file for individual legal review by WHM Law to pursue rescission and restitution.",
  "Corporate Evasion of Accountability": "Document each instance where customer service ignored your complaints or shifted responsibility between the installer, dealer, and finance company. File complaints with the FTC, CFPB, and State Attorney General highlighting the pattern of evasion as a barrier to good-faith resolution. Submit a written Holder Rule demand to the finance company, which remains liable for the seller's conduct, and request resolution within a firm deadline.",
  "Installer Bankruptcy and Abandonment of Obligations": "Document that the installer has gone out of business, filed bankruptcy, or abandoned support, including any bankruptcy case number if available. File complaints with the FTC and State Attorney General and assert claims against the finance company under the Holder Rule, which preserves your claims against the assignee despite the installer's absence. Preserve all records and prepare the file for individual legal review by WHM Law, including potential rejection of executory contracts under 11 U.S.C. §365 where applicable.",
  "Lack of Informed Consent at Signing": "Document the specific information that was withheld or misrepresented—full costs, tax credit rules, or utility realities—that would have changed your decision to sign. File complaints with the FTC and State Attorney General asserting that material omissions vitiated informed consent under FTC Act §5. Submit a written Holder Rule demand to the finance company requesting rescission and restitution, and preserve all records for individual legal review by WHM Law.",
  "Consumer Regret and Repudiation of Agreement": "Prepare a written statement documenting your reasons for repudiating the agreement, supported by the specific misrepresentations and harms you experienced. File complaints with the FTC, CFPB, and State Attorney General to formally record your dispute of the contract. Continue making payments to preserve your credit and legal standing while preparing the file for individual legal review by WHM Law to evaluate rescission.",
  "Inducement Through Misleading Sales Information": "Compile all misleading or incomplete sales materials and statements that induced you into the agreement. File complaints with the FTC and State Attorney General asserting deceptive inducement under FTC Act §5. Submit a written Holder Rule demand to the finance company identifying the misleading information and requesting rescission and restitution within a stated deadline.",
  "Request for Attorney-Backed Contract Review": "Preserve your complete contract file, financing documents, and all sales communications for a thorough attorney-backed review. Solar Release Co. will forward your case and supporting evidence to WHM Law, its legal support partner, for evaluation of your contract and representation history. Continue making payments during this process to preserve your credit and legal standing while the review proceeds."
};

