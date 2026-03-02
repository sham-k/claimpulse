import type { ReactNode } from 'react'

interface MetricCardProps {
  label: string
  value: string
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  accent?: 'green' | 'red' | 'amber' | 'default'
  icon?: ReactNode
}

export function MetricCard({ label, value, sub, trend, trendValue, accent = 'default', icon }: MetricCardProps) {
  const accentColor = {
    green: 'text-green-400',
    red: 'text-red-400',
    amber: 'text-amber-400',
    default: 'text-[#f0f0f0]',
  }[accent]

  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-[#888]'
  const trendArrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'

  return (
    <div className="bg-[#111] border border-[#2a2a2a] rounded-md p-4 flex flex-col gap-3 hover:border-[#3a3a3a] transition-colors duration-150">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-widest text-[#555] font-medium">{label}</span>
        {icon && <span className="text-[#444]">{icon}</span>}
      </div>
      <div className="flex items-end gap-2">
        <span className={`text-2xl font-semibold tracking-tight ${accentColor}`}>{value}</span>
        {trendValue && (
          <span className={`text-[11px] mb-0.5 font-mono ${trendColor}`}>
            {trendArrow} {trendValue}
          </span>
        )}
      </div>
      {sub && <span className="text-[11px] text-[#555]">{sub}</span>}
    </div>
  )
}
