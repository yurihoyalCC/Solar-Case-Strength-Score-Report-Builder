'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { FunnelInputs, ScoringResult, calculateSolarCaseScore } from '../services/scoring';
import { leadDb } from '../services/db';

interface FunnelContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  inputs: FunnelInputs;
  updateInputs: (fields: Partial<FunnelInputs>) => void;
  scoringResult: ScoringResult | null;
  calculateAndSaveResults: () => Promise<string>;
  resetFunnel: () => void;
  isSubmitting: boolean;
  submissionId: string | null;
}

const defaultInputs: FunnelInputs = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  state: '',
  contractType: 'loan',
  solarCompany: '',
  financeCompany: '',
  totalSystemPrice: 0,
  loanBalance: 0,
  monthlyPayment: 150,
  interestRate: 4.99,
  loanTerm: 25,
  remainingTerm: 20,
  paymentEscalator: false,
  escalatorPercentage: 2.9,
  preSolarUtilityBill: 200,
  currentUtilityBill: 80,
  taxCreditPromised: false,
  taxCreditReceived: false,
  systemPerformance: 'working',
  surveyAnswers: {},
  leadSource: 'funnel',
  campaignId: '',
  adSetId: '',
  utmSource: '',
  utmCampaign: '',
  fbclid: '',
  gclid: ''
};

const FunnelContext = createContext<FunnelContextType | undefined>(undefined);

export const FunnelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [inputs, setInputs] = useState<FunnelInputs>(defaultInputs);
  const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  // Capture UTM parameters from URL search query on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const utmFields: Partial<FunnelInputs> = {};
      
      const source = urlParams.get('utm_source');
      const campaign = urlParams.get('utm_campaign');
      const leadSrc = urlParams.get('lead_source');
      const adset = urlParams.get('adset_id');
      const campId = urlParams.get('campaign_id');
      const fbclid = urlParams.get('fbclid');
      const gclid = urlParams.get('gclid');

      if (source) utmFields.utmSource = source;
      if (campaign) utmFields.utmCampaign = campaign;
      if (leadSrc) utmFields.leadSource = leadSrc;
      if (adset) utmFields.adSetId = adset;
      if (campId) utmFields.campaignId = campId;
      if (fbclid) utmFields.fbclid = fbclid;
      if (gclid) utmFields.gclid = gclid;

      if (Object.keys(utmFields).length > 0) {
        setInputs(prev => ({ ...prev, ...utmFields }));
      }
    }
  }, []);

  const updateInputs = (fields: Partial<FunnelInputs>) => {
    setInputs(prev => ({ ...prev, ...fields }));
  };

  const calculateAndSaveResults = async (): Promise<string> => {
    setIsSubmitting(true);
    try {
      const results = calculateSolarCaseScore(inputs);
      setScoringResult(results);
      
      // Save directly to dynamic database
      const id = await leadDb.saveLeadApplication(inputs, results);
      setSubmissionId(id);
      setIsSubmitting(false);
      return id;
    } catch (error) {
      console.error('Submission failed:', error);
      setIsSubmitting(false);
      throw error;
    }
  };

  const resetFunnel = () => {
    setCurrentStep(1);
    setInputs(defaultInputs);
    setScoringResult(null);
    setSubmissionId(null);
    setIsSubmitting(false);
  };

  return (
    <FunnelContext.Provider value={{
      currentStep,
      setCurrentStep,
      inputs,
      updateInputs,
      scoringResult,
      calculateAndSaveResults,
      resetFunnel,
      isSubmitting,
      submissionId
    }}>
      {children}
    </FunnelContext.Provider>
  );
};

export const useFunnel = () => {
  const context = useContext(FunnelContext);
  if (!context) {
    throw new Error('useFunnel must be used within a FunnelProvider');
  }
  return context;
};
