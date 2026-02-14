import React from 'react';
import { motion } from 'framer-motion';

// Framer Motion Variants (Pro Level Animation Logic)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1 // Har ek item 0.1s ke gap par aayega
    }
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

const pulseVariant = {
  pulse: {
    scale: [1, 1.15, 1],
    opacity: [1, 0.8, 1],
    boxShadow: [
      "0px 0px 0px 0px rgba(255,255,255,0)",
      "0px 0px 10px 2px rgba(255,255,255,0.3)",
      "0px 0px 0px 0px rgba(255,255,255,0)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function BeadRoad({ history }) {
  // Logic: Hame latest 10 chahiye, lekin Left (Old) -> Right (New) dikhana hai
  // Isliye pehle slice(0, 10) liya (Latest 10), fir reverse kiya.
  const displayData = [...history].slice(0, 10).reverse();

  // Color Mapping Helper
  const getDotColor = (color) => {
    if (color === 'G') return 'bg-emerald-500 shadow-emerald-500/50';
    if (color === 'R') return 'bg-rose-500 shadow-rose-500/50';
    return 'bg-violet-500 shadow-violet-500/50';
  };

  const getSizeColor = (size) => {
    return size === 'Big' ? 'text-orange-400' : 'text-blue-400';
  };

  if (history.length === 0) {
    return (
      <div className="h-24 flex items-center justify-center text-white/20 text-xs animate-pulse">
        SYNCING BEAD ROAD...
      </div>
    );
  }

  return (
    <div className="w-full mb-2">
      <div className="flex justify-between items-center px-2 mb-2">
        <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
          Pattern Road (10R)
        </h3>
        <span className="text-[9px] text-white/20 font-mono">L → R</span>
      </div>

      {/* Glass Container */}
      <div className="glass-card p-4 relative overflow-hidden">
        {/* Background Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-10 bg-white/5 blur-2xl rounded-full pointer-events-none" />

        <motion.div 
          className="flex justify-between items-end relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {displayData.map((item, index) => {
            const isLatest = index === displayData.length - 1; // Last item is latest
            
            return (
              <motion.div 
                key={`${item.period}-${index}`}
                variants={itemVariants}
                className="flex flex-col items-center gap-2 group"
              >
                {/* 1. The Dot (Color) */}
                <motion.div
                  variants={isLatest ? pulseVariant : {}}
                  animate={isLatest ? "pulse" : ""}
                  className={`
                    w-3 h-3 rounded-full shadow-[0_0_10px] 
                    ${getDotColor(item.color)}
                    ${!isLatest && 'opacity-80 group-hover:opacity-100 transition-opacity'}
                  `}
                />

                {/* 2. The Line Connector (Subtle Design Element) */}
                <div className="w-[1px] h-3 bg-white/10 group-hover:bg-white/30 transition-colors" />

                {/* 3. The Number */}
                <span className={`text-sm font-bold font-mono ${isLatest ? 'text-white' : 'text-white/60'}`}>
                  {item.number}
                </span>

                {/* 4. The Size Code */}
                <span className={`text-[9px] font-bold tracking-tighter ${getSizeColor(item.size)}`}>
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
