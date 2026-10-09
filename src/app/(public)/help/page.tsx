import React from "react";
import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 px-4 sm:px-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Safety Guide & Help</h2>
        <p className="text-gray-500 mt-2 text-lg">Understanding how HeatShield AI assesses environmental risk and provides safety recommendations.</p>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl">
        <h3 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
          <span className="material-icons text-emerald-600">health_and_safety</span>
          Important Safety Boundary
        </h3>
        <p className="text-emerald-800">
          HeatShield AI provides environmental risk guidance for planning outdoor activity based on available weather and air quality data. 
          <strong> It is not a medical diagnosis, an emergency service, or a replacement for official alerts. </strong> 
          Always seek professional medical advice or emergency assistance if you experience symptoms of heat exhaustion or stroke.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Understanding HeatShield</h3>
          <p className="text-gray-700">
            HeatShield AI helps you plan safer outdoor activities by analyzing local heat and air quality conditions, assessing the risk of your specific activity, and recommending optimal schedules to minimize exposure.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 border-b pb-2">The Risk Score (0-100)</h3>
          <p className="text-gray-700">
            Our deterministic risk engine calculates a score between 0 and 100 based on five key factors:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li><strong>Heat (40%):</strong> Temperature and humidity</li>
            <li><strong>Air Quality (25%):</strong> AQI levels</li>
            <li><strong>Activity (15%):</strong> Physical intensity</li>
            <li><strong>Duration (10%):</strong> Length of exposure</li>
            <li><strong>Time of Day (10%):</strong> Solar radiation peak hours</li>
          </ul>
          <p className="text-sm text-gray-500 mt-2">
            Scores are categorized into LOW (0-39), MODERATE (40-69), HIGH (70-89), and VERY HIGH (90-100).
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Exposure Reduction</h3>
          <p className="text-gray-700">
            When HeatShield AI suggests a safer schedule, it calculates an <strong>Estimated Exposure Index</strong>. This index is a comparative mathematical score based on the risk levels throughout your activity window. The percentage reduction shows how much environmental stress you can avoid by shifting your schedule.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Data & AI Transparency</h3>
          <p className="text-gray-700 mb-2">
            <strong>Data Sources:</strong> We clearly label our data as either <em>Live Data</em> or <em>Fallback / Demo Data</em>. Fallback data is used when live APIs are unavailable to ensure you always receive guidance.
          </p>
          <p className="text-gray-700">
            <strong>AI Boundary:</strong> HeatShield uses generative AI (Groq) to provide personalized, multilingual explanations and action plans. However, the AI <em>never</em> calculates the underlying risk score or schedule optimization. Those are strictly determined by our mathematical models.
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-gray-200 text-center">
        <Link href="/assessment/new" className="inline-block px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition shadow-sm">
          Start a Safety Assessment
        </Link>
      </div>
    </div>
  );
}
