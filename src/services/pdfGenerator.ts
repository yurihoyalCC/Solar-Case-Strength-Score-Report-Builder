import { LeadApplication } from './db';
import { RECOMMENDED_ACTIONS } from './scoring';
import { compileRuleBasedSummary } from './summary';

export async function generatePdfReport(lead: LeadApplication, shouldSave = true, customSummary?: string) {
  const { jsPDF } = await import('jspdf');
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const { inputs, score, id, createdAt } = lead;
  
  // Custom Color Palette
  const navyDark = [11, 21, 36]; // #0B1524
  const goldAccent = [212, 175, 55]; // #D4AF37
  const slateGray = [100, 116, 139]; // #64748B
  const textDark = [51, 65, 85]; // #334155
  
  // Header and Footer Drawing helpers
  const drawHeader = (pageNum: number) => {
    // Top border accent
    doc.setFillColor(navyDark[0], navyDark[1], navyDark[2]);
    doc.rect(0, 0, 210, 12, 'F');
    doc.setFillColor(goldAccent[0], goldAccent[1], goldAccent[2]);
    doc.rect(0, 12, 210, 2, 'F');
    
    // Logo text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('SOLAR RELEASE CO.', 15, 8);
    
    doc.setFontSize(8);
    doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
    doc.text('Confidential Consumer Protection Diagnostic Report', 15, 22);
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 24, 195, 24);
  };

  const drawFooter = (pageNum: number, totalPagesCount = 2) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
    doc.text(`Report ID: ${id}  |  Generated: ${new Date(createdAt).toLocaleDateString()}  |  Page ${pageNum} of ${totalPagesCount}`, 15, 285);
    doc.text('Disclaimer: This is a diagnostic evaluation for review purposes. It is not formal legal representation or financial advice.', 15, 289);
  };

  // ==========================================
  // PAGE 1: Case Score, Projections, Progress Tracker
  // ==========================================
  drawHeader(1);
  
  // Title & Metadata
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.text('SOLAR AGREEMENT DIAGNOSTIC ANALYSIS', 15, 34);

  // Metadata Panel
  doc.setFillColor(248, 250, 252);
  doc.rect(15, 39, 180, 20, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, 39, 180, 20, 'D');

  doc.setFontSize(8.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('CLIENT DETAILS:', 18, 44);
  doc.text('CONTRACT DETAILS:', 110, 44);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.text(`${inputs.firstName} ${inputs.lastName}`, 18, 49);
  doc.text(`Location: ${inputs.state}`, 18, 54);

  doc.text(`Contract Type: ${inputs.contractType.toUpperCase()}`, 110, 49);
  doc.text(`Provider: ${inputs.solarCompany || 'N/A'} / ${inputs.financeCompany || 'N/A'}`, 110, 54);

  // SOLAR CASE SCORE CARD (Left side)
  doc.setFillColor(241, 245, 249);
  doc.rect(15, 64, 75, 45, 'F');
  doc.rect(15, 64, 75, 45, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.text('SOLAR CASE STRENGTH SCORE™', 20, 71);

  // Draw Score Circle
  doc.setFillColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.circle(52, 87, 11, 'F');
  
  // Draw Score text inside
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  const scoreStr = String(score.finalScore);
  doc.text(scoreStr, 52 - (doc.getTextWidth(scoreStr) / 2), 89);

  doc.setFontSize(8);
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.text('/100', 64, 89);

  doc.setFontSize(9);
  doc.text(score.scoreLabel.toUpperCase(), 20, 104);

  // CATEGORY BREAKDOWNS (Right side)
  doc.setFontSize(10);
  doc.text('Risk Category Breakdowns:', 100, 69);
  
  const categories = [
    { label: 'Sales Conduct Indicator', score: score.salesConductScore },
    { label: 'Financial Burden', score: score.financialBurdenScore },
    { label: 'Contract Risk', score: score.contractRiskScore },
    { label: 'System Performance', score: score.systemPerformanceScore },
    { label: 'Resolution Readiness', score: score.resolutionReadinessScore }
  ];

  let yOffset = 76;
  categories.forEach((cat) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(cat.label, 100, yOffset);
    
    // Draw Bar background
    doc.setFillColor(226, 232, 240);
    doc.rect(145, yOffset - 2, 40, 2.5, 'F');
    // Draw Bar fill
    doc.setFillColor(navyDark[0], navyDark[1], navyDark[2]);
    doc.rect(145, yOffset - 2, (cat.score / 100) * 40, 2.5, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.text(`${cat.score}%`, 188, yOffset);
    yOffset += 6;
  });

  // URGENCY BOX
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(252, 165, 165);
  doc.rect(15, 114, 180, 16, 'F');
  doc.rect(15, 114, 180, 16, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(153, 27, 27);
  doc.text('POTENTIAL CONCERNS IDENTIFIED:', 18, 120);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  
  const urgencyText = 'Your answers show multiple review indicators that may be time-sensitive, especially if payments are escalating, the installer is no longer responsive, or you were promised savings that have not happened.';
  const splitUrgency = doc.splitTextToSize(urgencyText, 172);
  doc.text(splitUrgency, 18, 125);

  // ==========================================
  // KEY FINDINGS (POTENTIAL FRAUD INDICATORS & LEGAL VIOLATIONS) (Concern Tags)
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.text('KEY FINDINGS (POTENTIAL FRAUD INDICATORS & LEGAL VIOLATIONS)', 15, 140);
  doc.setDrawColor(226, 232, 240);
  doc.line(15, 142, 195, 142);

  let tagX = 15;
  let tagY = 150;
  doc.setFontSize(8);
  
  if (score.concernTags.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
    doc.text('No key findings or potential violations identified.', 18, tagY);
  } else {
    score.concernTags.forEach((tag) => {
      const textWidth = doc.getTextWidth(tag);
      if (tagX + textWidth + 8 > 195) {
        tagX = 15;
        tagY += 8;
      }
      
      // Soft red background, soft red border, red text
      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(252, 165, 165);
      doc.rect(tagX, tagY - 4, textWidth + 6, 6, 'F');
      doc.rect(tagX, tagY - 4, textWidth + 6, 6, 'D');
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(220, 38, 38);
      doc.text(tag, tagX + 3, tagY);
      
      tagX += textWidth + 9;
    });
  }

  let currentY = tagY + 8;
  let currentPage = 1;

  const ensureSpace = (heightNeeded: number) => {
    if (currentY + heightNeeded > 270) {
      doc.addPage();
      currentPage++;
      drawHeader(currentPage);
      currentY = 32;
    }
  };

  // ==========================================
  // RECOMMENDED ACTIONS & DIAGNOSTIC SUMMARY
  // ==========================================
  ensureSpace(15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.text('RECOMMENDED ACTIONS & DIAGNOSTIC SUMMARY', 15, currentY);
  doc.setDrawColor(226, 232, 240);
  doc.line(15, currentY + 2, 195, currentY + 2);
  currentY += 8;

  // Specific Recommended Actions
  if (score.concernTags.length > 0) {
    ensureSpace(8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
    doc.text('Recommended Actions:', 15, currentY);
    currentY += 6;

    score.concernTags.forEach((tag) => {
      const actionText = RECOMMENDED_ACTIONS[tag] || 'Action details pending review.';
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      const splitAction = doc.splitTextToSize(actionText, 175);
      
      // Height needed: tag title (4.5mm) + description lines (length * 3.5mm) + gap (3.5mm)
      const blockHeight = 4.5 + (splitAction.length * 3.5) + 3.5;
      ensureSpace(blockHeight);
      
      // Draw left red indicator line
      doc.setDrawColor(252, 165, 165);
      doc.setLineWidth(0.6);
      doc.line(16, currentY - 2, 16, currentY + (splitAction.length * 3.5));
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(220, 38, 38);
      doc.text(tag, 19, currentY);
      currentY += 4.5;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.text(splitAction, 19, currentY);
      currentY += (splitAction.length * 3.5) + 3.5;
    });

    ensureSpace(6);
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.3);
    doc.line(15, currentY - 2, 195, currentY - 2);
  }

  // Diagnostic Summary
  const summaryText = customSummary || compileRuleBasedSummary(inputs, score);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  const splitSummary = doc.splitTextToSize(summaryText, 180);
  
  const summaryBlockHeight = 6 + (splitSummary.length * 3.8) + 6;
  ensureSpace(summaryBlockHeight);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.text('Diagnostic Summary:', 15, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(splitSummary, 15, currentY);
  currentY += (splitSummary.length * 3.8) + 6;

  // Force a page break to cleanly start contract metrics on the next page
  doc.addPage();
  currentPage++;
  drawHeader(currentPage);
  currentY = 32;

  // ==========================================
  // CONTRACT & COST CALCULATOR METRICS
  // ==========================================
  ensureSpace(15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.text('CONTRACT & COST CALCULATOR METRICS', 15, currentY);
  doc.setDrawColor(226, 232, 240);
  doc.line(15, currentY + 2, 195, currentY + 2);
  currentY += 8;

  const tableData = [
    { label: 'Current Monthly Payment:', val: `$${inputs.monthlyPayment.toFixed(2)}` },
    { label: 'Payment Escalator:', val: inputs.paymentEscalator ? `Yes (${inputs.escalatorPercentage}%)` : 'No' },
    { label: 'Remaining Term:', val: `${inputs.remainingTerm} Years` },
    { label: 'Pre-Solar Utility Bill:', val: `$${inputs.preSolarUtilityBill.toFixed(2)}` },
    { label: 'Current Utility Bill (Post-Solar):', val: `$${inputs.currentUtilityBill.toFixed(2)}` },
    { label: 'Projected Remaining Contract Cost:', val: `$${score.remainingTermCost.toLocaleString(undefined, {maximumFractionDigits: 0})}` }
  ];

  tableData.forEach((row, idx) => {
    ensureSpace(7);
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, currentY - 4, 180, 6.5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(row.label, 18, currentY);
    doc.setFont('helvetica', 'bold');
    doc.text(row.val, 150, currentY);
    currentY += 6.5;
  });

  currentY += 2;

  // ==========================================
  // PREMIUM HIGHLIGHT BOX (Estimated Full-Term Cost)
  // ==========================================
  const cardHeight = 44;
  ensureSpace(cardHeight + 4);
  const cardY = currentY;

  // Draw card background (#FFF5F5)
  doc.setFillColor(255, 245, 245);
  doc.roundedRect(15, cardY, 180, cardHeight, 2, 2, 'F');

  // Draw card border
  doc.setDrawColor(239, 68, 68);
  doc.setLineWidth(0.4);
  doc.roundedRect(15, cardY, 180, cardHeight, 2, 2, 'D');

  // Draw Top Right Badge
  const badgeText = 'TOTAL COST COMMITMENT';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  const badgeWidth = doc.getTextWidth(badgeText) + 4;
  const badgeX = 195 - badgeWidth - 4;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(239, 68, 68);
  doc.setLineWidth(0.2);
  doc.roundedRect(badgeX, cardY + 3, badgeWidth, 4.5, 1, 1, 'FD');
  doc.setTextColor(220, 38, 38);
  doc.text(badgeText, badgeX + 2, cardY + 6.2);

  // Left Side label & subtext
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(220, 38, 38);
  doc.text('Estimated Full-Term Cost', 19, cardY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Projected total financial obligation over the life of the agreement.', 19, cardY + 11.5);

  // Right Side large cost amount
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(220, 38, 38);
  const costValStr = `$${score.fullTermCost.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
  doc.text(costValStr, 195 - doc.getTextWidth(costValStr) - 5, cardY + 16.5);

  // Monthly and Annual perspectives directly below
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const combinedMonthly = inputs.monthlyPayment + inputs.currentUtilityBill;
  const combinedAnnual = combinedMonthly * 12;
  const monthlyCostStr = `Current Combined Monthly Cost: $${combinedMonthly.toLocaleString(undefined, {maximumFractionDigits: 0})}/mo`;
  const annualCostStr = `Equivalent Annual Cost: $${combinedAnnual.toLocaleString(undefined, {maximumFractionDigits: 0})}/yr`;
  doc.text(monthlyCostStr, 19, cardY + 17);
  doc.setFont('helvetica', 'normal');
  doc.text(annualCostStr, 19, cardY + 21);

  // Thin red divider below cost display
  doc.setDrawColor(239, 68, 68);
  doc.setLineWidth(0.2);
  doc.line(19, cardY + 23.5, 191, cardY + 23.5);

  // Impact statement
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(220, 38, 38);
  doc.text('[!]  Total Cost Commitment', 19, cardY + 27.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  const commitmentText = 'This represents your estimated total financial commitment if the agreement remains in place through the full contract term and no changes are made.';
  doc.text(commitmentText, 19, cardY + 31.5);

  const varianceText = 'Actual costs may vary based on escalators, utility usage, system performance, financing terms, and contract-specific provisions.';
  doc.setTextColor(100, 116, 139);
  doc.text(varianceText, 19, cardY + 35);

  // Legal disclaimer
  const disclaimerText = 'This estimate assumes the agreement remains active for the full contract term and does not account for future modifications, settlements, transfers, refinancing, or early termination.';
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text(disclaimerText, 19, cardY + 39.5);

  currentY += cardHeight + 8;

  // ==========================================
  // ABOUT SOLAR RELEASE CO.
  // ==========================================
  const aboutText = 'Solar Release Co. is a consumer advocacy and contract review organization that helps homeowners better understand solar agreements, financing obligations, system performance concerns, and potential contract issues.';
  const splitAbout = doc.splitTextToSize(aboutText, 180);
  const pillarsText = 'Our review process combines:\n\n' +
    '  •  Contract Analysis\n' +
    '  •  Solar Case Strength Score™ Evaluation\n' +
    '  •  Financial Impact Review\n' +
    '  •  Documentation Review\n' +
    '  •  Attorney-Backed Escalation Pathways When Appropriate\n\n' +
    'Our goal is to help consumers better understand their options and make informed decisions regarding their solar agreements.';
  const splitPillars = doc.splitTextToSize(pillarsText, 180);
  const aboutSectionHeight = 15 + (splitAbout.length * 4) + 2 + (splitPillars.length * 4) + 6;

  ensureSpace(aboutSectionHeight);

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.line(15, currentY, 195, currentY);
  currentY += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.text('ABOUT SOLAR RELEASE CO.', 15, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(splitAbout, 15, currentY);
  currentY += (splitAbout.length * 4) + 2;

  doc.text(splitPillars, 15, currentY);
  currentY += (splitPillars.length * 4) + 6;

  // ==========================================
  // CASE PROGRESS TRACKER
  // ==========================================
  const steps = [
    { 
      title: 'Step 1: Consumer Took Action', 
      status: 'Complete', 
      desc: 'You requested a professional review of your solar agreement and submitted your information for analysis.',
      completed: true,
      statusColor: [16, 185, 129] // Emerald Green
    },
    { 
      title: 'Step 2: Fraud Survey Completed', 
      status: 'Complete', 
      desc: 'Your responses were reviewed and analyzed for potential sales conduct, financial disclosure, performance, and contract concerns.',
      completed: true,
      statusColor: [16, 185, 129]
    },
    { 
      title: 'Step 3: Diagnostic Review Completed', 
      status: 'Qualified', 
      desc: 'Your Solar Case Strength Score™ and initial diagnostic findings have been generated and reviewed.',
      completed: true,
      statusColor: [212, 175, 55] // Gold
    },
    { 
      title: 'Step 4: Case Manager Review', 
      status: 'Pending', 
      desc: 'A case specialist will review your submitted information, confirm the case details, and identify which supporting documents may be needed for legal review.',
      completed: false,
      statusColor: [100, 116, 139] // Slate Gray
    },
    { 
      title: 'Step 5: Document Collection', 
      status: 'Pending', 
      desc: 'Installation agreements, finance agreements, utility bills, payment records, and related documents may be requested for detailed review.',
      completed: false,
      statusColor: [100, 116, 139]
    },
    { 
      title: 'Step 6: Resolution Strategy & Final Report', 
      status: 'Pending', 
      desc: 'A comprehensive fraud report and recommended resolution pathway will be prepared based on all available evidence.',
      completed: false,
      statusColor: [100, 116, 139]
    }
  ];

  const trackerHeaderHeight = 15;
  const trackerStepHeight = steps.length * 9;
  const trackerTotalHeight = trackerHeaderHeight + trackerStepHeight + 10;

  ensureSpace(trackerTotalHeight);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.text('CASE PROGRESS TRACKER', 15, currentY);
  doc.setDrawColor(226, 232, 240);
  doc.line(15, currentY + 2, 195, currentY + 2);

  // Progress bar
  doc.setFillColor(241, 245, 249);
  doc.rect(15, currentY + 5, 180, 2.5, 'F');
  doc.setFillColor(goldAccent[0], goldAccent[1], goldAccent[2]);
  doc.rect(15, currentY + 5, 90, 2.5, 'F'); // 50%

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.text('Progress: 50% Complete', 15, currentY + 11);
  doc.setFont('helvetica', 'normal');
  doc.text('You have completed 3 of 6 review stages.', 54, currentY + 11);
  
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('Your case has successfully advanced through the initial review phase.', 115, currentY + 11);

  // Vertical timeline line
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(20, currentY + 19, 20, currentY + 19 + (steps.length - 1) * 9);

  let stepY = currentY + 20;
  steps.forEach(step => {
    // Draw step circle
    if (step.completed) {
      doc.setFillColor(step.statusColor[0], step.statusColor[1], step.statusColor[2]);
      doc.circle(20, stepY - 1, 2, 'F');
      
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.35);
      doc.line(19.2, stepY - 1, 19.8, stepY - 0.4);
      doc.line(19.8, stepY - 0.4, 20.8, stepY - 1.6);
    } else {
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.4);
      doc.circle(20, stepY - 1, 2, 'FD');
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
    doc.text(step.title, 25, stepY - 0.5);

    doc.setFontSize(7);
    doc.setTextColor(step.statusColor[0], step.statusColor[1], step.statusColor[2]);
    doc.text(step.status.toUpperCase(), 195 - doc.getTextWidth(step.status.toUpperCase()) - 15, stepY - 0.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    
    const descLines = doc.splitTextToSize(step.desc, 155);
    doc.text(descLines, 25, stepY + 3);
    
    stepY += 9;
  });

  currentY = stepY + 2;

  // ==========================================
  // CONTACT INFO BOX
  // ==========================================
  const contactBoxHeight = 28;
  ensureSpace(contactBoxHeight + 4);
  const contactBoxY = (270 - currentY >= contactBoxHeight) ? (270 - contactBoxHeight) : currentY;

  doc.setFillColor(248, 250, 252);
  doc.rect(15, contactBoxY, 180, contactBoxHeight, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, contactBoxY, 180, contactBoxHeight, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
  doc.text('Contact Information:', 18, contactBoxY + 5);

  doc.setFont('helvetica', 'bold');
  doc.text('Solar Release Co.', 18, contactBoxY + 10);
  doc.setFont('helvetica', 'normal');
  doc.text('Consumer Contract Review Division', 18, contactBoxY + 14);
  doc.text('www.SolarReleaseCo.com', 18, contactBoxY + 18);

  doc.setFont('helvetica', 'bold');
  doc.text('Office:', 110, contactBoxY + 10);
  doc.setFont('helvetica', 'normal');
  doc.text('1-855-396-5090', 110, contactBoxY + 14);
  doc.setFont('helvetica', 'bold');
  doc.text('Client Care:', 110, contactBoxY + 18);
  doc.setFont('helvetica', 'normal');
  doc.text('clientcare@solarrelease.com', 110, contactBoxY + 22);
  doc.setFont('helvetica', 'italic');
  doc.text('Case Review Team', 110, contactBoxY + 26);

  // Draw footers on all pages dynamically at the end
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(i, totalPages);
  }

  // Save the PDF
  if (shouldSave) {
    doc.save(`Solar-Case-Strength-Score-${lead.inputs.lastName}-${lead.id}.pdf`);
  }
  return doc;
}
