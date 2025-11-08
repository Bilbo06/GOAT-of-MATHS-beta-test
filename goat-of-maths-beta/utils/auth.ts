import { UserData } from '../types';

// Generates a username like 'lucas.dubois' from 'Lucas Dubois'
// Handles duplicates by adding a number at the end
export const generateUsername = (fullName: string, existingUsers: UserData[]): string => {
  const normalized = fullName
    .toLowerCase()
    .trim()
    .normalize("NFD") // Decompose accented letters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s]/g, '') // remove special chars
    .replace(/\s+/g, '.'); // Replace spaces with dots

  const existingUsernames = existingUsers.map(u => u.username);
  let username = normalized;
  let counter = 2;
  while (existingUsernames.includes(username)) {
    username = `${normalized}${counter}`;
    counter++;
  }
  return username;
};

// Generates a random 8-character password with letters and numbers
export const generatePassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Get a string identifier for the current week (e.g., "2024-28")
export const getWeekId = (date: Date): string => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    // Return array of year and week number
    return `${d.getUTCFullYear()}-${String(weekNo).padStart(2, '0')}`;
};