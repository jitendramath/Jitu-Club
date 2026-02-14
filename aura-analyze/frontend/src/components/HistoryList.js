import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPeriod } from '../lib/utils';
import { ChevronDown } from 'lucide-react';

export default function HistoryList({ history }) {
  const [visibleCount, setVisibleCount] = useState(20); // Shuru mein sirf 20 dikhayenge

  // Load More Logic
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 20); // Har click par 20 aur dikhao
  };

  if (!history || history.length === 0) {
    return (
      <div className="p-8 text-center text-white/20 text-xs font-medium tracking-widest animate-pulse">
        WAITING FOR SATELLITE DATA...
      </div>
    );
  }

  // Slice data based on visibleCount
  const visibleHistory = history.slice(0, visibleCount);

  return (
    <div className="w-full px-1 mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-2">
        <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
          Data Log
        </h3>
        <span className="text-[9px] text-white/20 font-mono">
          SHOWING: {visibleHistory.length} / {history.length}
        </span>
      </div>

      {/* The Glass Container (Auto Height - No Scroll) */}
      <div className="glass-card overflow-hidden relative">
        
        {/* Table Header */}
        <div className="grid grid-cols-4 p-3 bg-white/5 border-b border-white/5 text-[9px] font-bold text-white/40 uppercase tracking-wider backdrop-blur-md">
          <div className="text-left pl-2">Period</div>
          <div className="text-center">Result</div>
          <div className="text-center">Size</div>
          <div className="text-right pr-2">Check</div>
        </div>

        {/* List Area */}
        <div className="w-full"> {/* removed max-h-[300px] and overflow-y-auto */}
          <AnimatePresence initial={false}>
            {visibleHistory.map((item, index) => (
              <motion.div
                key={item.period} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`
                  grid grid-cols-4 items-center p-3 border-b border-white/5 last:border-0
                  hover:bg-white/[0.02] transition-colors
                  ${index === 0 ? 'bg-blue-500/5' : ''} 
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

                {/* 4. Color Dot */}
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
        </div>

        {/* Load More Button Area */}
        {history.length > visibleCount && (
          <div className="p-4 flex justify-center border-t border-white/5 bg-white/[0.02]">
            <button 
              onClick={handleLoadMore}
              className="
                flex items-center gap-2 px-6 py-2 rounded-full 
                bg-white/5 hover:bg-white/10 active:scale-95 transition-all
                border border-white/10 text-[10px] font-bold text-white/60 uppercase tracking-widest
              "
            >
              Load More History <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
