import { useState, useEffect, useCallback, useRef } from 'react';
import { getSecondsRemaining, getIndianTime } from '../lib/utils';

// ✅ Cache-Busting Headers: Isse browser purana data nahi uthayega
const HEADERS = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
};

const API_URL = "https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json";

export function useGameLogic() {
  const [history, setHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Ref use karenge taaki infinite loop na ho
  const latestPeriodRef = useRef(null); 

  // 1. Data Processor (Clean & Simple)
  const processData = (list) => {
    return list.map(item => ({
      period: item.issueNumber.toString(), // String safe rehta hai comparison mein
      number: parseInt(item.number),
      size: parseInt(item.number) <= 4 ? "Small" : "Big",
      color: item.color.includes('green') ? 'G' : (item.color.includes('violet') ? 'V' : 'R'),
      rawColor: item.color,
    }));
  };

  // 2. The Fetch Function (Ab ye Ziddi hai) 😤
  const fetchData = useCallback(async () => {
    try {
      // Unique Timestamp + Random Number to break ALL caches
      const uniqueUrl = `${API_URL}?_=${Date.now()}_${Math.random()}`;
      
      const res = await fetch(uniqueUrl, { 
        headers: HEADERS,
        cache: 'no-store', // Next.js specific
        next: { revalidate: 0 } // Server-side specific
      });
      
      if (!res.ok) throw new Error("API Failed");

      const json = await res.json();
      const apiList = json.data.list.slice(0, 20); // Latest 20 uthao
      const newData = processData(apiList);

      // --- CRITICAL FIX: Direct Update Logic ---
      setHistory(currentHistory => {
        // Agar pehli baar hai, to seedha set karo
        if (currentHistory.length === 0) return newData;

        // Compare: Kya API ka latest period hamare current se naya hai?
        const apiLatestPeriod = parseInt(newData[0].period);
        const currentLatestPeriod = parseInt(currentHistory[0].period);

        // Agar API purana data de rahi hai (jo kabhi kabhi hota hai), to update MAT karo
        if (apiLatestPeriod < currentLatestPeriod) {
          return currentHistory;
        }

        // Agar naya data hai, to update karo aur Time bhi update karo
        if (apiLatestPeriod > currentLatestPeriod) {
            setLastUpdated(getIndianTime()); // Sirf tab update hoga jab DATA change hoga
            latestPeriodRef.current = apiLatestPeriod;
            return newData; // Seedha replace karo taaki sequence (55, 56, 57, 58) sahi rahe
        }

        return currentHistory; // Agar same hai to kuch mat karo
      });

      setLoading(false);

    } catch (error) {
      console.error("Fetch Error:", error);
    }
  }, []);

  // 3. Timer & Smart Polling Loop ⏳
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getSecondsRemaining();
      setTimeLeft(remaining);

      // --- SMART LOGIC ---
      // WinGo result usually 3-4 second late aata hai (0 se -4 tak).
      // Hum 0, 29 (just before), aur 1, 2, 3, 4, 5 (just after) par aggressive fetch karenge.
      
      const criticalPoints = [30, 0, 1, 2, 3, 4, 5]; 
      // (Note: utils mein 0 = 30 hota hai kabhi kabhi, isliye dono check kiye)

      if (criticalPoints.includes(remaining)) {
         fetchData();
      }

    }, 1000);

    // Initial fetch
    fetchData();

    return () => clearInterval(timer);
  }, [fetchData]);

  return {
    history,
    latestResult: history[0],
    timeLeft,
    lastUpdated, // Ab ye tabhi badlega jab NAYA result aayega
    loading
  };
}
