import { AssessmentInput, RiskAssessment, calculateRisk, RiskLevel } from './riskEngine';
import { EnvironmentalSnapshot, HourlyCondition } from './envService';

export interface ScheduleEvaluation {
  startTime: string;
  endTime: string;
  durationMinutes: number;
  riskScore: number;
  riskLevel: RiskLevel;
  exposureIndex: number;
  reason: string;
}

export interface ScheduleOptimizationResult {
  current: ScheduleEvaluation;
  recommended: ScheduleEvaluation;
  exposureReductionPercent: number;
  riskReductionPoints: number;
  improvementAvailable: boolean;
  evaluatedCandidates: number;
  dataQuality: "HIGH" | "MEDIUM" | "LOW";
  methodologyVersion: string;
}

// Convert HH:MM string to total minutes
function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

// Convert minutes to HH:MM string
function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = Math.floor(minutes % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

// Extract snapshot for a given hour from timeline
function getSnapshotForTime(timeline: HourlyCondition[], timestampMs: number, fallbackSnapshot: EnvironmentalSnapshot): EnvironmentalSnapshot {
  const hour = new Date(timestampMs).getHours();
  // Find condition for this hour
  const condition = timeline.find(c => new Date(c.timestamp).getHours() === hour);
  if (condition) {
    return {
      location: fallbackSnapshot.location,
      timestamp: condition.timestamp,
      temperature: condition.temperature,
      humidity: condition.humidity,
      aqi: condition.aqi,
      source: fallbackSnapshot.source
    };
  }
  return fallbackSnapshot;
}

// Evaluate a candidate schedule
function evaluateSchedule(
  startMinutes: number, 
  durationMinutes: number, 
  input: AssessmentInput, 
  timeline: HourlyCondition[], 
  fallbackSnapshot: EnvironmentalSnapshot
): ScheduleEvaluation {
  
  const startTime = minutesToTime(startMinutes);
  const endTime = minutesToTime(startMinutes + durationMinutes);
  
  const candidateInput: AssessmentInput = {
    ...input,
    startTime,
    endTime
  };
  
  // Calculate average risk across the duration
  // Sample at start time, and every 60 minutes
  let totalRisk = 0;
  let samples = 0;
  
  const startTimestampMs = new Date().setHours(Math.floor(startMinutes/60), Math.floor(startMinutes%60), 0, 0);
  
  for (let m = 0; m <= durationMinutes; m += 60) {
    const sampleTimestamp = startTimestampMs + m * 60 * 1000;
    const snapshot = getSnapshotForTime(timeline, sampleTimestamp, fallbackSnapshot);
    const risk = calculateRisk(candidateInput, snapshot, {}); // ignoring user context for relative opt
    totalRisk += risk.score;
    samples++;
  }
  
  // Also sample at end time if not aligned
  if (durationMinutes % 60 !== 0) {
    const sampleTimestamp = startTimestampMs + durationMinutes * 60 * 1000;
    const snapshot = getSnapshotForTime(timeline, sampleTimestamp, fallbackSnapshot);
    const risk = calculateRisk(candidateInput, snapshot, {});
    totalRisk += risk.score;
    samples++;
  }

  const averageRisk = totalRisk / samples;
  
  // Base single assessment for risk level bounds
  const baseSnapshot = getSnapshotForTime(timeline, startTimestampMs, fallbackSnapshot);
  const baseRisk = calculateRisk(candidateInput, baseSnapshot, {});
  
  // Exposure index = average risk score (duration is normalized since duration score is intrinsic to risk engine)
  const exposureIndex = Math.round(averageRisk);
  
  return {
    startTime,
    endTime,
    durationMinutes,
    riskScore: baseRisk.score,
    riskLevel: baseRisk.level,
    exposureIndex,
    reason: baseRisk.factors.filter(f => f.contribution === 'High').map(f => f.name).join(', ') || baseRisk.primaryConcern
  };
}

export function optimizeSchedule(
  input: AssessmentInput, 
  timeline: HourlyCondition[], 
  snapshot: EnvironmentalSnapshot
): ScheduleOptimizationResult | null {
  
  if (!timeline || timeline.length === 0) {
    return null; // Cannot optimize without hourly timeline
  }

  const startMins = timeToMinutes(input.startTime);
  const endMins = timeToMinutes(input.endTime);
  let durationMins = endMins - startMins;
  if (durationMins < 0) durationMins += 24 * 60;
  
  const currentEvaluation = evaluateSchedule(startMins, durationMins, input, timeline, snapshot);
  
  // Generate candidates every 30 mins from 06:00 to 20:00
  const candidates: ScheduleEvaluation[] = [];
  const startDay = 6 * 60; // 06:00
  const endDay = 20 * 60; // 20:00
  
  for (let m = startDay; m <= endDay - durationMins; m += 30) {
    candidates.push(evaluateSchedule(m, durationMins, input, timeline, snapshot));
  }
  
  // Sort candidates:
  // 1. Lowest exposure index
  // 2. Lowest risk score
  // 3. Closest to original schedule
  candidates.sort((a, b) => {
    if (a.exposureIndex !== b.exposureIndex) {
      return a.exposureIndex - b.exposureIndex;
    }
    if (a.riskScore !== b.riskScore) {
      return a.riskScore - b.riskScore;
    }
    const distA = Math.abs(timeToMinutes(a.startTime) - startMins);
    const distB = Math.abs(timeToMinutes(b.startTime) - startMins);
    return distA - distB;
  });
  
  const recommended = candidates[0];
  
  // Compare current and recommended
  const exposureReductionPercent = currentEvaluation.exposureIndex > 0 ? 
    Math.max(0, Math.round(((currentEvaluation.exposureIndex - recommended.exposureIndex) / currentEvaluation.exposureIndex) * 100)) : 0;
    
  const riskReductionPoints = Math.max(0, currentEvaluation.riskScore - recommended.riskScore);
  
  // Require at least 5% exposure reduction or 5 point risk reduction to recommend a change
  const improvementAvailable = exposureReductionPercent >= 5 || riskReductionPoints >= 5;

  return {
    current: currentEvaluation,
    recommended: improvementAvailable ? recommended : currentEvaluation,
    exposureReductionPercent: improvementAvailable ? exposureReductionPercent : 0,
    riskReductionPoints: improvementAvailable ? riskReductionPoints : 0,
    improvementAvailable,
    evaluatedCandidates: candidates.length,
    dataQuality: timeline.length > 5 ? "HIGH" : "MEDIUM",
    methodologyVersion: "schedule-optimizer-v1.0"
  };
}
