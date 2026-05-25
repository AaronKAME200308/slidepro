import { useState, type FormEvent } from 'react'
import {
  Zap, Target, Heart, Shield, Mail, Phone, MapPin,
  Send, Loader2, CheckCircle, Users, Lightbulb, Star,
  BarChart3, Clock, Trophy
} from 'lucide-react'
import { supabase } from '../services/supabase'

const values = [
  { icon: Zap,    title: 'Rapidité',   desc: "Nous comprenons la pression des soutenances. C'est pourquoi nous garantissons une livraison en 5 jours.",     accent: '#f59e0b', glow: 'rgba(245,158,11,0.18)' },
  { icon: Target, title: 'Précision',  desc: 'Chaque slide est pensée pour mettre en valeur ton travail et convaincre ton jury.',                            accent: '#4f8eff', glow: 'rgba(79,142,255,0.18)' },
  { icon: Heart,  title: 'Passion',    desc: "On aime ce qu'on fait. Le design, la narration visuelle, et le succès de nos clients.",                        accent: '#f472b6', glow: 'rgba(244,114,182,0.18)' },
  { icon: Shield, title: 'Confiance',  desc: 'Tes données et ton rapport sont en sécurité. Confidentialité totale garantie.',                               accent: '#34d399', glow: 'rgba(52,211,153,0.18)' },
]

