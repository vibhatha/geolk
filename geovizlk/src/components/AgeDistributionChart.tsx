import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export interface AgeDistributionData {
  region_id: string;
  region_name: string;
  total_population: number;
  less_than_10: number;
  age_10_to_19: number;
  age_20_to_29: number;
  age_30_to_39: number;
  age_40_to_49: number;
  age_50_to_59: number;
  age_60_to_69: number;
  age_70_to_79: number;
  age_80_to_89: number;
  age_90_and_above: number;
  year: number;
}

interface AgeDistributionChartProps {
  data: AgeDistributionData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#FF6384', '#36A2EB'];

const AgeDistributionChart: React.FC<AgeDistributionChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Less than 10', value: data.less_than_10 },
    { name: '10 to 19', value: data.age_10_to_19 },
    { name: '20 to 29', value: data.age_20_to_29 },
    { name: '30 to 39', value: data.age_30_to_39 },
    { name: '40 to 49', value: data.age_40_to_49 },
    { name: '50 to 59', value: data.age_50_to_59 },
    { name: '60 to 69', value: data.age_60_to_69 },
    { name: '70 to 79', value: data.age_70_to_79 },
    { name: '80 to 89', value: data.age_80_to_89 },
    { name: '90 and above', value: data.age_90_and_above },
  ];

  return (
    <PieChart width={650} height={450}>
      <Pie
        data={chartData}
        cx={220}
        cy={200}
        labelLine={false}
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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

export default AgeDistributionChart; 