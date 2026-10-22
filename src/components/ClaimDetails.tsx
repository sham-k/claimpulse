import type { Claim } from '../data/claims'
import { StatusBadge } from './StatusBadge'

interface ClaimDetailsProps {
  claim: Claim
  onClose: () => void
  onAction: (claim: Claim) => void
}

const TIMELINE = [
  { status: 'submitted', label: 'Submitted' },
  { status: 'in_review', label: 'In Review' },
  { status: 'approved', label: 'Approved' },
] as const

const ACTION_LABEL: Partial<Record<Claim['status'], string>> = {
  submitted: 'Confirm receipt with payer',
  in_review: 'Check status with payer',
  approved: 'Mark as paid',
}

export function ClaimDetails({ claim, onClose, onAction }: ClaimDetailsProps) {
  const currentStep = TIMELINE.findIndex((step) => step.status === claim.status)
  const actionLabel = ACTION_LABEL[claim.status]

  const details: [string, string][] = [
    ['Patient ID', claim.patientId],
    ['Agency', claim.agency],
    ['Payer', claim.payer],
    ['Service', claim.serviceType],
    ['Date of service', claim.dos],
    ['Episode', `${claim.episodeDays} days`],
    ['Priority', claim.priority.charAt(0).toUpperCase() + claim.priority.slice(1)],
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />

      {/* Panel */}
      <div className="relative h-full w-[520px] bg-[#fff] border-l border-[#2a2a2a] flex flex-col overflow-hidden fade-in">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[#2a2a2a]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={claim.status} />
              <span className="text-[11px] uppercase tracking-widest text-[#333]">Claim Details</span>
            </div>
            <h2 className="text-[15px] font-semibold text-[#444]">{claim.patientName}</h2>
            <p className="text-[11px] text-[#555] font-mono mt-0.5">{claim.id} · {claim.payer}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#555] hover:text-[#888] transition-colors p-1"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Amount */}
          <div className="p-5 border-b border-[#1e1e1e] flex items-center justify-between">
            <span className="text-[11px] text-[#555]">Billed amount</span>
            <span className="text-[13px] font-semibold text-[#1a1a1a]">${claim.billedAmount.toLocaleString()}</span>
          </div>

          {/* Timeline */}
          <div className="p-5 border-b border-[#1e1e1e]">
            <p className="text-[11px] uppercase tracking-widest text-[#555] mb-3">Status Timeline</p>
            <div className="space-y-3">
              {TIMELINE.map((step, i) => {
                const done = i <= currentStep
                const date = i === 0 ? claim.submittedDate : i === currentStep ? claim.lastUpdated : null
                return (
                  <div key={step.status} className="flex items-center gap-3">
                    <span className="w-3 flex justify-center">
                      {step.status === 'submitted' ? (
                        <i className="bi bi-check-circle-fill text-green-600 text-[12px] leading-none" />
                      ) : step.status === 'in_review' ? (
                        <i className={`bi bi-forward-fill text-[20px] leading-none ${done ? 'text-amber-600' : 'text-[#bbb]'}`} />
                      ) : (
                        <i className={`bi bi-hand-thumbs-up-fill text-[15px] leading-none ${done ? 'text-blue-600' : 'text-[#bbb]'}`} />
                      )}
                    </span>
                    <span className={`text-[12px] flex-1 ${done ? 'text-[#1a1a1a] font-medium' : 'text-[#999]'}`}>
                      {step.label}
                    </span>
                    {done && date && <span className="text-[11px] font-mono text-[#666]">{date}</span>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Details */}
          <div className="p-5">
            <p className="text-[11px] uppercase tracking-widest text-[#555] mb-3">Claim Info</p>
            <div className="border border-[#151414] rounded-md overflow-hidden">
              {details.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-4 py-2.5 border-b border-[#1e1e1e] last:border-0"
                >
                  <span className="text-[11px] text-[#555]">{label}</span>
                  <span className="text-[12px] text-[#1a1a1a]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action */}
        {actionLabel && (
          <div className="p-5 border-t border-[#2a2a2a]">
            <button
              onClick={() => onAction(claim)}
              className="w-full bg-[#1a1a1a] text-white rounded py-2 text-[12px] font-semibold hover:bg-black transition-colors"
            >
              {actionLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
