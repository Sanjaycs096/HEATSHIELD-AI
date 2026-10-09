'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createUser, getUserByEmail, verifyPassword, hashPassword, createSession, updateProfile, updateSettings, saveAssessmentDraft } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function loginAction(state: unknown, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const user = getUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: 'Invalid email or password' };
  }

  const sessionId = createSession(user.id);
  const cookieStore = await cookies();
  cookieStore.set('sessionId', sessionId, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });
  
  redirect('/dashboard');
}

export async function registerAction(state: unknown, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!name || !email || !password || password !== confirmPassword) {
    return { error: 'Invalid form data or passwords do not match' };
  }

  try {
    const passwordHash = hashPassword(password);
    const user = createUser(email, passwordHash, name);
    const sessionId = createSession(user.id);
    const cookieStore = await cookies();
    cookieStore.set('sessionId', sessionId, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: 'Unknown error occurred' };
  }

  redirect('/dashboard');
}

export async function updateProfileAction(formData: FormData) {
  const auth = await getAuthSession();
  if (!auth) throw new Error("Unauthorized");

  const name = formData.get('name') as string;
  const preferredLanguage = formData.get('preferredLanguage') as string;
  const location = formData.get('location') as string;
  const userType = formData.get('userType') as string;

  updateProfile(auth.session.userId, { name, preferredLanguage, location, userType });
  redirect('/profile');
}

export async function updateSettingsAction(formData: FormData) {
  const auth = await getAuthSession();
  if (!auth) throw new Error("Unauthorized");

  const language = formData.get('language') as string;
  updateSettings(auth.session.userId, { language });
  redirect('/settings');
}

import { envService } from '@/lib/envService';

import { calculateRisk, AssessmentInput, UserContext } from '@/lib/riskEngine';
import { generateActionPlan } from '@/lib/groqService';
import { optimizeSchedule } from '@/lib/scheduleOptimizer';

export async function saveAssessmentDraftAction(formData: FormData) {
  const auth = await getAuthSession();
  if (!auth) throw new Error("Unauthorized");

  const data = Object.fromEntries(formData.entries());
  
  // Use location from form or fallback to profile location
  const location = (data.location as string) || auth.profile.location || 'Unknown Location';
  data.location = location;

  try {
    // Phase 3: Fetch Environmental Data
    const snapshot = await envService.getEnvironmentalSnapshot(location);
    
    // Calculate timestamp bounds for hourly data
    const now = new Date();
    const startTimeStr = (data.startTime as string) || '08:00';
    const endTimeStr = (data.endTime as string) || '17:00';
    
    const [startHour] = startTimeStr.split(':').map(Number);
    const [endHour] = endTimeStr.split(':').map(Number);
    
    const startTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour).getTime();
    const endTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour).getTime();

    const timeline = await envService.getHourlyEnvironmentalData(location, startTimestamp, endTimestamp);
    
    // Phase 4: Risk Calculation
    const userContext: UserContext = {
      location: auth.profile.location,
      userType: auth.profile.userType
    };
    
    const riskAssessment = calculateRisk(data as unknown as AssessmentInput, snapshot, userContext);
    
    if (timeline && timeline.length > 0) {
      riskAssessment.dataQuality.hourlyDataAvailable = true;
    }

    // Phase 6: Schedule Optimization
    let scheduleOptimization = null;
    if (timeline && timeline.length > 0) {
      scheduleOptimization = optimizeSchedule(data as unknown as AssessmentInput, timeline, snapshot);
    }

    // Phase 5: AI Action Plan Generation
    const aiContext = {
      userContext: {
        location: auth.profile.location,
        userType: auth.profile.userType,
        preferredLanguage: auth.profile.preferredLanguage || 'en'
      },
      assessment: data as unknown as AssessmentInput,
      environment: snapshot,
      riskAssessment
    };
    const aiActionPlan = await generateActionPlan(aiContext);

    // Save assessment with environmental data, risk assessment, AI plan, and optimization
    saveAssessmentDraft(auth.session.userId, {
      input: data,
      environmental: {
        snapshot,
        timeline
      },
      riskAssessment,
      scheduleOptimization,
      aiActionPlan,
      createdAt: Date.now()
    });
  } catch (error) {
    // Save assessment even if environmental data fails
    saveAssessmentDraft(auth.session.userId, {
      input: data,
      environmental: null,
      error: 'Failed to fetch environmental data',
      createdAt: Date.now()
    });
  }
  
  redirect('/assessment/preview');
}


