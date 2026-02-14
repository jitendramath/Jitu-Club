"use client";
import React from 'react';
import { 
  LineChart, Line, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Defs, LinearGradient, Stop 
} from 'recharts';

const LiveGraph = ({ history }) => {
  // Data Logic: Latest 20 rounds only
  const graphData = [...history]
    .slice(0, 20)
    .reverse() 
    .map(item => ({
      period: item.period.slice(-4), // Last 4 digits
      number: item.number,
      color: item.color
    }));

  return (
    // ✅ Yahan se fixed height hata di, ab ye 100% lega
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={graphData}>
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />   {/* Green Top */}
            <stop offset="50%" stopColor="#eab308" stopOpacity={1} />   {/* Yellow Mid */}
            <stop offset="100%" stopColor="#ef4444" stopOpacity={1} />  {/* Red Bottom */}
          </linearGradient>
        </defs>

        <CartesianGrid 
          strokeDasharray="3 3" 
          vertical={false} 
          stroke="rgba(255,255,255,0.05)" 
        />
        
        {/* Y-Axis ko right side hidden rakhenge par numbers dikhenge */}
        <YAxis 
          domain={['dataMin - 1', 'dataMax + 1']} 
          hide={true} 
        />

        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(0,0,0,0.8)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '8px',
            fontSize: '10px'
          }}
          itemStyle={{ color: '#fff' }}
          labelStyle={{ display: 'none' }}
        />

        <ReferenceLine y={4.5} stroke="rgba(255,255,255,0.1)" strokeDasharray="5 5" />
        
        <Line 
          type="monotone" 
          dataKey="number" 
          stroke="url(#lineGradient)" 
          strokeWidth={3}
          dot={{ r: 3, fill: '#fff', strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#fff' }}
          animationDuration={1000}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LiveGraph;
