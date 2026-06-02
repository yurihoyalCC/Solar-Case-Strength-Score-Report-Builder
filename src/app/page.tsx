'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileText, TrendingUp, AlertTriangle, ArrowRight, Award } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-navy-800 bg-navy-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-500 to-amber-500 flex items-center justify-center shadow-lg shadow-gold-500/10">
              <ShieldCheck className="w-6 h-6 text-navy-950 stroke-[2]" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-gold-300 bg-clip-text text-transparent">
                SOLAR RELEASE CO.
              </span>
              <span className="block text-[10px] text-gold-400 font-semibold tracking-widest uppercase">
                Consumer Protection
              </span>
            </div>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-gold-400 transition-colors">How It Works</a>
            <a href="#common-concerns" className="hover:text-gold-400 transition-colors">Common Issues</a>
            <a href="#legal-standards" className="hover:text-gold-400 transition-colors">Compliance</a>
          </nav>
          <div>
            <Link 
              href="/funnel" 
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-bold text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 transition-all duration-200 shadow-lg shadow-gold-500/10 hover:shadow-gold-500/20 hover:-translate-y-0.5"
            >
              Start My Free Review
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-navy-800 via-navy-950 to-navy-950">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,transparent)] pointer-events-none opacity-20"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="inline-flex items-center space-x-2 bg-navy-900/80 border border-navy-700 px-3.5 py-1.5 rounded-full mb-8 shadow-inner">
            <Award className="w-4 h-4 text-gold-400" />
            <span className="text-xs font-semibold text-gold-300 tracking-wide">Independent Solar Diagnostic Funnel</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
            Understand the True Cost of <br />
            <span className="bg-gradient-to-r from-gold-400 via-gold-300 to-amber-400 bg-clip-text text-transparent">
              Your Solar Agreement
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-400 font-normal leading-relaxed mb-10">
            If you are concerned about rising solar loan payments, escalating PPA rates, or performance promises that haven&apos;t materialized, use our guided diagnostic tool to evaluate your agreement.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/funnel"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-extrabold text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 transition-all duration-200 shadow-xl shadow-gold-500/10 hover:shadow-gold-500/20 hover:-translate-y-0.5"
            >
              Start My Free Solar Contract Review
              <ArrowRight className="w-5 h-5 ml-2.5 stroke-[2.5]" />
            </Link>
            <a 
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold text-slate-300 bg-navy-900 border border-navy-700 hover:bg-navy-800 transition-colors"
            >
              Learn More
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20 pt-10 border-t border-navy-800/80">
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">100% Free</span>
              <span className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Diagnostic Review</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">Attorney-Backed</span>
              <span className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Resolution Network</span>
            </div>
            <div className="col-span-2 md:col-span-1 flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">Zero Pressure</span>
              <span className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">No Legal Obligation</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-navy-900/40 border-t border-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl mb-4">
              How the Diagnostic Funnel Works
            </h2>
            <p className="text-slate-400">
              In under 10 minutes, evaluate your solar installation contract to calculate actual lifetime liabilities and identify potential discrepancies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-navy-900/60 border border-navy-800 p-8 rounded-2xl relative shadow-lg hover:border-navy-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center text-gold-400 font-bold text-lg mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Submit Snapshot</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Provide basic details regarding your loan, lease, or PPA arrangement, including payments, interest rates, and utility bills.
              </p>
            </div>

            <div className="bg-navy-900/60 border border-navy-800 p-8 rounded-2xl relative shadow-lg hover:border-navy-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center text-gold-400 font-bold text-lg mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Survey Discrepancies</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Identify verbal promises made during sales presentations, utility elimination claims, or system production concerns.
              </p>
            </div>

            <div className="bg-navy-900/60 border border-navy-800 p-8 rounded-2xl relative shadow-lg hover:border-navy-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center text-gold-400 font-bold text-lg mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Review Score</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Receive an objective Solar Case Strength Score™ outlining contract metrics and a pathway for coordinating an attorney-backed review.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Concerns Section */}
      <section id="common-concerns" className="py-20 border-t border-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl mb-4">
              Common Solar Agreement Risks Evaluated
            </h2>
            <p className="text-slate-400">
              We review contracts to identify clauses and representations that may warrant specialist attention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="flex space-x-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-navy-800/80 border border-navy-700 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Unexpected Payment Escalators</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  PPAs and Leases often include compounding annual payment escalators (typically 2.9% or higher). Over 25 years, these escalators can more than double your monthly payment.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-navy-800/80 border border-navy-700 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Federal Tax Credit Misunderstandings</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Many consumers report verbal representations that the Federal Investment Tax Credit (ITC) was a direct cash rebate or that they qualified for free solar, leading to unintended financial gaps.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-navy-800/80 border border-navy-700 flex items-center justify-center">
                <FileText className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Hidden Property Encumbrances</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Solar providers place a UCC-1 financing statement (lien) on home fixtures. Homeowners are often surprised when attempting to refinance, transfer title, or sell their properties.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-navy-800/80 border border-navy-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Installer Discontinuation</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  In instances of contractor bankruptcy, customers may be left with underperforming equipment and long-term financial liabilities without operational warranty support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-gradient-to-br from-navy-900 to-navy-950 py-16 border-t border-navy-800 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-black text-white tracking-tight mb-4">
            Evaluate Your Solar Agreement Today
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto mb-8 text-sm">
            Understand your full-term costs, potential risks, and whether an attorney-backed contract review is appropriate for your situation.
          </p>
          <Link 
            href="/funnel"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-extrabold text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 transition-all shadow-xl shadow-gold-500/10 hover:shadow-gold-500/20"
          >
            Start My Free Solar Contract Review
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-950 border-t border-navy-900 py-12 text-slate-500 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <span className="font-extrabold text-sm tracking-widest text-slate-400">SOLAR RELEASE CO.</span>
          </div>
          <div className="text-center md:text-right max-w-md">
            <p className="mb-2">© 2026 Solar Release Co. All rights reserved.</p>
            <p className="leading-relaxed">
              Solar Release Co. provides case evaluation and diagnostics. We are not a law firm and do not provide legal representation directly. Attorney services are provided by independent resolution counsel.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
