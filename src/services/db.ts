import { FunnelInputs, ScoringResult } from './scoring';

export interface LeadApplication {
  id: string;
  inputs: FunnelInputs;
  score: ScoringResult;
  status: 'New' | 'In Review' | 'Attorney Assigned' | 'Resolved';
  notes: Array<{ text: string; createdAt: string }>;
  createdAt: string;
}

const hasFirebaseConfig = 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

// Mock survey answers seed helper
const mockSurveyAnswers = (yesIds: number[], somewhatIds: number[], notSureIds: number[]): Record<number, 'yes' | 'no' | 'not_sure' | 'somewhat'> => {
  const ans: Record<number, 'yes' | 'no' | 'not_sure' | 'somewhat'> = {};
  for (let i = 1; i <= 40; i++) {
    if (yesIds.includes(i)) ans[i] = 'yes';
    else if (somewhatIds.includes(i)) ans[i] = 'somewhat';
    else if (notSureIds.includes(i)) ans[i] = 'not_sure';
    else ans[i] = 'no';
  }
  return ans;
};

// Seed Leads with updated 40-question Record
const PRE_SEEDED_LEADS: LeadApplication[] = [
  {
    id: 'app_seed_001',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'New',
    notes: [
      { text: 'Customer reported aggressive sales tactics and promised tax credit check that never arrived.', createdAt: new Date(Date.now() - 3600000 * 2).toISOString() }
    ],
    inputs: {
      firstName: 'Arthur',
      lastName: 'Pendragon',
      email: 'arthur.p@camelot-solar.com',
      phone: '(407) 555-1234',
      state: 'FL',
      contractType: 'loan',
      solarCompany: 'Titan Solar Power',
      financeCompany: 'GoodLeap',
      totalSystemPrice: 52000,
      loanBalance: 49500,
      monthlyPayment: 285,
      interestRate: 4.99,
      loanTerm: 25,
      remainingTerm: 23,
      paymentEscalator: false,
      escalatorPercentage: 0,
      preSolarUtilityBill: 220,
      currentUtilityBill: 110,
      taxCreditPromised: true,
      taxCreditReceived: false,
      systemPerformance: 'underperforming',
      surveyAnswers: mockSurveyAnswers(
        [1, 2, 3, 5, 6, 9, 11, 12, 13, 17, 18, 19, 20, 22, 24, 25, 26, 28, 30, 34, 37, 39, 40], // YES
        [8, 15, 27, 35], // SOMEWHAT / NOT SURE (For Q8 reverse, somewhat means half indicator)
        []
      ),
      leadSource: 'facebook',
      utmSource: 'fb_ads',
      utmCampaign: 'solar_fraud_funnel',
      fbclid: 'fb_12984029482'
    },
    score: {
      salesConductScore: 78,
      financialBurdenScore: 72,
      contractRiskScore: 68,
      systemPerformanceScore: 56,
      resolutionReadinessScore: 68,
      finalScore: 70,
      scoreLabel: 'High Indicator',
      leadQuality: 'Strong Follow-Up',
      remainingTermCost: 78660,
      fullTermCost: 85500,
      pastPaidCost: 6840,
      projectedProjections: [],
      savingsLossStatus: 'losing',
      netDifference: -24200,
      concernTags: ['ITC Rebate Guarantee', 'Verification Call Coercion', 'Amortization Misrepresentation', 'Contract Terms Ambiguity', 'Solar Cost Increase Premium']
    }
  },
  {
    id: 'app_seed_002',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'In Review',
    notes: [
      { text: 'PPA escalator causing significant issues. Monthly cost now exceeds baseline. Reviewing contract details.', createdAt: new Date(Date.now() - 3600000 * 20).toISOString() }
    ],
    inputs: {
      firstName: 'Sarah',
      lastName: 'Connor',
      email: 'sconnor@cyberdyne.org',
      phone: '(213) 555-8000',
      state: 'CA',
      contractType: 'ppa',
      solarCompany: 'Sunrun Inc.',
      financeCompany: 'Sunrun',
      totalSystemPrice: 0,
      loanBalance: 0,
      monthlyPayment: 215,
      interestRate: 0,
      loanTerm: 25,
      remainingTerm: 20,
      paymentEscalator: true,
      escalatorPercentage: 2.9,
      preSolarUtilityBill: 190,
      currentUtilityBill: 80,
      taxCreditPromised: false,
      taxCreditReceived: false,
      systemPerformance: 'working',
      surveyAnswers: mockSurveyAnswers(
        [1, 2, 12, 13, 14, 15, 16, 20, 21, 22, 23, 37, 39, 40], // YES
        [8, 27],
        []
      ),
      leadSource: 'google',
      utmSource: 'google_search',
      utmCampaign: 'solar_lawyer_keywords',
      gclid: 'g_9824023049'
    },
    score: {
      salesConductScore: 32,
      financialBurdenScore: 58,
      contractRiskScore: 68,
      systemPerformanceScore: 0,
      resolutionReadinessScore: 58,
      finalScore: 46,
      scoreLabel: 'Moderate Indicator',
      leadQuality: 'Nurture',
      remainingTermCost: 69200,
      fullTermCost: 82100,
      pastPaidCost: 12900,
      projectedProjections: [],
      savingsLossStatus: 'losing',
      netDifference: -15800,
      concernTags: ['Lease/PPA Exposure', 'Surprise UCC Property Lien', 'Property Sale Title Complications', 'Severe Financial Stress', 'Compounding Payment Escalators']
    }
  },
  {
    id: 'app_seed_003',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    status: 'Attorney Assigned',
    notes: [
      { text: 'Elderly client on fixed income. Direct coercion on verification call confirmed by relative.', createdAt: new Date(Date.now() - 3600000 * 45).toISOString() },
      { text: 'Sent package to Law Offices of Marcus & Assoc for review.', createdAt: new Date(Date.now() - 3600000 * 36).toISOString() }
    ],
    inputs: {
      firstName: 'Evelyn',
      lastName: 'Miller',
      email: 'evelyn.miller@fixedincome.net',
      phone: '(602) 555-7722',
      state: 'AZ',
      contractType: 'lease',
      solarCompany: 'Meraki Solar',
      financeCompany: 'Mosaic',
      totalSystemPrice: 0,
      loanBalance: 0,
      monthlyPayment: 310,
      interestRate: 0,
      loanTerm: 25,
      remainingTerm: 22,
      paymentEscalator: true,
      escalatorPercentage: 3.5,
      preSolarUtilityBill: 250,
      currentUtilityBill: 195,
      taxCreditPromised: true,
      taxCreditReceived: false,
      systemPerformance: 'underperforming',
      surveyAnswers: mockSurveyAnswers(
        [1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 28, 29, 30, 31, 32, 33, 35, 36, 37, 39, 40], // YES
        [8, 38], // Reverse-score Yes means 0 points (high regret/ambiguity)
        []
      ),
      leadSource: 'facebook',
      utmSource: 'fb_ads',
      utmCampaign: 'elderly_protection_solar'
    },
    score: {
      salesConductScore: 98,
      financialBurdenScore: 88,
      contractRiskScore: 95,
      systemPerformanceScore: 78,
      resolutionReadinessScore: 98,
      finalScore: 92,
      scoreLabel: 'Strong Candidate for Review',
      leadQuality: 'Hot Lead',
      remainingTermCost: 114000,
      fullTermCost: 125160,
      pastPaidCost: 11160,
      projectedProjections: [],
      savingsLossStatus: 'losing',
      netDifference: -43100,
      concernTags: ['ITC Rebate Guarantee', 'Verification Call Coercion', 'Amortization Misrepresentation', 'Contract Terms Ambiguity', 'Lease/PPA Exposure']
    }
  }
];

