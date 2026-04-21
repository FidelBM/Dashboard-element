"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export function DonutChart({
  data
}: {
  data: Array<{ name: string; value: number; color: string }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={74} outerRadius={104} paddingAngle={4}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TrendLineChart({
  data,
  dataKey,
  stroke = "#2d6cdf"
}: {
  data: Array<Record<string, string | number>>;
  dataKey: string;
  stroke?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#dbe6f0" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip />
        <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={3} dot={{ fill: stroke }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function DualBarChart({
  data,
  firstKey,
  secondKey
}: {
  data: Array<Record<string, string | number>>;
  firstKey: string;
  secondKey: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#dbe6f0" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip />
        <Bar dataKey={firstKey} radius={[10, 10, 0, 0]} fill="#0e1f4f" />
        <Bar dataKey={secondKey} radius={[10, 10, 0, 0]} fill="#16b7d9" />
      </BarChart>
    </ResponsiveContainer>
  );
}
