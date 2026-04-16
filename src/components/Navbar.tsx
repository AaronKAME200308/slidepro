import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Presentation, Menu, X, Zap } from 'lucide-react'

const navLinks = [
  { label: 'Accueil', to: '/' },
  { label: 'Comment ça marche', to: '/processus' },
  { label: 'Réalisations', to: '/portfolio' },
  { label: 'À propos', to: '/a-propos' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'nav-blur shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl btn-primary flex items-center justify-center">
              <Presentation size={18} className="text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <span className="font-display text-xl font-800 text-slate-900 tracking-tight">
                Slide<span className="gradient-text">Zen</span>
              </span>
              <div className="text-[10px] text-slate-400 font-medium leading-none -mt-0.5 tracking-wider uppercase">
                Studio
              </div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/60'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/rendez-vous"
              className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
            >
              <Zap size={14} />
              Prendre rendez-vous
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="lg:hidden nav-blur border-t border-slate-100 animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    active ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              to="/rendez-vous"
              className="btn-primary mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-semibold"
            >
              <Zap size={14} />
              Prendre rendez-vous
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}