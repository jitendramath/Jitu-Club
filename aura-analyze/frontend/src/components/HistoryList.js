import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPeriod } from '../lib/utils';

export default function HistoryList({ history }) {
  
  if (!history || history.length === 0) {
    return (
      <div className="p-8 text-center text-white/20 text-xs font-medium tracking-widest animate-pulse">
        WAITING FOR SATELLITE DATA...
      </div>
    );
  }

  return (
    <div className="w-full px-1">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-2">
        <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
          Data Log
        </h3>
        <span className="text-[9px] text-white/20 font-mono">
          STORED: {history.length}
        </span>
      </div>

      {/* The Glass Container */}
      <div className="glass-card overflow-hidden relative">
        
        {/* Table Header (Sticky) */}
        <div className="grid grid-cols-4 p-3 bg-white/5 border-b border-white/5 text-[9px] font-bold text-white/40 uppercase tracking-wider backdrop-blur-md sticky top-0 z-10">
          <div className="text-left pl-2">Period</div>
          <div className="text-center">Result</div>
          <div className="text-center">Size</div>
          <div className="text-right pr-2">Check</div>
        </div>

        {/* Scrollable List Area */}
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
          <AnimatePresence initial={false}>
            {history.map((item, index) => (
              <motion.div
                key={item.period} // Unique Key is crucial for animation
                initial={{ opacity: 0, height: 0, x: -20 }}
                animate={{ opacity: 1, height: 'auto', x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`
                  grid grid-cols-4 items-center p-3 border-b border-white/5 last:border-0
                  hover:bg-white/[0.02] transition-colors
                  ${index === 0 ? 'bg-blue-500/5' : ''} // Latest row highlight
                `}
              >
                
                {/* 1. Period ID */}
                <div className="text-left pl-2 font-mono text-xs text-white/60">
                  {formatPeriod(item.period)}
                </div>

                {/* 2. Number Badge */}
                <div className="flex justify-center">
                  <span className={`
                    w-6 h-6 flex items-center justify-center rounded-lg text-xs font-bold shadow-lg
                    ${item.color === 'G' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                      item.color === 'R' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 
                      'bg-violet-500/20 text-violet-400 border border-violet-500/30'}
                  `}>
                    {item.number}
                  </span>
                </div>

                {/* 3. Size Text */}
                <div className={`text-center text-xs font-bold tracking-tight
                  ${item.size === 'Big' ? 'text-orange-400' : 'text-blue-400'}
                `}>
                  {item.size.toUpperCase()}
                </div>

                {/* 4. Color Dot (Visual Check) */}
                <div className="flex justify-end pr-4">
                  <div className={`
                    w-2 h-2 rounded-full ring-2 ring-white/5
                    ${item.color === 'G' ? 'bg-emerald-500' : 
                      item.color === 'R' ? 'bg-rose-500' : 'bg-violet-500'}
                  `} />
                </div>

              </motion.div>
            ))}
          </AnimatePresence>

          {/* End of List Indicator */}
          <div className="p-4 text-center text-[9px] text-white/10 uppercase tracking-widest">
            — End of Local Record —
          </div>
        </div>
      </div>
    </div>
  );
}
