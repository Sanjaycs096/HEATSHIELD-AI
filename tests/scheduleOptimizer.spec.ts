import { test, expect } from '@playwright/test';
import { optimizeSchedule } from '../src/lib/scheduleOptimizer';
import { AssessmentInput } from '../src/lib/riskEngine';
import { EnvironmentalSnapshot, HourlyCondition } from '../src/lib/envService';

const mockInput: AssessmentInput = {
  location: 'Test Location',
  activityType: 'walking',
  intensity: 'moderate',
  environment: 'outdoor',
  startTime: '12:00',
  endTime: '14:00' // 2 hours
};

const mockSnapshot: EnvironmentalSnapshot = {
  location: 'Test Location',
  timestamp: Date.now(),
  temperature: 30,
  humidity: 50,
  source: { provider: 'Test', type: 'fallback', fetchedAt: Date.now(), isLive: false, fallback: true }
};

// Generate a timeline where 08:00 is cool, 12:00 is hot
const mockTimeline: HourlyCondition[] = [];
for (let i = 0; i < 24; i++) {
  const timestamp = new Date();
  timestamp.setHours(i, 0, 0, 0);
  
  let temp = 25;
  if (i >= 11 && i <= 15) temp = 38; // hot midday
  if (i >= 7 && i <= 9) temp = 22;   // cool morning

  mockTimeline.push({
    timestamp: timestamp.getTime(),
    temperature: temp,
    humidity: 50,
    aqi: 50
  });
}

test.describe('Schedule Optimizer Tests', () => {
  test('Finds cooler alternative when current schedule is during peak heat', () => {
    const result = optimizeSchedule(mockInput, mockTimeline, mockSnapshot);
    
    expect(result).not.toBeNull();
    expect(result!.improvementAvailable).toBe(true);
    expect(result!.current.startTime).toBe('12:00');
    expect(result!.current.endTime).toBe('14:00');
    
    // Should prefer morning or evening which is cooler
    const recommendedStartHour = parseInt(result!.recommended.startTime.split(':')[0]);
    expect(recommendedStartHour).toBeLessThan(11);
    
    expect(result!.exposureReductionPercent).toBeGreaterThan(0);
    expect(result!.riskReductionPoints).toBeGreaterThan(0);
  });

  test('Preserves duration exactly', () => {
    const result = optimizeSchedule(mockInput, mockTimeline, mockSnapshot);
    expect(result!.recommended.durationMinutes).toBe(120);
  });

  test('Returns no improvement available when current schedule is already optimal', () => {
    const optimalInput = { ...mockInput, startTime: '07:00', endTime: '09:00' };
    const result = optimizeSchedule(optimalInput, mockTimeline, mockSnapshot);
    
    expect(result!.improvementAvailable).toBe(false);
    expect(result!.exposureReductionPercent).toBe(0);
    expect(result!.riskReductionPoints).toBe(0);
    expect(result!.recommended.startTime).toBe('07:00'); // same as input
  });

  test('Tie-breaking prefers original schedule when exposure is equal', () => {
    // Flat timeline, all hours same temp
    const flatTimeline = mockTimeline.map(c => ({ ...c, temperature: 25 }));
    // Start at 06:00 to avoid peak time score penalty
    const earlyInput = { ...mockInput, startTime: '06:00', endTime: '08:00' };
    const result = optimizeSchedule(earlyInput, flatTimeline, mockSnapshot);
    
    expect(result!.improvementAvailable).toBe(false);
    expect(result!.recommended.startTime).toBe('06:00');
  });

  test('Returns null when no timeline provided', () => {
    const result = optimizeSchedule(mockInput, [], mockSnapshot);
    expect(result).toBeNull();
  });
});
