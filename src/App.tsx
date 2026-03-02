import { useState, useMemo } from 'react'
import { MetricCard } from './components/MetricCard'
import { ClaimsTable } from './components/ClaimsTable'
import { DenialAnalyzer } from './components/DenialAnalyzer'

import { Toast } from './components/Toast'
import { MOCK_CLAIMS, METRICS, type Claim, type ClaimStatus } from './data/claims'

type FilterStatus = ClaimStatus | 'all'

interface ToastState {
  id: number
  message: string
  sub?: string
  type: 'success' | 'error' | 'info'
}
function App() {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [search, setSearch] = useState('')
  const [claims, setClaims] = useState<Claim[]>(MOCK_CLAIMS)
const [toasts, setToasts] = useState<ToastState[]>([])

const addToast = (message: string, sub?: string, type: ToastState['type'] = 'success') => {
  const id = Date.now()
  setToasts((prev) => [...prev, { id, message, sub, type }])
}

const dismissToast = (id: number) => {
  setToasts((prev) => prev.filter((t) => t.id !== id))
}

const handleResubmit = (claimId: string) => {
  setClaims((prev) =>
    prev.map((c) =>
      c.id === claimId
        ? { ...c, status: 'resubmitted' as ClaimStatus, lastUpdated: new Date().toISOString().slice(0, 10) }
        : c
    )
  )
  const claim = claims.find((c) => c.id === claimId)
  addToast(
    `${claim?.patientName ?? claimId} marked for resubmission`,
    `${claimId} · Status updated to Resubmitted`
  )
}

  const filteredClaims = useMemo(() => {
    return claims.filter((c) => {
      const matchesStatus = filterStatus === 'all' || c.status === filterStatus
      const matchesSearch =
        !search ||
        c.patientName.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.payer.toLowerCase().includes(search.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [claims, filterStatus, search])

  const statusCounts = useMemo(() => {
    const counts: Partial<Record<FilterStatus, number>> = { all: claims.length }
    claims.forEach((c) => {
      counts[c.status] = (counts[c.status] ?? 0) + 1
    })
    return counts
  }, [claims])

  const handleSelectClaim = (claim: Claim) => {
    if (claim.status === 'denied' || claim.status === 'resubmitted') {
      setSelectedClaim(claim)
    }
  }

  const filters: { label: string; value: FilterStatus }[] = [
    { label: 'All', value: 'all' },
    { label: 'Denied', value: 'denied' },
    { label: 'In Review', value: 'in_review' },
    { label: 'Submitted', value: 'submitted' },
    { label: 'Approved', value: 'approved' },
    { label: 'Resubmitted', value: 'resubmitted' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Top nav */}
      <nav className="border-b border-[#1e1e1e] px-6 h-12 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#f0f0f0] flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#0a0a0a]" />
            </div>
            <span className="text-[13px] font-semibold text-[#f0f0f0] tracking-tight">ClaimPulse</span>
          </div>
          <span className="text-[#2a2a2a]">/</span>
          <span className="text-[13px] text-[#555]">Revenue Operations</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[11px] text-[#444] font-mono">NOV 2024</span>
          <div className="flex items-center gap-2 bg-[#111] border border-[#2a2a2a] rounded px-2.5 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
            <span className="text-[11px] text-[#888]">Live</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 px-6 py-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[20px] font-semibold text-[#f0f0f0] tracking-tight">Revenue Dashboard</h1>
            <p className="text-[12px] text-[#555] mt-0.5">
              {MOCK_CLAIMS.length} claims · Click a denied claim to run AI recovery analysis
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#555]">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="font-mono">{statusCounts['denied'] ?? 0} denials need attention</span>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-5 gap-3">
          <MetricCard
            label="Total Billed"
            value={`$${(METRICS.totalBilled / 1000).toFixed(1)}k`}
            sub="This billing period"
            accent="default"
          />
          <MetricCard
            label="Recovered"
            value={`$${(METRICS.totalRecovered / 1000).toFixed(1)}k`}
            sub={`${Math.round((METRICS.totalRecovered / METRICS.totalBilled) * 100)}% collection rate`}
            accent="green"
            trend="up"
            trendValue="8.2%"
          />
          <MetricCard
            label="At Risk"
            value={`$${(METRICS.atRisk / 1000).toFixed(1)}k`}
            sub={`${statusCounts['denied'] ?? 0} denied claims`}
            accent="red"
            trend="down"
          />
          <MetricCard
            label="Denial Rate"
            value={`${METRICS.denialRate}%`}
            sub="Industry avg: 26.8%"
            accent="amber"
          />
          <MetricCard
            label="Avg. Days to Pay"
            value={`${METRICS.avgDaysToReimbursement}d`}
            sub="Per reimbursement"
            accent="default"
          />
        </div>

        {/* Claims section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            {/* Filters */}
            <div className="flex items-center gap-1">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilterStatus(f.value)}
                  className={`
                    px-3 py-1.5 rounded text-[11px] font-medium transition-colors
                    ${filterStatus === f.value
                      ? 'bg-[#f0f0f0] text-[#0a0a0a]'
                      : 'text-[#555] hover:text-[#888] hover:bg-[#1a1a1a]'
                    }
                  `}
                >
                  {f.label}
                  {statusCounts[f.value] !== undefined && (
                    <span className={`ml-1.5 font-mono ${filterStatus === f.value ? 'text-[#0a0a0a]/60' : 'text-[#444]'}`}>
                      {statusCounts[f.value]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#444]"
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient, ID, payer..."
                className="bg-[#111] border border-[#2a2a2a] rounded pl-7 pr-3 py-1.5 text-[12px] text-[#f0f0f0] placeholder-[#444] focus:outline-none focus:border-[#3a3a3a] w-56 transition-colors"
              />
            </div>
          </div>

          {/* Table */}
          <ClaimsTable
            claims={filteredClaims}
            onSelectClaim={handleSelectClaim}
            selectedId={selectedClaim?.id}
          />

          {filteredClaims.length === 0 && (
            <div className="text-center py-12 text-[#444] text-[12px]">No claims match this filter</div>
          )}
        </div>

        {/* Hint for denied claims */}
        <div className="flex items-center gap-2 text-[11px] text-[#444]">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Click any denied claim to open the AI Denial Analyzer and generate a recovery action plan.
        </div>
      </div>

      {/* Denial analyzer panel */}
    {selectedClaim && (
  <DenialAnalyzer
    claim={selectedClaim}
    onClose={() => setSelectedClaim(null)}
    onResubmit={handleResubmit}
  />
      )}



{/* Toast notifications */}
<div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-80">
  {toasts.map((t) => (
    <Toast
      key={t.id}
      message={t.message}
      sub={t.sub}
      type={t.type}
      onDismiss={() => dismissToast(t.id)}
    />
  ))}
</div>
    </div>
  )
}

export default App
