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
        {/* मार्जिन और ग्राफ लॉजिक (कमेंट्स अब यहाँ सुरक्षित हैं) */}
        <LineChart 
          data={graphData} 
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              {/* 5 नंबर (Neutral) 44.4% की ऊंचाई पर है */}
              <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
              <stop offset="44.4%" stopColor="#22c55e" stopOpacity={1} />
              <stop offset="44.4%" stopColor="#ef4444" stopOpacity={1} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={1} />
            </linearGradient>
          </defs>

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
            {/* dx: 20 से नंबर्स ग्राफ के फ्रेम के अंदर आ जाएंगे */}
            tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9, dx: 20 }}
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
            style={{ filter: 'drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.1))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiveGraph;
