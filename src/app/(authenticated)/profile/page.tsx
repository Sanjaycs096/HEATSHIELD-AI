import React from "react";
import { getAuthSession } from "@/lib/auth";
import { updateProfileAction } from "@/app/actions";

export default async function ProfilePage() {
  const auth = await getAuthSession();
  const profile = auth?.profile || {};

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
        <p className="text-gray-500 mt-1">Manage your personal information and preferences.</p>
      </div>

      <form action={updateProfileAction}>
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input name="name" type="text" defaultValue={profile.name} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input name="email" type="email" defaultValue={profile.email} disabled className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 focus:ring-emerald-500 focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                <select name="preferredLanguage" defaultValue={profile.preferredLanguage || "en"} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500">
                  <option value="en">English</option>
                  <option value="ta">Tamil</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Location</label>
                <input name="location" type="text" defaultValue={profile.location || ""} placeholder="e.g. Madurai" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                <select name="userType" defaultValue={profile.userType || ""} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500">
                  <option value="">Select Type</option>
                  <option value="outdoor_worker">Outdoor Worker</option>
                  <option value="resident">Resident</option>
                  <option value="caregiver">Caregiver</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="px-6 py-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}


