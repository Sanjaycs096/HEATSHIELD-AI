import React from "react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="text-xl font-bold text-emerald-700 flex items-center gap-2">
          <span className="material-icons text-emerald-600">shield</span>
          HeatShield AI
        </div>
        <nav className="hidden md:flex gap-8 items-center">
          <Link href="/how-it-works" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition">How It Works</Link>
          <Link href="/help" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition">Safety Guide</Link>
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition">Sign In</Link>
          <Link href="/register" className="text-sm font-medium text-white bg-emerald-600 px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition shadow-sm hover:shadow">Get Started</Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 py-20 md:py-32 max-w-6xl mx-auto text-center">
          {/* Subtle background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-50 rounded-full blur-3xl -z-10 opacity-50"></div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold mb-8">
            <span className="material-icons text-sm">eco</span>
            Climate Safety Intelligence
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
            Plan safer. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Work smarter.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            HeatShield AI helps you make safer outdoor activity decisions under heat and air-quality stress using personalized, explainable AI and deterministic risk modeling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-medium text-lg hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5">
              Create Safety Plan
              <span className="material-icons text-xl">arrow_forward</span>
            </Link>
            <Link href="/how-it-works" className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-xl font-medium text-lg hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2">
              <span className="material-icons text-xl">play_circle</span>
              See How It Works
            </Link>
          </div>
        </section>

        {/* Workflow Visualization */}
        <section className="px-6 py-16 bg-white border-y border-gray-100">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">How HeatShield Protects You</h2>
              <p className="text-gray-500 mt-2">A deterministic approach to environmental safety planning.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                  <span className="material-icons text-3xl text-emerald-600">analytics</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Assess Risk</h3>
                <p className="text-gray-600 leading-relaxed">We evaluate live temperature, humidity, and air quality against your specific planned activity.</p>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                  <span className="material-icons text-3xl text-emerald-600">psychology</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Understand Why</h3>
                <p className="text-gray-600 leading-relaxed">Our AI explains exactly which factors make the current conditions risky, in your preferred language.</p>
              </div>
              
              <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100 text-center hover:shadow-md transition-shadow transform md:-translate-y-2">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
                  <span className="material-icons text-3xl text-emerald-600">schedule</span>
                </div>
                <h3 className="text-xl font-bold text-emerald-900 mb-3">Find a Safer Time</h3>
                <p className="text-emerald-800 leading-relaxed">We mathematically optimize your schedule to find alternative timing that measurably reduces exposure.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="bg-gray-50 py-16 px-6">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="material-icons text-amber-500 text-3xl">warning</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Safety Disclaimer & Transparency</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                HeatShield AI provides preventive decision support through modeled environmental scores and AI-generated text. It does not diagnose medical conditions, predict medical outcomes, or replace professional advice.
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-600 rounded-full">Deterministic Risk Engine</span>
                <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-600 rounded-full">AI Assistance</span>
                <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-600 rounded-full">Live & Fallback Data</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-100 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <span className="material-icons text-emerald-600 text-sm">shield</span>
            HeatShield AI
          </div>
          <div className="text-sm text-gray-500">
            &copy; 2026 HeatShield AI. All rights reserved.
          </div>
          <div className="flex gap-4">
            <Link href="/help" className="text-sm text-gray-500 hover:text-emerald-600 transition">Safety Guide</Link>
            <Link href="/how-it-works" className="text-sm text-gray-500 hover:text-emerald-600 transition">How It Works</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
