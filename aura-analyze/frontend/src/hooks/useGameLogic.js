import { useState, useEffect, useCallback } from 'react';
import { getSecondsRemaining, getIndianTime } from '../lib/utils';

const API_URL = "https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json";

export function useGameLogic() {
  const [history, setHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Data Processor (API JSON -> App Format)
  const processData = useCallback((list) => {
    return list.map(item => ({
      period: item.issueNumber,
      number: parseInt(item.number),
      size: parseInt(item.number) <= 4 ? "Small" : "Big",
      color: item.color.includes('green') ? 'G' : (item.color.includes('violet') ? 'V' : 'R'),
      rawColor: item.color,
      timestamp: Date.now() // For internal sorting if needed
    }));
  }, []);

  // 2. Fetch & Merge Logic (The Brain) 🧠
  const fetchData = useCallback(async () => {
    setIsFetching(true);
    try {
      // Cache-busting ke liye timestamp lagaya
      const res = await fetch(`${API_URL}?ts=${Date.now()}`);
      const json = await res.json();
      const newData = processData(json.data.list.slice(0, 10)); // Sirf latest 10 lo

      setHistory(prevHistory => {
        // Agar pehli baar load ho raha hai
        if (prevHistory.length === 0) {
          localStorage.setItem('trackwingo_history', JSON.stringify(newData));
          return newData;
        }

        // --- MERGE LOGIC ---
        // Naye data mein se wo dhoondo jo hamare paas nahi hai
        const latestPeriodInState = parseInt(prevHistory[0].period);
        const newRounds = newData.filter(item => parseInt(item.period) > latestPeriodInState);

        // Agar naya data hai hi nahi, to purana hi rakho
        if (newRounds.length === 0) return prevHistory;

        // Gap Check: Agar 10 se zyada rounds ka gap hai (User der baad aya)
        // To purana saaf karo aur naya set karo (Safety Feature)
        const gap = parseInt(newRounds[0].period) - latestPeriodInState;
        if (gap > 10) {
          console.warn("Gap detected, resetting history...");
          localStorage.setItem('trackwingo_history', JSON.stringify(newData));
          return newData;
        }

        // Normal Case: Naya data upar jodo
        const updatedHistory = [...newRounds, ...prevHistory].slice(0, 50); // Max 50 rakho phone ke liye
        localStorage.setItem('trackwingo_history', JSON.stringify(updatedHistory));
        return updatedHistory;
      });

      // Update Time (CBI Enquiry ke liye) 🕵️‍♂️
      setLastUpdated(getIndianTime());

    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  }, [processData]);

  // 3. Initial Load from Local Storage
  useEffect(() => {
    const saved = localStorage.getItem('trackwingo_history');
    if (saved) {
      setHistory(JSON.parse(saved));
      setLoading(false);
    }
    fetchData(); // Turant naya data bhi check karo
  }, [fetchData]);

  // 4. Timer & Auto-Fetch Loop ⏳
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getSecondsRemaining();
      setTimeLeft(remaining);

      // Jab timer 1 second par ho, data fetch karo (Result aane wala hota hai)
      if (remaining === 1 || remaining === 0) {
        fetchData();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [fetchData]);

  return {
    history,
    latestResult: history[0],
    timeLeft,
    lastUpdated,
    isFetching,
    loading
  };
}
