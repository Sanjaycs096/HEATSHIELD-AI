import React from "react";
import Link from "next/link";

export default function PlansPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">My Safety Plans</h2>
          <p className="text-gray-500 mt-1.5 text-lg">Saved and active plans will appear here.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center mt-8 max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
          <span className="material-icons text-emerald-600 text-4xl">health_and_safety</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No safety plans yet</h3>
        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
          Create your first assessment to build a personalized safety plan based on your activity and environmental conditions.
        </p>
        <Link href="/assessment/new" className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-sm hover:bg-emerald-700 transition transform hover:-translate-y-0.5">
          <span className="material-icons text-sm">add</span>
          Create Safety Assessment
        </Link>
      </div>
    </div>
  );
}
