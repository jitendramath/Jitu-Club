"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameLogic } from '../hooks/useGameLogic';
import { getIndianTime } from '../lib/utils';
import { Activity } from 'lucide-react';

// 💎 Imported Masterpieces
import BeadRoad from '../components/BeadRoad';
import HeroCard from '../components/HeroCard';
import HistoryList from '../components/HistoryList';
import LiveGraph from '../components/LiveGraph'; // Make sure this file exists from previous steps
import ThemeToggle from '../components/ThemeToggle';

export default function Dashboard() {
  // 🧠 The Brain Hook
  const { history, latestResult, timeLeft, lastUpdated, loading } = useGameLogic();
  
  // 🇮🇳 Real-Time Clock State
  const [currentTime, setCurrentTime] = useState("Loading...");

  // Clock Ticker Effect (Updates every second)
  useEffect(() => {
    // Hydration mismatch avoid karne ke liye initial set
    setCurrentTime(getIndianTime());
    
    const interval = setInterval(() => {
      setCurrentTime(getIndianTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pb-24 relative overflow-x-hidden">
      
      {/* --- 1. HEADER SECTION --- */}
      <header className="flex justify-between items-center mb-6 pt-2 sticky top-0 z-50 bg-black/10 backdrop-blur-md px-1 py-3 rounded-b-2xl border-b border-white/5">
        
        {/* Logo Area */}
        <div className="flex flex-col">
          <h1 className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 italic">
            TRACK<span className="text-blue-500">WINGO</span>
          </h1>
          <span className="text-[8px] text-white/40 tracking-[0.4em] font-medium">
            PRO TERMINAL
          </span>
        </div>

        {/* Center: The Magic Toggle */}
        <div className="scale-90">
          <ThemeToggle />
        </div>

        {/* Right: India Clock */}
        <div className="flex flex-col items-end">
           <div className="font-mono text-xs font-bold text-white/90 tabular-nums tracking-wide">
             {currentTime}
           </div>
           <div className="flex items-center gap-1">
             <span className="relative flex h-1.5 w-1.5">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
             </span>
             <span className="text-[8px] text-green-400/80 font-bold tracking-wider">IST LIVE</span>
           </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <AnimatePresence mode="wait">
        {loading ? (
          // 🛰️ LOADING SCREEN
          <motion.div 
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-[60vh] space-y-4"
          >
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              </div>
            </div>
            <p className="text-[10px] text-white/50 tracking-[0.3em] animate-pulse font-medium">
              ESTABLISHING UPLINK...
            </p>
          </motion.div>
        ) : (
          // 🚀 DASHBOARD CONTENT
          <motion.div 
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6"
          >
            
            {/* A. Bead Road (Immediate Pattern) */}
            <section>
              <BeadRoad history={history} />
            </section>

            {/* B. Hero Card (Timer + Result) */}
            <section>
              <HeroCard 
                latestResult={latestResult} 
                timeLeft={timeLeft} 
                lastUpdated={lastUpdated} 
              />
            </section>

                        {/* C. Live Graph (Trend Visualization) */}
            {/* ✅ Update: p-2 hata diya, ab ye p-0 hai */}
            <section className="glass-card mx-1 overflow-hidden relative group">
              
              {/* Header (Isme padding rakhenge taaki text na chipke) */}
              <div className="flex justify-between items-center px-4 pt-3 pb-1 relative z-10">
                 <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Activity className="w-3 h-3 text-blue-400" />
                    Market Depth
                 </h3>
                 <span className="text-[9px] font-mono text-white/20">
                    LAST 20R
                 </span>
              </div>
              
              {/* The Graph Component */}
              {/* ✅ Height badha kar 220px kar di aur width full */}
              <div className="h-[220px] w-full -ml-1"> {/* Thoda left pull (-ml-1) taaki gap na dikhe */}
                <LiveGraph history={history} />
              </div>

              {/* Bottom Gradient Fade (Premium Touch) */}
              <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </section>
              

            {/* D. History List (Detailed Logs) */}
            <section>
              <HistoryList history={history} />
            </section>

          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Footer / Copyright */}
      <footer className="text-center mt-12 mb-4">
        <p className="text-[9px] text-white/10 tracking-widest uppercase">
          TrackWinGo System v3.0 • Secure Connection
        </p>
      </footer>

    </div>
  );
}
