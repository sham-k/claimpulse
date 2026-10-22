import type { ClaimStatus } from '../data/claims'
import { StatusBadge } from './StatusBadge'

const LEGEND: { status: ClaimStatus; label: string; description: string }[] = [
  { status: 'submitted', label: 'Submitted', description: 'Sent to payer' },
  { status: 'in_review', label: 'In Review', description: 'Payer is processing' },
  { status: 'approved', label: 'Approved', description: 'Approved for payment' },
  { status: 'denied', label: 'Denied', description: 'Rejected — click to analyze' },
  { status: 'resubmitted', label: 'Resubmitted', description: 'Corrected and sent again' },
]

export function StatusLegend() {
  return (
    <div className="fixed bottom-5 left-5 z-40 w-60 bg-white border border-[#151414] rounded-md overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 bg-[#444] border-b border-[#2a2a2a]">
        <span className="text-[10px] uppercase tracking-widest text-[#fff] font-medium">Status Legend</span>
      </div>

      {/* Rows */}
      <div>
        {LEGEND.map((item) => (
          <div
            key={item.status}
            className="flex items-center gap-3 px-4 py-2 border-b border-[#1e1e1e] last:border-0"
          >
            <span className="w-5 flex justify-center">
              <StatusBadge status={item.status} />
            </span>
            <div>
              <p className="text-[12px] text-[#1a1a1a] font-medium">{item.label}</p>
              <p className="text-[10px] text-[#666]">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
