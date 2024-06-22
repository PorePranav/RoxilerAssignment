import React from 'react';
import {
  PieChart,
  ResponsiveContainer,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from 'recharts';

export default function StatsPieChart({ data }) {
  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="w-1/2">
      <p className="font-semibold text-xl">Pie Chart</p>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            nameKey="category"
            dataKey="count"
            innerRadius={85}
            outerRadius={110}
            cx="40%"
            cy="50%"
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell key={entry.category} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Legend
            verticalAlign="middle"
            align="right"
            width="30%"
            layout="vertical"
            iconSize={15}
            iconType="circle"
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
