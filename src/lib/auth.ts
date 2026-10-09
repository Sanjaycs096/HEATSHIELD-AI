'use server';

import { cookies } from 'next/headers';
import { getSession, getProfile, deleteSession } from './db';
import { redirect } from 'next/navigation';

export async function getAuthSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionId')?.value;
  if (!sessionId) return null;
  const session = getSession(sessionId);
  if (!session) return null;
  const profile = getProfile(session.userId);
  return { session, profile };
}

export async function requireAuth() {
  const auth = await getAuthSession();
  if (!auth) {
    redirect('/login');
  }
  return auth;
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionId')?.value;
  if (sessionId) {
    deleteSession(sessionId);
    cookieStore.set('sessionId', '', { maxAge: 0, path: '/' });
  }
  redirect('/login');
}
