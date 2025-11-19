import { motion } from 'framer-motion'
import Spline from '@splinetool/react-spline'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <div className="relative min-h-[90vh] overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <motion.h1 className="text-4xl md:text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            STEM Society Electoral Voting System
          </motion.h1>
          <motion.p className="mt-4 text-blue-100/90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Secure, transparent, and modern voting built with React and Firebase.
          </motion.p>
          <motion.div className="mt-8 flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/register" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition text-white font-medium shadow-lg shadow-blue-600/30">Register</Link>
            <Link to="/login" className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition text-white font-medium border border-white/20">Login</Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/40 to-slate-900"></div>
    </div>
  )
}
