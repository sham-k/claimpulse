import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  sub?: string
  type?: 'success' | 'error' | 'info'
  onDismiss: () => void
}

export function Toast({ message, sub, type = 'success', onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10)
    const hide = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300)
    }, 3500)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [onDismiss])

  const accent = {
    success: 'border-green-500/30 bg-green-500/8',
    error: 'border-red-500/30 bg-red-500/8',
    info: 'border-[#3a3a3a] bg-[#1a1a1a]',
  }[type]

  const dot = {
    success: 'bg-green-400',
    error: 'bg-red-400',
    info: 'bg-blue-400',
  }[type]

  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-3 rounded-md border
        shadow-2xl shadow-black/60
        transition-all duration-300 ease-out
        ${accent}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${dot}`} />
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-[#e0e0e0]">{message}</p>
        {sub && <p className="text-[11px] text-[#555] mt-0.5">{sub}</p>}
      </div>
      <button
        onClick={() => { setVisible(false); setTimeout(onDismiss, 300) }}
        className="text-[#444] hover:text-[#888] transition-colors shrink-0 mt-0.5"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}