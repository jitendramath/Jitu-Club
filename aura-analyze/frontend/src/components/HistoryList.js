"use client";
import React, { useState } from 'react';

const HistoryList = ({ history }) => {
  const [displayCount, setDisplayCount] = useState(20);

  // Lazy Loading: और डेटा दिखाने के लिए फंक्शन
  const loadMore = () => {
    setDisplayCount(prev => Math.min(prev + 20, 200));
  };

  const visibleHistory = history.slice(0, displayCount);

  return (
    <div className="glass-card mt-6 overflow-hidden">
      <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-white/70">Game History</h3>
        <span className="text-[10px] bg-white/10 px-2 py-1 rounded-full text-white/40">
          Showing {visibleHistory.length} of 200
        </span>
      </div>

      <div className="w-full">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-white/30 text-[10px] uppercase tracking-widest border-b border-white/5">
              <th className="py-4 pl-6 text-left font-medium">Period</th>
              <th className="py-4 text-center font-medium">Number</th>
              <th className="py-4 text-center font-medium">Big Small</th>
              <th className="py-4 pr-6 text-right font-medium">Color</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {visibleHistory.map((item) => (
              <tr key={item.period} className="group active:bg-white/5 transition-colors">
                <td className="py-4 pl-6 text-white/60 font-mono text-xs">
                  {item.period.slice(-4)}
                </td>
                <td className="py-4 text-center font-bold text-lg">
                  {item.number}
                </td>
                <td className="py-4 text-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    item.size === 'Big' ? 'text-orange-400 bg-orange-400/10' : 'text-blue-400 bg-blue-400/10'
                  }`}>
                    {item.size.toUpperCase()}
                  </span>
                </td>
                <td className="py-4 pr-6">
                  <div className="flex justify-end gap-1">
                    {/* Color Dots Logic */}
                    {item.color === 'G' && <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />}
                    {item.color === 'R' && <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />}
                    {item.color === 'V' && <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Lazy Loading Button */}
        {displayCount < 200 && (
          <button 
            onClick={loadMore}
            className="w-full py-4 text-xs font-medium text-blue-400 hover:bg-white/5 transition-all border-t border-white/5"
          >
            Load More Results
          </button>
        )}
      </div>
    </div>
  );
};

export default HistoryList;
