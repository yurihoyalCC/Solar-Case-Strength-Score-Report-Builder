'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { leadDb, LeadApplication } from '@/services/db';
import { generatePdfReport } from '@/services/pdfGenerator';
import { SURVEY_QUESTIONS } from '@/services/scoring';
import { 
  ShieldCheck, Search, Filter, Calendar, MapPin, DollarSign, 
  CheckSquare, FileText, Download, LogOut, MessageSquare, ChevronRight,
  TrendingUp, Award, User, Phone, Mail, AlertTriangle, Layers, Tag, Edit3
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  
  // Auth state
  const [authorized, setAuthorized] = useState(false);
  
  // Data state
  const [leads, setLeads] = useState<LeadApplication[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<LeadApplication[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadApplication | null>(null);
  
  // Controls
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [qualityFilter, setQualityFilter] = useState<string>('All');
  
  // Note state
  const [newNote, setNewNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  // Authenticate on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = window.localStorage.getItem('src_admin_logged_in');
      if (isLoggedIn !== 'true') {
        router.push('/admin');
      } else {
        setAuthorized(true);
      }
    }
  }, [router]);

  // Load Leads on authorization
  const loadLeads = async () => {
    try {
      const data = await leadDb.getLeadApplications();
      setLeads(data);
      if (data.length > 0 && !selectedLead) {
        setSelectedLead(data[0]);
      } else if (selectedLead) {
        // Refresh selected lead data
        const updated = data.find(l => l.id === selectedLead.id);
        if (updated) setSelectedLead(updated);
      }
    } catch (error) {
      console.error('Failed to load leads:', error);
    }
  };

  useEffect(() => {
    if (authorized) {
      loadLeads();
    }
  }, [authorized]);

  // Filtering Logic
  useEffect(() => {
    let result = leads;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(lead => 
        `${lead.inputs.firstName} ${lead.inputs.lastName}`.toLowerCase().includes(term) ||
        lead.inputs.email.toLowerCase().includes(term) ||
        lead.inputs.solarCompany.toLowerCase().includes(term) ||
        lead.inputs.financeCompany.toLowerCase().includes(term) ||
        lead.id.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(lead => lead.status === statusFilter);
    }

    if (qualityFilter !== 'All') {
      result = result.filter(lead => lead.score.leadQuality === qualityFilter);
    }

    setFilteredLeads(result);
  }, [leads, searchTerm, statusFilter, qualityFilter]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('src_admin_logged_in');
    }
    router.push('/admin');
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadApplication['status']) => {
    try {
      await leadDb.updateLeadStatus(leadId, newStatus);
      await loadLeads();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedLead) return;
    setSubmittingNote(true);

    try {
      await leadDb.addAdminNote(selectedLead.id, newNote.trim());
      setNewNote('');
      await loadLeads();
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setSubmittingNote(false);
    }
  };

  const triggerPdfDownload = async (lead: LeadApplication) => {
    await generatePdfReport(lead);
  };

  const getQualityBadgeClass = (quality: LeadApplication['score']['leadQuality']) => {
    switch (quality) {
      case 'Hot Lead': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'Strong Follow-Up': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Nurture': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      case 'Low Fit': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      default: return 'bg-slate-800 text-slate-400';
    }
  };

  const getStatusBadgeClass = (status: LeadApplication['status']) => {
    switch (status) {
      case 'New': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'In Review': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'Attorney Assigned': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Resolved': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      default: return 'bg-slate-800 text-slate-400';
    }
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

  if (!authorized) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Authenticating session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans">
      {/* Dashboard Top bar */}
      <header className="border-b border-navy-800 bg-navy-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-widest text-slate-300">SOLAR RELEASE CO.</h1>
            <span className="block text-[9px] text-gold-400 font-bold uppercase tracking-wider">Admin Control Board</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={handleLogout}
            className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-white bg-navy-950 border border-navy-800 px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Dashboard Section */}
      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden max-h-[calc(100vh-69px)]">
        
        {/* Left column: Leads list */}
        <div className="w-full lg:w-[420px] border-r border-navy-800 bg-navy-950/20 flex flex-col overflow-hidden">
          
          {/* Search and Filters */}
          <div className="p-4 border-b border-navy-800/80 space-y-3 bg-navy-900/40">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                placeholder="Search leads by name, company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-navy-950 border border-navy-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Status</label>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-gold-500 appearance-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="In Review">In Review</option>
                  <option value="Attorney Assigned">Attorney Assigned</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Lead Quality</label>
                <select 
                  value={qualityFilter}
                  onChange={(e) => setQualityFilter(e.target.value)}
                  className="w-full bg-navy-950 border border-navy-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-gold-500 appearance-none"
                >
                  <option value="All">All Qualities</option>
                  <option value="Hot Lead">Hot Lead</option>
                  <option value="Strong Follow-Up">Strong Follow-Up</option>
                  <option value="Nurture">Nurture</option>
                  <option value="Low Fit">Low Fit</option>
                </select>
              </div>
            </div>
          </div>

          {/* List panel */}
          <div className="flex-grow overflow-y-auto divide-y divide-navy-900/60">
            {filteredLeads.map((lead) => (
              <button
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`w-full text-left p-4 flex items-center justify-between transition-colors ${
                  selectedLead?.id === lead.id ? 'bg-navy-900/70' : 'hover:bg-navy-900/20'
                }`}
              >
                <div className="space-y-1.5 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-white">
                      {lead.inputs.firstName} {lead.inputs.lastName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">({lead.inputs.state})</span>
                  </div>
                  
                  <div className="text-[11px] text-slate-400 truncate flex items-center gap-1.5">
                    <span className="font-medium text-slate-300">{lead.inputs.solarCompany || 'No Installer'}</span>
                    <span className="text-slate-600">•</span>
                    <span className="italic">{lead.inputs.contractType.toUpperCase()}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getQualityBadgeClass(lead.score.leadQuality)}`}>
                      {lead.score.leadQuality}
                    </span>
                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getStatusBadgeClass(lead.status)}`}>
                      {lead.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-sm font-black text-white">{lead.score.finalScore}</span>
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Score</span>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </div>
              </button>
            ))}

            {filteredLeads.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-xs">
                No matching leads found.
              </div>
            )}
          </div>
        </div>

        {/* Right column: Lead details viewer */}
        <div className="flex-grow bg-navy-900/10 flex flex-col overflow-y-auto p-6 space-y-6">
          {selectedLead ? (
            <div className="space-y-6 max-w-4xl">
              
              {/* Header card with status/actions */}
              <div className="bg-navy-900/40 border border-navy-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black text-white">
                      {selectedLead.inputs.firstName} {selectedLead.inputs.lastName}
                    </h2>
                    <span className="text-xs text-slate-500 bg-navy-950 px-2 py-1 rounded border border-navy-800 font-mono">
                      ID: {selectedLead.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Lead submitted: {new Date(selectedLead.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  {/* Status Dropdown */}
                  <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Change Case Status</label>
                    <select
                      value={selectedLead.status}
                      onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as any)}
                      className="bg-navy-950 border border-navy-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500 cursor-pointer"
                    >
                      <option value="New">New</option>
                      <option value="In Review">In Review</option>
                      <option value="Attorney Assigned">Attorney Assigned</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  {/* PDF Download Button */}
                  <button 
                    onClick={() => triggerPdfDownload(selectedLead)}
                    className="inline-flex items-center justify-center px-4 py-2.5 bg-navy-950 border border-navy-800 rounded-lg text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer mt-5"
                  >
                    <Download className="w-3.5 h-3.5 mr-2" />
                    Download PDF Report
                  </button>
                </div>
              </div>

              {/* Grid Section: Info boxes */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Score Card Panel */}
                <div className="md:col-span-4 bg-navy-950/60 p-6 rounded-2xl border border-navy-850 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4">Diagnostic Score</span>
                  <div className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center shadow-inner ${getScoreColor(selectedLead.score.finalScore)}`}>
                    <span className="text-5xl font-black">{selectedLead.score.finalScore}</span>
                    <span className="text-xs text-slate-400 font-semibold mt-0.5">/ 100</span>
                  </div>
                  <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider mt-5 ${getScoreBadgeColor(selectedLead.score.finalScore)}`}>
                    {selectedLead.score.scoreLabel}
                  </span>
                  
                  {/* Category Progress Bars */}
                  <div className="w-full space-y-3.5 mt-6 pt-6 border-t border-navy-800/80 text-left">
                    {[
                      { name: 'Sales Conduct Indicator', score: selectedLead.score.salesConductScore },
                      { name: 'Financial Burden', score: selectedLead.score.financialBurdenScore },
                      { name: 'Contract Risk', score: selectedLead.score.contractRiskScore },
                      { name: 'System Performance', score: selectedLead.score.systemPerformanceScore },
                      { name: 'Resolution Readiness', score: selectedLead.score.resolutionReadinessScore }
                    ].map((cat, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-semibold">
                          <span className="text-slate-400">{cat.name}</span>
                          <span className="text-white">{cat.score}%</span>
                        </div>
                        <div className="w-full h-1 bg-navy-900 rounded-full overflow-hidden">
                          <div className="h-full bg-gold-400 rounded-full" style={{ width: `${cat.score}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Left Detail Panel: Contact & Financial snapshot */}
                <div className="md:col-span-8 space-y-6">
                  
                  {/* Contact Info Card */}
                  <div className="bg-navy-900/40 border border-navy-800 p-6 rounded-2xl space-y-4">
                    <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider border-b border-navy-800 pb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-gold-400" />
                      Contact Metadata
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-1">Full Name:</span>
                        <strong className="text-white">{selectedLead.inputs.firstName} {selectedLead.inputs.lastName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-1">Email:</span>
                        <a href={`mailto:${selectedLead.inputs.email}`} className="text-gold-400 underline font-semibold">{selectedLead.inputs.email}</a>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-1">Phone:</span>
                        <strong className="text-white">{selectedLead.inputs.phone}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-1">State:</span>
                        <strong className="text-white">{selectedLead.inputs.state}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Financial Snapshot Card */}
                  <div className="bg-navy-900/40 border border-navy-800 p-6 rounded-2xl space-y-4">
                    <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider border-b border-navy-800 pb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gold-400" />
                      FinancialSnapshot & Agreement Details
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-1">Contract Type:</span>
                        <strong className="text-white uppercase font-bold">{selectedLead.inputs.contractType}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-1">Solar Company:</span>
                        <strong className="text-white">{selectedLead.inputs.solarCompany || 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-1">Finance Company:</span>
                        <strong className="text-white">{selectedLead.inputs.financeCompany || 'N/A'}</strong>
                      </div>
                      {selectedLead.inputs.contractType === 'loan' && (
                        <>
                          <div>
                            <span className="text-slate-400 block mb-1">Total System Price:</span>
                            <strong className="text-white">${selectedLead.inputs.totalSystemPrice.toLocaleString()}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block mb-1">Loan Balance:</span>
                            <strong className="text-white">${selectedLead.inputs.loanBalance.toLocaleString()}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block mb-1">Interest Rate:</span>
                            <strong className="text-white">{selectedLead.inputs.interestRate}%</strong>
                          </div>
                        </>
                      )}
                      <div>
                        <span className="text-slate-400 block mb-1">Monthly Payment:</span>
                        <strong className="text-white">${selectedLead.inputs.monthlyPayment}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-1">Remaining Term:</span>
                        <strong className="text-white">{selectedLead.inputs.remainingTerm} / {selectedLead.inputs.loanTerm} yrs</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-1">Payment Escalator:</span>
                        <strong className="text-white">
                          {selectedLead.inputs.paymentEscalator 
                            ? `Yes (${selectedLead.inputs.escalatorPercentage}%)` 
                            : 'No'
                          }
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-1">Pre-solar Utility Bill:</span>
                        <strong className="text-white">${selectedLead.inputs.preSolarUtilityBill}/mo</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-1">Post-solar Utility Bill:</span>
                        <strong className="text-white">${selectedLead.inputs.currentUtilityBill}/mo</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-1">Tax Credit (ITC):</span>
                        <strong className="text-white">
                          {selectedLead.inputs.taxCreditPromised 
                            ? (selectedLead.inputs.taxCreditReceived ? 'Promised & Received' : 'Promised but NOT Received') 
                            : 'Not Promised'
                          }
                        </strong>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Survey Answers */}
              <div className="bg-navy-900/40 border border-navy-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider border-b border-navy-800 pb-2 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-gold-400" />
                  Survey Responses & Concern Flags
                </h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar text-xs">
                  {[1, 2, 3, 4, 5].map((secId) => {
                    const secQuestions = SURVEY_QUESTIONS.filter(q => q.section === secId);
                    const secName = secQuestions[0]?.sectionName || `Section ${secId}`;
                    return (
                      <div key={secId} className="space-y-2.5">
                        <span className="block text-[10px] font-bold text-gold-400 uppercase tracking-widest bg-navy-950/60 p-2 rounded-md border border-navy-850">
                          {secName}
                        </span>
                        <div className="space-y-1.5 pl-1.5">
                          {secQuestions.map((q) => {
                            const ans = selectedLead.inputs.surveyAnswers[q.id] || 'no';
                            
                            // Determine point multi
                            let pointsEarned = 0;
                            if (q.reverseScore) {
                              if (ans === 'no') pointsEarned = q.weight;
                              else if (ans === 'somewhat' || ans === 'not_sure') pointsEarned = q.weight * 0.5;
                            } else {
                              if (ans === 'yes') pointsEarned = q.weight;
                              else if (ans === 'somewhat' || ans === 'not_sure') pointsEarned = q.weight * 0.5;
                            }

                            // Badge color
                            let badgeClass = 'bg-slate-850/40 text-slate-500 border border-slate-800/40';
                            if (pointsEarned === q.weight) {
                              badgeClass = q.weight === 5 
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20 font-bold'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold';
                            } else if (pointsEarned > 0) {
                              badgeClass = 'bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold';
                            }

                            return (
                              <div key={q.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 bg-navy-950/20 rounded border border-navy-900">
                                <span className="text-slate-300 leading-normal max-w-[85%]">
                                  <strong className="text-slate-500 mr-1.5">Q{q.id}.</strong>
                                  {q.text}
                                </span>
                                <div className="flex items-center gap-2 self-end sm:self-center">
                                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold ${badgeClass}`}>
                                    {ans.replace('_', ' ')}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CRM / UTM / Marketing parameters */}
              <div className="bg-navy-900/40 border border-navy-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider border-b border-navy-800 pb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gold-400" />
                  CRM & Marketing Parameter Tracking
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-1">leadSource</span>
                    <strong className="text-white">{selectedLead.inputs.leadSource || 'funnel'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-1">campaignId</span>
                    <strong className="text-white">{selectedLead.inputs.campaignId || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-1">adSetId</span>
                    <strong className="text-white">{selectedLead.inputs.adSetId || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-1">utmSource</span>
                    <strong className="text-white">{selectedLead.inputs.utmSource || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-1">utmCampaign</span>
                    <strong className="text-white">{selectedLead.inputs.utmCampaign || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-1">fbclid</span>
                    <strong className="text-white truncate block" title={selectedLead.inputs.fbclid}>{selectedLead.inputs.fbclid || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-1">gclid</span>
                    <strong className="text-white truncate block" title={selectedLead.inputs.gclid}>{selectedLead.inputs.gclid || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider mb-1">caseScore</span>
                    <strong className="text-gold-400">{selectedLead.score.finalScore}</strong>
                  </div>
                </div>
              </div>

              {/* Case Notes history */}
              <div className="bg-navy-900/40 border border-navy-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider border-b border-navy-800 pb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gold-400" />
                  Internal Case Notes
                </h3>

                {/* Notes Input */}
                <form onSubmit={handleAddNote} className="space-y-3">
                  <div className="relative">
                    <textarea
                      placeholder="Add an internal note about this case..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={3}
                      className="w-full bg-navy-950 border border-navy-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors text-xs"
                      required
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      type="submit"
                      disabled={submittingNote || !newNote.trim()}
                      className="inline-flex items-center justify-center px-4 py-2 bg-gold-500 hover:bg-gold-400 disabled:bg-navy-800 text-navy-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                      {submittingNote ? 'Saving...' : 'Add Note'}
                    </button>
                  </div>
                </form>

                {/* Notes list */}
                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 mt-4">
                  {selectedLead.notes && selectedLead.notes.length > 0 ? (
                    selectedLead.notes.map((note, idx) => (
                      <div key={idx} className="p-3 bg-navy-950/60 rounded-xl border border-navy-850/80 space-y-1">
                        <p className="text-xs text-slate-300 leading-normal">{note.text}</p>
                        <span className="block text-[9px] text-slate-500 font-medium">
                          Added: {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">No notes added to this case yet.</p>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center text-slate-500 text-xs italic">
              Select a lead application from the left panel to review details.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
