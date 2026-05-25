import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  Zap, Clock, Award, ChevronRight, Star, ArrowRight,
  CheckCircle, Users, TrendingUp, BarChart3
} from 'lucide-react'

const stats = [
  { value: 5,   suffix: 'j', label: 'Délai maximum',    icon: Clock },
  { value: 50,  suffix: '+', label: 'Projets livrés',   icon: Award },
  { value: 98,  suffix: '%', label: 'Clients satisfaits', icon: Star },
  { value: 100, suffix: '%', label: 'Taux de réussite', icon: TrendingUp },
]

const processSteps = [
  { step: '01', title: 'Tu souscris & uploades ton rapport',  desc: 'Remplis le formulaire en ligne et envoie ton document PDF directement via la plateforme.',         dotClass: 'from-blue-700 to-cyan-500' },
  { step: '02', title: 'Nous créons ta présentation',         desc: 'Notre équipe conçoit un PowerPoint pro avec animations modernes et mise en page soignée.',           dotClass: 'from-indigo-600 to-violet-600' },
  { step: '03', title: 'Tu reçois ton PPT en 5 jours',        desc: 'Tu reçois ta présentation finale prête à présenter devant ton jury de soutenance.',                  dotClass: 'from-emerald-600 to-teal-500' },
]

const testimonials = [
  { name: 'Marie-Claire N.', univ: 'Université de Yaoundé I',         text: 'Ma présentation était vraiment professionnelle. Le jury était impressionné !',                        rating: 5 },
  { name: 'Patrick A.',      univ: 'Institut Supérieur de Management', text: 'Livré en 4 jours seulement, avec des animations super modernes. Je recommande à 100%.',             rating: 5 },
  { name: 'Sandrine M.',     univ: 'ESSEC Douala',                     text: "Rapport qualité-rapidité imbattable. J'ai eu mention très honorable à ma soutenance.",              rating: 5 },
  { name: 'Jean-Paul K.',    univ: 'FSEG Yaoundé II',                  text: 'Présentation livrée avant le délai, impeccable. Mon directeur était étonné du rendu.',              rating: 5 },
]

