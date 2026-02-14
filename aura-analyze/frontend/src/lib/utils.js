import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind Classes ko merge karne ke liye helper (Apple-style clean code)
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// 🕒 Real-Time India Clock (HH:MM:SS AM/PM)
export function getIndianTime() {
  return new Date().toLocaleTimeString('en-US', {
    timeZone: 'Asia/Kolkata',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// ⏳ 30-Second Reverse Timer Logic
export function getSecondsRemaining() {
  const now = new Date();
  const seconds = now.getSeconds();
  // WinGo 30S logic: har 30 second par naya round (0-30, 30-60)
  const remaining = 30 - (seconds % 30);
  return remaining === 30 ? 0 : remaining;
}

// 🔢 Period ID Formatter (Sirf last 4 digits dikhane ke liye)
export function formatPeriod(periodId) {
  if (!periodId) return "----";
  const str = periodId.toString();
  return "..." + str.slice(-5); // ...51825
}

// 🎨 Color Code Helper
export function getColorClass(color) {
  if (color === 'G') return 'text-green-500 bg-green-500/20 border-green-500/20';
  if (color === 'R') return 'text-red-500 bg-red-500/20 border-red-500/20';
  if (color === 'V') return 'text-purple-500 bg-purple-500/20 border-purple-500/20';
  return 'text-gray-500 bg-gray-500/20';
}
