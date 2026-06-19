'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useFunnel } from '@/context/FunnelContext';
import { generatePdfReport } from '@/services/pdfGenerator';
import { LeadApplication, leadDb, uploadPdfToStorage } from '@/services/db';
import { SURVEY_QUESTIONS } from '@/services/scoring';
import { 
  ShieldCheck, ArrowLeft, ArrowRight, User, Mail, Phone, MapPin, 
  DollarSign, Calculator, HelpCircle, CheckCircle, FileDown, 
  ChevronRight, AlertCircle, RefreshCw, Layers, Zap, Scale 
} from 'lucide-react';

function AboutSolarRelease({ className = '' }: { className?: string }) {
  return (
    <div className={`border-t border-navy-800/80 mt-8 pt-6 text-left ${className}`}>
      <h3 className="text-xs font-bold text-slate-350 uppercase tracking-widest mb-3">About Solar Release Co.</h3>
      <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
        Solar Release Co. is a consumer advocacy and contract review organization that helps homeowners better understand solar agreements, financing obligations, system performance concerns, and potential contract issues.
      </p>
      
      <p className="text-[11px] text-slate-350 font-bold mb-1.5">Our review process combines:</p>
      <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400 mb-4">
        <li>Contract Analysis</li>
        <li>Solar Case Strength Score™ Evaluation</li>
        <li>Financial Impact Review</li>
        <li>Documentation Review</li>
        <li>Attorney-Backed Escalation Pathways When Appropriate</li>
      </ul>
      
      <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
        Our goal is to help consumers better understand their options and make informed decisions regarding their solar agreements.
      </p>

      <div className="bg-navy-950/40 p-4 rounded-xl border border-navy-850 text-[10px] sm:text-[11px] text-slate-400 space-y-3">
        <div>
          <span className="block font-bold text-slate-200">Solar Release Co.</span>
          <span className="text-slate-450 text-[10px]">Consumer Contract Review Division</span>
        </div>
        <div>
          <span className="text-slate-500">www.SolarReleaseCo.com</span>
        </div>
        <div>
          <span className="block font-bold text-slate-300">Office:</span>
          <span className="text-slate-400">1-855-396-5090</span>
        </div>
        <div>
          <span className="block font-bold text-slate-300">Client Care:</span>
          <a href="mailto:clientcare@solarrelease.com" className="text-gold-400 hover:underline">clientcare@solarrelease.com</a>
        </div>
        <div>
          <span className="block italic text-slate-500">Case Review Team</span>
        </div>
      </div>
    </div>
  );
}

