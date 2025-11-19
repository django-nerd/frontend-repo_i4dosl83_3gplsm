import { useEffect, useState } from 'react'

export default function Toaster() {
  const [msg, setMsg] = useState('')
  useEffect(() => {
    const handler = (e) => {
      setMsg(e.detail)
      setTimeout(() => setMsg(''), 2500)
    }
    window.addEventListener('toast', handler)
    return () => window.removeEventListener('toast', handler)
  }, [])

  if (!msg) return null
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-black/80 text-white border border-white/10 shadow-lg">
      {msg}
    </div>
  )
}
