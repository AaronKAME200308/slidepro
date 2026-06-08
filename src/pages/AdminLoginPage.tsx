import { useState, type FormEvent } from 'react'
import { Presentation, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../services/supabase'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Email et mot de passe requis')
      return
    }
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError('Identifiants incorrects. Réessaie.')
      setLoading(false)
      return
    }
    // Redirect handled by router / parent
    window.location.href = '/sp-admin-x7/dashboard'
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(150deg, #060918 0%, #0d1640 40%, #071428 100%)' }}
    >
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseOrb { 0%,100%{opacity:0.18} 50%{opacity:0.08} }
        .login-card { animation: fadeUp 0.5s ease both; }
        .orb { animation: pulseOrb 7s ease-in-out infinite; }
      `}</style>

      {/* Background orbs */}
      <div className="orb fixed w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', top: -80, left: -80, opacity: 0.18 }} />
      <div className="orb fixed w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, #0891b2 0%, transparent 70%)', bottom: -60, right: -60, opacity: 0.15, animationDelay: '3s' }} />

      <div className="login-card relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl btn-primary flex items-center justify-center">
              <Presentation size={20} className="text-white" />
            </div>
            <span className="font-display text-2xl font-bold text-white">
              Slide<span className="gradient-text">Pro</span>
            </span>
          </div>
          <p className="text-white/40 text-xs tracking-widest uppercase" style={{ fontFamily: 'monospace' }}>
            — Accès administrateur
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <h1 className="text-xl font-bold text-white mb-1">Connexion</h1>
          <p className="text-white/40 text-sm mb-7">Espace réservé à l'équipe SlidePro</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Email</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                  <Mail size={15} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@slidepro.cm"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1.5px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.85)',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(79,142,255,0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79,142,255,0.12)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Mot de passe</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                  <Lock size={15} />
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1.5px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.85)',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(79,142,255,0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79,142,255,0.12)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
              >
                <AlertCircle size={14} className="shrink-0" /> {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold text-sm transition-all mt-2"
              style={{
                background: 'linear-gradient(135deg, #4f8eff, #7c3aed)',
                boxShadow: '0 8px 24px rgba(79,142,255,0.3)',
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Connexion...</> : 'Se connecter'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Accès strictement réservé à l'équipe SlidePro
        </p>
      </div>
    </div>
  )
}