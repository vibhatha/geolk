import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export interface MaritalStatusDistributionData {
  region_id: string;
  region_name: string;
  year: number;
  total_population: number;
  never_married: number;
  married_registered: number;
  married_customary: number;
  separated_legally: number;
  separated_non_legal: number;
  divorced: number;
  widowed: number;
  not_stated: number;
}

interface MaritalStatusDistributionChartProps {
  data: MaritalStatusDistributionData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#FFCE56', '#FF9F40'];

const MaritalStatusDistributionChart: React.FC<MaritalStatusDistributionChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Never Married', value: data.never_married },
    { name: 'Married (Registered)', value: data.married_registered },
    { name: 'Married (Customary)', value: data.married_customary },
    { name: 'Separated (Legally)', value: data.separated_legally },
    { name: 'Separated (Non-legal)', value: data.separated_non_legal },
    { name: 'Divorced', value: data.divorced },
    { name: 'Widowed', value: data.widowed },
    { name: 'Not Stated', value: data.not_stated },
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

export default MaritalStatusDistributionChart; 