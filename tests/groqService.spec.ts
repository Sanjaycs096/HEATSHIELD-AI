import { test, expect } from '@playwright/test';
import { generateActionPlan, AIContext } from '../src/lib/groqService';

const mockContext: AIContext = {
  userContext: {
    preferredLanguage: 'en',
    userType: 'outdoor_worker'
  },
  assessment: {
    location: 'Test Location',
    activityType: 'street_vending',
    intensity: 'high',
    environment: 'outdoor',
    startTime: '10:00',
    endTime: '16:00'
  },
  environment: {
    location: 'Test Location',
    timestamp: Date.now(),
    temperature: 38,
    humidity: 50,
    source: {
      provider: 'Test',
      type: 'fallback',
      fetchedAt: Date.now(),
      isLive: false,
      fallback: true
    }
  },
  riskAssessment: {
    score: 85,
    level: 'VERY_HIGH',
    factors: [
      { id: 'heat', name: 'Heat Exposure', score: 90, contribution: 'High', available: true, reason: 'High temp' }
    ],
    primaryConcern: 'heat',
    dataQuality: {
      completeness: 100,
      environmentalDataAvailable: true,
      hourlyDataAvailable: true,
      confidence: 'HIGH'
    },
    evaluatedAt: Date.now(),
    methodologyVersion: 'v1.0'
  }
};

test.describe('Groq Service Tests', () => {
  test('Fallback generation returns valid schema (No Key Mode)', async () => {
    // Ensuring no API key is present for the fallback test
    const originalKey = process.env.GROQ_API_KEY;
    process.env.GROQ_API_KEY = '';

    const plan = await generateActionPlan(mockContext);

    expect(plan.generatedBy).toBe('fallback');
    expect(plan.summary).toContain('VERY_HIGH');
    expect(plan.actions.length).toBeGreaterThan(0);
    expect(plan.language).toBe('en');

    process.env.GROQ_API_KEY = originalKey;
  });

  test('Tamil fallback generation works', async () => {
    const originalKey = process.env.GROQ_API_KEY;
    process.env.GROQ_API_KEY = '';

    const taContext = { ...mockContext, userContext: { preferredLanguage: 'ta' } };
    const plan = await generateActionPlan(taContext);

    expect(plan.language).toBe('ta');
    expect(plan.summary).toContain('VERY_HIGH');
    expect(plan.actions[0].title).toBe('நீரேற்றத்துடன் இருங்கள்');

    process.env.GROQ_API_KEY = originalKey;
  });
});
