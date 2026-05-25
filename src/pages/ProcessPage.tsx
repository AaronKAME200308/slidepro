import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import {
  FileText, Phone, Wand2, Presentation, CheckCircle, Clock,
  Upload, Zap, ArrowRight, Layers, Palette, Play, Shield
} from 'lucide-react'

const timelineSteps = [
  {
    num: '01', icon: FileText, title: 'Tu soumets ta demande', subtitle: 'En quelques minutes',
    color: '#4f8eff',
    desc: "Remplis notre formulaire de rendez-vous en ligne avec tes informations personnelles, le titre de ton mémoire, ta filière et ta date de soutenance. Tu uploades ensuite ton rapport PDF directement depuis la plateforme.",
    details: ['Formulaire rapide 5 minutes', 'Upload PDF sécurisé', 'Aucun compte requis'],
  },
  {
    num: '02', icon: Phone, title: 'On te contacte dans les 24h', subtitle: 'Appel de cadrage',
    color: '#a78bfa',
    desc: "Notre équipe te rappelle par téléphone pour discuter de tes attentes : couleurs, style, nombre de slides, éléments à mettre en avant. L'appel dure 10 à 20 minutes maximum.",
    details: ['Appel sous 24h maximum', 'Discussion de tes attentes', 'Choix du style & couleurs'],
  },
  {
    num: '03', icon: Wand2, title: 'On crée ta présentation', subtitle: 'Notre studio au travail',
    color: '#f472b6',
    desc: "Nos designers créent ton PowerPoint : hiérarchie de l'information, visuels percutants, animations fluides, transitions élégantes et cohérence graphique pour impacter ton jury dès la première slide.",
    details: ['Animations & transitions modernes', 'Design professionnel personnalisé', 'Contenu structuré & synthétisé'],
  },
  {
    num: '04', icon: Presentation, title: 'Tu reçois ton PPT en 5 jours', subtitle: 'Livraison finale',
    color: '#34d399',
    desc: "Tu reçois ton fichier PowerPoint par email ou WhatsApp, prêt à être présenté. Une révision mineure est incluse. Tu es armé pour impressionner ton jury.",
    details: ['Livraison par email & WhatsApp', '1 révision incluse', 'Fichier .pptx & PDF fournis'],
  },
]

const advantages = [
  { icon: Palette, title: 'Design sur-mesure',    desc: 'Chaque présentation est unique, conçue selon tes instructions et les codes de ta filière.', color: '#f472b6' },
  { icon: Play,    title: 'Animations modernes',  desc: "Transitions fluides, graphiques animés qui captivent l'attention de ton jury.",              color: '#4f8eff' },
  { icon: Clock,   title: '5 jours garantis',     desc: 'Nous respectons ton délai. Si ta soutenance est dans 6 jours, on livre dans 5.',             color: '#fbbf24' },
  { icon: Layers,  title: 'Contenu synthétisé',   desc: "On extrait l'essentiel de ton rapport pour créer des slides claires et mémorables.",          color: '#34d399' },
  { icon: Shield,  title: 'Confidentialité totale', desc: 'Ton rapport et tes données sont protégés. Accès restreint à notre équipe uniquement.',     color: '#a78bfa' },
  { icon: Upload,  title: 'Livraison multiple',   desc: 'Tu reçois le fichier en format .pptx modifiable ET en PDF prêt à imprimer.',                  color: '#fb923c' },
]

const faqs = [
  { q: "Mon mémoire est très long (100+ pages). C'est possible ?",    a: "Absolument. Nous lisons l'intégralité de ton rapport et sélectionnons les informations clés à présenter. Plus le rapport est riche, plus nous avons de matière pour créer des slides percutantes." },
  { q: 'Combien de slides vais-je avoir ?',                           a: "En général entre 15 et 25 slides selon la richesse de ton rapport. Nous discutons du nombre exact lors de l'appel de cadrage." },
  { q: 'Je peux demander des modifications après la livraison ?',     a: "Oui, une révision mineure est incluse dans la prestation. Des modifications majeures peuvent faire l'objet d'un ajustement tarifaire." },
  { q: 'Dans quelle ville opérez-vous ?',                             a: 'Nous opérons à 100% en ligne. Peu importe où tu es au Cameroun (Yaoundé, Douala, Bafoussam, etc.), nous livrons partout.' },
]

