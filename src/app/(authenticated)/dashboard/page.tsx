import React from "react";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { getAssessmentDraft } from "@/lib/db";
import { RiskAssessment } from "@/lib/riskEngine";
import { EnvironmentalSnapshot } from "@/lib/envService";

export default async function DashboardPage() {
  const auth = await getAuthSession();
  const name = auth?.profile?.name || "User";
  const location = auth?.profile?.location || "Madurai (Default)";
  const profileComplete = !!(auth?.profile?.location && auth?.profile?.userType);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const draft = auth ? getAssessmentDraft(auth.session.userId) as any : null;
  const snapshot = draft?.environmental?.snapshot as EnvironmentalSnapshot | undefined;
  const risk = draft?.riskAssessment as RiskAssessment | undefined;
  const opt = draft?.scheduleOptimization;
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Good morning, {name}</h2>
          <p className="text-gray-500 mt-1.5 text-lg">Plan your outdoor activity safely today.</p>
        </div>
        <Link href="/assessment/new" className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium shadow-sm hover:bg-emerald-700 transition hover:-translate-y-0.5">
          <span className="material-icons text-sm">add</span>
          New Assessment
        </Link>
      </div>

      {!profileComplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="material-icons text-amber-500 mt-0.5">account_circle</span>
            <div>
              <h4 className="text-amber-900 font-bold">Complete your profile</h4>
              <p className="text-amber-800 text-sm mt-1">Add your location and preferences to personalize HeatShield AI recommendations.</p>
            </div>
          </div>
          <Link href="/profile" className="shrink-0 px-4 py-2 bg-amber-100 border border-amber-200 text-amber-900 text-sm font-bold rounded-lg hover:bg-amber-200 transition">
            Update Profile
          </Link>
        </div>
      )}

      {draft && snapshot && risk ? (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-icons text-emerald-600">history</span>
            <h3 className="font-bold text-gray-800 text-lg">Latest Assessment Result</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Summary Card */}
            <div className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col relative overflow-hidden transition-all hover:shadow-md ${
              risk.level === 'HIGH' || risk.level === 'VERY_HIGH' ? 'border-orange-200' :
              risk.level === 'MODERATE' ? 'border-amber-200' : 'border-emerald-200'
            }`}>
              <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-3xl opacity-20 pointer-events-none ${
                risk.level === 'HIGH' || risk.level === 'VERY_HIGH' ? 'bg-orange-500' :
                risk.level === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}></div>
              
              <h3 className="font-bold text-gray-500 mb-4 text-sm uppercase tracking-wider">Overall Risk Score</h3>
              
              <div className="flex items-end gap-4 mb-6 relative z-10">
                <div className={`text-6xl font-extrabold tracking-tighter leading-none ${
                  risk.level === 'HIGH' || risk.level === 'VERY_HIGH' ? 'text-orange-600' :
                  risk.level === 'MODERATE' ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {risk.score}
                </div>
                <div className="pb-1 text-gray-400 font-medium text-lg">/ 100</div>
              </div>

              <div className="mb-6 relative z-10">
                <span className={`inline-flex items-center px-3 py-1 text-sm font-bold rounded-full ${
                  risk.level === 'HIGH' || risk.level === 'VERY_HIGH' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                  risk.level === 'MODERATE' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {risk.level.replace('_', ' ')} RISK
                </span>
              </div>

              {opt && opt.improvementAvailable && (
                <div className="mt-auto bg-emerald-50 border border-emerald-100 p-4 rounded-xl relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-icons text-emerald-600 text-sm">schedule</span>
                    <span className="text-sm font-bold text-emerald-900">Safer Timing Available</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-800 text-sm">{opt.recommended.startTime} – {opt.recommended.endTime}</span>
                    <span className="text-xs font-bold bg-white text-emerald-700 px-2 py-1 rounded shadow-sm">-{opt.exposureReductionPercent}% Exposure</span>
                  </div>
                </div>
              )}
              {(!opt || !opt.improvementAvailable) && (
                <div className="mt-auto text-sm text-gray-500 flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">check_circle</span>
                  Current schedule is optimal
                </div>
              )}
            </div>

            {/* Conditions Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider mb-2">Environmental Snapshot</h3>
                  <div className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${snapshot.source.isLive ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                    {snapshot.source.isLive ? 'Live Data' : 'Demo Data'}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-gray-900 font-semibold mb-6">
                  <span className="material-icons text-emerald-600">location_on</span>
                  {draft.input.location}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="text-gray-500 text-xs font-semibold mb-1 flex items-center gap-1"><span className="material-icons text-sm">thermostat</span> Temp</div>
                    <div className="text-2xl font-bold text-gray-900">{snapshot.temperature.toFixed(1)}°</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="text-gray-500 text-xs font-semibold mb-1 flex items-center gap-1"><span className="material-icons text-sm">air</span> AQI</div>
                    <div className="text-2xl font-bold text-gray-900">{snapshot.aqi || 'N/A'}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 col-span-2">
                    <div className="text-gray-500 text-xs font-semibold mb-1 flex items-center gap-1"><span className="material-icons text-sm">water_drop</span> Humidity</div>
                    <div className="text-lg font-bold text-gray-900">{snapshot.humidity.toFixed(0)}%</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <Link href="/assessment/preview" className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold rounded-xl transition-colors border border-gray-200">
                  View Full Safety Plan
                  <span className="material-icons text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center mt-8 max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
            <span className="material-icons text-emerald-500 text-4xl">analytics</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No active assessment</h3>
          <p className="text-gray-500 text-lg mb-8">
            Create an assessment to see environmental risk and AI safety plans here.
          </p>
          <Link href="/assessment/new" className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium shadow-sm hover:bg-emerald-700 transition transform hover:-translate-y-0.5">
            <span className="material-icons text-sm">add</span>
            Create Safety Assessment
          </Link>
        </div>
      )}
    </div>
  );
}


