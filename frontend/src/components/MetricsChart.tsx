import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MetricHistory } from '../types/metrics';
import { formatTimestamp } from '../utils/metrics';
import { tokens } from '../styles/tokens';

interface MetricsChartProps {
  data: MetricHistory[];
}

export const MetricsChart: React.FC<MetricsChartProps> = ({ data }) => {
  const chartData = useMemo(() => 
    data.map(point => ({
      time: formatTimestamp(point.timestamp),
      CPU: point.cpu,
      Memory: point.memory,
      'Error Rate': point.errorRate
    })), [data]);
  
  if (chartData.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '300px',
        color: tokens.colors.text.secondary
      }}>
        Collecting data...
      </div>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={tokens.colors.border.light} />
        <XAxis 
          dataKey="time" 
          tick={{ fontSize: 12 }}
          stroke={tokens.colors.text.secondary}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke={tokens.colors.text.secondary}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: tokens.colors.background.primary,
            border: `1px solid ${tokens.colors.border.medium}`,
            borderRadius: tokens.borderRadius.md
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="CPU" 
          stroke={tokens.colors.primary} 
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="Memory" 
          stroke={tokens.colors.secondary} 
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="Error Rate" 
          stroke={tokens.colors.danger} 
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

