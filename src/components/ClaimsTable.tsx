import type { Claim } from '../data/claims'
import { StatusBadge } from './StatusBadge'

interface ClaimsTableProps {
  claims: Claim[]
  onSelectClaim: (claim: Claim) => void
  selectedId?: string
}

export function ClaimsTable({ claims, onSelectClaim, selectedId }: ClaimsTableProps) {
  return (
    <div className="border border-[#2a2a2a] rounded-md overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-2.5 bg-[#0f0f0f] border-b border-[#2a2a2a]">
        {['Patient', 'Agency', 'Payer', 'Service', 'Billed', 'Status'].map((col) => (
          <span key={col} className="text-[10px] uppercase tracking-widest text-[#444] font-medium">
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
                ${isSelected ? 'bg-[#1a1a1a]' : 'hover:bg-[#141414]'}
                ${isDenied && !isSelected ? 'hover:bg-[#1a1010]' : ''}
                ${i === 0 ? '' : ''}
              `}
            >
              <div>
                <p className="text-[12px] text-[#e0e0e0] font-medium">{claim.patientName}</p>
                <p className="text-[10px] text-[#444] font-mono mt-0.5">{claim.id}</p>
              </div>
              <div className="flex items-center">
                <span className="text-[12px] text-[#888] truncate">{claim.agency}</span>
              </div>
              <div className="flex items-center">
                <span className="text-[12px] text-[#888]">{claim.payer}</span>
              </div>
              <div className="flex items-center">
                <span className="text-[11px] text-[#666]">{claim.serviceType}</span>
              </div>
              <div className="flex items-center">
                <span className={`text-[12px] font-mono font-medium ${isDenied ? 'text-red-400' : 'text-[#c0c0c0]'}`}>
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
