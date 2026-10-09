import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial structure
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], sessions: [], profiles: {}, settings: {}, assessments: {} }));
}

function readDB() {
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(data);
}

function writeDB(data: Record<string, unknown>) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Passwords
export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(':');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return key === hash;
}

// Users
export function createUser(email: string, passwordHash: string, name: string) {
  const db = readDB();
  if (db.users.find((u: Record<string, unknown>) => u.email === email)) {
    throw new Error('User already exists');
  }
  const id = crypto.randomUUID();
  db.users.push({ id, email, passwordHash, createdAt: Date.now() });
  
  db.profiles[id] = { id, name, email, preferredLanguage: 'en', location: '', userType: '', createdAt: Date.now(), updatedAt: Date.now() };
  db.settings[id] = { language: 'en', units: 'metric', notifications: false };
  
  writeDB(db);
  return { id, email, name };
}

export function getUserByEmail(email: string) {
  const db = readDB();
  return db.users.find((u: Record<string, unknown>) => u.email === email);
}

// Sessions
export function createSession(userId: string) {
  const db = readDB();
  const sessionId = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
  db.sessions.push({ sessionId, userId, expiresAt });
  writeDB(db);
  return sessionId;
}

export function getSession(sessionId: string) {
  if (!sessionId) return null;
  const db = readDB();
  const session = db.sessions.find((s: Record<string, unknown>) => s.sessionId === sessionId);
  if (!session || session.expiresAt < Date.now()) {
    return null;
  }
  return session;
}

export function deleteSession(sessionId: string) {
  const db = readDB();
  db.sessions = db.sessions.filter((s: Record<string, unknown>) => s.sessionId !== sessionId);
  writeDB(db);
}

// Profile
export function getProfile(userId: string) {
  const db = readDB();
  return db.profiles[userId];
}

export function updateProfile(userId: string, data: Record<string, unknown>) {
  const db = readDB();
  if (!db.profiles[userId]) return null;
  db.profiles[userId] = { ...db.profiles[userId], ...data, updatedAt: Date.now() };
  writeDB(db);
  return db.profiles[userId];
}

// Settings
export function getSettings(userId: string) {
  const db = readDB();
  return db.settings[userId];
}

export function updateSettings(userId: string, data: Record<string, unknown>) {
  const db = readDB();
  if (!db.settings[userId]) return null;
  db.settings[userId] = { ...db.settings[userId], ...data };
  writeDB(db);
  return db.settings[userId];
}

// Assessments
export function saveAssessmentDraft(userId: string, data: Record<string, unknown>) {
  const db = readDB();
  if (!db.assessments) db.assessments = {};
  db.assessments[userId] = { ...data, updatedAt: Date.now() };
  writeDB(db);
  return db.assessments[userId];
}

export function getAssessmentDraft(userId: string) {
  const db = readDB();
  return db.assessments[userId];
}