export default function FunnelPage() {
  const { 
    currentStep, 
    setCurrentStep, 
    inputs, 
    updateInputs, 
    scoringResult, 
    calculateAndSaveResults, 
    isSubmitting,
    submissionId 
  } = useFunnel();

  const [aiSummary, setAiSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>('Initializing analysis...');
  const [progressPercent, setProgressPercent] = useState<number>(0);

  // Email report states
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({
    email: '',
    firstName: '',
    cc: '',
    internalNotes: ''
  });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  // Prefill Email Form with user inputs when results page is reached
  useEffect(() => {
    if (currentStep === 8 && inputs) {
      setEmailForm(prev => ({
        ...prev,
        email: inputs.email || '',
        firstName: inputs.firstName || ''
      }));
    }
  }, [currentStep, inputs]);

  const handleEmailSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoringResult || !submissionId) return;

    setSendingEmail(true);
    setEmailStatus({ type: null, message: '' });

    const dateSent = new Date().toISOString();
    let emailLogId = '';
    
    // Log 'pending' status in Firebase/Logs
    try {
      emailLogId = await leadDb.saveEmailRecord({
        clientEmail: emailForm.email,
        reportId: submissionId,
        score: scoringResult.finalScore,
        dateSent,
        sentBy: 'Client',
        status: 'pending',
        provider: 'resend/sendgrid',
        sentAt: dateSent
      });
    } catch (dbErr) {
      console.warn('Failed to save pending email log:', dbErr);
    }

    try {
      // Generate PDF client-side without forcing immediate download
      const lead: LeadApplication = {
        id: submissionId,
        inputs: {
          ...inputs,
          firstName: emailForm.firstName,
          email: emailForm.email
        },
        score: scoringResult,
        status: 'New',
        notes: [],
        createdAt: new Date().toISOString()
      };
      
      const doc = await generatePdfReport(lead, false);
      const pdfBase64 = doc.output('datauristring').split(',')[1];

      // Upload PDF to storage if Firebase is configured
      let pdfUrl = '';
      try {
        const uploadedUrl = await uploadPdfToStorage(pdfBase64, submissionId, inputs.lastName || 'Client');
        if (uploadedUrl) {
          pdfUrl = uploadedUrl;
        }
      } catch (storageErr) {
        console.warn('Failed to upload PDF to Firebase Storage:', storageErr);
      }

      // POST to Route Handler API
      const response = await fetch('/api/email-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailForm.email,
          firstName: emailForm.firstName,
          cc: emailForm.cc || undefined,
          pdfBase64,
          reportId: submissionId,
          lastName: inputs.lastName || 'Client'
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setEmailStatus({
          type: 'success',
          message: 'Report emailed successfully.'
        });

        // Update record with success status ('sent' or 'mock_sent') and pdfUrl
        const finalStatus = result.provider === 'mock' ? 'mock_sent' : 'sent';
        if (emailLogId) {
          await leadDb.saveEmailRecord({
            id: emailLogId,
            clientEmail: emailForm.email,
            reportId: submissionId,
            score: scoringResult.finalScore,
            dateSent,
            sentBy: 'Client',
            pdfUrl,
            status: finalStatus,
            provider: result.provider,
            sentAt: new Date().toISOString()
          });
        }

        // Add internal notes to Firebase notes log if provided in modal
        if (emailForm.internalNotes.trim()) {
          try {
            await leadDb.addAdminNote(submissionId, `[Emailed Report Note] ${emailForm.internalNotes}`);
          } catch (noteErr) {
            console.warn('Failed to save email internal notes as admin lead note:', noteErr);
          }
        }

        // Auto close modal after 1.5 seconds
        setTimeout(() => {
          setIsEmailModalOpen(false);
          setEmailStatus({ type: null, message: '' });
          setEmailForm(prev => ({ ...prev, cc: '', internalNotes: '' }));
        }, 1500);

      } else {
        throw new Error(result.error || 'Failed to send email.');
      }

    } catch (err: any) {
      console.error('Email send error:', err);
      setEmailStatus({
        type: 'error',
        message: 'We were unable to send the report. Please check the email address and try again.'
      });

      // Update log with 'failed' status and error message
      if (emailLogId) {
        try {
          await leadDb.saveEmailRecord({
            id: emailLogId,
            clientEmail: emailForm.email,
            reportId: submissionId,
            score: scoringResult.finalScore,
            dateSent,
            sentBy: 'Client',
            status: 'failed',
            provider: 'error',
            errorMessage: err.message || 'Unknown sending error',
            sentAt: new Date().toISOString()
          });
        } catch (dbErr) {
          console.error('Failed to log failed email transaction:', dbErr);
        }
      }
    } finally {
      setSendingEmail(false);
    }
  };

  const standardSolar = ['Sunrun', 'Titan Solar Power', 'ADT Solar', 'Meraki Solar', 'SunPower', 'Sunnova', 'Momentum Solar', 'Trinity Solar'];
  const standardFinance = ['GoodLeap', 'Mosaic', 'Sunlight Financial', 'Dividend Finance', 'Sunrun', 'EverBright', 'Omnidian', 'Greensky'];

  const [solarOpt, setSolarOpt] = useState('');
  const [customSolarName, setCustomSolarName] = useState('');
  const [financeOpt, setFinanceOpt] = useState('');
  const [customFinanceName, setCustomFinanceName] = useState('');

  // Sync inputs on currentStep === 3
  useEffect(() => {
    if (currentStep === 3) {
      const isStdSolar = standardSolar.includes(inputs.solarCompany);
      setSolarOpt(inputs.solarCompany ? (isStdSolar ? inputs.solarCompany : 'OTHER') : '');
      setCustomSolarName(inputs.solarCompany ? (isStdSolar ? '' : inputs.solarCompany) : '');

      const isStdFinance = standardFinance.includes(inputs.financeCompany);
      setFinanceOpt(inputs.financeCompany ? (isStdFinance ? inputs.financeCompany : 'OTHER') : '');
      setCustomFinanceName(inputs.financeCompany ? (isStdFinance ? '' : inputs.financeCompany) : '');
    }
  }, [currentStep, inputs.solarCompany, inputs.financeCompany]);

  const [surveySection, setSurveySection] = useState(1);

  // Sync survey section when step changes
  useEffect(() => {
    if (currentStep === 6) {
      setSurveySection(1);
    }
  }, [currentStep]);

  // Loading Screen simulation (Step 7)
  useEffect(() => {
    if (currentStep === 7) {
      setProgressPercent(0);
      const messages = [
        'Parsing financial agreement parameters...',
        'Running historical utility baseline models...',
        'Checking contractor licensing directories...',
        'Calculating payment escalation projections...',
        'Computing weighted Solar Case Strength Score™...',
        'Assembling consumer protection diagnostic report...'
      ];
      
      let msgIdx = 0;
      let percent = 0;
      
      const interval = setInterval(() => {
        percent += 2;
        setProgressPercent(percent);
        
        if (percent % 16 === 0 && msgIdx < messages.length - 1) {
          msgIdx++;
          setLoadingText(messages[msgIdx]);
        }
        
        if (percent >= 100) {
          clearInterval(interval);
          // Complete calculations and advance
          calculateAndSaveResults().then(() => {
            setCurrentStep(8);
          }).catch(() => {
            setCurrentStep(8); // advance anyway with rule-based scores
          });
        }
      }, 60);

      return () => clearInterval(interval);
    }
  }, [currentStep, calculateAndSaveResults, setCurrentStep]);

  // Fetch AI generated summary when reaching results screen (Step 8)
  useEffect(() => {
    if (currentStep === 8 && scoringResult) {
      setLoadingSummary(true);
      fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs, score: scoringResult })
      })
      .then(res => res.json())
      .then(data => {
        if (data.summary) {
          setAiSummary(data.summary);
        } else {
          // fallback
          setAiSummary('');
        }
      })
      .catch(err => {
        console.error('Failed to generate summary:', err);
      })
      .finally(() => {
        setLoadingSummary(false);
      });
    }
  }, [currentStep, scoringResult, inputs]);

  // Confetti on step 10 (Confirmation)
  useEffect(() => {
    if (currentStep === 10) {
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#e2b659', '#1e293b', '#10b981']
        });
      });
    }
  }, [currentStep]);

  const handlePdfDownload = async () => {
    if (!scoringResult || !submissionId) return;
    
    const lead: LeadApplication = {
      id: submissionId,
      inputs,
      score: scoringResult,
      status: 'New',
      notes: [],
      createdAt: new Date().toISOString()
    };
    
    await generatePdfReport(lead);
  };

  // Helper validation
  const validateContact = () => {
    return inputs.firstName && inputs.lastName && inputs.email && inputs.phone && inputs.state;
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-red-500 border-red-500/30 bg-red-950/20';
    if (score >= 50) return 'text-amber-500 border-amber-500/30 bg-amber-950/20';
    if (score >= 25) return 'text-orange-400 border-orange-500/30 bg-orange-950/20';
    return 'text-emerald-500 border-emerald-500/30 bg-emerald-950/20';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 75) return 'bg-red-500/10 text-red-400 border border-red-500/20';
    if (score >= 50) return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    if (score >= 25) return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
    return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-navy-800 bg-navy-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-gold-400" />
            <span className="font-bold text-sm tracking-widest text-slate-300">SOLAR RELEASE CO.</span>
          </div>
          {currentStep <= 6 && (
            <div className="text-xs text-slate-400 font-medium">
              Diagnostic Step {currentStep} of 6
            </div>
          )}
          {currentStep > 7 && (
            <div className="text-xs text-gold-400 font-semibold uppercase tracking-wider">
              Diagnostic Complete
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-2xl bg-navy-900/40 border border-navy-800/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl relative">
          
          {/* Top colored border */}
          <div className="h-1.5 w-full bg-gradient-to-r from-gold-500 via-amber-500 to-gold-400"></div>

          {/* Steps Progress bar */}
          {currentStep <= 6 && (
            <div className="w-full h-1 bg-navy-800">
              <div 
                className="h-full bg-gold-400 transition-all duration-300"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              ></div>
            </div>
          )}

          <div className="p-6 sm:p-10">
            {/* SCREEN 2: Contact Information */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-2.5">
                  <User className="w-6 h-6 text-gold-400" />
                  Contact Information
                </h2>
                <p className="text-slate-400 text-sm mb-8">
                  Please provide your contact details to begin the diagnostic evaluation. Your information is protected under our strict privacy policy.
                </p>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">First Name</label>
                      <input 
                        type="text" 
                        value={inputs.firstName}
                        onChange={(e) => updateInputs({ firstName: e.target.value })}
                        placeholder="John"
                        className="w-full bg-navy-950 border border-navy-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Last Name</label>
                      <input 
                        type="text" 
                        value={inputs.lastName}
                        onChange={(e) => updateInputs({ lastName: e.target.value })}
                        placeholder="Doe"
                        className="w-full bg-navy-950 border border-navy-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-600" />
                      <input 
                        type="email" 
                        value={inputs.email}
                        onChange={(e) => updateInputs({ email: e.target.value })}
                        placeholder="john.doe@example.com"
                        className="w-full bg-navy-950 border border-navy-700/80 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-3.5 w-4 h-4 text-slate-600" />
                        <input 
                          type="tel" 
                          value={inputs.phone}
                          onChange={(e) => updateInputs({ phone: e.target.value })}
                          placeholder="(555) 555-5555"
                          className="w-full bg-navy-950 border border-navy-700/80 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">State</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-slate-600" />
                        <select 
                          value={inputs.state}
                          onChange={(e) => updateInputs({ state: e.target.value })}
                          className="w-full bg-navy-950 border border-navy-700/80 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors text-sm appearance-none"
                        >
                          <option value="">Select State</option>
                          <option value="AL">Alabama</option>
                          <option value="AK">Alaska</option>
                          <option value="AZ">Arizona</option>
                          <option value="AR">Arkansas</option>
                          <option value="CA">California</option>
                          <option value="CO">Colorado</option>
                          <option value="CT">Connecticut</option>
                          <option value="DE">Delaware</option>
                          <option value="FL">Florida</option>
                          <option value="GA">Georgia</option>
                          <option value="HI">Hawaii</option>
                          <option value="ID">Idaho</option>
                          <option value="IL">Illinois</option>
                          <option value="IN">Indiana</option>
                          <option value="IA">Iowa</option>
                          <option value="KS">Kansas</option>
                          <option value="KY">Kentucky</option>
                          <option value="LA">Louisiana</option>
                          <option value="ME">Maine</option>
                          <option value="MD">Maryland</option>
                          <option value="MA">Massachusetts</option>
                          <option value="MI">Michigan</option>
                          <option value="MN">Minnesota</option>
                          <option value="MS">Mississippi</option>
                          <option value="MO">Missouri</option>
                          <option value="MT">Montana</option>
                          <option value="NE">Nebraska</option>
                          <option value="NV">Nevada</option>
                          <option value="NH">New Hampshire</option>
                          <option value="NJ">New Jersey</option>
                          <option value="NM">New Mexico</option>
                          <option value="NY">New York</option>
                          <option value="NC">North Carolina</option>
                          <option value="ND">North Dakota</option>
                          <option value="OH">Ohio</option>
                          <option value="OK">Oklahoma</option>
                          <option value="OR">Oregon</option>
                          <option value="PA">Pennsylvania</option>
                          <option value="RI">Rhode Island</option>
                          <option value="SC">South Carolina</option>
                          <option value="SD">South Dakota</option>
                          <option value="TN">Tennessee</option>
                          <option value="TX">Texas</option>
                          <option value="UT">Utah</option>
                          <option value="VT">Vermont</option>
                          <option value="VA">Virginia</option>
                          <option value="WA">Washington</option>
                          <option value="WV">West Virginia</option>
                          <option value="WI">Wisconsin</option>
                          <option value="WY">Wyoming</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button 
                    disabled={!validateContact()}
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold text-navy-950 bg-gold-400 hover:bg-gold-300 disabled:bg-navy-800 disabled:text-slate-600 transition-colors shadow-lg shadow-gold-500/5 cursor-pointer"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 3: Contract Type Selection */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-2.5">
                  <Layers className="w-6 h-6 text-gold-400" />
                  Contract Type
                </h2>
                <p className="text-slate-400 text-sm mb-8">
                  Solar agreements are structured differently. Select the type of agreement you signed.
                </p>

                <div className="grid grid-cols-1 gap-4">
                  {[
                    { key: 'loan', title: 'Solar Purchase Loan', desc: 'You financed the solar system. You own (or will own) the panels and make payments to a financing company.' },
                    { key: 'lease', title: 'Solar Lease Agreement', desc: 'You pay a fixed monthly rate to lease the panels from the installer. You do not own the equipment.' },
                    { key: 'ppa', title: 'Power Purchase Agreement (PPA)', desc: 'You do not own the system. You agree to purchase the power generated by the solar panels at a set rate per kWh.' }
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => updateInputs({ contractType: item.key as any })}
                      className={`text-left p-5 rounded-2xl border-2 transition-all ${
                        inputs.contractType === item.key 
                          ? 'border-gold-500 bg-gold-500/5 shadow-md shadow-gold-500/5' 
                          : 'border-navy-800 bg-navy-950/40 hover:border-navy-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-extrabold text-white text-base">{item.title}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          inputs.contractType === item.key ? 'border-gold-500 bg-gold-500' : 'border-slate-700'
                        }`}>
                          {inputs.contractType === item.key && <div className="w-2 h-2 rounded-full bg-navy-950"></div>}
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex justify-between">
                  <button 
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                  <button 
                    onClick={() => setCurrentStep(3)}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold text-navy-950 bg-gold-400 hover:bg-gold-300 transition-colors shadow-lg"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 4: Solar Company and Finance Company details */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-2.5">
                  <Zap className="w-6 h-6 text-gold-400" />
                  Company Details
                </h2>
                <p className="text-slate-400 text-sm mb-8">
                  Identify the contractor who sold/installed the system and the financial company managing the billing.
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Solar Installation / Sales Company</label>
                    <select
                      value={solarOpt}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSolarOpt(val);
                        if (val !== 'OTHER') {
                          updateInputs({ solarCompany: val });
                        } else {
                          updateInputs({ solarCompany: customSolarName });
                        }
                      }}
                      className="w-full bg-navy-950 border border-navy-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors text-sm appearance-none"
                    >
                      <option value="">Select Solar Company</option>
                      <option value="Sunrun">Sunrun</option>
                      <option value="Titan Solar Power">Titan Solar Power</option>
                      <option value="ADT Solar">ADT Solar</option>
                      <option value="Meraki Solar">Meraki Solar</option>
                      <option value="SunPower">SunPower</option>
                      <option value="Sunnova">Sunnova</option>
                      <option value="Momentum Solar">Momentum Solar</option>
                      <option value="Trinity Solar">Trinity Solar</option>
                      <option value="OTHER">Other / Unknown</option>
                    </select>

                    {solarOpt === 'OTHER' && (
                      <div className="mt-3 animate-fade-in">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Specify Solar Installer Name</label>
                        <input 
                          type="text" 
                          value={customSolarName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomSolarName(val);
                            updateInputs({ solarCompany: val });
                          }}
                          placeholder="Type company name manually..."
                          className="w-full bg-navy-950 border border-navy-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors text-xs"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Financing / Billing Company</label>
                    <select
                      value={financeOpt}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFinanceOpt(val);
                        if (val !== 'OTHER') {
                          updateInputs({ financeCompany: val });
                        } else {
                          updateInputs({ financeCompany: customFinanceName });
                        }
                      }}
                      className="w-full bg-navy-950 border border-navy-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors text-sm appearance-none"
                    >
                      <option value="">Select Finance Provider</option>
                      <option value="GoodLeap">GoodLeap (formerly Loanpal)</option>
                      <option value="Mosaic">Mosaic</option>
                      <option value="Sunlight Financial">Sunlight Financial</option>
                      <option value="Dividend Finance">Dividend Finance</option>
                      <option value="Sunrun">Sunrun Financial</option>
                      <option value="EverBright">EverBright</option>
                      <option value="Omnidian">Omnidian</option>
                      <option value="Greensky">GreenSky</option>
                      <option value="OTHER">Other / Unknown</option>
                    </select>

                    {financeOpt === 'OTHER' && (
                      <div className="mt-3 animate-fade-in">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Specify Finance Provider Name</label>
                        <input 
                          type="text" 
                          value={customFinanceName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomFinanceName(val);
                            updateInputs({ financeCompany: val });
                          }}
                          placeholder="Type provider name manually..."
                          className="w-full bg-navy-950 border border-navy-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors text-xs"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button 
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                  <button 
                    disabled={!inputs.solarCompany || !inputs.financeCompany}
                    onClick={() => setCurrentStep(4)}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold text-navy-950 bg-gold-400 hover:bg-gold-300 disabled:bg-navy-800 disabled:text-slate-600 transition-colors shadow-lg cursor-pointer"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 5: Loan / lease / PPA financial snapshot */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-2.5">
                  <DollarSign className="w-6 h-6 text-gold-400" />
                  Financial Snapshot
                </h2>
                <p className="text-slate-400 text-sm mb-8">
                  Provide current agreement figures. Approximate estimates are acceptable.
                </p>

                <div className="space-y-6">
                  {inputs.contractType === 'loan' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total System Price ($)</label>
                        <input 
                          type="number" 
                          value={inputs.totalSystemPrice || ''}
                          onChange={(e) => updateInputs({ totalSystemPrice: Number(e.target.value) })}
                          placeholder="e.g. 45000"
                          className="w-full bg-navy-950 border border-navy-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Loan Balance ($)</label>
                        <input 
                          type="number" 
                          value={inputs.loanBalance || ''}
                          onChange={(e) => updateInputs({ loanBalance: Number(e.target.value) })}
                          placeholder="e.g. 42000"
                          className="w-full bg-navy-950 border border-navy-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Monthly Payment ($)</label>
                      <input 
                        type="number" 
                        value={inputs.monthlyPayment || ''}
                        onChange={(e) => updateInputs({ monthlyPayment: Number(e.target.value) })}
                        placeholder="e.g. 150"
                        className="w-full bg-navy-950 border border-navy-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                      />
                    </div>
                    
                    {inputs.contractType === 'loan' ? (
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Interest Rate (%)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={inputs.interestRate || ''}
                          onChange={(e) => updateInputs({ interestRate: Number(e.target.value) })}
                          placeholder="e.g. 3.99"
                          className="w-full bg-navy-950 border border-navy-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Contract Term (Years)</label>
                        <select
                          value={inputs.loanTerm}
                          onChange={(e) => updateInputs({ loanTerm: Number(e.target.value) })}
                          className="w-full bg-navy-950 border border-navy-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors text-sm appearance-none"
                        >
                          <option value={15}>15 Years</option>
                          <option value={20}>20 Years</option>
                          <option value={25}>25 Years</option>
                          <option value={30}>30 Years</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {inputs.contractType === 'loan' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Loan Term (Years)</label>
                        <select
                          value={inputs.loanTerm}
                          onChange={(e) => updateInputs({ loanTerm: Number(e.target.value) })}
                          className="w-full bg-navy-950 border border-navy-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors text-sm appearance-none"
                        >
                          <option value={15}>15 Years</option>
                          <option value={20}>20 Years</option>
                          <option value={25}>25 Years</option>
                          <option value={30}>30 Years</option>
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Remaining Term (Years)</label>
                      <input 
                        type="number" 
                        value={inputs.remainingTerm || ''}
                        onChange={(e) => updateInputs({ remainingTerm: Number(e.target.value) })}
                        placeholder="e.g. 21"
                        className="w-full bg-navy-950 border border-navy-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button 
                    onClick={() => setCurrentStep(3)}
                    className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                  <button 
                    disabled={!inputs.monthlyPayment || !inputs.remainingTerm}
                    onClick={() => setCurrentStep(5)}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold text-navy-950 bg-gold-400 hover:bg-gold-300 disabled:bg-navy-800 disabled:text-slate-600 transition-colors shadow-lg cursor-pointer"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 6: Lifetime cost calculator details */}
            {currentStep === 5 && (
              <div>
                <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-2.5">
                  <Calculator className="w-6 h-6 text-gold-400" />
                  Calculator Inputs
                </h2>
                <p className="text-slate-400 text-sm mb-8">
                  Enter utility costs and specific contract provisions to project estimated lifetime obligations.
                </p>

                <div className="space-y-6">
                  {/* Utility bills */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pre-Solar Utility Bill ($/mo)</label>
                      <input 
                        type="number" 
                        value={inputs.preSolarUtilityBill || ''}
                        onChange={(e) => updateInputs({ preSolarUtilityBill: Number(e.target.value) })}
                        placeholder="e.g. 200"
                        className="w-full bg-navy-950 border border-navy-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Utility Bill ($/mo)</label>
                      <input 
                        type="number" 
                        value={inputs.currentUtilityBill || ''}
                        onChange={(e) => updateInputs({ currentUtilityBill: Number(e.target.value) })}
                        placeholder="e.g. 60"
                        className="w-full bg-navy-950 border border-navy-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                      />
                    </div>
                  </div>

                  {/* Escalator */}
                  <div className="p-4 bg-navy-950/60 border border-navy-800 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-sm font-bold text-white mb-0.5">Payment Escalator Clause</span>
                        <span className="block text-xs text-slate-400">Does your agreement payment increase annually?</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={inputs.paymentEscalator}
                          onChange={(e) => updateInputs({ paymentEscalator: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-navy-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
                      </label>
                    </div>
                    
                    {inputs.paymentEscalator && (
                      <div className="mt-4 pt-4 border-t border-navy-800/80 flex items-center justify-between">
                        <span className="text-xs text-slate-400">Annual Escalator Rate (%)</span>
                        <input 
                          type="number" 
                          step="0.1"
                          value={inputs.escalatorPercentage || ''}
                          onChange={(e) => updateInputs({ escalatorPercentage: Number(e.target.value) })}
                          placeholder="e.g. 2.9"
                          className="w-24 bg-navy-950 border border-navy-700/80 rounded-lg px-2.5 py-1.5 text-right text-white focus:outline-none focus:border-gold-500 text-xs"
                        />
                      </div>
                    )}
                  </div>

                  {/* Tax Credit promises */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-navy-950/60 border border-navy-800 rounded-2xl">
                      <span className="block text-xs text-slate-400 mb-2">Promised Federal Tax Credit?</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => updateInputs({ taxCreditPromised: true })}
                          className={`flex-grow py-2 rounded-xl text-xs font-bold transition-all ${
                            inputs.taxCreditPromised ? 'bg-gold-500/10 text-gold-400 border border-gold-500/30' : 'bg-navy-900 text-slate-500 border border-transparent'
                          }`}
                        >
                          Yes
                        </button>
                        <button 
                          onClick={() => updateInputs({ taxCreditPromised: false, taxCreditReceived: false })}
                          className={`flex-grow py-2 rounded-xl text-xs font-bold transition-all ${
                            !inputs.taxCreditPromised ? 'bg-slate-800/40 text-slate-300 border border-slate-700/40' : 'bg-navy-900 text-slate-500 border border-transparent'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {inputs.taxCreditPromised && (
                      <div className="p-4 bg-navy-950/60 border border-navy-800 rounded-2xl animate-fade-in">
                        <span className="block text-xs text-slate-400 mb-2">Actually Received Tax Credit?</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => updateInputs({ taxCreditReceived: true })}
                            className={`flex-grow py-2 rounded-xl text-xs font-bold transition-all ${
                              inputs.taxCreditReceived ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-navy-900 text-slate-500 border border-transparent'
                            }`}
                          >
                            Yes
                          </button>
                          <button 
                            onClick={() => updateInputs({ taxCreditReceived: false })}
                            className={`flex-grow py-2 rounded-xl text-xs font-bold transition-all ${
                              !inputs.taxCreditReceived ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-navy-900 text-slate-500 border border-transparent'
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* System performance status */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">System Performance Status</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'working', label: 'Working' },
                        { key: 'underperforming', label: 'Underproducing' },
                        { key: 'non-operational', label: 'Broken / Off' }
                      ].map(perf => (
                        <button
                          key={perf.key}
                          onClick={() => updateInputs({ systemPerformance: perf.key as any })}
                          className={`py-3.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                            inputs.systemPerformance === perf.key
                              ? 'border-gold-500 bg-gold-500/5 text-gold-400'
                              : 'border-navy-800 bg-navy-950/40 text-slate-400 hover:border-navy-700'
                          }`}
                        >
                          {perf.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button 
                    onClick={() => setCurrentStep(4)}
                    className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                  <button 
                    onClick={() => setCurrentStep(6)}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold text-navy-950 bg-gold-400 hover:bg-gold-300 transition-colors shadow-lg"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 7: Solar experience survey */}
            {currentStep === 6 && (
              <div>
                <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-2.5">
                  <HelpCircle className="w-6 h-6 text-gold-400" />
                  Solar Experience Survey
                </h2>
                <p className="text-slate-400 text-sm mb-4">
                  Identify reported concern areas. Select an option for each question.
                </p>

                {/* Section Progress Tabs */}
                <div className="flex justify-between items-center bg-navy-950/60 p-2.5 rounded-xl border border-navy-850 mb-6 text-center text-[10px] font-extrabold uppercase tracking-wider gap-1.5 flex-wrap md:flex-nowrap">
                  {[
                    { id: 1, label: 'Sales Conduct' },
                    { id: 2, label: 'Financial' },
                    { id: 3, label: 'Contract' },
                    { id: 4, label: 'Performance' },
                    { id: 5, label: 'Resolution' }
                  ].map(sec => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setSurveySection(sec.id)}
                      className={`flex-grow md:flex-grow-0 px-2.5 py-1.5 rounded-md transition-all text-center cursor-pointer ${
                        surveySection === sec.id 
                          ? 'bg-gold-500/10 text-gold-400 border border-gold-500/30' 
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 mb-6 scrollbar">
                  {SURVEY_QUESTIONS.filter(q => q.section === surveySection).map((q) => {
                    const currentAnswer = inputs.surveyAnswers[q.id] || '';
                    return (
                      <div key={q.id} className="space-y-2.5 border-b border-navy-900/60 pb-5 last:border-b-0 last:pb-0">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Question {q.id}</span>
                        <p className="text-sm font-semibold text-slate-200 leading-relaxed">{q.text}</p>
                        
                        {/* 4 Choices */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { key: 'yes', label: 'Yes' },
                            { key: 'no', label: 'No' },
                            { key: 'not_sure', label: 'Not Sure' },
                            { key: 'somewhat', label: 'Somewhat' }
                          ].map(opt => (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => {
                                updateInputs({
                                  surveyAnswers: {
                                    ...inputs.surveyAnswers,
                                    [q.id]: opt.key as any
                                  }
                                });
                              }}
                              className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                currentAnswer === opt.key
                                  ? 'border-gold-500 bg-gold-500/10 text-gold-400 shadow-sm shadow-gold-500/5'
                                  : 'border-navy-800 bg-navy-950/40 text-slate-400 hover:border-navy-750'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-between border-t border-navy-850/80 pt-6">
                  {surveySection > 1 ? (
                    <button 
                      type="button"
                      onClick={() => setSurveySection(prev => prev - 1)}
                      className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous Section
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => setCurrentStep(5)}
                      className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </button>
                  )}

                  {surveySection < 5 ? (
                    <button 
                      type="button"
                      onClick={() => setSurveySection(prev => prev + 1)}
                      className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold text-navy-950 bg-gold-400 hover:bg-gold-300 transition-colors shadow-lg cursor-pointer"
                    >
                      Next Section
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => setCurrentStep(7)}
                      className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold text-navy-950 bg-gold-400 hover:bg-gold-300 transition-colors shadow-lg font-extrabold cursor-pointer animate-pulse"
                    >
                      Calculate My Score
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* SCREEN 8: Score calculation loading screen */}
            {currentStep === 7 && (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <RefreshCw className="w-12 h-12 text-gold-400 animate-spin mb-6 stroke-[1.5]" />
                
                <h2 className="text-2xl font-black text-white mb-2">Analyzing Agreement Details</h2>
                <p className="text-slate-400 text-sm max-w-md mx-auto mb-10 h-10">
                  {loadingText}
                </p>

                {/* Progress bar */}
                <div className="w-full max-w-md bg-navy-950 h-2.5 rounded-full overflow-hidden border border-navy-800">
                  <div 
                    className="h-full bg-gradient-to-r from-gold-500 to-amber-500 transition-all duration-100 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gold-400 font-extrabold mt-3 tracking-widest">{progressPercent}% COMPLETE</span>
              </div>
            )}

            {/* SCREEN 9: Solar Case Score™ results page */}
            {currentStep === 8 && scoringResult && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b border-navy-800/40">
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                      <Scale className="w-6 h-6 text-gold-400" />
                      Solar Case Strength Score™ Results
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                      Review diagnostics reflecting financial cost projections and specific concern indicator scores.
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <button 
                      onClick={() => setIsEmailModalOpen(true)}
                      className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-navy-950 border border-gold-500/50 hover:bg-navy-900 transition-colors shadow-lg cursor-pointer"
                    >
                      <Mail className="w-4 h-4 mr-2 text-gold-400" />
                      Email Report
                    </button>
                    <button 
                      onClick={handlePdfDownload}
                      className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-navy-950 border border-gold-500/50 hover:bg-navy-900 transition-colors shadow-lg cursor-pointer"
                    >
                      <FileDown className="w-4 h-4 mr-2 text-gold-400" />
                      Download PDF
                    </button>
                  </div>
                </div>

                {/* Score Circle Card */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-navy-950/60 p-6 rounded-2xl border border-navy-850 mb-6">
                  <div className="md:col-span-4 flex flex-col items-center justify-center py-4 border-b md:border-b-0 md:border-r border-navy-800/80">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">Case Score</span>
                    
                    {/* Ring */}
                    <div className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center shadow-inner ${getScoreColor(scoringResult.finalScore)}`}>
                      <span className="text-4xl font-black">{scoringResult.finalScore}</span>
                      <span className="text-[10px] text-slate-400 font-semibold mt-0.5">/ 100</span>
                    </div>

                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mt-4 text-center ${getScoreBadgeColor(scoringResult.finalScore)}`}>
                      {scoringResult.scoreLabel}
                    </span>
                  </div>

                  <div className="md:col-span-8 flex flex-col justify-center space-y-4">
                    <span className="text-xs text-slate-300 font-extrabold uppercase tracking-wider">Indicator Categories:</span>
                    
                    {[
                      { name: 'Sales Conduct Indicator', score: scoringResult.salesConductScore },
                      { name: 'Financial Burden', score: scoringResult.financialBurdenScore },
                      { name: 'Contract Risk', score: scoringResult.contractRiskScore },
                      { name: 'System Performance', score: scoringResult.systemPerformanceScore },
                      { name: 'Resolution Readiness', score: scoringResult.resolutionReadinessScore }
                    ].map((cat, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-400">{cat.name}</span>
                          <span className="text-white">{cat.score}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-navy-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gold-400 rounded-full"
                            style={{ width: `${cat.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Urgency Prompt Alert */}
                <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-xl mb-6">
                  <p className="text-xs text-red-400 leading-relaxed font-medium">
                    Your answers show multiple review indicators that may be time-sensitive, especially if payments are escalating, the installer is no longer responsive, or you were promised savings that have not happened.
                  </p>
                </div>

                {/* CASE PROGRESS TRACKER */}
                <div className="bg-navy-950/60 p-6 rounded-2xl border border-navy-850 mb-6 space-y-4 text-left">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider border-b border-navy-800 pb-2 flex items-center gap-2">
                    Case Progress Tracker
                  </h3>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
                      <span className="text-slate-200 font-extrabold flex items-center gap-1.5">
                        Progress: <span className="text-gold-400">50% Complete</span>
                      </span>
                      <span className="text-slate-400 font-semibold">
                        You have completed 3 of 6 review stages.
                      </span>
                    </div>
                    <div className="w-full bg-navy-900 h-2 rounded-full overflow-hidden border border-navy-800">
                      <div className="h-full bg-gradient-to-r from-gold-500 via-amber-500 to-gold-400 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                    <p className="text-[11px] text-slate-400 italic">
                      Your case has successfully advanced through the initial review phase.
                    </p>
                  </div>

                  {/* Vertical Timeline steps */}
                  <div className="relative border-l border-navy-800 pl-6 ml-3.5 space-y-5 pt-1">
                    {[
                      {
                        title: "Step 1: Consumer Took Action",
                        status: "Complete",
                        desc: "You requested a professional review of your solar agreement and submitted your information for analysis.",
                        completed: true,
                        statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                      },
                      {
                        title: "Step 2: Fraud Survey Completed",
                        status: "Complete",
                        desc: "Your responses were reviewed and analyzed for potential sales conduct, financial disclosure, performance, and contract concerns.",
                        completed: true,
                        statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                      },
                      {
                        title: "Step 3: Diagnostic Review Completed",
                        status: "QUALIFIED",
                        desc: "Your Solar Case Strength Score™ and initial diagnostic findings have been generated and reviewed.",
                        completed: true,
                        statusColor: "text-gold-400 bg-gold-500/10 border-gold-500/20"
                      },
                      {
                        title: "Step 4: Case Manager Review",
                        status: "PENDING",
                        desc: "A case specialist will review your submitted information, confirm the case details, and identify which supporting documents may be needed for legal review.",
                        completed: false,
                        statusColor: "text-slate-500 bg-navy-950 border-navy-800"
                      },
                      {
                        title: "Step 5: Document Collection",
                        status: "PENDING",
                        desc: "Installation agreements, finance agreements, utility bills, payment records, and related documents may be requested for detailed review.",
                        completed: false,
                        statusColor: "text-slate-500 bg-navy-950 border-navy-800"
                      },
                      {
                        title: "Step 6: Resolution Strategy & Final Report",
                        status: "Pending",
                        desc: "A comprehensive fraud report and recommended resolution pathway will be prepared based on all available evidence.",
                        completed: false,
                        statusColor: "text-slate-500 bg-navy-950 border-navy-800"
                      }
                    ].map((step, idx) => (
                      <div key={idx} className="relative">
                        {/* Circle dot on vertical line */}
                        <div className={`absolute -left-[35px] top-0.5 w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-bold ${
                          step.completed ? 'bg-gold-500 border-gold-400 text-navy-950' : 'bg-navy-950 border-navy-800 text-slate-650'
                        }`}>
                          {step.completed ? '✓' : idx + 1}
                        </div>

                        {/* Step Details */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-white">{step.title}</h4>
                            <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border ${step.statusColor}`}>
                              {step.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed max-w-xl">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CONTRACT & COST CALCULATOR METRICS */}
                <div className="bg-navy-950/60 p-6 rounded-2xl border border-navy-850 mb-6 text-left">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider border-b border-navy-800 pb-2 mb-4">
                    Contract & Cost Calculator Metrics
                  </h3>

                  {/* Metrics Table */}
                  <div className="space-y-3 mb-6 text-xs">
                    {[
                      { label: 'Current Monthly Payment:', val: `$${inputs.monthlyPayment.toFixed(2)}` },
                      { label: 'Payment Escalator:', val: inputs.paymentEscalator ? `Yes (${inputs.escalatorPercentage}%)` : 'No' },
                      { label: 'Remaining Term:', val: `${inputs.remainingTerm} Years` },
                      { label: 'Pre-Solar Utility Bill:', val: `$${inputs.preSolarUtilityBill.toFixed(2)}` },
                      { label: 'Current Utility Bill (Post-Solar):', val: `$${inputs.currentUtilityBill.toFixed(2)}` },
                      { label: 'Projected Remaining Contract Cost:', val: `$${scoringResult.remainingTermCost.toLocaleString(undefined, {maximumFractionDigits: 0})}` }
                    ].map((row, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-navy-900/60 last:border-0">
                        <span className="text-slate-400 font-medium">{row.label}</span>
                        <strong className="text-white font-bold">{row.val}</strong>
                      </div>
                    ))}
                  </div>

                  {/* PREMIUM HIGHLIGHT PANEL FOR ESTIMATED FULL-TERM COST */}
                  <div className="bg-[#FFF5F5] border-2 border-[#EF4444] rounded-2xl p-5 sm:p-6 relative overflow-hidden mb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs sm:text-sm font-bold text-[#DC2626] uppercase tracking-wider block">
                          Estimated Full-Term Cost
                        </span>
                        <p className="text-[11px] sm:text-xs text-slate-700 font-medium leading-normal max-w-sm">
                          Projected total financial obligation over the life of the agreement.
                        </p>
                      </div>
                      
                      <div className="text-left sm:text-right flex flex-col sm:items-start sm:items-end gap-1.5">
                        <div className="bg-white border border-[#EF4444] text-[#DC2626] text-[8px] sm:text-[9px] font-extrabold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase tracking-wider inline-block w-fit">
                          Total Cost Commitment
                        </div>
                        <div className="text-3xl sm:text-4xl font-extrabold text-[#DC2626] tracking-tight leading-none">
                          ${scoringResult.fullTermCost.toLocaleString(undefined, {maximumFractionDigits: 0})}
                        </div>
                        
                        {/* Monthly & Annual Perspectives */}
                        <div className="mt-2 text-[11px] sm:text-xs text-slate-700 font-semibold space-y-0.5">
                          <div>
                            Current Monthly Cost: <span className="text-slate-900 font-bold">${(inputs.monthlyPayment + inputs.currentUtilityBill).toLocaleString(undefined, {maximumFractionDigits: 0})}/mo</span>
                          </div>
                          <div>
                            Equivalent Annual Cost: <span className="text-slate-900 font-bold">${((inputs.monthlyPayment + inputs.currentUtilityBill) * 12).toLocaleString(undefined, {maximumFractionDigits: 0})}/yr</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Divider line */}
                    <div className="border-t border-[#EF4444]/20 my-4"></div>

                    {/* Warning statement */}
                    <div className="flex items-start gap-2.5 text-left">
                      <span className="text-[#DC2626] text-lg leading-none select-none">⚠</span>
                      <div className="space-y-1">
                        <span className="block text-xs font-bold text-[#DC2626] uppercase tracking-wider">
                          Total Cost Commitment
                        </span>
                        <p className="text-[11px] sm:text-xs text-slate-700 font-medium leading-relaxed">
                          This represents your estimated total financial commitment if the agreement remains in place through the full contract term and no changes are made.
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed">
                          Actual costs may vary based on escalators, utility usage, system performance, financing terms, and contract-specific provisions.
                        </p>
                      </div>
                    </div>

                    {/* Legal Disclaimer */}
                    <div className="mt-4 pt-3 border-t border-[#EF4444]/10 text-[9px] text-slate-500 italic leading-relaxed">
                      This estimate assumes the agreement remains active for the full contract term and does not account for future modifications, settlements, transfers, refinancing, or early termination.
                    </div>
                  </div>
                </div>

                {/* COST PERSPECTIVE SECTION */}
                <div className="bg-navy-950/60 p-6 rounded-2xl border border-navy-850 mb-6 text-left">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider border-b border-navy-800 pb-2 mb-4">
                    Cost Perspective
                  </h3>
                  
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400 font-medium">Current Monthly Utility Before Solar:</span>
                      <strong className="text-white font-bold">${inputs.preSolarUtilityBill.toLocaleString()}/mo</strong>
                    </div>
                    
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400 font-medium">Current Combined Solar + Utility Cost:</span>
                      <strong className="text-white font-bold">${(inputs.monthlyPayment + inputs.currentUtilityBill).toLocaleString()}/mo</strong>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-navy-900/60 my-2"></div>

                    {/* Monthly Difference */}
                    {(() => {
                      const diff = (inputs.monthlyPayment + inputs.currentUtilityBill) - inputs.preSolarUtilityBill;
                      const isCostIncreased = diff > 2;
                      const isCostReduced = diff < -2;
                      
                      let diffColor = 'text-slate-300';
                      let diffBg = 'bg-slate-950/20 border-slate-800/40';
                      let label = 'Minimal Difference';
                      
                      if (isCostIncreased) {
                        diffColor = 'text-red-400';
                        diffBg = 'bg-red-500/10 border-red-500/20';
                        label = `+$${diff.toLocaleString(undefined, {maximumFractionDigits: 0})}/mo Cost Increase`;
                      } else if (isCostReduced) {
                        diffColor = 'text-emerald-400';
                        diffBg = 'bg-emerald-500/10 border-emerald-500/20';
                        label = `-$${Math.abs(diff).toLocaleString(undefined, {maximumFractionDigits: 0})}/mo Cost Reduction`;
                      }

                      return (
                        <div className={`p-4 rounded-xl border flex items-center justify-between font-bold ${diffBg}`}>
                          <span className="text-slate-300 uppercase tracking-wider text-[10px]">Monthly Net Impact:</span>
                          <span className={`text-sm ${diffColor}`}>{label}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Projections Comparative Card */}
                <div className="bg-navy-950/60 p-6 rounded-2xl border border-navy-850 mb-6">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">Lifetime Projections Comparison</h3>
                  
                  {/* Projections Visual Bar */}
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-medium">Est. Full-Term Solar Agreement Liability:</span>
                        <span className="text-white font-bold">${scoringResult.fullTermCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                      </div>
                      <div className="h-4 bg-navy-900 rounded-md overflow-hidden relative flex items-center border border-navy-800">
                        <div className="h-full bg-amber-500/80 rounded-md" style={{ width: '100%' }}></div>
                      </div>
                    </div>

                    {scoringResult.netDifference < 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400 font-medium">Baseline Cost If You Had Kept Utility Only:</span>
                          <span className="text-emerald-400 font-bold">${(scoringResult.fullTermCost + scoringResult.netDifference).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                        </div>
                        <div className="h-4 bg-navy-900 rounded-md overflow-hidden relative flex items-center border border-navy-800">
                          <div 
                            className="h-full bg-emerald-500/80 rounded-md" 
                            style={{ width: `${((scoringResult.fullTermCost + scoringResult.netDifference) / scoringResult.fullTermCost) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-navy-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Net Contract Cost Discrepancy:</span>
                    <span className={scoringResult.netDifference < 0 ? 'text-red-400 font-extrabold' : 'text-emerald-400 font-extrabold'}>
                      {scoringResult.netDifference < 0 
                        ? `Paying $${Math.abs(scoringResult.netDifference).toLocaleString(undefined, {maximumFractionDigits: 0})} MORE than utility baseline`
                        : `Estimated savings of $${scoringResult.netDifference.toLocaleString(undefined, {maximumFractionDigits: 0})} over term`
                      }
                    </span>
                  </div>
                </div>

                {/* Concern Tags */}
                <div className="mb-6">
                  <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2.5">Flagged Risk Tags:</span>
                  <div className="flex flex-wrap gap-2">
                    {scoringResult.concernTags.map((tag, idx) => (
                      <span key={idx} className="bg-navy-950/80 border border-navy-800 text-[10px] text-gold-400 px-2.5 py-1 rounded-full font-bold">
                        {tag}
                      </span>
                    ))}
                    {scoringResult.concernTags.length === 0 && (
                      <span className="text-xs text-slate-500 italic">No concern flags triggered.</span>
                    )}
                  </div>
                </div>

                {/* AI / Custom Generated summary */}
                <div className="bg-navy-950/60 p-6 rounded-2xl border border-navy-850 mb-6">
                  <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">Diagnostic Summary:</span>
                  
                  {loadingSummary ? (
                    <div className="space-y-2.5 animate-pulse">
                      <div className="h-3 bg-navy-850 rounded-full w-full"></div>
                      <div className="h-3 bg-navy-850 rounded-full w-5/6"></div>
                      <div className="h-3 bg-navy-850 rounded-full w-4/6"></div>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {aiSummary}
                    </p>
                  )}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-navy-800/40 pt-6">
                  <div className="flex items-center gap-2.5">
                    <button 
                      onClick={() => setIsEmailModalOpen(true)}
                      className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-navy-950 border border-gold-500/50 hover:bg-navy-900 transition-colors shadow-lg cursor-pointer"
                    >
                      <Mail className="w-4 h-4 mr-2 text-gold-400" />
                      Email Report
                    </button>
                    <button 
                      onClick={handlePdfDownload}
                      className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-navy-950 border border-gold-500/50 hover:bg-navy-900 transition-colors shadow-lg cursor-pointer"
                    >
                      <FileDown className="w-4 h-4 mr-2 text-gold-400" />
                      Download PDF
                    </button>
                  </div>
                  <button 
                    onClick={() => setCurrentStep(9)}
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-bold text-navy-950 bg-gold-400 hover:bg-gold-300 transition-colors shadow-lg cursor-pointer"
                  >
                    View Attorney Review Recommendation
                    <ChevronRight className="w-4 h-4 ml-1.5" />
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 10: Recommended attorney-backed review CTA */}
            {currentStep === 9 && scoringResult && (
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-6 h-6 text-gold-400 stroke-[1.5]" />
                </div>

                <h2 className="text-2xl font-black text-white mb-3">Recommended Next Step</h2>
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold-400 mb-6">Attorney-Backed Review May Be Appropriate</span>

                <div className="bg-navy-950/60 p-6 rounded-2xl border border-navy-850 text-left max-w-xl mx-auto space-y-4 mb-8">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Based on your Solar Case Strength Score™ of <strong className="text-white font-bold">{scoringResult.finalScore}/100</strong> and multiple triggered indicators (such as {scoringResult.concernTags.slice(0, 3).join(', ')}), your agreement warrants professional analysis.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Solar Release Co. works alongside an independent network of consumer protection attorneys who specialize in resolving misrepresented solar agreements, title liens (UCC-1 statements), and performance breaches.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-400 border-t border-navy-800/80 pt-4">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                      No-cost consultation to evaluate legal options
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                      Detailed analysis of written terms and verification recordings
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                      Independent legal verification of UCC fixture liens
                    </li>
                  </ul>
                </div>

                <AboutSolarRelease className="max-w-xl mx-auto mb-8" />

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={() => setCurrentStep(8)}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Score
                  </button>
                  
                  <button 
                    disabled={isSubmitting}
                    onClick={() => setCurrentStep(10)}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-sm font-extrabold text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 transition-colors shadow-lg cursor-pointer"
                  >
                    {isSubmitting ? 'Requesting Review...' : 'Request My Solar Contract Review'}
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 11: Lead submission confirmation */}
            {currentStep === 10 && (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-emerald-400 stroke-[1.5]" />
                </div>

                <h2 className="text-2xl font-black text-white mb-2">Request Submitted Successfully</h2>
                <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mb-8">
                  Your solar diagnostic case profile has been logged. A Solar Release Co. consumer specialist will review your file and contact you at the details provided.
                </p>

                <div className="bg-navy-950/60 p-6 rounded-2xl border border-navy-850 max-w-md mx-auto text-left mb-8 space-y-3.5">
                  <span className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">What Happens Next:</span>
                  <div className="flex space-x-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-navy-800 flex items-center justify-center text-gold-400 font-bold flex-shrink-0">1</span>
                    <p className="text-slate-400 leading-normal"><strong className="text-white">Diagnostic Review:</strong> We analyze your cost snapshot and contract details internally (typically 24-48 hours).</p>
                  </div>
                  <div className="flex space-x-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-navy-800 flex items-center justify-center text-gold-400 font-bold flex-shrink-0">2</span>
                    <p className="text-slate-400 leading-normal"><strong className="text-white">Document Request:</strong> A case specialist may request your solar agreement, utility bills, and finance documents during review.</p>
                  </div>
                  <div className="flex space-x-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-navy-800 flex items-center justify-center text-gold-400 font-bold flex-shrink-0">3</span>
                    <p className="text-slate-400 leading-normal"><strong className="text-white">Counsel Coordination:</strong> If qualified, your file is matched with independent consumer protection counsel for a free formal review.</p>
                  </div>

                  <AboutSolarRelease />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={handlePdfDownload}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-bold text-navy-950 bg-gold-400 hover:bg-gold-300 transition-colors shadow-lg cursor-pointer"
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    Download Diagnostic Report (PDF)
                  </button>
                  
                  <Link 
                    href="/"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-bold text-slate-300 bg-navy-950 border border-navy-800 hover:bg-navy-900 transition-colors"
                  >
                    Return to Homepage
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Email Report Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-navy-900 border border-navy-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-navy-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-gold-400" />
                Email Solar Diagnostic Report
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Send a secure copy of the Solar Case Strength Score™ report PDF to the client and log the transaction.
              </p>
            </div>

            <form onSubmit={handleEmailSend} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Client Email Address
                </label>
                <input
                  type="email"
                  required
                  disabled={sendingEmail}
                  value={emailForm.email}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="client@example.com"
                  className="w-full bg-navy-950 border border-navy-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-650 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Client First Name
                </label>
                <input
                  type="text"
                  required
                  disabled={sendingEmail}
                  value={emailForm.firstName}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="First name"
                  className="w-full bg-navy-950 border border-navy-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-650 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  CC Email Address <span className="text-[10px] text-slate-500">(Optional)</span>
                </label>
                <input
                  type="email"
                  disabled={sendingEmail}
                  value={emailForm.cc}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, cc: e.target.value }))}
                  placeholder="cc@example.com"
                  className="w-full bg-navy-950 border border-navy-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-650 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Internal Notes <span className="text-[10px] text-slate-500">(Optional - Saved to logs only)</span>
                </label>
                <textarea
                  disabled={sendingEmail}
                  value={emailForm.internalNotes}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, internalNotes: e.target.value }))}
                  placeholder="Log notes about this sending action..."
                  rows={3}
                  className="w-full bg-navy-950 border border-navy-700/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-650 focus:outline-none focus:border-gold-500 transition-colors text-xs resize-none"
                />
              </div>

              {emailStatus.type && (
                <div className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                  emailStatus.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {emailStatus.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  )}
                  <span>{emailStatus.message}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-navy-800">
                <button
                  type="button"
                  disabled={sendingEmail}
                  onClick={() => {
                    setIsEmailModalOpen(false);
                    setEmailStatus({ type: null, message: '' });
                    setEmailForm(prev => ({ ...prev, cc: '', internalNotes: '' }));
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-55"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-xs font-bold text-navy-950 bg-gold-400 hover:bg-gold-300 transition-colors shadow-lg cursor-pointer disabled:bg-navy-800 disabled:text-slate-600"
                >
                  {sendingEmail ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Report'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
