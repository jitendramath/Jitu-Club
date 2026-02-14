import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  // 1. Initialize Theme (Check LocalStorage or System Preference)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // 2. Toggle Logic
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative flex items-center gap-2 px-1 py-1 rounded-full h-8 w-16
        transition-colors duration-500 shadow-inner
        ${isDark ? 'bg-black/40 border border-white/10' : 'bg-gray-200 border border-gray-300'}
      `}
    >
      {/* Sliding Indicator (The Magic) */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className={`
          absolute w-6 h-6 rounded-full shadow-md z-10
          ${isDark ? 'bg-gray-800' : 'bg-white'}
        `}
        style={{
          left: isDark ? 'auto' : '4px',
          right: isDark ? '4px' : 'auto'
        }}
      />

      {/* Sun Icon */}
      <div className="w-1/2 flex justify-center z-20">
        <Sun 
          className={`w-3 h-3 transition-colors duration-300 ${!isDark ? 'text-orange-500' : 'text-white/20'}`} 
        />
      </div>

      {/* Moon Icon */}
      <div className="w-1/2 flex justify-center z-20">
        <Moon 
          className={`w-3 h-3 transition-colors duration-300 ${isDark ? 'text-blue-400' : 'text-gray-400'}`} 
        />
      </div>

    </button>
  );
}
