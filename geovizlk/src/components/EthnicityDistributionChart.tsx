import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export interface EthnicityDistributionData {
  region_id: string;
  region_name: string;
  total_population: number;
  sinhalese: number;
  sl_tamil: number;
  ind_tamil: number;
  sl_moor: number;
  burgher: number;
  malay: number;
  sl_chetty: number;
  bharatha: number;
  other_eth: number;
  year: number;
}

interface EthnicityDistributionChartProps {
  data: EthnicityDistributionData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#FF6384', '#36A2EB'];

const EthnicityDistributionChart: React.FC<EthnicityDistributionChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Sinhalese', value: data.sinhalese },
    { name: 'Sri Lankan Tamil', value: data.sl_tamil },
    { name: 'Indian Tamil', value: data.ind_tamil },
    { name: 'Sri Lankan Moor', value: data.sl_moor },
    { name: 'Burgher', value: data.burgher },
    { name: 'Malay', value: data.malay },
    { name: 'Sri Lankan Chetty', value: data.sl_chetty },
    { name: 'Bharatha', value: data.bharatha },
    { name: 'Other', value: data.other_eth },
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

export default EthnicityDistributionChart; 