/* ── useInView ── */
function useInView(ref: React.RefObject<HTMLDivElement | null>) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.2 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return inView
}

/* ── FAQ Item ── */
function FaqItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      onClick={() => setOpen(o => !o)}
      className="rounded-2xl cursor-pointer overflow-hidden transition-all duration-300"
      style={{
        background: open ? 'rgba(79,142,255,0.06)' : '#fff',
        border: open ? '1px solid rgba(79,142,255,0.25)' : '1px solid #e8eaf2',
        boxShadow: open ? '0 8px 32px rgba(79,142,255,0.1)' : '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div className="flex items-center justify-between gap-4 px-6 py-5">
        <div className="flex items-center gap-3.5">
          <div
            className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-[11px] font-bold transition-all duration-300"
            style={{
              background: open ? 'rgba(79,142,255,0.15)' : '#f1f5f9',
              color: open ? '#4f8eff' : '#94a3b8',
              fontFamily: 'monospace',
            }}
          >
            {String(idx + 1).padStart(2, '0')}
          </div>
          <span className="text-sm font-semibold text-slate-900 leading-snug">{q}</span>
        </div>
        <div
          className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center transition-all duration-300"
          style={{
            background: open ? '#4f8eff' : '#f1f5f9',
            transform: open ? 'rotate(45deg)' : 'none',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <line x1="5" y1="0" x2="5" y2="10" stroke={open ? '#fff' : '#64748b'} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="0" y1="5" x2="10" y2="5" stroke={open ? '#fff' : '#64748b'} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <div style={{ maxHeight: open ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
        <p className="px-6 pb-5 pt-4 text-sm text-slate-500 leading-relaxed border-t" style={{ borderColor: 'rgba(79,142,255,0.1)' }}>{a}</p>
      </div>
    </div>
  )
}

/* ── Timeline Step ── */
type TimelineStepType = {
  num: string
  icon: any
  title: string
  subtitle?: string
  color: string
  desc: string
  details?: string[]
}

function TimelineStep({ step, idx, total }: { step: TimelineStepType; idx: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const Icon = step.icon

  return (
    <div
      ref={ref}
      className="flex gap-0 relative"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.6s ease ${idx * 0.12}s, transform 0.6s ease ${idx * 0.12}s`,
      }}
    >
      {/* Giant step number bg */}
      <div
        className="absolute font-black pointer-events-none select-none leading-none"
        style={{
          fontSize: 'clamp(120px,18vw,200px)',
          color: 'transparent',
          WebkitTextStroke: `1px ${step.color}18`,
          top: -20, left: -10,
          letterSpacing: '-0.05em',
        }}
      >
        {step.num}
      </div>

      {/* Left gutter */}
      <div className="flex flex-col items-center w-[72px] shrink-0 relative z-10">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            background: `linear-gradient(135deg, ${step.color}22, ${step.color}08)`,
            border: `1.5px solid ${step.color}40`,
            boxShadow: `0 0 0 6px ${step.color}08, 0 8px 24px ${step.color}20`,
          }}
        >
          <Icon size={22} style={{ color: step.color }} />
        </div>
        {idx < total - 1 && (
          <div
            className="flex-1 mt-2"
            style={{ width: 1.5, minHeight: 60, background: `linear-gradient(to bottom, ${step.color}50, transparent)` }}
          />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pl-6 relative z-10 ${idx < total - 1 ? 'pb-14' : ''}`}>
        <div
          className="inline-block text-[10px] font-bold tracking-[2px] uppercase mb-1.5"
          style={{ color: step.color, fontFamily: 'monospace' }}
        >
          Étape {step.num} · {step.subtitle}
        </div>
        <h3 className="font-bold text-slate-900 mb-3 leading-tight" style={{ fontSize: 'clamp(1.4rem,3vw,1.8rem)' }}>
          {step.title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-4 max-w-lg">{step.desc}</p>
        <div className="flex flex-wrap gap-2">
          {step.details?.map(d => (
            <div
              key={d}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
              style={{ background: `${step.color}0d`, border: `1px solid ${step.color}25`, color: step.color }}
            >
              <CheckCircle size={11} />{d}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Main ── */
export default function ProcessPage() {
  return (
    <div>
      <style>{`
        @keyframes heroFade  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float1    { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-12px) rotate(4deg)} }
        @keyframes float2    { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(-3deg)} }
        @keyframes pulse-ring{ 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.15;transform:scale(1.1)} }
        @keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes adv-in    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        .hero-anim   { animation: heroFade 0.8s ease-out both; }
        .hero-anim-2 { animation: heroFade 0.8s ease-out 0.15s both; }
        .hero-anim-3 { animation: heroFade 0.8s ease-out 0.3s both; }
        .badge-float-a { animation: float1 5s ease-in-out infinite; }
        .badge-float-b { animation: float2 4s ease-in-out infinite 1s; }
        .orb-pulse { animation: pulse-ring 7s ease-in-out infinite; }
        .advantage-card { animation: adv-in 0.5s ease both; transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
        .advantage-card:hover { transform: translateY(-6px); }
        .cta-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .cta-btn:hover { transform: translateY(-3px); box-shadow: 0 20px 48px rgba(0,0,0,0.3) !important; }

        .shimmer-text {
          background: linear-gradient(90deg, #4f8eff 0%, #a78bfa 40%, #f472b6 60%, #4f8eff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .gradient-blue-violet {
          background: linear-gradient(135deg, #4f8eff, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .gradient-blue-violet-2 {
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden text-center px-12 pt-32 pb-24"
        style={{ background: 'linear-gradient(150deg, #060918 0%, #0d1640 40%, #0a2448 70%, #071428 100%)' }}
      >
        <div className="orb-pulse absolute w-[600px] h-[600px] rounded-full pointer-events-none opacity-15"
          style={{ background: 'radial-gradient(circle, #4f8eff 0%, transparent 70%)', top: -200, right: -150 }} />
        <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.12]"
          style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)', bottom: -100, left: -100 }} />

        {/* Floating accent lines */}
        <div className="badge-float-a absolute opacity-60 rounded-sm"
          style={{ top: '20%', left: '8%', width: 48, height: 2, background: 'linear-gradient(90deg, #4f8eff, transparent)' }} />
        <div className="badge-float-b absolute opacity-50 rounded-sm"
          style={{ top: '35%', right: '10%', width: 32, height: 2, background: 'linear-gradient(90deg, #f472b6, transparent)' }} />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="hero-anim inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-6"
            style={{ background: 'rgba(79,142,255,0.12)', border: '1px solid rgba(79,142,255,0.3)', color: '#7bb3ff', fontFamily: 'monospace' }}>
            <Zap size={12} />PROCESSUS TRANSPARENT · 4 ÉTAPES
          </div>

          <h1 className="hero-anim-2 font-extrabold text-white leading-[1.05] mb-5 tracking-tight"
            style={{ fontSize: 'clamp(2.6rem,6vw,4.2rem)' }}>
            Comment on transforme<br />
            <span className="shimmer-text">ton rapport</span> en chef-d'œuvre
          </h1>

          <p className="hero-anim-3 text-white/50 leading-relaxed max-w-lg mx-auto mb-9"
            style={{ fontSize: 17 }}>
            4 étapes simples, un résultat professionnel. Du dépôt de ton rapport à la livraison, voici exactement ce qui se passe.
          </p>

          <div className="hero-anim-3 flex justify-center gap-2 flex-wrap">
            {timelineSteps.map(s => (
              <div key={s.num}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium text-white/70"
                style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.color }} />
                {s.title}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="relative py-24 px-12 bg-slate-50">
        <div className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{ background: 'linear-gradient(to bottom, transparent, #4f8eff30, #a78bfa30, #f472b630, #34d39930, transparent)' }} />

        <div className="max-w-3xl mx-auto">
          <div className="mb-16">
            <div className="text-[10px] font-bold tracking-[3px] uppercase text-slate-400 mb-3" style={{ fontFamily: 'monospace' }}>
              — Le processus
            </div>
            <h2 className="font-extrabold text-slate-900 leading-tight tracking-tight" style={{ fontSize: 'clamp(2rem,4vw,2.8rem)' }}>
              Chaque étape,<br />
              <span className="gradient-blue-violet">pensée pour toi</span>
            </h2>
          </div>

          <div className="relative">
            {timelineSteps.map((step, idx) => (
              <TimelineStep key={step.num} step={step} idx={idx} total={timelineSteps.length} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ADVANTAGES ── */}
      <section
        className="relative overflow-hidden py-24 px-12"
        style={{ background: 'linear-gradient(160deg, #060918 0%, #0d1640 60%, #0a1e3a 100%)' }}
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 65%)', top: -120, right: -80 }} />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
            <div>
              <div className="text-[10px] font-bold tracking-[3px] uppercase text-[#4f8eff] mb-3" style={{ fontFamily: 'monospace' }}>
                — Nos avantages
              </div>
              <h2 className="font-extrabold text-white leading-tight tracking-tight max-w-sm" style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>
                Pourquoi choisir{' '}
                <span className="gradient-blue-violet">SlidePro ?</span>
              </h2>
            </div>
            <p className="text-sm text-white/40 max-w-[280px] leading-relaxed">
              Tout ce qui rend notre prestation unique et adaptée aux étudiants en soutenance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {advantages.map(({ icon: Icon, title, desc, color }, i) => (
              <div
                key={title}
                className="advantage-card rounded-2xl p-7"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  animationDelay: `${i * 0.07}s`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${color}10`
                  e.currentTarget.style.borderColor = `${color}35`
                  e.currentTarget.style.boxShadow = `0 16px 48px ${color}15`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                  style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <div className="text-[10px] font-bold tracking-[2px] mb-2" style={{ color: `${color}80`, fontFamily: 'monospace' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-xs text-white/45 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-12 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-13">
            <div className="text-[10px] font-bold tracking-[3px] uppercase text-slate-400 mb-3" style={{ fontFamily: 'monospace' }}>
              — Questions fréquentes
            </div>
            <h2 className="font-extrabold text-slate-900 tracking-tight leading-tight" style={{ fontSize: 'clamp(2rem,4vw,2.8rem)' }}>
              Tu as des{' '}
              <span className="gradient-blue-violet">questions ?</span>
            </h2>
          </div>

          <div className="flex flex-col gap-2.5 mt-12">
            {faqs.map((faq, idx) => <FaqItem key={idx} {...faq} idx={idx} />)}
          </div>

          <div className="mt-10 flex items-center gap-3.5 px-6 py-5 rounded-2xl"
            style={{ background: 'rgba(79,142,255,0.06)', border: '1px solid rgba(79,142,255,0.15)' }}>
            <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center"
              style={{ background: 'rgba(79,142,255,0.15)' }}>
              <Phone size={16} style={{ color: '#4f8eff' }} />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Une autre question ?{' '}
              <strong style={{ color: '#4f8eff' }}>Contacte-nous directement</strong>
              {' '}— on répond dans les 2h en semaine.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="relative overflow-hidden py-24 px-12 text-center"
        style={{ background: 'linear-gradient(150deg, #060918 0%, #0d1640 50%, #1a0a30 100%)' }}
      >
        <div className="absolute pointer-events-none blur-[40px] opacity-20 rounded-full"
          style={{ top: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse, #4f46e5 0%, transparent 70%)' }} />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full border border-white/[0.04]" style={{ transform: 'translate(30%,-30%)' }} />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full border border-white/[0.04]" style={{ transform: 'translate(-30%,30%)' }} />

        <div className="relative z-10 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>
            ✦ PRÊT EN 5 JOURS GARANTIS
          </div>

          <h2 className="font-extrabold text-white leading-[1.05] tracking-tight mb-4" style={{ fontSize: 'clamp(2rem,5vw,3.4rem)' }}>
            Tu es convaincu ?<br />
            <span className="shimmer-text">Alors, allons-y.</span>
          </h2>

          <p className="text-sm text-white/45 leading-relaxed mb-10">
            Prends rendez-vous maintenant — on s'occupe de tout le reste.
          </p>

          <div className="flex justify-center gap-3 flex-wrap">
            <Link to="/rendez-vous" className="cta-btn inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl font-bold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #4f8eff 0%, #7c3aed 100%)', boxShadow: '0 8px 32px rgba(79,142,255,0.35)' }}>
              <Zap size={16} />Prendre rendez-vous <ArrowRight size={16} />
            </Link>
            <Link to="/"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl font-medium text-sm text-white/70 transition-all duration-200 hover:bg-white/[0.12] hover:text-white"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)' }}>
              Voir nos réalisations
            </Link>
          </div>

          <p className="text-xs text-white/25 mt-5">
            Aucun paiement immédiat — on vous contacte d'abord
          </p>
        </div>
      </section>
    </div>
  )
}