const getLocalStorage = (): Storage | null => {
  if (typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
};

const initializeLocalStorage = () => {
  const ls = getLocalStorage();
  if (ls && !ls.getItem('src_leads')) {
    ls.setItem('src_leads', JSON.stringify(PRE_SEEDED_LEADS));
  }
};

export const leadDb = {
  async saveLeadApplication(inputs: FunnelInputs, score: ScoringResult): Promise<string> {
    const id = 'app_' + Math.random().toString(36).substring(2, 11);
    const newLead: LeadApplication = {
      id,
      inputs,
      score,
      status: 'New',
      notes: [],
      createdAt: new Date().toISOString()
    };

    if (hasFirebaseConfig) {
      try {
        const { db } = await import('./firebase');
        const { collection, doc, setDoc } = await import('firebase/firestore');
        
        await setDoc(doc(db, 'applications', id), {
          id,
          firstName: inputs.firstName,
          lastName: inputs.lastName,
          email: inputs.email,
          phone: inputs.phone,
          state: inputs.state,
          solarCompany: inputs.solarCompany,
          financeCompany: inputs.financeCompany,
          status: 'New',
          createdAt: newLead.createdAt,
          leadSource: inputs.leadSource || 'funnel',
          campaignId: inputs.campaignId || '',
          adSetId: inputs.adSetId || '',
          utmSource: inputs.utmSource || '',
          utmCampaign: inputs.utmCampaign || '',
          fbclid: inputs.fbclid || '',
          gclid: inputs.gclid || '',
          projectedLifetimeCost: score.fullTermCost,
          caseScore: score.finalScore,
          contractType: inputs.contractType,
          monthlyPayment: inputs.monthlyPayment
        });

        // Store answers record directly as a map of questionId -> answer
        await setDoc(doc(db, 'surveyAnswers', id), {
          id,
          answers: inputs.surveyAnswers
        });

        await setDoc(doc(db, 'financialSnapshots', id), {
          id,
          contractType: inputs.contractType,
          totalSystemPrice: inputs.totalSystemPrice,
          loanBalance: inputs.loanBalance,
          monthlyPayment: inputs.monthlyPayment,
          interestRate: inputs.interestRate,
          loanTerm: inputs.loanTerm,
          remainingTerm: inputs.remainingTerm,
          paymentEscalator: inputs.paymentEscalator,
          escalatorPercentage: inputs.escalatorPercentage,
          preSolarUtilityBill: inputs.preSolarUtilityBill,
          currentUtilityBill: inputs.currentUtilityBill,
          taxCreditPromised: inputs.taxCreditPromised,
          taxCreditReceived: inputs.taxCreditReceived,
          systemPerformance: inputs.systemPerformance
        });

        await setDoc(doc(db, 'scores', id), {
          id,
          finalScore: score.finalScore,
          scoreLabel: score.scoreLabel,
          salesConductScore: score.salesConductScore,
          financialBurdenScore: score.financialBurdenScore,
          contractRiskScore: score.contractRiskScore,
          systemPerformanceScore: score.systemPerformanceScore,
          resolutionReadinessScore: score.resolutionReadinessScore,
          leadQuality: score.leadQuality,
          concernTags: score.concernTags
        });

        return id;
      } catch (error) {
        console.warn('Firebase save failed, falling back to LocalStorage:', error);
      }
    }

    // Fallback: LocalStorage
    initializeLocalStorage();
    const ls = getLocalStorage();
    if (ls) {
      const currentLeadsRaw = ls.getItem('src_leads');
      const leads: LeadApplication[] = currentLeadsRaw ? JSON.parse(currentLeadsRaw) : [];
      leads.unshift(newLead);
      ls.setItem('src_leads', JSON.stringify(leads));
    }
    return id;
  },

  async getLeadApplications(): Promise<LeadApplication[]> {
    if (hasFirebaseConfig) {
      try {
        const { db } = await import('./firebase');
        const { collection, getDocs, doc, getDoc } = await import('firebase/firestore');
        
        const appSnapshot = await getDocs(collection(db, 'applications'));
        const leads: LeadApplication[] = [];

        for (const docRef of appSnapshot.docs) {
          const appData = docRef.data();
          const id = docRef.id;

          const surveySnap = await getDoc(doc(db, 'surveyAnswers', id));
          const financialSnap = await getDoc(doc(db, 'financialSnapshots', id));
          const scoreSnap = await getDoc(doc(db, 'scores', id));
          
          const notesSnap = await getDocs(collection(db, `applications/${id}/notes`));
          const notes: Array<{ text: string; createdAt: string }> = notesSnap.docs.map(n => ({
            text: n.data().text,
            createdAt: n.data().createdAt
          }));

          const surveyData = surveySnap.data() || {};
          const finData = financialSnap.data() || {};
          const scoreData = scoreSnap.data() || {};

          // Assemble inputs
          const inputs: FunnelInputs = {
            firstName: appData.firstName || '',
            lastName: appData.lastName || '',
            email: appData.email || '',
            phone: appData.phone || '',
            state: appData.state || '',
            contractType: appData.contractType || 'loan',
            solarCompany: appData.solarCompany || '',
            financeCompany: appData.financeCompany || '',
            totalSystemPrice: finData.totalSystemPrice || 0,
            loanBalance: finData.loanBalance || 0,
            monthlyPayment: appData.monthlyPayment || 0,
            interestRate: finData.interestRate || 0,
            loanTerm: finData.loanTerm || 25,
            remainingTerm: finData.remainingTerm || 25,
            paymentEscalator: finData.paymentEscalator || false,
            escalatorPercentage: finData.escalatorPercentage || 0,
            preSolarUtilityBill: finData.preSolarUtilityBill || 0,
            currentUtilityBill: finData.currentUtilityBill || 0,
            taxCreditPromised: finData.taxCreditPromised || false,
            taxCreditReceived: finData.taxCreditReceived || false,
            systemPerformance: finData.systemPerformance || 'working',
            surveyAnswers: surveyData.answers || {},
            leadSource: appData.leadSource || '',
            campaignId: appData.campaignId || '',
            adSetId: appData.adSetId || '',
            utmSource: appData.utmSource || '',
            utmCampaign: appData.utmCampaign || '',
            fbclid: appData.fbclid || '',
            gclid: appData.gclid || ''
          };

          // Assemble score
          const score: ScoringResult = {
            salesConductScore: scoreData.salesConductScore || 0,
            financialBurdenScore: scoreData.financialBurdenScore || 0,
            contractRiskScore: scoreData.contractRiskScore || 0,
            systemPerformanceScore: scoreData.systemPerformanceScore || 0,
            resolutionReadinessScore: scoreData.resolutionReadinessScore || 0,
            finalScore: appData.caseScore || 0,
            scoreLabel: scoreData.scoreLabel || 'Low Indicator',
            leadQuality: scoreData.leadQuality || 'Low Fit',
            remainingTermCost: finData.remainingTermCost || 0,
            fullTermCost: appData.projectedLifetimeCost || 0,
            pastPaidCost: 0,
            projectedProjections: [],
            savingsLossStatus: scoreData.savingsLossStatus || 'losing',
            netDifference: scoreData.netDifference || 0,
            concernTags: scoreData.concernTags || []
          };

          leads.push({
            id,
            inputs,
            score,
            status: appData.status || 'New',
            notes,
            createdAt: appData.createdAt || new Date().toISOString()
          });
        }
        return leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } catch (error) {
        console.warn('Firebase query failed, falling back to LocalStorage:', error);
      }
    }

    // Fallback LocalStorage
    initializeLocalStorage();
    const ls = getLocalStorage();
    if (ls) {
      const dataRaw = ls.getItem('src_leads');
      return dataRaw ? JSON.parse(dataRaw) : [];
    }
    return [];
  },

  async updateLeadStatus(id: string, status: LeadApplication['status']): Promise<void> {
    if (hasFirebaseConfig) {
      try {
        const { db } = await import('./firebase');
        const { doc, updateDoc } = await import('firebase/firestore');
        await updateDoc(doc(db, 'applications', id), { status });
        return;
      } catch (error) {
        console.warn('Firebase status update failed, falling back to LocalStorage:', error);
      }
    }

    const ls = getLocalStorage();
    if (ls) {
      const dataRaw = ls.getItem('src_leads');
      if (dataRaw) {
        const leads: LeadApplication[] = JSON.parse(dataRaw);
        const index = leads.findIndex(l => l.id === id);
        if (index > -1) {
          leads[index].status = status;
          ls.setItem('src_leads', JSON.stringify(leads));
        }
      }
    }
  },

  async addAdminNote(id: string, noteText: string): Promise<void> {
    const note = {
      text: noteText,
      createdAt: new Date().toISOString()
    };

    if (hasFirebaseConfig) {
      try {
        const { db } = await import('./firebase');
        const { collection, addDoc } = await import('firebase/firestore');
        await addDoc(collection(db, `applications/${id}/notes`), note);
        return;
      } catch (error) {
        console.warn('Firebase note save failed, falling back to LocalStorage:', error);
      }
    }

    const ls = getLocalStorage();
    if (ls) {
      const dataRaw = ls.getItem('src_leads');
      if (dataRaw) {
        const leads: LeadApplication[] = JSON.parse(dataRaw);
        const index = leads.findIndex(l => l.id === id);
        if (index > -1) {
          if (!leads[index].notes) leads[index].notes = [];
          leads[index].notes.unshift(note);
          ls.setItem('src_leads', JSON.stringify(leads));
        }
      }
    }
  },

  async saveEmailRecord(record: Omit<EmailRecord, 'id'> & { id?: string }): Promise<string> {
    const id = record.id || 'em_' + Math.random().toString(36).substring(2, 11);
    const newRecord: EmailRecord = { ...record, id };

    if (hasFirebaseConfig) {
      try {
        const { db } = await import('./firebase');
        const { doc, setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'emailLogs', id), newRecord);
        return id;
      } catch (error) {
        console.warn('Firebase email log save failed, falling back to LocalStorage:', error);
      }
    }

    // Fallback: LocalStorage
    const ls = typeof window !== 'undefined' ? window.localStorage : null;
    if (ls) {
      const currentLogsRaw = ls.getItem('src_email_logs');
      const logs: EmailRecord[] = currentLogsRaw ? JSON.parse(currentLogsRaw) : [];
      const existingIdx = logs.findIndex(log => log.id === id);
      if (existingIdx > -1) {
        logs[existingIdx] = newRecord;
      } else {
        logs.unshift(newRecord);
      }
      ls.setItem('src_email_logs', JSON.stringify(logs));
    }
    return id;
  }
};

export interface EmailRecord {
  id: string;
  clientEmail: string;
  reportId: string;
  score: number;
  dateSent: string;
  sentBy: string;
  pdfUrl?: string;
  status: 'pending' | 'mock_sent' | 'sent' | 'failed';
  provider: string;
  errorMessage?: string;
  sentAt: string;
}

export async function uploadPdfToStorage(pdfBase64: string, reportId: string, lastName: string): Promise<string | null> {
  if (!hasFirebaseConfig) return null;
  try {
    const { storage } = await import('./firebase');
    const { ref, uploadString, getDownloadURL } = await import('firebase/storage');
    const filename = `reports/Solar-Case-Score-${lastName}-${reportId}.pdf`;
    const storageRef = ref(storage, filename);
    await uploadString(storageRef, pdfBase64, 'base64', {
      contentType: 'application/pdf'
    });
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Failed to upload PDF to Firebase Storage:', error);
    return null;
  }
}

