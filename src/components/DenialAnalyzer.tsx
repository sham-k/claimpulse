import { useState } from 'react'
import type { Claim } from '../data/claims'
import { useDenialAnalysis } from '../hooks/useDenialAnalysis'

interface DenialAnalyzerProps {
  claim: Claim
  onClose: () => void
  onResubmit: (claimId: string) => void
}

export function DenialAnalyzer({ claim, onClose, onResubmit }: DenialAnalyzerProps) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('cp_api_key') ?? '')
  const [keySubmitted, setKeySubmitted] = useState(() => !!localStorage.getItem('cp_api_key'))
  const { analyze, analysis, loading, error } = useDenialAnalysis()

  const handleKeySubmit = () => {
    if (!apiKey.trim()) return
    localStorage.setItem('cp_api_key', apiKey.trim())
    setKeySubmitted(true)
    analyze(claim, apiKey.trim())
  }

  const handleAnalyze = () => {
    analyze(claim, apiKey)
  }

  const probabilityColor = {
    High: 'text-green-400 bg-green-400/10 border-green-400/25',
    Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/25',
    Low: 'text-red-400 bg-red-400/10 border-red-400/25',
  }

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
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span className="text-[11px] uppercase tracking-widest text-[#333]">Denial Recovery</span>
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

        {/* Denial info */}
        <div className="p-5 border-b border-[#1e1e1e]">
          <p className="text-[11px] uppercase tracking-widest text-[#555] mb-2">Denial Reason</p>
          <div className="bg-red-500/5 border border-red-500/15 rounded p-3">
            <p className="text-[12px] text-white-300/90 leading-relaxed">{claim.denialReason}</p>
            {claim.denialCode && (
              <p className="text-[14px] font-mono text-red-800/60 mt-3">Code: {claim.denialCode}</p>
            )}
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-[11px] text-[#555]">At-risk revenue</span>
            <span className="text-[13px] font-semibold text-red-600">${claim.billedAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-5">
          {!keySubmitted ? (
            <div className="space-y-3">
              <p className="text-[13px] text-[#444] leading-relaxed">
                Enter your Anthropic API key to run AI-powered denial analysis on this claim.
              </p>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleKeySubmit()}
                placeholder="sk-ant-..."
                className="w-full bg-[#e3e0e0] border border-[#2a2a2a] rounded px-3 py-2 text-[12px] font-mono text-[#444] placeholder-[#444] focus:outline-none focus:border-[#3a3a3a] transition-colors"
              />
              <button
                onClick={handleKeySubmit}
                disabled={!apiKey.trim()}
                className="w-full bg-[#f0f0f0] text-[#0a0a0a] rounded py-2 text-[12px] font-semibold hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Analyze Denial
              </button>
            </div>
          ) : !analysis && !loading && !error ? (
            <div className="text-center py-10 space-y-3">
              <p className="text-[12px] text-[#555]">Ready to analyze this denial</p>
              <button
                onClick={handleAnalyze}
                className="bg-[#f0f0f0] text-[#0a0a0a] rounded px-5 py-2 text-[12px] font-semibold hover:bg-white transition-colors"
              >
                Run Analysis
              </button>
            </div>
          ) : null}

          {loading && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[12px] text-[#555]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#555] pulse-dot" />
                Analyzing denial patterns...
              </div>
              {[80, 60, 90, 70].map((w, i) => (
                <div key={i} className={`h-3 rounded shimmer`} style={{ width: `${w}%` }} />
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-500/5 border border-red-500/15 rounded p-4">
              <p className="text-[12px] text-red-400">{error}</p>
              <button
                onClick={handleAnalyze}
                className="text-[11px] text-red-400/60 hover:text-red-400 mt-2 transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {analysis && (
            <div className="space-y-5 fade-in">
              {/* Recovery probability */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-widest text-[#555]">Recovery Probability</span>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded border ${probabilityColor[analysis.recoveryProbability]}`}>
                  {analysis.recoveryProbability} · {analysis.estimatedTimeframe}
                </span>
              </div>

              {/* Root cause */}
              <div>
                <p className="text-[11px] uppercase tracking-widest text-[#555] mb-2">Root Cause</p>
                <p className="text-[13px] text-[#333] leading-relaxed">{analysis.rootCause}</p>
              </div>

              {/* Immediate actions */}
              <div>
                <p className="text-[11px] uppercase tracking-widest text-[#555] mb-2">Immediate Actions</p>
                <ul className="space-y-1.5">
                  {analysis.immediateActions.map((action, i) => (
                    <li key={i} className="flex gap-2.5 text-[13px] text-[#333]">
                      <span className="font-mono text-[#444] mt-0.5 shrink-0">{i + 1}.</span>
                      <span className="leading-relaxed">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Documentation needed */}
              <div>
                <p className="text-[11px] uppercase tracking-widest text-[#555] mb-2">Documentation Required</p>
                <ul className="space-y-1.5">
                  {analysis.documentationNeeded.map((doc, i) => (
                    <li key={i} className="flex gap-2 text-[13px] text-[#444] items-start">
                      <span className="text-amber-400/60 mt-0.5 shrink-0">◆</span>
                      <span className="leading-relaxed">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resubmission strategy */}
              <div>
                <p className="text-[11px] uppercase tracking-widest text-[#555] mb-2">Resubmission Strategy</p>
                <div className="bg-[#7ae1ed] border border-[#242424] rounded p-3">
                  <p className="text-[12px] text-[#444] leading-relaxed">{analysis.resubmissionStrategy}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {analysis && (
          <div className="p-4 border-t border-[#2a2a2a]">
            <button
            onClick={() => { onResubmit(claim.id); onClose() }}
            className="w-full bg-[#f0f0f0] text-[#0a0a0a] rounded py-2 text-[12px] font-semibold hover:bg-white transition-colors"
>
              Mark for Resubmission →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
