import { FunnelInputs, ScoringResult } from './scoring';

export function compileRuleBasedSummary(inputs: FunnelInputs, score: ScoringResult): string {
  const parts: string[] = [];

  // Paragraph 1: Initial context and financial snapshot
  let intro = `A diagnostic analysis was conducted on the solar ${inputs.contractType} contract provided by the homeowner, involving installation by ${inputs.solarCompany || 'an independent solar provider'} and financing through ${inputs.financeCompany || 'a third-party lender'}. `;
  
  const currentTotal = inputs.monthlyPayment + inputs.currentUtilityBill;
  const isLosing = currentTotal > inputs.preSolarUtilityBill;
  
  if (isLosing && inputs.preSolarUtilityBill > 0) {
    const pctIncrease = Math.round(((currentTotal - inputs.preSolarUtilityBill) / inputs.preSolarUtilityBill) * 100);
    intro += `The financial snapshot shows a current combined monthly cost of $${currentTotal.toFixed(2)} (comprising a $${inputs.monthlyPayment.toFixed(2)} solar payment and $${inputs.currentUtilityBill.toFixed(2)} remaining utility fee). This exceeds the pre-solar utility average of $${inputs.preSolarUtilityBill.toFixed(2)} by approximately ${pctIncrease}%, representing a notable monthly premium over historical utility baseline spending. `;
  } else {
    intro += `The current combined monthly cost is $${currentTotal.toFixed(2)} (including a $${inputs.monthlyPayment.toFixed(2)} solar payment and $${inputs.currentUtilityBill.toFixed(2)} remaining utility fee), compared to a pre-solar utility baseline of $${inputs.preSolarUtilityBill.toFixed(2)}. `;
  }

  if (inputs.paymentEscalator) {
    intro += `Additionally, the contract includes a ${inputs.escalatorPercentage}% annual payment escalator, which is projected to escalate payments over the remaining ${inputs.remainingTerm} years, bringing the estimated remaining contract cost to $${score.remainingTermCost.toLocaleString(undefined, {maximumFractionDigits: 0})}. `;
  } else {
    intro += `The contract is reported to have a fixed payment structure over the remaining ${inputs.remainingTerm} years of the term, with an estimated remaining contract liability of $${score.remainingTermCost.toLocaleString(undefined, {maximumFractionDigits: 0})}. `;
  }

  parts.push(intro);

  // Helper check
  const isYes = (qId: number) => inputs.surveyAnswers[qId] === 'yes' || inputs.surveyAnswers[qId] === 'somewhat';

  // Paragraph 2: Core misrepresentation / sales conduct findings
  const concerns: string[] = [];
  if (isYes(1)) concerns.push('verbal assurances that the utility electric bill would be completely eliminated');
  if ((isYes(5) || isYes(6)) && inputs.taxCreditPromised && !inputs.taxCreditReceived) {
    concerns.push('unrealized representations regarding federal tax credit incentives being applied to pay down the contract principal');
  }
  if (isYes(19)) concerns.push('the undisclosed inclusion of dealer financing fees in the principal balance');
  if (isYes(22)) concerns.push('the placement of a UCC-1 financing statement (property lien) without prior notice or explanation');
  if (isYes(24) || isYes(25)) {
    concerns.push('sales process irregularities, including rushed signing processes or unauthorized electronic signatures');
  }
  if (isYes(11)) concerns.push('instructions from sales staff to agree to verification scripts containing statements that did not reflect the actual verbal agreements');
  if (isYes(9)) concerns.push('marketing or pressure tactics directed toward securing a same-day agreement');

  let conductPart = '';
  if (concerns.length > 0) {
    conductPart += `A review of the sales and onboarding experience highlights several reported concerns, including: ${concerns.join('; ') || 'none'}. `;
    if (inputs.taxCreditPromised && !inputs.taxCreditReceived) {
      conductPart += `Crucially, the promised federal tax credit was either not received or could not be utilized, leaving the customer with an unreduced contract balance and higher-than-expected payments. `;
    }
  } else {
    conductPart += `No specific verbal misrepresentations or sales process irregularities were flagged during the initial diagnostic screening. `;
  }

  parts.push(conductPart);

  // Paragraph 3: System performance and installer status
  let performancePart = '';
  const performanceIssues: string[] = [];
  if (inputs.systemPerformance === 'non-operational' || isYes(29)) {
    performanceIssues.push('a non-operational solar system that has stopped working or has repeated service issues');
  } else if (inputs.systemPerformance === 'underperforming' || isYes(28)) {
    performanceIssues.push('chronic system underperformance relative to initial solar sales projections');
  }
  if (isYes(31)) performanceIssues.push('physical damage to the roof structure or water intrusion following installation');
  if (isYes(36)) performanceIssues.push('installer abandonment, leaving the system without maintenance, monitoring, or warranty support due to corporate bankruptcy');

  if (performanceIssues.length > 0) {
    performancePart += `On the technical side, the analyzer flags several critical performance indicators: ${performanceIssues.join(', ')}. `;
  }
  
  if (isYes(23)) {
    performancePart += `Furthermore, the presence of the solar fixture lien (UCC-1 statement) has reportedly created complications regarding property title transfer, refinancing, or home sale negotiations. `;
  }

  if (performancePart.length > 0) {
    parts.push(performancePart);
  }

  // Paragraph 4: Legal context warning & next steps
  const conclusion = `Based on these cumulative findings, this agreement displays multiple risk indicators. In accordance with professional standards, further review by qualified legal counsel may be appropriate to investigate contract terms, verify financing disclosure compliance, and assess potential resolution paths. Solar Release Co. provides professional coordination to support homeowners in executing attorney-backed review options.`;
  parts.push(conclusion);

  return parts.join('\n\n');
}
