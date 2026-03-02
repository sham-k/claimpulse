import { useState } from 'react'
import type { Claim } from '../data/claims'

export interface DenialAnalysis {
  rootCause: string
  immediateActions: string[]
  documentationNeeded: string[]
  resubmissionStrategy: string
  recoveryProbability: 'High' | 'Medium' | 'Low'
  estimatedTimeframe: string
}

export function useDenialAnalysis() {
  const [analysis, setAnalysis] = useState<DenialAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyze = async (claim: Claim, apiKey: string) => {
    if (!claim.denialReason) return

    setLoading(true)
    setError(null)
    setAnalysis(null)

    const prompt = `You are a revenue cycle management specialist with deep expertise in post-acute home health care billing. Analyze this denied claim and provide a recovery action plan.

Claim ID: ${claim.id}
Payer: ${claim.payer}
Service Type: ${claim.serviceType}
Billed Amount: $${claim.billedAmount.toLocaleString()}
Denial Code: ${claim.denialCode}
Denial Reason: ${claim.denialReason}
Date of Service: ${claim.dos}
Episode Length: ${claim.episodeDays} days

Respond ONLY with a valid JSON object in this exact structure (no markdown, no explanation):
{
  "rootCause": "one clear sentence explaining why this was really denied",
  "immediateActions": ["action 1", "action 2", "action 3"],
  "documentationNeeded": ["doc 1", "doc 2", "doc 3"],
  "resubmissionStrategy": "2-3 sentences on the best path to resubmit and recover this claim",
  "recoveryProbability": "High" | "Medium" | "Low",
  "estimatedTimeframe": "e.g. 14-21 days"
}`

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-opus-4-6',
          max_tokens: 800,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error?.message || 'API request failed')
      }

      const data = await response.json()
      const text = data.content[0]?.text ?? ''
      const parsed: DenialAnalysis = JSON.parse(text)
      setAnalysis(parsed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze claim')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setAnalysis(null)
    setError(null)
  }

  return { analyze, analysis, loading, error, reset }
}
