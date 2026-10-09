import { test, expect } from '@playwright/test';
import { calculateRisk, AssessmentInput, getRiskLevel } from '../src/lib/riskEngine';
import { EnvironmentalSnapshot } from '../src/lib/envService';

const getMockSnapshot = (temp: number, humidity: number, aqi: number | null): EnvironmentalSnapshot => ({
  location: 'Test Location',
  timestamp: Date.now(),
  temperature: temp,
  humidity: humidity,
  aqi: aqi === null ? undefined : aqi,
  source: {
    provider: 'Test',
    type: 'fallback',
    fetchedAt: Date.now(),
    isLive: false,
    fallback: true
  }
});

const getMockInput = (): AssessmentInput => ({
  location: 'Test',
  activityType: 'walking',
  intensity: 'moderate',
  environment: 'outdoor',
  startTime: '10:00',
  endTime: '12:00'
});

test.describe('Risk Engine Unit Tests', () => {
  test('Low environmental conditions produce LOW/MODERATE result', () => {
    const risk = calculateRisk(getMockInput(), getMockSnapshot(22, 50, 40));
    expect(risk.score).toBeGreaterThanOrEqual(0);
    expect(risk.score).toBeLessThan(50);
  });

  test('High heat produces higher score', () => {
    const riskLow = calculateRisk(getMockInput(), getMockSnapshot(22, 50, 40));
    const riskHigh = calculateRisk(getMockInput(), getMockSnapshot(39, 50, 40));
    expect(riskHigh.score).toBeGreaterThan(riskLow.score);
  });

  test('High AQI increases score', () => {
    const riskLowAqi = calculateRisk(getMockInput(), getMockSnapshot(25, 50, 30));
    const riskHighAqi = calculateRisk(getMockInput(), getMockSnapshot(25, 50, 180));
    expect(riskHighAqi.score).toBeGreaterThan(riskLowAqi.score);
  });

  test('Higher activity intensity increases score', () => {
    const input = getMockInput();
    
    input.intensity = 'light';
    const riskLight = calculateRisk(input, getMockSnapshot(30, 50, 50));
    
    input.intensity = 'heavy';
    const riskHeavy = calculateRisk(input, getMockSnapshot(30, 50, 50));
    
    expect(riskHeavy.score).toBeGreaterThan(riskLight.score);
  });

  test('Missing AQI does not crash calculation and adjusts weights', () => {
    const risk = calculateRisk(getMockInput(), getMockSnapshot(30, 50, null));
    expect(risk.score).toBeGreaterThanOrEqual(0);
    expect(risk.dataQuality.completeness).toBeLessThan(100);
  });

  test('Score is always 0–100', () => {
    const input = getMockInput();
    input.intensity = 'heavy';
    input.startTime = '12:00';
    input.endTime = '20:00';
    const riskMax = calculateRisk(input, getMockSnapshot(50, 100, 500));
    expect(riskMax.score).toBeLessThanOrEqual(100);
    expect(riskMax.score).toBeGreaterThanOrEqual(0);
  });
});
