import { Link } from 'react-router-dom'
import {
  Zap, Clock, Award, ChevronRight, Star, ArrowRight,
  FileText, Wand2, Presentation, CheckCircle, Users, TrendingUp
} from 'lucide-react'

const stats = [
  { value: '72h', label: 'Délai maximum', icon: Clock },
  { value: '50+', label: 'Projets livrés', icon: Award },
  { value: '98%', label: 'Clients satisfaits', icon: Star },
  { value: '100%', label: 'Taux de réussite', icon: TrendingUp },
]

const processSteps = [
  {
    step: '01',
    title: 'Tu souscris & uploades ton rapport',
    desc: 'Remplis le formulaire en ligne et envoie ton document PDF directement via la plateforme.',
    icon: FileText,
    gradient: 'linear-gradient(135deg, #1d4ed8 0%, #0891b2 100%)',
    accent: '#1d4ed8',
  },
  {
    step: '02',
    title: 'Nous créons ta présentation',
    desc: 'Notre équipe conçoit un PowerPoint pro avec animations modernes et mise en page soignée.',
    icon: Wand2,
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    accent: '#4f46e5',
  },
  {
    step: '03',
    title: 'Tu reçois ton PPT en 72h',
    desc: 'Tu reçois ta présentation finale prête à présenter devant ton jury de soutenance.',
    icon: Presentation,
    gradient: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
    accent: '#059669',
  },
]

const recentWorks = [
  {
    title: "Analyse du système d'information bancaire",
    field: 'Informatique',
    level: 'Master 2',
    gradient: 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 100%)',
    accent: '#4f46e5',
    icon: '💻',
  },
  {
    title: 'Impact du microcrédit sur les PME',
    field: 'Finance',
    level: 'Licence 3',
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    accent: '#7c3aed',
    icon: '📊',
  },
  {
    title: 'Approche agile en gestion de projet',
    field: 'Management',
    level: 'Master 1',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
    accent: '#2563eb',
    icon: '🎯',
  },
]

const testimonials = [
  {
    name: 'Marie-Claire N.',
    univ: 'Université de Yaoundé I',
    text: 'Ma présentation était vraiment professionnelle. Le jury était impressionné !',
    rating: 5,
  },
  {
    name: 'Patrick A.',
    univ: 'Institut Supérieur de Management',
    text: 'Livré en 2 jours seulement, avec des animations super modernes. Je recommande à 100%.',
    rating: 5,
  },
  {
    name: 'Sandrine M.',
    univ: 'ESSEC Douala',
    text: "Rapport qualité-rapidité imbattable. J'ai eu mention très honorable à ma soutenance.",
    rating: 5,
  },
]

