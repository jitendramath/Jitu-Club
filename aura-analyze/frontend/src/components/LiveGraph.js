"use client";
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const LiveGraph = ({ history }) => {
  // ग्राफ के लिए डेटा तैयार करें (20 राउंड्स)
  const graphData = [...history]
    .slice(0, 20)
    .reverse() 
    .map(item => ({
      period: item.period.slice(-3),
      number: item.number,
    }));

  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={graphData} 
          {/* ✨ Left margin को -35 करने से लेफ्ट पैडिंग पूरी तरह खत्म हो जाएगी */}
          margin={{ top: 5, right: 0, left: -35, bottom: 0 }}
        >
          {/* 🎨 'Stock Market' Gradient Logic */}
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              {/* 5 से ऊपर (Big) के लिए Green */}
              <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
              <stop offset="44%" stopColor="#22c55e" stopOpacity={1} />
              {/* 5 से नीचे (Small) के लिए Red */}
              <stop offset="44%" stopColor="#ef4444" stopOpacity={1} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={1} />
            </linearGradient>
          </defs>

          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="rgba(255,255,255,0.03)" 
          />
          
          <XAxis 
            dataKey="period" 
            hide={true} // क्लीन लुक के लिए X-axis छुपाया
          />
          
          <YAxis 
            domain={[0, 9]} 
            hide={true} // लेफ्ट पैडिंग हटाने के लिए Y-axis को छुपाना ज़रूरी है
          />

          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              borderRadius: '12px', 
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '10px'
            }}
            itemStyle={{ color: '#fff' }}
            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
          />

          {/* 5 नंबर पर एक न्यूट्रल बेसलाइन */}
          <ReferenceLine y={4.5} stroke="rgba(255,255,255,0.05)" />
          
          <Line 
            type="monotone" 
            dataKey="number" 
            {/* ✨ यहाँ हमने ऊपर बनाए गए Gradient को अप्लाई किया है */}
            stroke="url(#lineGradient)" 
            strokeWidth={4}
            dot={false} // क्लीन एप्पल लुक के लिए डॉट्स हटा दिए
            activeDot={{ r: 4, fill: '#fff', strokeWidth: 0 }}
            animationDuration={800}
            {/* ग्लो इफ़ेक्ट जो लाइन के साथ बढ़ेगा */}
            style={{ filter: 'drop-shadow(0px 0px 6px rgba(255, 255, 255, 0.1))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiveGraph;
                   
