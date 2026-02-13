"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

// कंपोनेंट्स
import StatsGrid from '../components/StatsGrid';
import LiveGraph from '../components/LiveGraph';
import HistoryList from '../components/HistoryList';
import DateFilter from '../components/DateFilter';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. ✅ Frontend Sync Logic
  const syncData = async () => {
    setIsSyncing(true);
    try {
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
          source: "mobile_sync"
        }, { merge: true });
      }
    } catch (err) {
      console.error("Sync Error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const q = query(
      collection(db, "history"),
      orderBy("period", "desc"),
      limit(150)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHistory(data);
      setLoading(false);
    });

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
        <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#000000] overflow-hidden selection:bg-blue-500/30">
      {/* ✨ Premium Blurry Blobs (Background) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[40%] bg-blue-600/40 blur-[60px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[50%] bg-purple-600/35 blur-[60px] rounded-full" />
        <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] bg-indigo-500/30 blur-[60px] rounded-full" />
      </div>

      {/* Main Content Area (Locked to Mobile Width) */}
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 max-w-md mx-auto px-2 pt-5 pb-10 space-y-7"
        >
          {/* Minimalist Apple Header */}
          <header className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white italic">AURA</h1>
              <p className="text-[10px] text-white/30 font-medium tracking-[0.3em] uppercase">Predictive Terminal</p>
            </div>
            <div className={`h-2 w-2 rounded-full ${isSyncing ? 'bg-blue-500 animate-ping' : 'bg-green-500'}`} />
          </header>

          {/* 1. Statistics Grid */}
          <section className="glass-card rounded-3xl bg-white/[0.03] border border-white/5 p-1">
             <StatsGrid history={history.slice(0, 50)} />
          </section>

          {/* 2. Live Graph (Focused & Clean) */}
          <section className="glass-card rounded-[2rem] bg-white/[0.02] border border-white/5 p-4 overflow-hidden">
            <h2 className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-4 ml-1">Live Trend (20R)</h2>
            <LiveGraph history={history.slice(0, 20)} />
          </section>

          {/* 3. Date Filter */}
          <section>
            <DateFilter />
          </section>

          {/* 4. History List */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white ml-1">Live Feed</h2>
            <HistoryList history={history} />
          </section>

      
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
