import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export interface ReligiousAffiliationDistributionData {
  region_id: string;
  region_name: string;
  year: number;
  total_population: number;
  buddhist: number;
  hindu: number;
  islam: number;
  roman_catholic: number;
  other_christian: number;
  other: number;
}

interface ReligiousAffiliationDistributionChartProps {
  data: ReligiousAffiliationDistributionData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB'];

const ReligiousAffiliationDistributionChart: React.FC<ReligiousAffiliationDistributionChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Buddhist', value: data.buddhist },
    { name: 'Hindu', value: data.hindu },
    { name: 'Islam', value: data.islam },
    { name: 'Roman Catholic', value: data.roman_catholic },
    { name: 'Other Christian', value: data.other_christian },
    { name: 'Other', value: data.other },
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

export default ReligiousAffiliationDistributionChart; 