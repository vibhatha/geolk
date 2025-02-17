import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export interface GenderDistributionData {
  region_id: string;
  region_name: string;
  year: number;
  total_population: number;
  male: number;
  female: number;
}

interface GenderDistributionChartProps {
  data: GenderDistributionData;
}

const COLORS = ['#0088FE', '#FF6384'];

const GenderDistributionChart: React.FC<GenderDistributionChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Male', value: data.male },
    { name: 'Female', value: data.female },
  ];

  return (
    <PieChart width={650} height={450}>
      <Pie
        data={chartData}
        cx={220}
        cy={200}
        label={false}
        outerRadius={160}
        fill="#8884d8"
        dataKey="value"
      >
        {chartData.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend
        layout="vertical"
        align="right"
        verticalAlign="middle"
        wrapperStyle={{
          fontSize: '14px',
          paddingLeft: '20px',
          backgroundColor: '#f9f9f9',
          border: '1px solid #ccc',
          borderRadius: '5px',
          padding: '10px',
        }}
      />
    </PieChart>
  );
};

export default GenderDistributionChart; 