import type { ClaimStatus } from '../data/claims'

interface StatusBadgeProps {
  status: ClaimStatus
}

const STATUS_CONFIG: Record<ClaimStatus, { label: string; dot: string; text: string; bg: string }> = {
  submitted: {
    label: 'Submitted',
    dot: 'bg-blue-400',
    text: 'text-blue-300',
    bg: 'bg-blue-400/8 border-blue-400/20',
  },
  in_review: {
    label: 'In Review',
    dot: 'bg-amber-400',
    text: 'text-amber-300',
    bg: 'bg-amber-400/8 border-amber-400/20',
  },
  approved: {
    label: 'Approved',
    dot: 'bg-green-400',
    text: 'text-green-300',
    bg: 'bg-green-400/8 border-green-400/20',
  },
  denied: {
    label: 'Denied',
    dot: 'bg-red-400',
    text: 'text-red-300',
    bg: 'bg-red-400/8 border-red-400/20',
  },
  resubmitted: {
    label: 'Resubmitted',
    dot: 'bg-purple-400',
    text: 'text-purple-300',
    bg: 'bg-purple-400/8 border-purple-400/20',
  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${config.bg} ${config.text}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === 'in_review' ? 'pulse-dot' : ''}`}
      />
      {config.label}
    </span>
  )
}
