"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

// कंपोनेंट्स इम्पोर्ट करें
import StatsGrid from '../components/StatsGrid';
import LiveGraph from '../components/LiveGraph';
import HistoryList from '../components/HistoryList';
import DateFilter from '../components/DateFilter';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiPrediction, setAiPrediction] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. ✅ Self-Healing Sync: सीधे API से डेटा लाना और Firebase में भरना
  const syncData = async () => {
    setIsSyncing(true);
    try {
      // नोट: अगर सीधे कॉल में CORS एरर आए, तो अपने Vercel API Proxy का इस्तेमाल करें
      const res = await fetch('https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json');
      const json = await res.json();
      const latestRounds = json.data.list;

      for (const round of latestRounds) {
        const docRef = doc(db, "history", round.issueNumber);
        await setDoc(docRef, {
          period: round.issueNumber,
          number: parseInt(round.number),
          size: parseInt(round.number) <= 4 ? "Small" : "Big",
          color: round.color.includes('green') ? 'G' : (round.color.includes('violet') ? 'V' : 'R'),
          timestamp: serverTimestamp(),
          source: "frontend_sync" 
        }, { merge: true });
      }
      console.log("📡 Frontend Sync Done");
    } catch (err) {
      console.error("Sync Error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // 2. 🧠 Gemini AI Prediction: लेटेस्ट डेटा के आधार पर भविष्यवाणी
  const fetchAiPrediction = async (currentHistory) => {
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: currentHistory.slice(0, 20) })
      });
      const data = await res.json();
      setAiPrediction(data);
    } catch (err) {
      console.error("AI Prediction Error:", err);
    }
  };

  useEffect(() => {
    // 3. Real-time Firestore Listener
    const q = query(
      collection(db, "history"),
      orderBy("period", "desc"), // पीरियड के हिसाब से सॉर्टिंग ज़्यादा सटीक है
      limit(200)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHistory(data);
      setLoading(false);
      
      // जैसे ही नया राउंड आए, AI प्रेडिक्शन अपडेट करें
      if (data.length > 0) fetchAiPrediction(data);
    });

    // 4. ऑटो-सिंक इंटरवल (हर 30 सेकंड)
    syncData();
    const syncInterval = setInterval(syncData, 30000);

    return () => {
      unsubscribe();
      clearInterval(syncInterval);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="space-y-6 pb-24 px-4 max-w-lg mx-auto"
      >
        {/* Apple Style Header */}
        <header className="flex justify-between items-end pt-8 mb-4">
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-medium">System Terminal</p>
            <h1 className="text-4xl font-bold tracking-tight text-white">Aura <span className="text-white/40">Analyze</span></h1>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`text-[9px] font-bold px-2 py-1 rounded-full border ${isSyncing ? 'border-blue-500/50 text-blue-400 animate-pulse' : 'border-green-500/50 text-green-400'}`}>
              {isSyncing ? 'SYNCING' : 'LIVE'}
            </span>
          </div>
        </header>

        {/* 🧠 AI Prediction Card (New Next-Level Feature) */}
        <section className="glass-card p-5 rounded-[2.5rem] bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 backdrop-blur-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs font-semibold text-white/60 uppercase tracking-widest">AI Intelligence</h2>
            <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
          </div>
          {aiPrediction ? (
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-4xl font-black text-white">{aiPrediction.prediction.size}</p>
                  <p className="text-sm text-white/40 font-medium">{aiPrediction.prediction.color === 'R' ? '🔴 Red' : '🟢 Green'}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-400">{aiPrediction.confidence}</p>
                  <p className="text-[10px] text-white/30 tracking-tighter">Confidence Score</p>
                </div>
              </div>
              <p className="text-[11px] leading-relaxed text-white/50 border-t border-white/5 pt-3">
                <span className="text-blue-400 font-bold">Logic:</span> {aiPrediction.logic}
              </p>
            </div>
          ) : (
            <p className="text-sm text-white/20 italic">Processing patterns...</p>
          )}
        </section>

        {/* 📊 Statistics Grid */}
        <section>
          <StatsGrid history={history.slice(0, 50)} />
        </section>

        {/* 📈 Live Graph (20 Round Premium View) */}
        <section className="glass-card p-4 rounded-[2.5rem] bg-white/5 border border-white/10">
          <h2 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4 px-2">Market Momentum</h2>
          <LiveGraph history={history.slice(0, 20)} />
        </section>

        {/* 🗓️ Date Filter */}
        <section>
          <DateFilter />
        </section>

        {/* 📜 Detailed History */}
        <section>
          <HistoryList history={history} />
        </section>

        {/* iPhone Style Navigation */}
        <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 w-64 h-12 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full flex items-center justify-around px-6 z-50 shadow-2xl">
           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
           <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
           <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        </footer>
      </motion.div>
    </AnimatePresence>
  );
}
