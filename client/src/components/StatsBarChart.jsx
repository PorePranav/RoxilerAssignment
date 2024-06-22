import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function StatsBarChart({ data }) {
  return (
    <div className="w-1/2">
      <p className="font-semibold text-xl">Bar Chart</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#f0b27a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
