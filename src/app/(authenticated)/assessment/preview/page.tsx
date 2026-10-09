import React from "react";
import { getAuthSession } from "@/lib/auth";
import { getAssessmentDraft } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { EnvironmentalSnapshot, HourlyCondition } from "@/lib/envService";
import { RiskAssessment } from "@/lib/riskEngine";

// Helper function to format timestamp to hour
function formatHour(timestamp: number) {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: true }).format(new Date(timestamp));
}

function getRiskColor(level: string) {
  switch (level) {
    case 'LOW': return 'text-emerald-600';
    case 'MODERATE': return 'text-amber-500';
    case 'HIGH': return 'text-orange-500';
    case 'VERY_HIGH': return 'text-red-600';
    default: return 'text-gray-500';
  }
}

function getRiskBgColor(level: string) {
  switch (level) {
    case 'LOW': return 'bg-emerald-50 border-emerald-200';
    case 'MODERATE': return 'bg-amber-50 border-amber-200';
    case 'HIGH': return 'bg-orange-50 border-orange-200';
    case 'VERY_HIGH': return 'bg-red-50 border-red-200';
    default: return 'bg-gray-50 border-gray-200';
  }
}

export default async function AssessmentPreviewPage() {
  const auth = await getAuthSession();
  if (!auth) redirect('/login');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const draft = getAssessmentDraft(auth.session.userId) as any;
  if (!draft || !draft.environmental || !draft.riskAssessment) {
    redirect('/assessment/new');
  }

  const { input, environmental, riskAssessment, aiActionPlan, scheduleOptimization, error } = draft;
  const snapshot = environmental?.snapshot as EnvironmentalSnapshot | undefined;
  const timeline = environmental?.timeline as HourlyCondition[] | undefined;
  const risk = riskAssessment as RiskAssessment;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const aiPlan = aiActionPlan as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const opt = scheduleOptimization as any;
  
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3 uppercase tracking-wider">
            <span className="material-icons text-sm">verified</span>
            Assessment Complete
          </span>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Risk Assessment</h2>
          <p className="text-gray-500 mt-2 text-lg">
            For {input.location} during {input.startTime} - {input.endTime} ({input.activityType})
          </p>
        </div>
        {snapshot?.source && (
          <div className="flex flex-col items-end">
            <div className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${snapshot.source.isLive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
              <span className="flex items-center gap-1">
                <span className="material-icons text-[12px]">{snapshot.source.isLive ? 'sensors' : 'science'}</span>
                {snapshot.source.isLive ? 'Live Data' : 'Fallback / Demo Data'}
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-2 font-medium">Source: {snapshot.source.provider}</div>
          </div>
        )}
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex items-start gap-3 shadow-sm">
          <span className="material-icons text-red-500 shrink-0 mt-0.5">error</span>
          <div>
            <h3 className="font-bold mb-1">Assessment Failed</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      ) : snapshot && risk ? (
        <div className="space-y-8">
          {/* Risk Assessment Display */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`rounded-3xl shadow-sm border p-8 flex flex-col justify-center items-center text-center relative overflow-hidden transition-all ${getRiskBgColor(risk.level)}`}>
              <div className="absolute inset-0 bg-white/40 pointer-events-none"></div>
              <div className="relative z-10 w-full flex flex-col items-center">
                <span className="px-4 py-1.5 bg-white shadow-sm text-sm font-bold rounded-full mb-6 uppercase tracking-wider border border-gray-100 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${
                    risk.level === 'HIGH' || risk.level === 'VERY_HIGH' ? 'bg-orange-500' :
                    risk.level === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}></span>
                  {risk.level.replace('_', ' ')} RISK
                </span>
                <div className={`text-7xl font-black tracking-tighter mb-2 drop-shadow-sm ${getRiskColor(risk.level)}`}>{risk.score}</div>
                <div className="text-gray-500 font-bold tracking-wide uppercase text-sm mb-6">/ 100 Score</div>
                
                {risk.dataQuality.confidence !== 'HIGH' && (
                  <div className="mt-auto text-xs font-bold text-amber-700 bg-amber-100/80 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <span className="material-icons text-[14px]">warning</span>
                    Data Quality: {risk.dataQuality.confidence}
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 lg:col-span-2 relative overflow-hidden">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="material-icons text-amber-500">analytics</span>
                Risk Factors
              </h3>
              <div className="space-y-5">
                {risk.factors.filter(f => f.available).map((factor, idx) => (
                  <div key={idx} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-gray-800">{factor.name}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                        factor.contribution === 'High' ? 'bg-red-50 text-red-700 border-red-200' : 
                        factor.contribution === 'Moderate' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {factor.contribution} Impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{factor.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Environmental Snapshot */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <span className="material-icons text-blue-500">thermostat</span>
              Environmental Snapshot
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><span className="material-icons text-[14px]">device_thermostat</span> Temperature</span>
                <div className="text-3xl font-black text-gray-900">{snapshot.temperature.toFixed(1)}°C</div>
              </div>
              <div className="flex flex-col bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><span className="material-icons text-[14px]">water_drop</span> Humidity</span>
                <div className="text-3xl font-black text-gray-900">{snapshot.humidity.toFixed(0)}%</div>
              </div>
              <div className="flex flex-col bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><span className="material-icons text-[14px]">air</span> AQI</span>
                <div className="text-3xl font-black text-gray-900">{snapshot.aqi ? snapshot.aqi : 'N/A'}</div>
              </div>
              <div className="flex flex-col bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><span className="material-icons text-[14px]">wb_sunny</span> UV Index</span>
                <div className="text-3xl font-black text-gray-900">{snapshot.uvIndex ? snapshot.uvIndex : 'N/A'}</div>
              </div>
            </div>
          </section>

          {/* AI Safety Plan */}
          {aiPlan && (
            <section className="space-y-6 pt-8 border-t border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <h3 className="text-2xl font-bold text-gray-900">Personalized Safety Plan</h3>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 w-fit ${aiPlan.generatedBy === 'groq' ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-sm' : 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                  <span className="material-icons text-sm">{aiPlan.generatedBy === 'groq' ? 'auto_awesome' : 'shield'}</span>
                  {aiPlan.generatedBy === 'groq' ? 'AI-Generated Plan' : 'Standard Safety Guidance'}
                </span>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <p className="text-gray-700 text-lg leading-relaxed font-medium">{aiPlan.summary}</p>
              </div>
              
              {/* Why This Assessment? */}
              {aiPlan.keyFactors && aiPlan.keyFactors.length > 0 && (
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 md:p-8">
                  <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg">
                    <span className="material-icons text-emerald-600">psychology</span>
                    Why This Assessment?
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {aiPlan.keyFactors.map((kf: any, idx: number) => (
                      <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                        <div className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {kf.factor}
                        </div>
                        <div className="text-sm text-gray-600 leading-relaxed">{kf.explanation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {aiPlan.actions.map((action: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full transition-all hover:shadow-md hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-5">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                        action.priority === 'HIGH' ? 'bg-red-50 text-red-700 border-red-200' :
                        action.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {action.priority} Priority
                      </span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        action.category === 'hydration' ? 'bg-blue-50 text-blue-600' :
                        action.category === 'rest' ? 'bg-indigo-50 text-indigo-600' :
                        action.category === 'timing' ? 'bg-purple-50 text-purple-600' :
                        action.category === 'shade' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <span className="material-icons text-[18px]">
                          {action.category === 'hydration' ? 'water_drop' :
                           action.category === 'rest' ? 'airline_seat_recline_extra' :
                           action.category === 'timing' ? 'schedule' :
                           action.category === 'shade' ? 'deck' : 'health_and_safety'}
                        </span>
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-3 text-lg">{action.title}</h4>
                    <p className="text-gray-600 text-sm flex-grow leading-relaxed">{action.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Schedule Optimization */}
          {opt && (
            <section className="space-y-6 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Current vs Safer Alternative</h3>
              
              {opt.improvementAvailable ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <span className="material-icons text-emerald-600">check_circle</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-900 mb-1 text-lg">Safer timing available</h4>
                      <p className="text-emerald-800 text-sm">
                        Consider shifting your activity to <strong>{opt.recommended.startTime} – {opt.recommended.endTime}</strong>.
                      </p>
                    </div>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-emerald-100 whitespace-nowrap">
                    <div className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-0.5">Exposure Reduction</div>
                    <div className="text-xl font-black text-emerald-700">-{opt.exposureReductionPercent}%</div>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="material-icons text-blue-600">info</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900 mb-1 text-lg">Schedule is optimal</h4>
                    <p className="text-blue-800 text-sm">
                      Your selected schedule is already the safest available option within this time window.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Current Schedule */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gray-300"></div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Current Schedule</h4>
                  <div className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
                    {opt.current.startTime} <span className="text-gray-400 font-medium mx-1">–</span> {opt.current.endTime}
                  </div>
                  <div className="flex gap-3 items-center mb-8">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                      opt.current.riskLevel === 'HIGH' || opt.current.riskLevel === 'VERY_HIGH' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      opt.current.riskLevel === 'MODERATE' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {opt.current.riskLevel.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">Risk Score: <span className="text-gray-900 font-bold">{opt.current.riskScore}</span></span>
                  </div>
                  
                  <div className="mt-auto bg-gray-50 rounded-xl p-5 border border-gray-100 flex justify-between items-center">
                    <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Estimated Exposure Index</div>
                    <div className="text-3xl font-black text-gray-900">{opt.current.exposureIndex}</div>
                  </div>
                </div>

                {/* Recommended Schedule */}
                <div className={`rounded-2xl shadow-sm border p-6 sm:p-8 flex flex-col relative overflow-hidden transition-all ${opt.improvementAvailable ? 'bg-emerald-50/30 border-emerald-200' : 'bg-gray-50/50 border-gray-200 opacity-75'}`}>
                  {opt.improvementAvailable && <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>}
                  <h4 className={`text-xs font-bold uppercase tracking-widest mb-4 ${opt.improvementAvailable ? 'text-emerald-700' : 'text-gray-500'}`}>Safer Alternative</h4>
                  <div className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
                    {opt.recommended.startTime} <span className="text-gray-400 font-medium mx-1">–</span> {opt.recommended.endTime}
                  </div>
                  <div className="flex gap-3 items-center mb-8">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                      opt.recommended.riskLevel === 'HIGH' || opt.recommended.riskLevel === 'VERY_HIGH' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      opt.recommended.riskLevel === 'MODERATE' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {opt.recommended.riskLevel.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">Risk Score: <span className="text-gray-900 font-bold">{opt.recommended.riskScore}</span></span>
                  </div>
                  
                  <div className="mt-auto bg-white rounded-xl p-5 shadow-sm border border-emerald-100 flex justify-between items-center relative">
                    <div className="text-xs text-emerald-800 uppercase font-bold tracking-wider">Estimated Exposure Index</div>
                    <div className="text-3xl font-black text-emerald-700 flex items-center gap-2">
                      {opt.recommended.exposureIndex}
                      {opt.improvementAvailable && (
                        <span className="material-icons text-emerald-500">trending_down</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {opt.improvementAvailable && (
                <div className="text-sm text-gray-600 bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-3">
                  <span className="material-icons text-emerald-500 text-[18px] mt-0.5">lightbulb</span>
                  <p><strong>Why is this safer?</strong> {opt.recommended.reason} factors are reduced during this window.</p>
                </div>
              )}
            </section>
          )}

          {/* Schedule Guidance */}
          {aiPlan && aiPlan.scheduleGuidance && (
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 mt-6 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="material-icons text-blue-500">schedule</span>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">Schedule Guidance</h4>
                  <p className="text-blue-800 text-sm leading-relaxed">{aiPlan.scheduleGuidance}</p>
                </div>
              </div>
            </div>
          )}

          {/* AI Plan Caution */}
          {aiPlan && aiPlan.caution && (
            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 mt-6 flex items-start gap-3">
              <span className="material-icons text-amber-500 text-[18px] mt-0.5">warning_amber</span>
              <p className="text-sm text-amber-800 italic">{aiPlan.caution}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 text-gray-500 p-12 rounded-2xl text-center flex flex-col items-center justify-center">
          <span className="material-icons text-4xl mb-4 text-gray-400">cloud_off</span>
          <p className="text-lg font-medium">Data is not available at this time.</p>
        </div>
      )}

      {/* Safety Disclaimer */}
      <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 mt-12">
        <div className="flex gap-3">
          <span className="material-icons text-gray-400 shrink-0">info</span>
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong className="text-gray-700">Disclaimer:</strong> HeatShield AI provides environmental risk guidance for planning outdoor activity. 
            It is not a medical diagnosis or a replacement for official alerts, professional advice, or emergency services.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-8 border-t border-gray-200 gap-4">
        <Link href="/assessment/new" className="text-gray-500 hover:text-gray-900 font-bold px-4 py-2 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
          <span className="material-icons text-sm">arrow_back</span>
          Back to Editing
        </Link>
        <div className="w-full sm:w-auto flex justify-center">
          <button className="w-full sm:w-auto px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-sm hover:shadow-md flex items-center justify-center gap-2">
            <span className="material-icons text-[18px]">save</span>
            Save Assessment Plan
          </button>
        </div>
      </div>
    </div>
  );
}
