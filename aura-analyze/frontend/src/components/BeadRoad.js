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

const pulseColumn = {
  pulse: {
    scale: [1, 1.05, 1],
    filter: [
      'drop-shadow(0 0 0px rgba(0,0,0,0))',
      'drop-shadow(0 0 5px rgba(255,255,255,0.2))',
      'drop-shadow(0 0 0px rgba(0,0,0,0))'
    ],
    transition: { duration: 1.5, repeat: Infinity }
  }
};

export default function BeadRoad({ history }) {
  const displayData = [...history].slice(0, 10).reverse();

  // Unified Color Helper (Number aur Size dono ke liye same)
  const getColor = (color) => {
    if (color === 'G') return 'text-emerald-500';
    if (color === 'R') return 'text-rose-500';
    return 'text-violet-500';
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
            const itemColor = getColor(item.color); // Common Color
            
            return (
              <motion.div 
                key={`${item.period}-${index}`}
                variants={itemVariants}
                animate={isLatest ? "pulse" : ""}
                variants={isLatest ? pulseColumn : itemVariants}
                className="flex flex-col items-center" 
              >
                
                {/* 1. NUMBER (Bold & Big) */}
                <span className={`
                  text-xl font-black font-mono leading-none tracking-tighter
                  ${itemColor}
                `}>
                  {item.number}
                </span>

                {/* 2. SIZE (Bold - Chipka hua) */}
                {/* Negative margin-top (-mt-1) se gap kam kiya */}
                <span className={`
                  text-lg font-black font-mono leading-none uppercase -mt-1
                  ${itemColor}
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