/* ── Animated counter ── */
function AnimatedCounter({ target, suffix }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 1200
        const start = performance.now()
        const step = (now) => {
          const t = Math.min((now - start) / duration, 1)
          const ease = 1 - Math.pow(1 - t, 3)
          setCount(Math.round(ease * target))
          if (t < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{count}{suffix}</span>
}

/* ── Testimonial carousel ── */
function TestimonialCarousel() {
  const doubled = [...testimonials, ...testimonials]
  const [paused, setPaused] = useState(false)
  return (
    <div className="overflow-hidden w-full">
      <div
        className="flex gap-3.5 px-7 py-1 w-max"
        style={{ animation: paused ? 'none' : 'slideCarousel 24s linear infinite' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {doubled.map((t, i) => (
          <div key={i} className="w-64 shrink-0 rounded-2xl p-4 glass-card-dark hover:bg-white/10 transition-colors duration-200">
            <div className="flex gap-0.5 mb-2.5">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} size={11} className="text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-xs text-white/70 leading-relaxed mb-3 italic">"{t.text}"</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full shrink-0 bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-medium text-white">
                {t.name.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-medium text-white/90">{t.name}</div>
                <div className="text-[10px] text-white/40">{t.univ}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── PPT Mockup ── */
function PptMockup() {
  return (
    <div className="relative hidden lg:block">
      {/* Badge top-right */}
      <div className="animate-float-delayed absolute -top-3 right-0 z-10 glass-card-dark rounded-2xl px-3.5 py-2 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-yellow-400/20 border border-yellow-400/35 flex items-center justify-center text-yellow-400 text-sm">★</div>
        <div>
          <div className="text-xs font-semibold text-white/90">4.9 / 5</div>
          <div className="text-[10px] text-white/45">50+ avis</div>
        </div>
      </div>

      {/* Card */}
      <div className="animate-float my-6">
        <div className="rounded-2xl overflow-hidden border border-white/15" style={{ boxShadow: '0 24px 72px rgba(0,0,0,0.55)' }}>
          {/* Titlebar */}
          <div className="bg-black/40 px-4 py-2.5 flex items-center gap-1.5 border-b border-white/10">
            {['#ff5f57','#ffbd2e','#28c840'].map(c => (
              <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
            ))}
            <span className="text-[10px] text-white/30 ml-2">Soutenance_Master2_Finale.pptx</span>
          </div>
          {/* Slide */}
          <div className="relative overflow-hidden h-60 flex flex-col justify-between p-6 pb-5"
            style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 50%, #0891b2 100%)' }}>
            {/* Decorative rings */}
            <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full border border-white/10"
              style={{ animation: 'spinSlow 14s linear infinite' }} />
            <div className="absolute bottom-5 -left-4 w-24 h-24 rounded-full border border-white/7" />
            {/* Content */}
            <div className="relative z-10">
              <div className="text-white/50 text-[9px] font-semibold tracking-widest uppercase mb-1.5">
                Université de Yaoundé I · Master 2
              </div>
              <div className="text-white text-lg font-bold leading-snug">
                Impact du e-commerce<br />sur le commerce traditionnel
              </div>
            </div>
            {/* Chart bars */}
            <div className="relative z-10">
              <div className="flex items-end gap-1.5 h-14">
                {[55,85,42,90,68,50].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t"
                    style={{ height: `${h}%`, background: (i===1||i===3) ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)' }} />
                ))}
              </div>
              <div className="flex justify-between items-center mt-3">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-0.5 rounded" style={{ width: i===1 ? 22 : 14, background: i===1 ? '#fff' : 'rgba(255,255,255,0.25)' }} />
                  ))}
                </div>
                <div className="text-[9px] text-white/40">Slide 1 / 18</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badge bottom-left */}
      <div className="animate-float absolute -bottom-2 left-0 z-10 glass-card-dark rounded-2xl px-3.5 py-2 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-sm">✓</div>
        <div>
          <div className="text-xs font-semibold text-white/90">Livré en 4 jours</div>
          <div className="text-[10px] text-white/45">Mention très honorable</div>
        </div>
      </div>
    </div>
  )
}

/* ── Main ── */
export default function HomePage() {
  return (
    <div>
      <style>{`
        @keyframes pulseOrb    { 0%,100%{opacity:0.3;transform:scale(1)}   50%{opacity:0.18;transform:scale(1.08)} }
        @keyframes slideCarousel { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes spinSlow    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .hero-orb-1 { animation: pulseOrb 6s ease-in-out infinite; }
        .hero-orb-2 { animation: pulseOrb 8s ease-in-out infinite 2s; }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-screen flex items-center pt-20"
        style={{ background: 'linear-gradient(140deg, #0f0825 0%, #1a1060 30%, #0d2e5c 65%, #061a35 100%)' }}>

        <div className="hero-orb-1 absolute w-[500px] h-[500px] rounded-full pointer-events-none opacity-30"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', top: -120, right: -100 }} />
        <div className="hero-orb-2 absolute w-[380px] h-[380px] rounded-full pointer-events-none opacity-[0.28]"
          style={{ background: 'radial-gradient(circle, #0891b2 0%, transparent 70%)', bottom: -80, left: -80 }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 py-12 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium glass-card-dark text-white/90 mb-6">
                <Zap size={12} /> Délai garanti : 5 jours maximum
              </div>

              <h1 className="text-[clamp(2.6rem,5.5vw,4.2rem)] font-bold text-white leading-[1.05] mb-5">
                Ton mémoire,{' '}
                <span className="gradient-text-white">transformé en</span>
                <br />présentation parfaite
              </h1>

              <p className="text-base text-white/60 leading-relaxed mb-7 max-w-[440px]">
                Nous créons des PowerPoints professionnels, animés et percutants à partir de ton rapport de soutenance. Impressionne ton jury dès la première slide.
              </p>

              <div className="flex flex-wrap gap-3 mb-7">
                <Link to="/rendez-vous" className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white text-sm font-semibold">
                  <Zap size={16} /> Commencer maintenant
                </Link>
                <Link to="/processus"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium glass-card-dark text-white/85 hover:bg-white/15 transition-colors"
                >
                  Voir comment ça marche <ChevronRight size={16} />
                </Link>
              </div>

              <div className="flex flex-wrap gap-5">
                {['Rendu en 5 jours', 'Animations pro', 'Support inclus'].map(b => (
                  <div key={b} className="flex items-center gap-1.5 text-sm text-white/50">
                    <CheckCircle size={13} className="text-emerald-400" />{b}
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <PptMockup />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-slate-50 py-12 px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-7">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium badge-blue">
              <BarChart3 size={12} /> Nos chiffres clés
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ value, suffix, label, icon: Icon }) => (
              <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 text-center card-hover">
                <div className="w-10 h-10 rounded-xl mx-auto mb-3 bg-indigo-50 flex items-center justify-center">
                  <Icon size={18} className="text-indigo-500" />
                </div>
                <div className="text-3xl font-bold text-slate-900 leading-none">
                  <AnimatedCounter target={value} suffix={suffix} />
                </div>
                <div className="text-xs text-slate-500 mt-1.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium badge-blue mb-3">
              <Zap size={12} /> Simple & rapide
            </div>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold text-slate-900 mb-2">
              Comment ça <span className="gradient-text">fonctionne ?</span>
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Trois étapes simples, 5 jours, une présentation qui impressionne ton jury.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-5 top-5 bottom-5 w-px bg-gradient-to-b from-indigo-500 to-cyan-500 opacity-25" />
            {processSteps.map(({ step, title, desc, dotClass }, i) => (
              <div key={step} className={`flex gap-5 ${i < processSteps.length - 1 ? 'pb-6' : ''} relative`}>
                <div className={`shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${dotClass} flex items-center justify-center text-sm font-semibold text-white z-10 shadow-md hover:scale-110 transition-transform`}>
                  {i + 1}
                </div>
                <div className="process-step-body flex-1 bg-slate-50 rounded-2xl border border-slate-200 p-4">
                  <div className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mb-1">Étape {step}</div>
                  <div className="text-sm font-semibold text-slate-900 mb-1">{title}</div>
                  <div className="text-xs text-slate-500 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/processus" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              Voir le processus détaillé <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="pt-16 pb-14 overflow-hidden" style={{ background: 'linear-gradient(160deg, #1a1060 0%, #0f0a2e 100%)' }}>
        <div className="px-8 mb-7 text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium glass-card-dark text-white/80 mb-2.5">
            💬 Avis étudiants
          </div>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold text-white mb-1">
            Ce que disent{' '}
            <span style={{ background: 'linear-gradient(135deg, #a5b4fc, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              nos étudiants
            </span>
          </h2>
        </div>
        <TestimonialCarousel />
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative overflow-hidden py-24 px-8 text-center"
        style={{ background: 'linear-gradient(135deg, #312e81 0%, #4f46e5 50%, #0891b2 100%)' }}>
        <div className="absolute w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-[0.06] -top-24 -left-20"
          style={{ background: '#fff' }} />
        <div className="absolute w-80 h-80 rounded-full pointer-events-none blur-3xl opacity-[0.05] -bottom-20 -right-16"
          style={{ background: '#fff' }} />

        <div className="relative z-10 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium glass-card-dark text-white mb-5">
            <Users size={12} /> Rejoins 50+ étudiants satisfaits
          </div>
          <h2 className="text-[clamp(2rem,5vw,3.4rem)] font-bold text-white mb-3.5 leading-[1.1]">
            Prêt à épater ton jury ?
          </h2>
          <p className="text-sm text-white/70 mb-8 leading-relaxed">
            Prends rendez-vous maintenant et reçois ta présentation professionnelle en moins de <strong className="text-white">5 jours</strong>.
          </p>
          <Link to="/rendez-vous"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm bg-white text-indigo-600 hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-200"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.22)' }}
          >
            <Zap size={16} /> Prendre rendez-vous gratuitement <ArrowRight size={16} />
          </Link>
          <p className="text-xs text-white/40 mt-3.5">
            Aucun paiement immédiat — on vous contacte d'abord
          </p>
        </div>
      </section>
    </div>
  )
}