export default function HomePage() {
  return (
    <div className="font-body">
      {/* HERO */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden pt-20"
        style={{ background: 'linear-gradient(160deg, #f8faff 0%, #eef2ff 40%, #f0fdf4 100%)' }}
      >
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', opacity: 0.12, filter: 'blur(80px)', transform: 'translate(20%, -20%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', opacity: 0.12, filter: 'blur(60px)', transform: 'translate(-20%, 20%)' }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
                style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)' }}
              >
                <Zap size={13} />
                Délai garanti : 72 heures maximum
              </div>
              <h1 className="font-display font-bold text-slate-900 leading-[1.05] mb-6" style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)' }}>
                Ton mémoire,{' '}<br />
                <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  transformé en
                </span>
                <br />présentation parfaite
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
                Nous créons des PowerPoints professionnels, animés et percutants à partir de ton rapport de soutenance. Impressionne ton jury dès la première slide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/rendez-vous"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-white font-bold text-base transition-all"
                  style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #0891b2 100%)', boxShadow: '0 8px 32px rgba(99,102,241,0.35)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(99,102,241,0.45)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.35)' }}
                >
                  <Zap size={16} />Commencer maintenant
                </Link>
                <Link
                  to="/processus"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-semibold text-base transition-all"
                  style={{ background: 'rgba(255,255,255,0.8)', color: '#475569', border: '1.5px solid rgba(99,102,241,0.2)', backdropFilter: 'blur(8px)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; e.currentTarget.style.color = '#4f46e5' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'; e.currentTarget.style.color = '#475569' }}
                >
                  Voir comment ça marche<ChevronRight size={16} />
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-5 mt-10">
                {['Rendu en 72h', 'Animations professionnelles', 'Support inclus'].map(badge => (
                  <div key={badge} className="flex items-center gap-1.5 text-slate-500 text-sm">
                    <CheckCircle size={14} className="text-emerald-500" />{badge}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden lg:block">
              <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}@keyframes floatD{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
              <div className="relative" style={{ animation: 'float 4s ease-in-out infinite' }}>
                <div className="rounded-3xl p-1.5" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.95)', boxShadow: '0 32px 80px rgba(99,102,241,0.2), 0 8px 32px rgba(0,0,0,0.06)' }}>
                  <div className="rounded-[20px] overflow-hidden aspect-video flex flex-col justify-between p-8 relative" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 50%, #0891b2 100%)' }}>
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute top-4 right-4 w-32 h-32 rounded-full border border-white/10" />
                      <div className="absolute bottom-8 left-4 w-20 h-20 rounded-full border border-white/10" />
                    </div>
                    <div className="relative z-10">
                      <div className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-2">Université de Yaoundé I</div>
                      <h3 className="text-white font-bold text-xl leading-tight">Impact du e-commerce<br />sur le commerce traditionnel</h3>
                    </div>
                    <div className="relative z-10 flex items-end gap-2 h-16">
                      {[60, 85, 45, 90, 70].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: 'rgba(255,255,255,0.3)' }} />
                      ))}
                    </div>
                    <div className="relative z-10 flex items-center justify-between mt-4">
                      <div className="flex gap-1.5">
                        {[1,2,3,4,5].map(i => <div key={i} className="w-6 h-1 rounded-full" style={{ background: i===1?'#fff':'rgba(255,255,255,0.3)' }} />)}
                      </div>
                      <div className="text-blue-200 text-xs">Slide 1 / 18</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-6 rounded-2xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', animation: 'floatD 3.5s ease-in-out infinite' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#dcfce7' }}>
                      <CheckCircle size={16} className="text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Livré en 2 jours</div>
                      <div className="text-xs text-slate-400">Mention très honorable</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 rounded-2xl px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', animation: 'float 3.5s ease-in-out infinite', animationDelay: '1.5s' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⭐</span>
                    <div>
                      <div className="text-xs font-bold text-slate-800">4.9/5</div>
                      <div className="text-xs text-slate-400">50+ avis</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 relative overflow-hidden" style={{ background: '#0f172a' }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <Icon size={20} style={{ color: '#818cf8' }} />
                </div>
                <div className="font-bold text-4xl text-white mb-1">{value}</div>
                <div className="text-slate-400 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)' }}>
              <Zap size={13} />Simple & rapide
            </div>
            <h2 className="font-bold text-slate-900 mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Comment ça{' '}
              <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>fonctionne ?</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">Un processus simple en 3 étapes pour obtenir ta présentation parfaite</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {processSteps.map(({ step, title, desc, icon: Icon, gradient, accent }, i) => (
              <div key={step} className="relative">
                {i < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+3rem)] w-full h-0.5 z-0" style={{ background: 'linear-gradient(to right, rgba(99,102,241,0.3), transparent)' }} />
                )}
                <div
                  className="rounded-3xl p-8 text-center relative z-10 transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 16px 48px ${accent}20`; e.currentTarget.style.borderColor = `${accent}30` }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#e2e8f0' }}
                >
                  <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: accent }}>{step}</div>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 text-white" style={{ background: gradient }}>
                    <Icon size={28} />
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 mb-3">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/processus" className="inline-flex items-center gap-2 font-semibold transition-all" style={{ color: '#4f46e5' }}>
              Voir le processus détaillé <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* PORTFOLIO PREVIEW */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #f8faff 0%, #eef2ff 50%, #f0fdf4 100%)' }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', opacity: 0.08, filter: 'blur(60px)', transform: 'translate(30%, -30%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-16 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-3" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)' }}>
                <Award size={13} />Notre travail
              </div>
              <h2 className="font-bold text-slate-900" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                Réalisations{' '}
                <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>récentes</span>
              </h2>
            </div>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
              style={{ background: 'rgba(255,255,255,0.8)', color: '#4f46e5', border: '1.5px solid rgba(99,102,241,0.25)', backdropFilter: 'blur(8px)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.8)' }}
            >
              Voir tout <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {recentWorks.map(({ title, field, level, gradient, accent, icon }) => (
              <div
                key={title}
                className="rounded-3xl overflow-hidden cursor-pointer group transition-all duration-300"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 16px 48px ${accent}25` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)' }}
              >
                <div className="relative aspect-video flex flex-col justify-between p-6" style={{ background: gradient }}>
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-3 right-3 w-20 h-20 rounded-full border border-white/10" />
                    <div className="absolute bottom-3 left-3 w-12 h-12 rounded-full border border-white/10" />
                  </div>
                  <div className="text-4xl relative z-10" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}>{icon}</div>
                  <div className="relative z-10">
                    <div className="text-white/60 text-xs uppercase tracking-widest mb-1 font-medium">{field}</div>
                    <div className="text-white font-bold text-sm leading-snug" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}>{title}</div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(2px)' }}>
                    <span className="text-white text-sm font-semibold px-4 py-2 rounded-full" style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.35)', backdropFilter: 'blur(8px)' }}>Voir le détail →</span>
                  </div>
                </div>
                <div className="bg-white px-4 py-3 flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: '#f1f5f9', color: '#475569' }}>{field}</span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: '#f1f5f9', color: '#475569' }}>{level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 relative overflow-hidden" style={{ background: '#0f172a' }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #60a5fa 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', opacity: 0.08, filter: 'blur(60px)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <h2 className="font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Ce que disent nos{' '}
              <span style={{ background: 'linear-gradient(135deg, #a5b4fc, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>étudiants</span>
            </h2>
            <p className="text-slate-400 text-lg">Des résultats concrets, des jurys impressionnés</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, univ, text, rating }) => (
              <div
                key={name}
                className="rounded-3xl p-7 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: rating }).map((_, i) => <Star key={i} size={14} style={{ color: '#fbbf24', fill: '#fbbf24' }} />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #4f46e5, #0891b2)' }}>
                    {name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{name}</div>
                    <div className="text-slate-500 text-xs">{univ}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #312e81 0%, #4f46e5 40%, #0891b2 100%)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full border border-white/5 translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full border border-white/5 -translate-x-1/4 translate-y-1/4" />
          <div className="absolute top-0 left-0 w-80 h-80 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', filter: 'blur(60px)', transform: 'translate(-20%, -30%)' }} />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', filter: 'blur(80px)', transform: 'translate(20%, 30%)' }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }}>
            <Users size={13} />Rejoins 50+ étudiants satisfaits
          </div>
          <h2 className="font-bold text-white mb-6 leading-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>Prêt à épater ton jury ?</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
            Prends rendez-vous maintenant et reçois ta présentation professionnelle en moins de <strong className="text-white">72 heures</strong>.
          </p>
          <Link
            to="/rendez-vous"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all"
            style={{ background: '#fff', color: '#4f46e5', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.25)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)' }}
          >
            <Zap size={16} />Prendre rendez-vous gratuitement<ArrowRight size={16} />
          </Link>
          <p className="text-blue-200 text-sm mt-4">Aucun paiement immédiat — on vous contacte d'abord</p>
        </div>
      </section>
    </div>
  )
}