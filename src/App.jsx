import { Routes, Route, Link } from 'react-router-dom'
import Hero from './components/Hero'
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Toaster from './components/Toaster'

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="sticky top-0 z-40 backdrop-blur bg-slate-900/50 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="font-semibold tracking-tight">STEM Society</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/register" className="hover:text-blue-300">Register</Link>
            <Link to="/login" className="hover:text-blue-300">Login</Link>
            <Link to="/dashboard" className="hover:text-blue-300">Dashboard</Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="border-t border-white/10 mt-10">
        <div className="max-w-6xl mx-auto px-6 py-10 text-blue-200/70 text-sm">
          © {new Date().getFullYear()} STEM Society • Secure electoral voting
        </div>
      </footer>
      <Toaster />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Shell><Hero /></Shell>} />
      <Route path="/register" element={<Shell><Register /></Shell>} />
      <Route path="/login" element={<Shell><Login /></Shell>} />
      <Route path="/dashboard" element={<Shell><Dashboard /></Shell>} />
    </Routes>
  )
}

export default App
