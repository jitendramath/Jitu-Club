import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Hash, Activity, RefreshCw } from 'lucide-react';
import { formatPeriod } from '../lib/utils';

export default function HeroCard({ latestResult, timeLeft, lastUpdated }) {
  
  // Color Theme Helper
  const getTheme = (color) => {
    if (color === 'G') return { bg: 'from-emerald-500/20 to-emerald-900/10', text: 'text-emerald-400', border: 'border-emerald-500/20' };
    if (color === 'R') return { bg: 'from-rose-500/20 to-rose-900/10', text: 'text-rose-400', border: 'border-rose-500/20' };
    if (color === 'V') return { bg: 'from-violet-500/20 to-violet-900/10', text: 'text-violet-400', border: 'border-violet-500/20' };
    return { bg: 'from-gray-500/20 to-gray-900/10', text: 'text-gray-400', border: 'border-white/10' };
  };

  const theme = latestResult ? getTheme(latestResult.color) : getTheme(null);
  const isCritical = timeLeft <= 5; // Last 5 seconds alert

  return (
    <div className="w-full px-1 mb-4 relative z-10">
      
      {/* Main Glass Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`
          relative overflow-hidden rounded-[32px] border backdrop-blur-3xl shadow-2xl
          bg-gradient-to-br ${theme.bg} ${theme.border}
        `}
      >
        
        {/* Background Mesh Gradient (Moving Light) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="p-6 relative">
          
          {/* --- TOP ROW: Period & Timer --- */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium flex items-center gap-1">
                <Hash className="w-3 h-3" /> Current Period
              </span>
              <span className="text-xl font-mono font-bold text-white/90 tracking-widest mt-1">
                {latestResult ? formatPeriod(latestResult.period) : "Loading..."}
              </span>
            </div>

            {/* The Reverse Timer */}
            <div className={`
              flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all duration-500
              ${isCritical ? 'bg-red-500/20 border-red-500/50 animate-pulse' : 'bg-black/20 border-white/10'}
            `}>
              <Clock className={`w-3 h-3 ${isCritical ? 'text-red-400' : 'text-emerald-400'}`} />
              <span className={`text-sm font-mono font-bold ${isCritical ? 'text-red-400' : 'text-emerald-400'}`}>
                {timeLeft === 0 ? "SCAN" : `00:${timeLeft.toString().padStart(2, '0')}`}
              </span>
            </div>
          </div>

          {/* --- MIDDLE ROW: The Big Result --- */}
          <div className="flex justify-between items-end">
            
            {/* BIG NUMBER */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={latestResult?.period}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="relative"
              >
                <h1 className="text-[80px] leading-[0.8] font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/10 drop-shadow-2xl">
                  {latestResult ? latestResult.number : "-"}
                </h1>
              </motion.div>
            </AnimatePresence>

            {/* Result Details (Badge Stack) */}
            <div className="flex flex-col items-end gap-2 mb-2">
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={`
                  px-4 py-1.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md
                  text-lg font-bold tracking-wider uppercase shadow-lg
                  ${latestResult?.size === 'Big' ? 'text-orange-400' : 'text-blue-400'}
                `}
              >
                {latestResult?.size || "WAIT"}
              </motion.div>
              
              <div className={`
                flex items-center gap-2 px-3 py-1 rounded-lg bg-black/20 border border-white/5
              `}>
                <div className={`w-2 h-2 rounded-full ${latestResult?.color === 'G' ? 'bg-emerald-500' : latestResult?.color === 'R' ? 'bg-rose-500' : 'bg-violet-500'}`} />
                <span className="text-[10px] text-white/60 uppercase font-medium">
                  {latestResult?.rawColor || "Color"}
                </span>
              </div>
            </div>
          </div>

          {/* --- BOTTOM ROW: The CBI Time Check --- */}
          <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {timeLeft === 0 ? (
                <RefreshCw className="w-3 h-3 text-yellow-400 animate-spin" />
              ) : (
                <Activity className="w-3 h-3 text-white/30" />
              )}
              <span className="text-[10px] font-medium text-white/40 tracking-wider">
                {timeLeft === 0 ? (
                  <span className="text-yellow-400">SYNCING CLOUD DATA...</span>
                ) : (
                  <>UPDATED: <span className="text-white/70 font-mono ml-1">{lastUpdated || "--:--:--"}</span></>
                )}
              </span>
            </div>
            
            {/* Live Indicator Dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
