"use client";
import React, { useMemo } from 'react';

const StatsGrid = ({ history }) => {
  // पिछले 200 राउंड्स का सांख्यिकीय विश्लेषण (Statistical Analysis)
  const stats = useMemo(() => {
    const data = history.slice(0, 200); // सिर्फ लेटेस्ट 200 राउंड्स
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    return numbers.map(num => {
      let count = 0;
      let missing = 0;
      let maxConsecutive = 0;
      let currentConsecutive = 0;
      let lastIndex = -1;

      data.forEach((round, index) => {
        if (round.number === num) {
          count++;
          if (lastIndex === -1) missing = index; // आखरी बार कब आया (Missing)
          currentConsecutive++;
          maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
        } else {
          currentConsecutive = 0;
        }
      });

      return {
        num,
        frequency: count,
        missing: missing === -1 ? data.length : missing,
        avgMissing: Math.floor(data.length / (count || 1)),
        maxConsecutive
      };
    });
  }, [history]);

  return (
    <div className="glass-card mt-6 overflow-hidden">
      <div className="p-4 border-b border-white/5 bg-white/5">
        <h3 className="text-sm font-semibold text-white/70">Statistics (last 200 Periods)</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-center border-collapse">
          <thead>
            <tr className="text-white/40 border-b border-white/5">
              <th className="p-3 font-medium">Winning Numbers</th>
              {stats.map(s => (
                <th key={s.num} className="p-3">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full border border-red-500/50 text-red-500 mx-auto">
                    {s.num}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-white/80">
            {/* Missing Row */}
            <tr className="border-b border-white/5">
              <td className="p-3 text-left pl-4 text-white/40">Missing</td>
              {stats.map(s => <td key={s.num} className="p-3">{s.missing}</td>)}
            </tr>
            {/* Avg Missing Row */}
            <tr className="border-b border-white/5">
              <td className="p-3 text-left pl-4 text-white/40">Avg missing</td>
              {stats.map(s => <td key={s.num} className="p-3 text-blue-400/80">{s.avgMissing}</td>)}
            </tr>
            {/* Frequency Row */}
            <tr className="border-b border-white/5">
              <td className="p-3 text-left pl-4 text-white/40">Frequency</td>
              {stats.map(s => <td key={s.num} className="p-3 text-orange-400/80">{s.frequency}</td>)}
            </tr>
            {/* Max Consecutive Row */}
            <tr>
              <td className="p-3 text-left pl-4 text-white/40">Max consecutive</td>
              {stats.map(s => <td key={s.num} className="p-3">{s.maxConsecutive}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatsGrid;
