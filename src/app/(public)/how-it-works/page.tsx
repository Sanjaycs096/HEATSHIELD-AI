import React from "react";
import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="text-xl font-bold text-emerald-700 flex items-center gap-2">
          <span className="material-icons text-emerald-600">shield</span>
          HeatShield AI
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/help" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition hidden md:block">Safety Guide</Link>
          <Link href="/login" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">Sign In</Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-4 uppercase tracking-wider">
            <span className="material-icons text-sm">info</span>
            How It Works
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Understanding Risk Together</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Environmental risk requires more than just checking the temperature. Here is how we build your personalized safety plan.
          </p>
        </div>

        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-[3.25rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-emerald-200 before:to-transparent">
          {/* Step 1 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-gray-50 bg-emerald-600 text-white font-bold text-lg shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              1
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <span className="material-icons text-emerald-600">directions_run</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Your Activity</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">Tell us what you plan to do. Different activities—like heavy construction vs. light walking—generate different amounts of internal body heat.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-gray-50 bg-emerald-600 text-white font-bold text-lg shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              2
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <span className="material-icons text-emerald-600">thermostat</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Environmental Data</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">We check weather and air quality conditions for your location and time window, factoring in temperature, humidity, and pollutants.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-gray-50 bg-emerald-600 text-white font-bold text-lg shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              3
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <span className="material-icons text-emerald-600">calculate</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Deterministic Engine</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">Our engine mathematically calculates your estimated exposure risk by combining your activity intensity with the environmental conditions.</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-gray-50 bg-emerald-600 text-white font-bold text-lg shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              4
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <span className="material-icons text-emerald-600">auto_awesome</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">AI Explanation</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">You receive a clear, personalized explanation of your risk and an action plan to reduce exposure in your preferred language.</p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-gray-50 bg-emerald-600 text-white font-bold text-lg shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              5
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-emerald-50 p-6 rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-emerald-100">
                  <span className="material-icons text-emerald-600">schedule</span>
                </div>
                <h3 className="text-xl font-bold text-emerald-900">Optimization</h3>
              </div>
              <p className="text-emerald-800 leading-relaxed">If your current plan is risky, we automatically suggest a safer time to schedule your activity and calculate the exact exposure reduction.</p>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-xl font-medium text-lg hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
            Start Your First Assessment
            <span className="material-icons">arrow_forward</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
