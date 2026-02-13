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
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={graphData} 
          margin={{ top: 5, right: 0, left: -35, bottom: 0 }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              {/* 5 और उससे ऊपर Green */}
              <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
              <stop offset="44%" stopColor="#22c55e" stopOpacity={1} />
              {/* 5 से नीचे Red */}
              <stop offset="44%" stopColor="#ef4444" stopOpacity={1} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={1} />
            </linearGradient>
          </defs>

          {/* 1. सब नंबरों के लिए बहुत पतली लाइनें */}
          <CartesianGrid 
            strokeDasharray="1 1" 
            vertical={false} 
            stroke="rgba(255,255,255,0.02)" 
          />
          
          <XAxis dataKey="period" hide={true} />
          
          {/* 2. सभी 0-9 नंबरों के लिए टिक्स सेट किए */}
          <YAxis 
            domain={[0, 9]} 
            ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]} 
            hide={true} 
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

          {/* 3. 5 नंबर के लिए 'Special' लाइन (The Origin Line) */}
          <ReferenceLine 
            y={5} 
            stroke="rgba(255,255,255,0.15)" 
            strokeWidth={1}
            strokeDasharray="3 3"
            label={{ 
              position: 'left', 
              value: '5', 
              fill: 'rgba(255,255,255,0.2)', 
              fontSize: 8 
            }}
          />
          
          <Line 
            type="monotone" 
            dataKey="number" 
            stroke="url(#lineGradient)" 
            strokeWidth={4}
            dot={false}
            activeDot={{ r: 4, fill: '#fff', strokeWidth: 0 }}
            animationDuration={800}
            style={{ filter: 'drop-shadow(0px 0px 6px rgba(255, 255, 255, 0.1))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiveGraph;
