import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import { EXPENSE_CATEGORY_COLORS, formatCurrency } from '../../utils/format'

export function ExpenseCategoryChart({ data }) {
  const chartData = Object.entries(data || {}).map(([category, amount]) => ({ name: category, value: amount }))

  if (chartData.length === 0) {
    return <div className="grid h-64 place-items-center text-sm text-slate-400">No expense data yet</div>
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={3}
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={EXPENSE_CATEGORY_COLORS[entry.name] || '#94a3b8'} stroke="none" />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function ExpenseTrendChart({ data }) {
  const chartData = Object.entries(data || {}).map(([month, amount]) => ({ month, amount }))

  if (chartData.length === 0) {
    return <div className="grid h-64 place-items-center text-sm text-slate-400">No expense data yet</div>
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} cursor={{ fill: 'rgba(23,179,127,0.06)' }} />
        <Bar dataKey="amount" fill="#17b37f" radius={[8, 8, 0, 0]} maxBarSize={42} />
      </BarChart>
    </ResponsiveContainer>
  )
}
