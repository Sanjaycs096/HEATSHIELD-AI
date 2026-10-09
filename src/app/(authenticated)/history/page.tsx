import React from "react";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { getAssessmentDraft } from "@/lib/db";
import { redirect } from "next/navigation";
import { EnvironmentalSnapshot } from "@/lib/envService";
import { RiskAssessment } from "@/lib/riskEngine";

export default async function HistoryPage() {
  const auth = await getAuthSession();
  if (!auth) redirect('/login');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const draft = getAssessmentDraft(auth.session.userId) as any;
  const snapshot = draft?.environmental?.snapshot as EnvironmentalSnapshot | undefined;
  const risk = draft?.riskAssessment as RiskAssessment | undefined;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Assessment History</h2>
          <p className="text-gray-500 mt-1.5 text-lg">View your past safety assessments and generated action plans.</p>
        </div>
      </div>

      {!draft || !snapshot || !risk ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center mt-8 max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200">
            <span className="material-icons text-gray-400 text-4xl">history</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No assessments yet</h3>
          <p className="text-gray-500 text-lg mb-8">
            Your completed safety assessments will appear here.
          </p>
          <Link href="/assessment/new" className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium shadow-sm hover:bg-emerald-700 transition transform hover:-translate-y-0.5">
            <span className="material-icons text-sm">add</span>
            Create Assessment
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8 hover:shadow-md transition-shadow relative">
          <div className={`absolute top-0 left-0 w-1.5 h-full ${
            risk.level === 'HIGH' || risk.level === 'VERY_HIGH' ? 'bg-orange-500' :
            risk.level === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500'
          }`}></div>
          <div className="p-6 sm:p-8 pl-8 sm:pl-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">{draft.input.location}</h3>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                    risk.level === 'HIGH' || risk.level === 'VERY_HIGH' ? 'bg-red-50 text-red-700 border-red-200' : 
                    risk.level === 'MODERATE' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {risk.level.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 font-medium">
                  <span className="material-icons text-sm">schedule</span>
                  {draft.input.startTime} – {draft.input.endTime} 
                  <span className="text-gray-300 mx-1">•</span> 
                  <span className="capitalize">{draft.input.activityType.replace('_', ' ')}</span>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="flex items-end gap-1 sm:justify-end">
                  <div className={`text-4xl font-black tracking-tight ${
                    risk.level === 'HIGH' || risk.level === 'VERY_HIGH' ? 'text-orange-600' : 
                    risk.level === 'MODERATE' ? 'text-amber-600' : 'text-emerald-600'
                  }`}>{risk.score}</div>
                  <div className="text-lg text-gray-400 font-medium mb-1">/100</div>
                </div>
                <div className="text-xs text-gray-400 font-bold tracking-wider uppercase mt-1">
                  {new Date(draft.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100 mb-6">
              <div>
                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                  <span className="material-icons text-[14px]">warning_amber</span> Primary Concern
                </div>
                <div className="text-sm font-bold text-gray-900 capitalize">{risk.primaryConcern.replace('_', ' ')}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                  <span className="material-icons text-[14px]">thermostat</span> Temp
                </div>
                <div className="text-sm font-bold text-gray-900">{snapshot.temperature.toFixed(1)}°C</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                  <span className="material-icons text-[14px]">air</span> AQI
                </div>
                <div className="text-sm font-bold text-gray-900">{snapshot.aqi || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                  <span className="material-icons text-[14px]">dataset</span> Source
                </div>
                <div className="text-xs font-bold text-gray-900">{snapshot.source.isLive ? 'Live Data' : 'Demo Data'}</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {draft.scheduleOptimization?.improvementAvailable && (
                <div className="flex-1 bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm p-4 rounded-xl flex items-start gap-3">
                  <span className="material-icons text-emerald-600 shrink-0">trending_down</span>
                  <div>
                    <strong className="block text-emerald-900 mb-0.5">Safer alternative available</strong>
                    {draft.scheduleOptimization.recommended.startTime}–{draft.scheduleOptimization.recommended.endTime} (-{draft.scheduleOptimization.exposureReductionPercent}% exposure)
                  </div>
                </div>
              )}
              
              {draft.aiActionPlan && (
                <div className="flex-1 bg-purple-50 border border-purple-100 text-purple-800 text-sm p-4 rounded-xl flex items-center gap-3">
                  <span className="material-icons text-purple-600 shrink-0">auto_awesome</span>
                  <strong className="text-purple-900">AI Safety Plan Generated</strong>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <Link href="/assessment/preview" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition shadow-sm">
                View Full Details
                <span className="material-icons text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
