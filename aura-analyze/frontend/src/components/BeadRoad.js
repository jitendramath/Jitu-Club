import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

// Pulse Animation for the LATEST column
const pulseColumn = {
  pulse: {
    scale: [1, 1.05, 1],
    filter: [
      'drop-shadow(0 0 0px rgba(0,0,0,0))',
      'drop-shadow(0 0 8px rgba(255,255,255,0.3))',
      'drop-shadow(0 0 0px rgba(0,0,0,0))'
    ],
    transition: { duration: 1.5, repeat: Infinity }
  }
};

export default function BeadRoad({ history }) {
  const displayData = [...history].slice(0, 10).reverse();

  // Color Helpers
  const getNumColor = (color) => {
    if (color === 'G') return 'text-emerald-500';
    if (color === 'R') return 'text-rose-500';
    return 'text-violet-500';
  };

  const getSizeColor = (size) => {
    return size === 'Big' ? 'text-orange-400' : 'text-blue-400';
  };

  if (history.length === 0) {
    return (
      <div className="h-24 flex items-center justify-center text-white/20 text-[10px] animate-pulse">
        CALCULATING ROAD...
      </div>
    );
  }

  return (
    <div className="w-full mb-4 px-1">
      {/* Header */}
      <div className="flex justify-between items-center px-2 mb-2">
        <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
          Trend Matrix
        </h3>
        <span className="text-[9px] text-white/20 font-mono">L → R</span>
      </div>

      {/* The Container */}
      <div className="glass-card px-2 py-3 relative overflow-hidden">
        
        <motion.div 
          className="flex justify-between items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {displayData.map((item, index) => {
            const isLatest = index === displayData.length - 1;
            
            return (
              <motion.div 
                key={`${item.period}-${index}`}
                variants={itemVariants}
                animate={isLatest ? "pulse" : ""}
                variants={isLatest ? pulseColumn : itemVariants} // Use explicit variant for latest
                className="flex flex-col items-center gap-0.5" // Gap kam kiya taaki juda hua lage
              >
                
                {/* 1. NUMBER (Bold & Big) */}
                <span className={`
                  text-lg font-black font-mono leading-none
                  ${getNumColor(item.color)}
                `}>
                  {item.number}
                </span>

                {/* 2. THE PIPE (Separator) - Same Size */}
                <span className="text-lg font-black text-white/10 leading-none select-none">
                  |
                </span>

                {/* 3. SIZE (Bold & Big - Same as Number) */}
                <span className={`
                  text-lg font-black font-mono leading-none
                  ${getSizeColor(item.size)}
                `}>
                  {item.size === 'Big' ? 'B' : 'S'}
                </span>

              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
