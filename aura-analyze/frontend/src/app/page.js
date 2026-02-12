"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

// कंपोनेंट्स इम्पोर्ट करें
import StatsGrid from '../components/StatsGrid';
import LiveGraph from '../components/LiveGraph';
import HistoryList from '../components/HistoryList';
import DateFilter from '../components/DateFilter';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. रियल-टाइम क्वेरी: आखरी 200 पीरियड्स मंगाएं
    const q = query(
      collection(db, "history"),
      orderBy("timestamp", "desc"),
      limit(200)
    );

    // 2. Firestore Listener (जैसे ही डेटा बदलेगा, UI अपडेट होगा)
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHistory(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
        className="space-y-6 pb-20"
      >
        {/* Header Section */}
        <header className="flex justify-between items-end mb-8 px-2">
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-medium">Data Terminal</p>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
              Aura Analyze
            </h1>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-green-400 font-bold bg-green-400/10 px-2 py-1 rounded-md border border-green-400/20">
              STABLE
            </span>
          </div>
        </header>

        {/* 1. Statistics Component */}
        <section>
          <StatsGrid history={history} />
        </section>

        {/* 2. Live Graph Component */}
        <section>
          <LiveGraph history={history} />
        </section>

        {/* 3. Archive & Date Filter */}
        <section>
          <DateFilter />
        </section>

        {/* 4. Detailed History List */}
        <section>
          <HistoryList history={history} />
        </section>

        {/* Mobile Footer Tab (Optional) */}
        <footer className="fixed bottom-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-10">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)]" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
        </footer>
      </motion.div>
    </AnimatePresence>
  );
}
