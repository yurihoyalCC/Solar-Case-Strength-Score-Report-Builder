import { NextRequest, NextResponse } from 'next/server';
import { compileRuleBasedSummary } from '@/services/summary';

export async function POST(req: NextRequest) {
  try {
    const { inputs, score } = await req.json();

    if (!inputs || !score) {
      return NextResponse.json({ error: 'Missing inputs or score calculations.' }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      try {
        const prompt = `
          You are a legal review specialist and solar contract analyst at Solar Release Co.
          Analyze the following customer solar contract diagnostic inputs and scoring metrics, and generate a calm, professional, legally-cautious, and consumer-protection focused summary report paragraph.
          
          CRITICAL RULES:
          1. NEVER say "fraud confirmed", "guaranteed cancellation", "stop paying", or make any absolute legal declarations.
          2. Use legally cautious terms like "reported concern", "potential indicator", "may warrant review", "attorney-backed review may be appropriate".
          3. Base your analysis on the actual numbers and flags reported below. Write about 2-3 short, structured paragraphs.
          4. Highlight any monthly financial discrepancies (e.g. combined solar + utility cost vs pre-solar utility bill) and escalator details.
          
          CUSTOMER DIAGNOSTIC DATA:
          - Contract Type: ${inputs.contractType}
          - Solar Company: ${inputs.solarCompany || 'Unknown'}
          - Financing Company: ${inputs.financeCompany || 'Unknown'}
          - Monthly Solar Payment: $${inputs.monthlyPayment}
          - Payment Escalator: ${inputs.paymentEscalator ? 'Yes' : 'No'} (Escalator rate: ${inputs.escalatorPercentage}%)
          - Pre-solar Utility average: $${inputs.preSolarUtilityBill}
          - Current remaining Utility bill: $${inputs.currentUtilityBill}
          - Total System Price (if loan): $${inputs.totalSystemPrice}
          - Remaining term: ${inputs.remainingTerm} years
          - System Performance Status: ${inputs.systemPerformance}
          - Federal Tax Credit Promised: ${inputs.taxCreditPromised ? 'Yes' : 'No'}, Received: ${inputs.taxCreditReceived ? 'Yes' : 'No'}
          
          KEY CONCERNS REPORTED:
          - Verbal promise of $0 utility bill: ${inputs.promisedZeroBill ? 'Yes' : 'No'}
          - Verbal promise that tax credit would pay off loan: ${inputs.promisedTaxCreditPayoff ? 'Yes' : 'No'}
          - Hidden dealer fees: ${inputs.hiddenDealerFees ? 'Yes' : 'No'}
          - Surprise UCC-1 property lien: ${inputs.surpriseLien ? 'Yes' : 'No'}
          - Installation/roof damage: ${inputs.roofDamage ? 'Yes' : 'No'}
          - System underproduction: ${inputs.underproduction ? 'Yes' : 'No'}
          - Installer out of business/bankrupt: ${inputs.installerBankrupt ? 'Yes' : 'No'}
          - Forged or rushed tablet e-signatures: ${inputs.forgedOrRushedSignatures ? 'Yes' : 'No'}
          - Elderly or fixed income targeting: ${inputs.elderlyOrFixedIncomeTargeting ? 'Yes' : 'No'}
          - Coerced on recorded welcome verification call: ${inputs.recordedCallCoercion ? 'Yes' : 'No'}
          - Financial distress reported: ${inputs.financialDistress ? 'Yes' : 'No'}
          - Property sale/transfer issues due to UCC lien: ${inputs.homeSaleHindered ? 'Yes' : 'No'}
          
          SCORING METRICS:
          - Final Solar Case Strength Score™: ${score.finalScore}/100
          - Final Label: ${score.scoreLabel}
          
          Write a detailed summary.
        `;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          })
        });

        if (response.ok) {
          const resData = await response.json();
          const generatedText = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            return NextResponse.json({ summary: generatedText.trim() });
          }
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, using rule-based generator:', geminiError);
      }
    }

    // Fallback if no key or API error
    const ruleSummary = compileRuleBasedSummary(inputs, score);
    return NextResponse.json({ summary: ruleSummary });

  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error.' }, { status: 500 });
  }
}
