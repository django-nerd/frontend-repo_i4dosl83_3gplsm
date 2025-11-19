import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseReady } from '../firebase'

export default function Login() {
  const [ready, setReady] = useState(firebaseReady)
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => { setReady(firebaseReady) }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!ready) { setMessage('Firebase is not configured. Add your keys to .env'); return }
    try {
      setLoading(true)
      setMessage('')
      const auth = getAuth()
      await signInWithEmailAndPassword(auth, form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setMessage(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="text-blue-100/80">Sign in to vote</p>
        </div>
        {!ready && (
          <p className="text-yellow-300 mb-4">Firebase not configured. Add VITE_FIREBASE_* keys.</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e)=>setForm(f=>({...f,email:e.target.value}))} className="w-full px-4 py-3 rounded-lg bg-slate-900/60 border border-white/10 focus:outline-none focus:border-blue-500" placeholder="you@college.edu" />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input type="password" value={form.password} onChange={(e)=>setForm(f=>({...f,password:e.target.value}))} className="w-full px-4 py-3 rounded-lg bg-slate-900/60 border border-white/10 focus:outline-none focus:border-blue-500" placeholder="••••••••" />
          </div>
          {message && <p className="text-red-300 text-sm">{message}</p>}
          <button disabled={loading} className="w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60">
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-blue-100/80">No account? <Link to="/register" className="text-white underline">Register</Link></p>
      </motion.div>
    </div>
  )
}