const team = [
  { name: 'Jean-Pascal Olinga.', role: 'Fondateur & Designer Principal', bio: "Designer depuis 2 ans, Etudiant en Master à Pigier. Passionné par la communication visuelle.", emoji: '🎨', gradient: 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 100%)', accent: '#4f46e5' },
  { name: 'Aaron KAME',          role: 'Co-fondateur & Développeur',     bio: 'Développeur passionné par les solutions numériques. Il assure que notre plateforme soit toujours à jour et performante.', emoji: '💻', gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', accent: '#7c3aed' },
]

const statCards = [
  { val: '50+',  label: 'Projets livrés',    icon: BarChart3,  color: '#4f8eff',  glow: 'rgba(79,142,255,0.25)' },
  { val: '5j',   label: 'Délai garanti',     icon: Clock,      color: '#a78bfa',  glow: 'rgba(167,139,250,0.25)' },
  { val: '98%',  label: 'Satisfaction',      icon: Star,       color: '#fbbf24',  glow: 'rgba(251,191,36,0.25)'  },
  { val: '3',    label: "Ans d'expérience",  icon: Trophy,     color: '#34d399',  glow: 'rgba(52,211,153,0.25)'  },
]

const faqs = [
  { q: 'Quelles sont vos heures de disponibilité ?',       a: 'Notre équipe est disponible du lundi au samedi, de 8h à 20h (heure de Yaoundé). Pour les urgences de soutenance, nous nous adaptons.' },
  { q: 'Comment se passe le paiement ?',                   a: "Le paiement se fait directement entre vous et notre équipe lors de l'appel de cadrage. Nous acceptons Mobile Money (Orange Money, MTN MoMo) et le virement." },
  { q: 'Puis-je voir des exemples avant de commander ?',   a: "Oui ! Consulte notre page \"Réalisations\" pour voir les projets que nous avons déjà livrés, ou demande à notre équipe de te partager des exemples lors de l'appel." },
  { q: 'Et si je ne suis pas satisfait du résultat ?',     a: "Une révision mineure est incluse. Si le rendu est très éloigné de ce qui a été discuté lors de l'appel de cadrage, nous travaillons avec toi pour corriger." },
]

/* ── FAQ Item ── */
function FaqItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      onClick={() => setOpen(o => !o)}
      className="rounded-2xl cursor-pointer overflow-hidden transition-all duration-300"
      style={{
        background: open ? 'rgba(79,142,255,0.06)' : 'rgba(255,255,255,0.04)',
        border: open ? '1px solid rgba(79,142,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
        boxShadow: open ? '0 8px 32px rgba(79,142,255,0.1)' : 'none',
      }}
    >
      <div className="flex items-center justify-between gap-4 px-6 py-5">
        <div className="flex items-center gap-3.5">
          <div
            className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-[11px] font-bold transition-all duration-300"
            style={{
              background: open ? 'rgba(79,142,255,0.2)' : 'rgba(255,255,255,0.08)',
              color: open ? '#4f8eff' : 'rgba(255,255,255,0.4)',
              fontFamily: 'monospace',
            }}
          >
            {String(idx + 1).padStart(2, '0')}
          </div>
          <span className="text-sm font-semibold text-white/85 leading-snug">{q}</span>
        </div>
        <div
          className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center transition-all duration-300"
          style={{ background: open ? '#4f8eff' : 'rgba(255,255,255,0.08)', transform: open ? 'rotate(45deg)' : 'none' }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <line x1="5" y1="0" x2="5" y2="10" stroke={open ? '#fff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="0" y1="5" x2="10" y2="5" stroke={open ? '#fff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <div style={{ maxHeight: open ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
        <p className="px-6 pb-5 pt-1 text-sm text-white/55 leading-relaxed border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>{a}</p>
      </div>
    </div>
  )
}

export default function AboutPage() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [cfErrors, setCfErrors] = useState<Record<string, string>>({})

  const handleContact = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!contactForm.name.trim()) errs.name = 'Requis'
    if (!contactForm.email.trim()) errs.email = 'Requis'
    if (!contactForm.message.trim()) errs.message = 'Requis'
    if (Object.keys(errs).length) { setCfErrors(errs); return }
    setSending(true)
    try { await supabase.from('contacts').insert([contactForm]) } catch {}
    await new Promise(r => setTimeout(r, 1000))
    setSent(true)
    setSending(false)
  }

  return (
    <div>
      <style>{`
        @keyframes pulseOrb { 0%,100%{opacity:0.25;transform:scale(1)} 50%{opacity:0.15;transform:scale(1.08)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes heroFade { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .orb-1 { animation: pulseOrb 7s ease-in-out infinite; }
        .orb-2 { animation: pulseOrb 9s ease-in-out infinite 2s; }
        .hero-anim { animation: heroFade 0.7s ease-out both; }
        .hero-anim-2 { animation: heroFade 0.7s ease-out 0.12s both; }
        .stat-ring { animation: spinSlow 18s linear infinite; }
        .value-card { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease; }
        .value-card:hover { transform: translateY(-6px); }
        .team-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .team-card:hover { transform: translateY(-5px); }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-32 pb-20 text-center"
        style={{ background: 'linear-gradient(150deg, #060918 0%, #0d1640 40%, #0a2448 70%, #071428 100%)' }}>
        <div className="orb-1 absolute w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', top: -150, left: -100, opacity: 0.25 }} />
        <div className="orb-2 absolute w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #0891b2 0%, transparent 70%)', bottom: -100, right: -100, opacity: 0.2 }} />

        <div className="relative z-10 max-w-4xl mx-auto px-8">
          <div className="hero-anim inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 glass-card-dark text-white/80">
            <Users size={12} /> Notre histoire
          </div>
          <h1 className="hero-anim-2 font-bold text-white leading-[1.05] mb-5" style={{ fontSize: 'clamp(2.5rem,6vw,4rem)' }}>
            Qui se cache derrière{' '}
            <span style={{ background: 'linear-gradient(135deg, #a5b4fc, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              SlidePro ?
            </span>
          </h1>
          <p className="text-white/55 leading-relaxed max-w-2xl mx-auto" style={{ fontSize: 17 }}>
            Nous sommes une équipe de designers et d'anciens étudiants qui comprennent le stress de la soutenance. Notre mission : te donner une présentation qui te donne confiance.
          </p>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5 badge-blue">
                <Lightbulb size={12} /> Notre mission
              </div>
              <h2 className="font-bold text-slate-900 mb-5" style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)' }}>
                Donner à chaque étudiant les armes visuelles pour réussir
              </h2>
              <p className="text-slate-500 leading-relaxed mb-4">
                Au Cameroun, de nombreux étudiants arrivent en soutenance avec des présentations PowerPoint basiques qui ne font pas honneur à des mois de travail. Nous avons créé SlidePro pour changer ça.
              </p>
              <p className="text-slate-500 leading-relaxed mb-6">
                Un mémoire bien présenté, c'est un jury déjà conquis avant même que tu commences à parler. C'est une mention supérieure. C'est la confiance pour défendre 5 ans d'études.
              </p>
              <div className="flex flex-col gap-3">
                {["50+ étudiants accompagnés depuis 2023", "Taux de satisfaction : 98%", "Opérationnel dans tout le Cameroun"].map(item => (
                  <div key={item} className="flex items-center gap-2 text-slate-700 text-sm">
                    <CheckCircle size={16} className="text-emerald-500 shrink-0" />{item}
                  </div>
                ))}
              </div>
            </div>

            {/* Stat grid */}
            <div className="grid grid-cols-2 gap-4">
              {statCards.map(({ val, label, icon: Icon, color, glow }) => (
                <div
                  key={label}
                  className="rounded-3xl p-6 text-center relative overflow-hidden transition-all duration-300 cursor-default"
                  style={{ background: 'linear-gradient(150deg, #0d1640 0%, #060918 100%)', border: `1px solid ${color}25` }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 16px 48px ${glow}` }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 0%, ${color}18 0%, transparent 60%)` }} />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                      style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                      <Icon size={20} style={{ color }} />
                    </div>
                    <div className="font-bold text-white leading-none mb-1" style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)' }}>{val}</div>
                    <div className="text-xs text-white/45">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #060918 0%, #0d1640 60%, #0a1e3a 100%)' }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.1]"
          style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 65%)', transform: 'translate(20%, -30%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-8">
          <div className="text-center mb-14">
            <div className="text-[10px] font-bold tracking-[3px] uppercase text-white/40 mb-3" style={{ fontFamily: 'monospace' }}>— Nos valeurs</div>
            <h2 className="font-bold text-white" style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>
              Ce qui nous{' '}
              <span style={{ background: 'linear-gradient(135deg, #a5b4fc, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>guide</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon: Icon, title, desc, accent, glow }, i) => (
              <div
                key={title}
                className="value-card rounded-2xl p-7"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${accent}0e`
                  e.currentTarget.style.borderColor = `${accent}35`
                  e.currentTarget.style.boxShadow = `0 16px 48px ${glow}`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div className="w-13 h-13 w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                  style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}>
                  <Icon size={22} style={{ color: accent }} />
                </div>
                <div className="text-[10px] font-bold tracking-[2px] mb-2" style={{ color: `${accent}80`, fontFamily: 'monospace' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-xs text-white/45 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium badge-blue mb-3">
              <Users size={12} /> L'équipe
            </div>
            <h2 className="font-bold text-slate-900 mb-2" style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>
              L'équipe <span className="gradient-text">SlidePro</span>
            </h2>
            <p className="text-slate-500 text-sm">Des passionnés qui travaillent pour ton succès</p>
          </div>
          <div className="grid md:grid-cols-2 gap-7">
            {team.map(({ name, role, bio, emoji, gradient, accent }) => (
              <div
                key={name}
                className="team-card rounded-3xl overflow-hidden bg-white"
                style={{ border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 20px 60px ${accent}20`; e.currentTarget.style.borderColor = `${accent}30` }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#e2e8f0' }}
              >
                {/* Gradient header */}
                <div className="h-36 flex items-center justify-center relative overflow-hidden" style={{ background: gradient }}>
                  <div className="stat-ring absolute w-40 h-40 rounded-full border border-white/10" style={{ top: -20, right: -20 }} />
                  <div className="absolute w-24 h-24 rounded-full border border-white/10" style={{ bottom: -10, left: -10 }} />
                  <span className="text-5xl relative z-10" style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.35))' }}>{emoji}</span>
                  {/* Glow dot */}
                  <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 8px rgba(52,211,153,0.8)' }} />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{name}</h3>
                  <div className="inline-block text-xs px-3 py-1 rounded-full font-semibold mb-4"
                    style={{ background: `${accent}10`, color: accent, border: `1px solid ${accent}20` }}>
                    {role}
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #060918 0%, #0d1640 60%, #0a1e3a 100%)' }}>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.1]"
          style={{ background: 'radial-gradient(circle, #4f8eff 0%, transparent 65%)', transform: 'translate(-20%, 30%)' }} />

        <div className="relative z-10 max-w-2xl mx-auto px-8">
          <div className="text-center mb-12">
            <div className="text-[10px] font-bold tracking-[3px] uppercase text-white/40 mb-3" style={{ fontFamily: 'monospace' }}>— Questions fréquentes</div>
            <h2 className="font-bold text-white" style={{ fontSize: 'clamp(2rem,4vw,2.8rem)' }}>
              Tu as des{' '}
              <span style={{ background: 'linear-gradient(135deg, #a5b4fc, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                questions ?
              </span>
            </h2>
          </div>
          <div className="flex flex-col gap-2.5">
            {faqs.map((faq, idx) => <FaqItem key={idx} {...faq} idx={idx} />)}
          </div>
          <div className="mt-8 flex items-center gap-3.5 px-5 py-4 rounded-2xl"
            style={{ background: 'rgba(79,142,255,0.06)', border: '1px solid rgba(79,142,255,0.18)' }}>
            <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center"
              style={{ background: 'rgba(79,142,255,0.15)' }}>
              <Phone size={16} style={{ color: '#4f8eff' }} />
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              Une autre question ?{' '}
              <strong style={{ color: '#4f8eff' }}>Contacte-nous directement</strong>
              {' '}— on répond dans les 2h en semaine.
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left info */}
            <div>
              <h2 className="font-bold text-slate-900 mb-4" style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)' }}>
                Contacte <span className="gradient-text">notre équipe</span>
              </h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                Tu as des questions avant de prendre rendez-vous ? N'hésite pas à nous écrire ou nous appeler directement.
              </p>
              <div className="space-y-5 mb-8">
                {[
                  { icon: Phone,  label: 'Téléphone',   value: '+237 6 73 84 68 13',             href: 'tel:+237673846813',          accent: '#4f46e5' },
                  { icon: Mail,   label: 'Email',        value: 'contact@slidePro.cm',          href: 'mailto:contact@slidePro.cm', accent: '#0891b2' },
                  { icon: MapPin, label: 'Localisation', value: 'Yaoundé, Cameroun (100% en ligne)', href: '#',                   accent: '#059669' },
                ].map(({ icon: Icon, label, value, href, accent }) => (
                  <a key={label} href={href}
                    className="flex items-start gap-4 group card-hover rounded-2xl p-4 border border-slate-100 bg-slate-50 block"
                    style={{ textDecoration: 'none' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${accent}25`; e.currentTarget.style.background = `${accent}06` }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.background = '#f8fafc' }}
                  >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all"
                      style={{ background: `${accent}12`, border: `1px solid ${accent}22` }}>
                      <Icon size={18} style={{ color: accent }} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</div>
                      <div className="text-slate-800 font-medium text-sm">{value}</div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="p-5 rounded-2xl text-white"
                style={{ background: 'linear-gradient(135deg, #1a1060 0%, #0d2e5c 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Star size={15} style={{ color: '#fde68a', fill: '#fde68a' }} />
                  <span className="text-sm font-bold">Horaires de réponse</span>
                </div>
                <p className="text-white/70 text-sm">Lun–Sam · 8h00–20h00</p>
                <p className="text-white/40 text-xs mt-1">Réponse garantie sous 24h ouvrables</p>
              </div>
            </div>

            {/* Right form */}
            <div className="rounded-3xl p-8 glass-card"
              style={{ boxShadow: '0 16px 48px rgba(37,99,235,0.08)' }}>
              {sent ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-float" style={{ background: '#dcfce7' }}>
                    <CheckCircle size={30} className="text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Message envoyé !</h3>
                  <p className="text-slate-500 text-sm">On te revient très bientôt.</p>
                </div>
              ) : (
                <form onSubmit={handleContact} className="space-y-5">
                  <h3 className="text-2xl font-bold text-slate-900 mb-5">Envoie-nous un message</h3>
                  {[
                    { label: 'Ton nom',   name: 'name',  type: 'text',  placeholder: 'Ex : Jean-Baptiste' },
                    { label: 'Ton email', name: 'email', type: 'email', placeholder: 'Ex : jean@email.com' },
                  ].map(({ label, name, type, placeholder }) => (
                    <div key={name}>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
                      <input
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        value={contactForm[name as keyof typeof contactForm]}
                        onChange={e => setContactForm(f => ({ ...f, [name]: e.target.value }))}
                        className="input-field w-full px-4 py-3 rounded-xl text-sm"
                        style={{ borderColor: cfErrors[name] ? '#f87171' : undefined }}
                      />
                      {cfErrors[name] && <p className="text-red-500 text-xs mt-1">{cfErrors[name]}</p>}
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ton message</label>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="Pose ta question ici..."
                      value={contactForm.message}
                      onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                      className="input-field w-full px-4 py-3 rounded-xl text-sm resize-none"
                      style={{ borderColor: cfErrors.message ? '#f87171' : undefined }}
                    />
                    {cfErrors.message && <p className="text-red-500 text-xs mt-1">{cfErrors.message}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm"
                    style={{ opacity: sending ? 0.8 : 1 }}
                  >
                    {sending ? <><Loader2 size={16} className="animate-spin" /> Envoi en cours...</> : <><Send size={16} /> Envoyer le message</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}