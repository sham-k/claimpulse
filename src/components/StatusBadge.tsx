import type { ClaimStatus } from '../data/claims'

interface StatusBadgeProps {
  status: ClaimStatus
}


export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === 'denied') {
    return (
      <i
        className="bi bi-clipboard-x-fill text-red-600 text-[20px]"
        title="Denied"
        aria-label="Denied"
      />
    )
  }

  if (status === 'in_review') {
    return (
      <i
        className="bi bi-chevron-double-right text-amber-600 text-[20px] pulse-dot"
        title="In Review"
        aria-label="In Review"
      />
    )
  }

  if (status === 'approved') {
    return (
      <i
        className="bi bi-clipboard-check-fill text-green-600 text-[20px]"
        title="Approved"
        aria-label="Approved"
      />
    )
  }

  if (status === 'submitted'){
    return(
    <i className="bi bi-clipboard-plus-fill text-blue-600 text-[20px]"
    title="Submitted"
    aria-label="Submitted"
    />
    )
  }

    if (status === 'resubmitted'){
    return(
    <i className="bi bi-clipboard2-pulse-fill text-purple-600 text-[20px]"
    title="Resubmitted"
    aria-label="Resubmitted"
    />
    )
  }


}

