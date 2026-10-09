import React from "react";

import { saveAssessmentDraftAction } from "@/app/actions";

export default function NewAssessmentPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3 uppercase tracking-wider">
            <span className="material-icons text-sm">science</span>
            Risk Analysis
          </span>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">New Safety Assessment</h2>
          <p className="text-gray-500 mt-2 text-lg">Plan your upcoming activity to get personalized safety recommendations.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>
        
        <form action={saveAssessmentDraftAction} className="space-y-12 relative z-10">
          
          {/* Step 1: Location */}
          <section className="bg-gray-50/50 p-6 rounded-xl border border-gray-100/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">1</div>
              <h3 className="text-xl font-bold text-gray-900">Where are you going?</h3>
            </div>
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Destination / Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-icons text-gray-400 text-sm">location_on</span>
                  </div>
                  <input name="location" type="text" placeholder="e.g. Madurai, Tamil Nadu" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-shadow" />
                </div>
              </div>
            </div>
          </section>

          {/* Step 2: Activity */}
          <section className="bg-gray-50/50 p-6 rounded-xl border border-gray-100/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">2</div>
              <h3 className="text-xl font-bold text-gray-900">What is the activity?</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Activity Type</label>
                <select name="activityType" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-shadow bg-white cursor-pointer">
                  <option value="construction">Construction</option>
                  <option value="street_vending">Street vending</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="delivery">Delivery</option>
                  <option value="sanitation">Sanitation</option>
                  <option value="maintenance">Outdoor maintenance</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Intensity</label>
                <select name="intensity" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-shadow bg-white cursor-pointer">
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="heavy">Heavy</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Environment</label>
                <select name="environment" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-shadow bg-white cursor-pointer">
                  <option value="outdoor">Outdoor</option>
                  <option value="indoor">Indoor</option>
                </select>
              </div>
            </div>
          </section>

          {/* Step 3: Schedule */}
          <section className="bg-gray-50/50 p-6 rounded-xl border border-gray-100/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">3</div>
              <h3 className="text-xl font-bold text-gray-900">When is the activity?</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Time</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-icons text-gray-400 text-sm">schedule</span>
                  </div>
                  <input name="startTime" type="time" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-shadow" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Time</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-icons text-gray-400 text-sm">schedule</span>
                  </div>
                  <input name="endTime" type="time" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-shadow" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Duration (hours)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-icons text-gray-400 text-sm">timer</span>
                  </div>
                  <input name="duration" type="number" min="0.5" step="0.5" placeholder="e.g. 4" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-shadow" />
                </div>
              </div>
            </div>
          </section>

          {/* Step 4: Personal Factors */}
          <section className="bg-gray-50/50 p-6 rounded-xl border border-gray-100/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">4</div>
              <h3 className="text-xl font-bold text-gray-900">Personal Factors</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Age Group</label>
                <select name="ageGroup" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-shadow bg-white cursor-pointer">
                  <option value="18-35">18-35</option>
                  <option value="36-50">36-50</option>
                  <option value="51-65">51-65</option>
                  <option value="65+">65+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Heat Sensitivity</label>
                <select name="heatSensitivity" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-shadow bg-white cursor-pointer">
                  <option value="normal">Normal</option>
                  <option value="sensitive">Sensitive</option>
                  <option value="highly_sensitive">Highly Sensitive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cooling Access</label>
                <select name="coolingAccess" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-shadow bg-white cursor-pointer">
                  <option value="available">Available</option>
                  <option value="limited">Limited</option>
                  <option value="none">None</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Explanation Language</label>
                <select name="language" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-shadow bg-white cursor-pointer">
                  <option value="en">English</option>
                  <option value="ta">Tamil</option>
                </select>
              </div>
            </div>
          </section>
          
          <div className="pt-6 flex justify-end">
            <button type="submit" className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-lg">
              <span className="material-icons">analytics</span>
              Analyze My Risk
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

