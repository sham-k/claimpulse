import type { Claim } from '../data/claims'
import { StatusBadge } from './StatusBadge'

interface ClaimsTableProps {
  claims: Claim[]
  onSelectClaim: (claim: Claim) => void
  selectedId?: string
}

export function ClaimsTable({ claims, onSelectClaim, selectedId }: ClaimsTableProps) {
  return (
    <div className="border border-[#151414] rounded-md overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-2.5 bg-[#444] border-b border-[#2a2a2a]">
        {['Patient', 'Agency', 'Payer', 'Service', 'Billed', 'Status'].map((col) => (
          <span key={col} className="text-[10px] uppercase tracking-widest text-[#999] font-medium">
            {col}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div>
        {claims.map((claim, i) => {
          const isDenied = claim.status === 'denied'
          const isSelected = claim.id === selectedId
          return (
            <div
              key={claim.id}
              onClick={() => onSelectClaim(claim)}
              className={`
                grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3
                border-b border-[#1e1e1e] last:border-0
                cursor-pointer transition-colors duration-100
                ${isSelected ? 'bg-[#ececec]' : 'hover:bg-[#f2f2f2]'}
                ${isDenied && !isSelected ? 'hover:bg-[#fdeaea]' : ''}
                ${i === 0 ? '' : ''}
              `}
            >
              <div>
                <p className="text-[12px] text-[#1a1a1a] font-medium">{claim.patientName}</p>
                <p className="text-[10px] text-[#666] font-mono mt-0.5">{claim.id}</p>
              </div>
              <div className="flex items-center">
                <span className="text-[12px] text-[#444] truncate">{claim.agency}</span>
              </div>
              <div className="flex items-center">
                <span className="text-[12px] text-[#444]">{claim.payer}</span>
              </div>
              <div className="flex items-center">
                <span className="text-[11px] text-[#555]">{claim.serviceType}</span>
              </div>
              <div className="flex items-center">
                <span className={`text-[12px] font-mono font-medium ${isDenied ? 'text-red-600' : 'text-[#333]'}`}>
                  ${claim.billedAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center">
                <StatusBadge status={claim.status} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
