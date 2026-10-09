import React from "react";
import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-100 shadow-sm z-10">
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-emerald-700">
          <span className="material-icons text-emerald-600">shield</span>
          HeatShield AI
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
        <div>
          <h3 className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Overview</h3>
          <div className="space-y-1">
            <Link href="/dashboard" className="flex items-center px-3 py-2.5 text-sm font-semibold text-emerald-700 rounded-lg bg-emerald-50 transition-colors">
              <span className="material-icons mr-3 text-emerald-600">dashboard</span>
              Dashboard
            </Link>
          </div>
        </div>
        <div>
          <h3 className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Safety</h3>
          <div className="space-y-1">
            <Link href="/assessment/new" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <span className="material-icons mr-3 text-gray-400">add_circle</span>
              New Assessment
            </Link>
            <Link href="/plans" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <span className="material-icons mr-3 text-gray-400">health_and_safety</span>
              My Safety Plans
            </Link>
          </div>
        </div>
        <div>
          <h3 className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Insights</h3>
          <div className="space-y-1">
            <Link href="/history" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <span className="material-icons mr-3 text-gray-400">history</span>
              History
            </Link>
          </div>
        </div>
        <div>
          <h3 className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Account</h3>
          <div className="space-y-1">
            <Link href="/profile" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <span className="material-icons mr-3 text-gray-400">person</span>
              Profile
            </Link>
            <Link href="/settings" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <span className="material-icons mr-3 text-gray-400">settings</span>
              Settings
            </Link>
          </div>
        </div>
      </nav>
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <Link href="/help" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-white hover:text-gray-900 hover:shadow-sm transition-all border border-transparent hover:border-gray-200">
          <span className="material-icons mr-3 text-emerald-500">help</span>
          Safety Guide
        </Link>
      </div>
    </aside>
  );
}
