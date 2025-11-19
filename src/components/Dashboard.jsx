import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, getFirestore, increment, setDoc, updateDoc } from 'firebase/firestore'

const candidatesSeed = [
  { id: 'c1', name: 'Fatima Iqbal', role: 'President', dept: 'CS', bio: 'Advocating innovation and inclusivity.', color: 'from-blue-500 to-cyan-500' },
  { id: 'c2', name: 'Ahmed Khan', role: 'Vice President', dept: 'EE', bio: 'Empowering students with resources.', color: 'from-purple-500 to-fuchsia-500' },
  { id: 'c3', name: 'Sara Ali', role: 'General Secretary', dept: 'Math', bio: 'Transparency and growth for STEM.', color: 'from-emerald-500 to-teal-500' },
]

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [voted, setVoted] = useState(false)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    const auth = getAuth()
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (!u) { setLoading(false); return }
      const ref = doc(collection(getFirestore(), 'users'), u.uid)
      const snap = await getDoc(ref)
      const data = snap.exists() ? snap.data() : null
      setVoted(!!(data && data.voted))
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const castVote = async (candidateId) => {
    if (!user || voted) return
    setConfirming(true)
    const db = getFirestore()
    const voteRef = doc(collection(db, 'votes'), candidateId)
    await setDoc(voteRef, { count: increment(0) }, { merge: true })
    await updateDoc(voteRef, { count: increment(1) })

    const userRef = doc(collection(db, 'users'), user.uid)
    await setDoc(userRef, { voted: true }, { merge: true })
    setVoted(true)
    setTimeout(() => setConfirming(false), 1500)
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-900 text-white">
        <div className="animate-spin size-10 rounded-full border-2 border-white/20 border-t-white" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-900 text-white p-6 text-center">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Please login to vote</h2>
          <a href="/login" className="text-blue-400 underline">Go to Login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Hello, {user.displayName || user.email}</h1>
          <a href="/" className="text-blue-300 hover:text-white">Home</a>
        </div>

        <p className="text-blue-100/80 mb-6">Cast your vote for your preferred candidates. One vote per account. Your response will be securely recorded.</p>

        <div className="grid md:grid-cols-3 gap-6">
          {candidatesSeed.map((c, idx) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
              <div className={`h-32 bg-gradient-to-r ${c.color}`} />
              <div className="p-5">
                <h3 className="text-xl font-semibold">{c.name}</h3>
                <p className="text-blue-200/80">{c.role} • {c.dept}</p>
                <p className="mt-2 text-sm text-blue-100/80">{c.bio}</p>
                <button disabled={voted} onClick={() => castVote(c.id)} className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60">
                  {voted ? 'Voted' : 'Vote'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {confirming && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 grid place-items-center">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white/10 border border-white/20 rounded-2xl p-8 text-center">
                <div className="mx-auto size-16 rounded-full grid place-items-center bg-emerald-500/20 border border-emerald-400/40 mb-4">
                  <svg viewBox="0 0 24 24" fill="none" className="size-8 text-emerald-400"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Vote recorded!</h3>
                <p className="text-blue-100/80">Thank you for participating in the STEM elections.</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
