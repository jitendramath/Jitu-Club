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
  const graphData = [...history]
    .slice(0, 20)
    .reverse() 
    .map(item => ({
      period: item.period.slice(-3),
      number: item.number,
    }));

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={graphData} 
          {/* मार्जिन को बैलेंस किया ताकि नंबर्स अंदर दिखें */}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              {/* 0 से 9 के स्केल में 5 नंबर लगभग 44.4% की ऊंचाई पर होता है */}
              <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
              <stop offset="44.4%" stopColor="#22c55e" stopOpacity={1} />
              <stop offset="44.4%" stopColor="#ef4444" stopOpacity={1} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={1} />
            </linearGradient>
          </defs>

          {/* बहुत बारीक ग्रिड लाइन्स */}
          <CartesianGrid 
            strokeDasharray="0" 
            vertical={false} 
            stroke="rgba(255,255,255,0.03)" 
          />
          
          <XAxis dataKey="period" hide={true} />
          
          <YAxis 
            domain={[0, 9]} 
            ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]} 
            axisLine={false}
            tickLine={false}
            {/* नंबर्स को ग्राफ के अंदर खिसकाया (dx: 20) ताकि लेफ्ट स्पेस बचे */}
            tick={{ fill: 'rgba(255,255,255,0.15)', fontSize: 9, dx: 20 }}
          />

          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0,0,0,0.9)', 
              borderRadius: '12px', 
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '11px'
            }}
            itemStyle={{ color: '#fff' }}
          />

          {/* 5 नंबर की स्पेशल 'Neutral' लाइन */}
          <ReferenceLine 
            y={5} 
            stroke="rgba(255,255,255,0.2)" 
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          
          <Line 
            type="monotone" 
            dataKey="number" 
            stroke="url(#lineGradient)" 
            strokeWidth={4}
            dot={{ r: 2, fill: '#fff', strokeWidth: 0, opacity: 0.3 }}
            activeDot={{ r: 5, fill: '#fff', strokeWidth: 0 }}
            animationDuration={1000}
            {/* प्रीमियम ग्लो इफ़ेक्ट */}
            style={{ filter: 'drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.1))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiveGraph;
