"use client";
import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Download, Calendar } from 'lucide-react';

const DateFilter = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadDailyData = async () => {
    setIsDownloading(true);
    try {
      // 1. तारीख की शुरुआत और अंत तय करें (12:00 AM to 11:59 PM)
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      // 2. Firestore से उस दिन का सारा डेटा मंगाएं
      const q = query(
        collection(db, "history"),
        where("timestamp", ">=", startOfDay),
        where("timestamp", "<=", endOfDay),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => doc.data());

      if (data.length === 0) {
        alert("No data found for this date.");
        return;
      }

      // 3. JSON फाइल तैयार करें और डाउनलोड करवाएं
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Aura_Data_${selectedDate}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log(`✅ Downloaded ${data.length} records.`);
    } catch (error) {
      console.error("Error downloading data:", error);
      alert("Error fetching data. Check console.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="glass-card mt-6 p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="text-blue-400 w-5 h-5" />
          <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Archive & Export</h3>
        </div>

        <p className="text-[11px] text-white/40 leading-relaxed">
          Select a date to retrieve the full 24-hour history and export it as a JSON file for analysis.
        </p>

        <div className="flex gap-3 mt-2">
          {/* iOS Style Date Picker */}
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
          />

          {/* Download Button */}
          <button 
            onClick={downloadDailyData}
            disabled={isDownloading}
            className={`flex items-center justify-center gap-2 px-6 rounded-xl font-medium transition-all ${
              isDownloading 
              ? 'bg-white/5 text-white/20 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-95'
            }`}
          >
            <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
            <span className="text-xs">{isDownloading ? 'Fetching...' : 'JSON'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateFilter;
