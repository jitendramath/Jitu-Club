import React from 'react';
import { motion } from 'framer-motion';

// Animation Variants
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

// Pulse Animation for the latest number
const pulseText = {
  pulse: {
    opacity: [1, 0.5, 1],
    scale: [1, 1.1, 1],
    textShadow: [
      "0px 0px 0px rgba(0,0,0,0)",
      "0px 0px 8px rgba(255,255,255,0.5)",
      "0px 0px 0px rgba(0,0,0,0)"
    ],
    transition: { duration: 2, repeat: Infinity }
  }
};

export default function BeadRoad({ history }) {
  // Logic: Latest 10, reversed for Left-to-Right flow
  const displayData = [...history].slice(0, 10).reverse();

  // Color Helper for TEXT
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
      <div className="h-20 flex items-center justify-center text-white/20 text-[10px] animate-pulse">
        WAITING FOR FEED...
      </div>
    );
  }

  return (
    <div className="w-full mb-4 px-1">
      {/* Header */}
      <div className="flex justify-between items-center px-2 mb-1">
        <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
          Pattern Strip
        </h3>
        <span className="text-[9px] text-white/20 font-mono">L → R</span>
      </div>

      {/* The Container */}
      <div className="glass-card px-2 py-4 relative overflow-hidden">
        
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
                className="flex flex-col items-center gap-1"
              >
                
                {/* 1. BIG NUMBER (Color Coded) */}
                <motion.span 
                  variants={isLatest ? pulseText : {}}
                  animate={isLatest ? "pulse" : ""}
                  className={`
                    text-xl font-black font-mono leading-none
                    ${getNumColor(item.color)}
                  `}
                >
                  {item.number}
                </motion.span>

                {/* 2. THE PIPE SEPARATOR */}
                <span className="text-[10px] text-white/10 font-light h-3">
                  |
                </span>

                {/* 3. SIZE CODE */}
                <span className={`
                  text-[10px] font-bold uppercase tracking-tight
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
