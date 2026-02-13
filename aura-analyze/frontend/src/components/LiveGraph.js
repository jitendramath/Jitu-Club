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
  // ग्राफ के लिए पिछले 100 राउंड्स का डेटा तैयार करें
  const graphData = [...history]
    .slice(0, 20)
    .reverse() // पुराने से नए की तरफ दिखाने के लिए
    .map(item => ({
      period: item.period.slice(-3), // सिर्फ आखरी 3 अंक
      number: item.number,
    }));

  return (
    <div className="glass-card mt-6 p-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-widest">Trend Analysis</h3>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] text-blue-400 font-medium">LIVE UPDATING</span>
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={graphData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="rgba(255,255,255,0.05)" 
            />
            <XAxis 
              dataKey="period" 
              stroke="rgba(255,255,255,0.3)" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
              minTickGap={20}
            />
            <YAxis 
              domain={[0, 9]} 
              ticks={[0, 2, 4, 6, 8]}
              stroke="rgba(255,255,255,0.3)" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                borderRadius: '12px', 
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '12px'
              }}
              itemStyle={{ color: '#60a5fa' }}
            />
            {/* 4.5 पर एक लाइन (Big/Small का बॉर्डर) */}
            <ReferenceLine y={4.5} stroke="rgba(255,255,255,0.1)" strokeDasharray="5 5" />
            
            <Line 
              type="monotone" 
              dataKey="number" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={1000}
              // लाइन के नीचे ग्लो (Glow) के लिए CSS फिल्टर
              style={{ filter: 'drop-shadow(0px 0px 8px rgba(59, 130, 246, 0.5))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LiveGraph;
