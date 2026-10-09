import React from "react";

import { getAuthSession } from "@/lib/auth";
import { updateSettingsAction } from "@/app/actions";
import { logoutAction } from "@/lib/auth";
import { getSettings } from "@/lib/db";

export default async function SettingsPage() {
  const auth = await getAuthSession();
  const settings = auth ? getSettings(auth.session.userId) : { language: "en" };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500 mt-1">Manage your application preferences and account settings.</p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
            <p className="text-sm text-gray-500 mt-1">Theme preference (Light/Dark mode placeholder)</p>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            System Default
          </button>
        </div>

        {/* Language */}
        <form action={updateSettingsAction}>
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Language</h3>
              <p className="text-sm text-gray-500 mt-1">Select your preferred language (English / Tamil)</p>
            </div>
            <div className="flex gap-2">
              <select name="language" defaultValue={settings?.language || "en"} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white">
                <option value="en">English</option>
                <option value="ta">Tamil</option>
              </select>
              <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 transition">Save</button>
            </div>
          </div>
        </form>

        {/* Notifications */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <p className="text-sm text-gray-500 mt-1">Future feature placeholder</p>
          </div>
          <div className="w-11 h-6 bg-gray-200 rounded-full relative cursor-not-allowed opacity-60">
            <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy</h3>
          <p className="text-sm text-gray-600 mb-4">
            HeatShield AI prioritizes your privacy. The personal factors you provide are only used to calculate localized risk estimation and are not shared with third parties.
          </p>
          <button className="text-emerald-600 text-sm font-medium hover:underline">Read Privacy Policy</button>
        </div>

        {/* Safety Information */}
        <div className="bg-emerald-50 border border-emerald-200 shadow-sm rounded-xl p-6">
          <h3 className="text-lg font-semibold text-emerald-900 mb-2 flex items-center gap-2">
            <span className="material-icons text-emerald-600">info</span>
            Safety Information
          </h3>
          <p className="text-sm text-emerald-800">
            HeatShield AI provides preventive decision-support. It does not diagnose medical conditions or replace official emergency warnings from authorities. Always prioritize immediate physical symptoms and seek medical help if necessary.
          </p>
        </div>

        {/* Account */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account</h3>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Sign out of your account on this device.</p>
            <form action={logoutAction}>
              <button type="submit" className="px-4 py-2 border border-red-300 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 transition">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}



