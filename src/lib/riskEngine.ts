import { EnvironmentalSnapshot } from './envService';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';

export interface RiskFactor {
  id: string;
  name: string;
  score: number;
  contribution: 'Low' | 'Moderate' | 'High';
  available: boolean;
  reason: string;
}

export interface DataQuality {
  completeness: number;
  environmentalDataAvailable: boolean;
  hourlyDataAvailable: boolean;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface RiskAssessment {
  score: number;
  level: RiskLevel;
  factors: RiskFactor[];
  primaryConcern: string;
  dataQuality: DataQuality;
  evaluatedAt: number;
  methodologyVersion: string;
}

export interface AssessmentInput {
  location: string;
  activityType: string;
  intensity: string;
  environment: string;
  startTime: string;
  endTime: string;
  duration?: number;
  ageGroup?: string;
  heatSensitivity?: string;
  coolingAccess?: string;
  language?: string;
}

export interface UserContext {
  location?: string;
  userType?: string;
}

const RISK_WEIGHTS = {
  heat: 0.40,
  aqi: 0.25,
  activity: 0.15,
  duration: 0.10,
  time: 0.10
};

export const RISK_LEVELS: Record<RiskLevel, { min: number, max: number }> = {
  LOW: { min: 0, max: 24 },
  MODERATE: { min: 25, max: 49 },
  HIGH: { min: 50, max: 74 },
  VERY_HIGH: { min: 75, max: 100 }
};

export function getRiskLevel(score: number): RiskLevel {
  if (score < 25) return 'LOW';
  if (score < 50) return 'MODERATE';
  if (score < 75) return 'HIGH';
  return 'VERY_HIGH';
}

function calculateHeatScore(snapshot: EnvironmentalSnapshot): { score: number, reason: string } {
  const temp = snapshot.temperature;
  let score = 0;
  let reason = '';

  if (temp < 27) {
    score = 10;
    reason = 'Temperature is in a comfortable range.';
  } else if (temp < 32) {
    score = 40;
    reason = 'Warm temperatures elevate exposure risk.';
  } else if (temp < 38) {
    score = 75;
    reason = 'High temperature increases heat stress risk.';
  } else {
    score = 100;
    reason = 'Extreme temperature indicates severe heat stress potential.';
  }

  // Adjust for humidity if temperature is somewhat high
  if (temp >= 27 && snapshot.humidity > 60) {
    score = Math.min(100, score + 15);
    reason += ' High humidity reduces evaporative cooling.';
  }

  return { score, reason };
}

function calculateAqiScore(snapshot: EnvironmentalSnapshot): { score: number, reason: string, available: boolean } {
  if (snapshot.aqi === undefined || snapshot.aqi === null) {
    return { score: 0, reason: 'Air quality data unavailable.', available: false };
  }

  const aqi = snapshot.aqi;
  let score = 0;
  let reason = '';

  if (aqi <= 50) {
    score = 10;
    reason = 'Air quality is good.';
  } else if (aqi <= 100) {
    score = 30;
    reason = 'Air quality is acceptable; moderate concern for sensitive individuals.';
  } else if (aqi <= 150) {
    score = 60;
    reason = 'Air quality is unhealthy for sensitive groups.';
  } else if (aqi <= 200) {
    score = 80;
    reason = 'Air quality is unhealthy, contributing significantly to exposure risk.';
  } else {
    score = 100;
    reason = 'Air quality is very unhealthy/hazardous.';
  }

  return { score, reason, available: true };
}

function calculateActivityScore(input: AssessmentInput): { score: number, reason: string } {
  const intensity = input.intensity?.toLowerCase() || 'moderate';
  
  if (intensity === 'light') {
    return { score: 20, reason: 'Light physical activity limits metabolic heat generation.' };
  } else if (intensity === 'moderate') {
    return { score: 50, reason: 'Moderate physical activity generates moderate metabolic heat.' };
  } else {
    return { score: 90, reason: 'Heavy/strenuous physical activity significantly increases metabolic heat and exposure.' };
  }
}

function calculateDurationScore(input: AssessmentInput): { score: number, reason: string } {
  let duration = 0;
  if (input.startTime && input.endTime) {
    const [startH, startM] = input.startTime.split(':').map(Number);
    const [endH, endM] = input.endTime.split(':').map(Number);
    duration = (endH + endM/60) - (startH + startM/60);
    if (duration < 0) duration += 24;
  }
  
  if (duration <= 1) {
    return { score: 20, reason: 'Short duration limits overall exposure.' };
  } else if (duration <= 3) {
    return { score: 50, reason: 'Moderate duration represents standard exposure.' };
  } else if (duration <= 6) {
    return { score: 80, reason: 'Prolonged duration significantly increases accumulated exposure.' };
  } else {
    return { score: 100, reason: 'Very long duration leads to severe accumulated exposure risk.' };
  }
}

function calculateTimeScore(input: AssessmentInput): { score: number, reason: string } {
  if (!input.startTime || !input.endTime) {
    return { score: 50, reason: 'Schedule undefined.' };
  }
  
  const [startH] = input.startTime.split(':').map(Number);
  const [endH] = input.endTime.split(':').map(Number);
  
  // Peak sun hours roughly 11:00 to 15:00 (11 to 15)
  const isPeak = (startH >= 11 && startH < 15) || (endH > 11 && endH <= 15) || (startH < 11 && endH > 15);
  
  if (isPeak) {
    return { score: 90, reason: 'Activity schedule overlaps with peak solar radiation and temperature hours.' };
  } else {
    return { score: 30, reason: 'Activity schedule avoids peak solar radiation hours.' };
  }
}

function getContributionLevel(score: number): 'Low' | 'Moderate' | 'High' {
  if (score < 40) return 'Low';
  if (score < 70) return 'Moderate';
  return 'High';
}

export function calculateRisk(
  input: AssessmentInput,
  snapshot: EnvironmentalSnapshot,
  user: UserContext = {}
): RiskAssessment {
  
  const heat = calculateHeatScore(snapshot);
  const aqi = calculateAqiScore(snapshot);
  const activity = calculateActivityScore(input);
  const duration = calculateDurationScore(input);
  const time = calculateTimeScore(input);
  
  // Normalize weights if AQI is missing
  let totalWeight = 1.0;
  let aqiWeight = RISK_WEIGHTS.aqi;
  
  if (!aqi.available) {
    totalWeight -= RISK_WEIGHTS.aqi;
    aqiWeight = 0;
  }

  // Calculate raw weighted score
  const rawScore = (
    (heat.score * RISK_WEIGHTS.heat) +
    (aqi.score * aqiWeight) +
    (activity.score * RISK_WEIGHTS.activity) +
    (duration.score * RISK_WEIGHTS.duration) +
    (time.score * RISK_WEIGHTS.time)
  ) / totalWeight;

  // Clamp safely between 0 and 100
  const finalScore = Math.max(0, Math.min(100, Math.round(rawScore || 0)));

  const factors: RiskFactor[] = [
    { id: 'heat', name: 'Heat Exposure', score: heat.score, contribution: getContributionLevel(heat.score), available: true, reason: heat.reason },
    { id: 'aqi', name: 'Air Quality', score: aqi.score, contribution: getContributionLevel(aqi.score), available: aqi.available, reason: aqi.reason },
    { id: 'activity', name: 'Activity Intensity', score: activity.score, contribution: getContributionLevel(activity.score), available: true, reason: activity.reason },
    { id: 'duration', name: 'Duration', score: duration.score, contribution: getContributionLevel(duration.score), available: true, reason: duration.reason },
    { id: 'time', name: 'Time Context', score: time.score, contribution: getContributionLevel(time.score), available: true, reason: time.reason }
  ];

  // Determine primary concern
  const validFactors = factors.filter(f => f.available);
  const primaryFactor = validFactors.reduce((prev, current) => (prev.score > current.score) ? prev : current);
  const primaryConcern = primaryFactor.id;

  const completeness = (validFactors.length / factors.length) * 100;
  const confidence = completeness >= 100 ? 'HIGH' : (completeness > 50 ? 'MEDIUM' : 'LOW');

  const dataQuality: DataQuality = {
    completeness,
    environmentalDataAvailable: true,
    hourlyDataAvailable: false, // Updated by caller if timeline exists
    confidence
  };

  return {
    score: finalScore,
    level: getRiskLevel(finalScore),
    factors,
    primaryConcern,
    dataQuality,
    evaluatedAt: Date.now(),
    methodologyVersion: 'v1.0'
  };
}
