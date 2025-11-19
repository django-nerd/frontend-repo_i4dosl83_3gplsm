import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import { firebaseReady, db } from '../firebase'

function randomStemId() {
  const prefix = 'STEM-'
  const num = Math.floor(100000 + Math.random() * 900000)
  return `${prefix}${num}`
}

export default function Register() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(firebaseReady)
  const [form, setForm] = useState({ name: '', email: '', password: '', isMember: true, stemId: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => { setReady(firebaseReady) }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const fakePayment = () => new Promise((res) => setTimeout(res, 1500))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!ready) { setMessage('Firebase is not configured. Add your keys to .env'); return }
    if (!form.name || !form.email || !form.password) { setMessage('Please fill all required fields'); return }

    try {
      setLoading(true)
      setMessage('')

      let stemId = form.stemId
      if (!form.isMember) {
        // Simulate payment then generate STEM ID
        await fakePayment()
        stemId = randomStemId()
      }

      const auth = getAuth()
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password)
      await updateProfile(cred.user, { displayName: form.name })

      const userRef = doc(collection(getFirestore(), 'users'), cred.user.uid)
      await setDoc(userRef, { name: form.name, email: form.email, stemId, createdAt: new Date().toISOString(), voted: false })

      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setMessage(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold">Create your account</h2>
          <p className="text-blue-100/80">Join the STEM Society voting portal</p>
        </div>
        {!ready && (
          <p className="text-yellow-300 mb-4">Firebase not configured. Add VITE_FIREBASE_* keys.</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Full name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-slate-900/60 border border-white/10 focus:outline-none focus:border-blue-500" placeholder="Ayesha Khan" />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-slate-900/60 border border-white/10 focus:outline-none focus:border-blue-500" placeholder="you@college.edu" />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-slate-900/60 border border-white/10 focus:outline-none focus:border-blue-500" placeholder="••••••••" />
          </div>
          <div className="flex items-center gap-3">
            <input id="isMember" type="checkbox" name="isMember" checked={form.isMember} onChange={handleChange} className="size-4" />
            <label htmlFor="isMember">I already have a STEM Society ID</label>
          </div>
          {form.isMember ? (
            <div>
              <label className="block text-sm mb-1">STEM ID</label>
              <input name="stemId" value={form.stemId} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-slate-900/60 border border-white/10 focus:outline-none focus:border-blue-500" placeholder="STEM-123456" />
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 p-4 bg-slate-900/40">
              <p className="text-sm">Not a member? One-time membership is 200 PKR.</p>
              <button type="button" onClick={async () => { setLoading(true); await fakePayment(); setForm(f => ({ ...f, isMember: false })); setLoading(false) }} className="mt-3 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500">Pay 200 PKR</button>
            </div>
          )}

          {message && <p className="text-red-300 text-sm">{message}</p>}
          <button disabled={loading} className="w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-blue-100/80">Already have an account? <Link to="/login" className="text-white underline">Login</Link></p>
      </motion.div>
    </div>
  )
}
