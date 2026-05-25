import { useState, useRef, type MouseEvent, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  X, Zap, ArrowRight, Award, Eye, Sparkles, ChevronRight,
  ChevronLeft, Play, Image, Info, Film, Loader2
} from 'lucide-react'

import {supabase} from '../services/supabase'

// ─── MOCK PORTFOLIO DATA ──────────────────────────────────────────────────────
const works = [
  {
    id: 1,
    title: "Impact du e-commerce sur le commerce de détail au Cameroun",
    field: "Commerce & Marketing", category: "management", level: "Master 2", university: "ESSEC Douala",
    slides: 22, gradient: "linear-gradient(135deg, #1d4ed8 0%, #0891b2 60%, #06b6d4 100%)", accent: "#06b6d4", icon: "🛒",
    tags: ["E-commerce", "Marketing digital", "Commerce"],
    highlights: ["Analyse comparative en infographies", "Graphiques de données animés", "Carte géographique interactive"],
    images: [
      "https://placehold.co/800x450/1d4ed8/ffffff?text=Slide+1+%E2%80%93+Titre",
      "https://placehold.co/800x450/0891b2/ffffff?text=Slide+2+%E2%80%93+Contexte",
      "https://placehold.co/800x450/06b6d4/ffffff?text=Slide+3+%E2%80%93+Analyse",
      "https://placehold.co/800x450/0284c7/ffffff?text=Slide+4+%E2%80%93+R%C3%A9sultats",
    ], videoUrl: "",
  },
  {
    id: 2,
    title: "Implémentation d'un système de gestion des stocks avec Python",
    field: "Informatique", category: "informatique", level: "Licence 3", university: "Université de Yaoundé I",
    slides: 18, gradient: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)", accent: "#9333ea", icon: "💻",
    tags: ["Python", "Gestion stocks", "Base de données"],
    highlights: ["Architecture système en schéma", "Captures d'écran de l'interface", "Diagrammes UML animés"],
    images: [
      "https://placehold.co/800x450/4f46e5/ffffff?text=Slide+1+%E2%80%93+Introduction",
      "https://placehold.co/800x450/7c3aed/ffffff?text=Slide+2+%E2%80%93+Architecture",
      "https://placehold.co/800x450/9333ea/ffffff?text=Slide+3+%E2%80%93+Impl%C3%A9mentation",
    ], videoUrl: "",
  },
  {
    id: 3,
    title: "Rôle du microcrédit dans le développement des PME rurales",
    field: "Finance & Économie", category: "finance", level: "Master 1", university: "Université de Dschang",
    slides: 20, gradient: "linear-gradient(135deg, #059669 0%, #0d9488 50%, #0891b2 100%)", accent: "#0d9488", icon: "💰",
    tags: ["Microfinance", "PME", "Développement rural"],
    highlights: ["Infographies d'impact", "Visualisation de données terrain", "Comparatifs avant/après"],
    images: [
      "https://placehold.co/800x450/059669/ffffff?text=Slide+1+%E2%80%93+Titre",
      "https://placehold.co/800x450/0d9488/ffffff?text=Slide+2+%E2%80%93+Contexte",
      "https://placehold.co/800x450/0891b2/ffffff?text=Slide+3+%E2%80%93+Impact",
    ], videoUrl: "",
  },
  {
    id: 4,
    title: "Stratégie de communication digitale pour les entreprises locales",
    field: "Communication", category: "management", level: "Licence Pro", university: "Institut Supérieur de Communication",
    slides: 16, gradient: "linear-gradient(135deg, #ea580c 0%, #d97706 50%, #ca8a04 100%)", accent: "#d97706", icon: "📱",
    tags: ["Communication digitale", "Réseaux sociaux", "Stratégie"],
    highlights: ["Moodboard visuel", "Statistiques animées", "Plan d'action visuel"],
    images: [
      "https://placehold.co/800x450/ea580c/ffffff?text=Slide+1+%E2%80%93+Titre",
      "https://placehold.co/800x450/d97706/ffffff?text=Slide+2+%E2%80%93+Strat%C3%A9gie",
    ], videoUrl: "",
  },
  {
    id: 5,
    title: "Analyse des facteurs de décrochage scolaire en zone urbaine",
    field: "Sciences de l'Éducation", category: "education", level: "Master 2", university: "ENS Yaoundé",
    slides: 24, gradient: "linear-gradient(135deg, #db2777 0%, #e11d48 50%, #dc2626 100%)", accent: "#e11d48", icon: "🎓",
    tags: ["Éducation", "Sociologie", "Analyse quantitative"],
    highlights: ["Graphiques d'enquête détaillés", "Cartes de zones d'impact", "Tableaux de corrélation"],
    images: [
      "https://placehold.co/800x450/db2777/ffffff?text=Slide+1+%E2%80%93+Titre",
      "https://placehold.co/800x450/e11d48/ffffff?text=Slide+2+%E2%80%93+Analyse",
      "https://placehold.co/800x450/dc2626/ffffff?text=Slide+3+%E2%80%93+R%C3%A9sultats",
    ], videoUrl: "",
  },
  {
    id: 6,
    title: "Optimisation de la chaîne logistique d'une entreprise agro-alimentaire",
    field: "Logistique & Supply Chain", category: "management", level: "Master 1", university: "IAI Cameroun",
    slides: 19, gradient: "linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #4f46e5 100%)", accent: "#2563eb", icon: "🏭",
    tags: ["Logistique", "Agro-alimentaire", "Optimisation"],
    highlights: ["Schémas de flux animés", "Tableaux de KPIs", "Carte de la chaîne d'approvisionnement"],
    images: [
      "https://placehold.co/800x450/0284c7/ffffff?text=Slide+1+%E2%80%93+Titre",
      "https://placehold.co/800x450/2563eb/ffffff?text=Slide+2+%E2%80%93+Cha%C3%AEne",
    ], videoUrl: "",
  },
  {
    id: 7,
    title: "Cybersécurité dans les institutions financières camerounaises",
    field: "Informatique & Sécurité", category: "informatique", level: "Master 2", university: "Université de Ngaoundéré",
    slides: 21, gradient: "linear-gradient(135deg, #1e293b 0%, #1e3a5f 50%, #1d4ed8 100%)", accent: "#1d4ed8", icon: "🔐",
    tags: ["Cybersécurité", "Finance", "Informatique"],
    highlights: ["Schémas d'architecture sécurisée", "Visualisation des menaces", "Recommandations en roadmap"],
    images: [
      "https://placehold.co/800x450/1e293b/ffffff?text=Slide+1+%E2%80%93+Titre",
      "https://placehold.co/800x450/1e3a5f/ffffff?text=Slide+2+%E2%80%93+Menaces",
      "https://placehold.co/800x450/1d4ed8/ffffff?text=Slide+3+%E2%80%93+Solutions",
    ], videoUrl: "",
  },
  {
    id: 8,
    title: "Gestion des ressources humaines et motivation au travail",
    field: "Ressources Humaines", category: "management", level: "Licence 3", university: "IRIC Yaoundé",
    slides: 17, gradient: "linear-gradient(135deg, #7c3aed 0%, #a21caf 50%, #c026d3 100%)", accent: "#a21caf", icon: "👥",
    tags: ["RH", "Management", "Motivation"],
    highlights: ["Pyramides de Maslow animées", "Résultats d'enquête RH", "Plan d'action illustré"],
    images: [
      "https://placehold.co/800x450/7c3aed/ffffff?text=Slide+1+%E2%80%93+Titre",
      "https://placehold.co/800x450/a21caf/ffffff?text=Slide+2+%E2%80%93+Motivation",
    ], videoUrl: "",
  },
  {
    id: 9,
    title: "Impact des énergies renouvelables sur l'accès à l'électricité rurale",
    field: "Génie Électrique & Développement", category: "science", level: "Master 2", university: "École Polytechnique de Yaoundé",
    slides: 25, gradient: "linear-gradient(135deg, #16a34a 0%, #059669 50%, #0d9488 100%)", accent: "#059669", icon: "☀️",
    tags: ["Énergies renouvelables", "Développement durable", "Génie civil"],
    highlights: ["Cartes d'accès à l'énergie", "Graphiques d'impact CO2", "Schémas techniques animés"],
    images: [
      "https://placehold.co/800x450/16a34a/ffffff?text=Slide+1+%E2%80%93+Titre",
      "https://placehold.co/800x450/059669/ffffff?text=Slide+2+%E2%80%93+Impact",
      "https://placehold.co/800x450/0d9488/ffffff?text=Slide+3+%E2%80%93+Solutions",
    ], videoUrl: "",
  },
]

const fallbackWorks = works

type PortfolioWork = (typeof works)[number]

// ─── TILT CARD ────────────────────────────────────────────────────────────────
function TiltCard({ work, onClick }: { work: PortfolioWork; onClick: () => void }) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const glowRef = useRef<HTMLDivElement | null>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    card.style.transform = `perspective(1000px) rotateX(${((y - cy) / cy) * -7}deg) rotateY(${((x - cx) / cx) * 7}deg) scale3d(1.03,1.03,1.03)`
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15) 0%, transparent 65%)`
    }
  }

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    if (glowRef.current) glowRef.current.style.background = 'transparent'
  }

  const hasImage = work.images && work.images.length > 0

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group cursor-pointer rounded-3xl overflow-hidden"
      style={{
        transition: 'transform 0.15s ease, box-shadow 0.3s ease',
        transformStyle: 'preserve-3d',
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        willChange: 'transform',
        background: '#fff',
        border: '1px solid rgba(255,255,255,0.9)',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 20px 60px ${work.accent}25` }}
    >
      {/* Thumbnail */}
      <div className="relative flex flex-col justify-between" style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
        {hasImage ? (
          <img src={work.images[0]} alt={work.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ background: work.gradient }} />
        )}
        {hasImage && <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }} />}
        {!hasImage && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full border border-white/10" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full border border-white/10" />
          </div>
        )}
        <div ref={glowRef} className="absolute inset-0 transition-all duration-200 pointer-events-none" />
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          style={{ background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(2px)' }}>
          <span className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.35)', backdropFilter: 'blur(8px)' }}>
            <Eye size={15} /> Voir le détail
          </span>
        </div>
        {/* Top row */}
        <div className="relative z-10 flex items-start justify-between p-5">
          <span className="text-3xl" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}>{work.icon}</span>
          <div className="flex items-center gap-2">
            {work.videoUrl && (
              <span className="text-white/90 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
                style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Film size={11} /> Vidéo
              </span>
            )}
            <span className="text-white/90 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
              style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Image size={11} /> {hasImage ? work.images.length : work.slides} slides
            </span>
          </div>
        </div>
        {/* Bottom info */}
        <div className="relative z-10 p-5">
          <div className="text-white/60 text-xs uppercase tracking-widest mb-1 font-medium">{work.field}</div>
          <div className="text-white font-bold text-base leading-snug line-clamp-2" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>{work.title}</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-white/65 text-xs">{work.level}</span>
            <span className="w-1 h-1 rounded-full bg-white/35" />
            <span className="text-white/65 text-xs truncate">{work.university}</span>
          </div>
        </div>
      </div>

      {/* Tags strip — style amélioré */}
      <div className="flex items-center gap-2 px-4 py-3 flex-wrap" style={{ background: '#fff' }}>
        {work.tags.slice(0, 2).map(t => (
          <span key={t} className="text-xs font-medium px-2.5 py-1 rounded-full transition-colors"
            style={{ background: `${work.accent}10`, color: work.accent, border: `1px solid ${work.accent}20` }}>
            {t}
          </span>
        ))}
        {work.tags.length > 2 && <span className="text-xs text-slate-400">+{work.tags.length - 2}</span>}
        {/* Slide count pill */}
        <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: '#f1f5f9', color: '#64748b' }}>
          {work.slides} slides
        </span>
      </div>
    </div>
  )
}

// ─── SLIDE CAROUSEL ───────────────────────────────────────────────────────────
function SlideCarousel({ images, accent }: { images: string[]; accent: string }) {
  const [idx, setIdx] = useState(0)
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length)
  const next = () => setIdx(i => (i + 1) % images.length)

  if (!images.length) return (
    <div className="flex flex-col items-center justify-center py-16 text-white/40 gap-3 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.1)' }}>
      <Image size={40} strokeWidth={1.2} />
      <p className="text-sm">Aucune image disponible pour ce projet</p>
    </div>
  )

  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9', background: '#0f172a' }}>
        <img key={idx} src={images[idx]} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover"
          style={{ animation: 'fadeInSlide 0.25s ease' }} />
        <style>{`@keyframes fadeInSlide{from{opacity:0;transform:scale(1.02)}to{opacity:1;transform:scale(1)}}`}</style>
        <div className="absolute top-3 right-3 text-xs font-bold text-white px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
          {idx + 1} / {images.length}
        </div>
        {images.length > 1 && (
          <>
            {[{ fn: prev, side: 'left-3', Icon: ChevronLeft }, { fn: next, side: 'right-3', Icon: ChevronRight }].map(({ fn, side, Icon }) => (
              <button key={side} onClick={fn}
                className={`absolute ${side} top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white transition-all`}
                style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
              >
                <Icon size={18} />
              </button>
            ))}
          </>
        )}
      </div>
      {images.length > 1 && (
        <>
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {images.map((src, i) => (
              <button key={i} onClick={() => setIdx(i)} className="flex-shrink-0 rounded-xl overflow-hidden transition-all"
                style={{ width: 72, height: 45, outline: i === idx ? `2.5px solid ${accent}` : '2.5px solid transparent', opacity: i === idx ? 1 : 0.5, transform: i === idx ? 'scale(1.05)' : 'scale(1)' }}>
                <img src={src} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-1.5 mt-3">
            {images.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className="rounded-full transition-all"
                style={{ width: i === idx ? 20 : 6, height: 6, background: i === idx ? accent : 'rgba(255,255,255,0.2)' }} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── VIDEO PLAYER ─────────────────────────────────────────────────────────────
function VideoPlayer({ videoUrl }: { videoUrl: string }) {
  if (!videoUrl) return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.1)' }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
        <Film size={28} style={{ color: '#6366f1' }} />
      </div>
      <div className="text-center">
        <p className="text-white/60 font-semibold text-sm mb-1">Aucune vidéo disponible</p>
        <p className="text-white/35 text-xs">La vidéo de présentation n'a pas encore été ajoutée</p>
      </div>
    </div>
  )
  const isYoutube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')
  const getYoutubeId = (url: string) => url.match(/(?:youtu\.be\/|v=|embed\/)([^&?/]+)/)?.[1] || ''
  return (
    <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9', background: '#000' }}>
      {isYoutube ? (
        <iframe src={`https://www.youtube.com/embed/${getYoutubeId(videoUrl)}?rel=0&modestbranding=1`}
          className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      ) : (
        <video src={videoUrl} controls className="w-full h-full" style={{ background: '#000' }} />
      )}
    </div>
  )
}

// ─── DETAIL MODAL ─────────────────────────────────────────────────────────────
function WorkModal({ work, onClose }: { work: PortfolioWork | null; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'info' | 'slides' | 'video'>('info')
  if (!work) return null

  const hasImages = work.images && work.images.length > 0
  const hasVideo = !!work.videoUrl
  const tabs = [
    { key: 'info' as const,   label: 'Aperçu', icon: Info },
    { key: 'slides' as const, label: 'Slides', icon: Image, badge: hasImages ? work.images.length : null },
    { key: 'video' as const,  label: 'Vidéo',  icon: Play },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
      style={{ background: 'rgba(2,6,23,0.9)', backdropFilter: 'blur(20px)' }}>
      <style>{`
        @keyframes slideUp { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes fadeModal { from{opacity:0;transform:scale(1.02)} to{opacity:1;transform:scale(1)} }
      `}</style>
      <div
        className="relative w-full sm:max-w-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #0d1640 0%, #060918 100%)',
          border: `1px solid ${work.accent}25`,
          borderRadius: '2rem 2rem 0 0',
          boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px ${work.accent}15`,
          animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Gradient hero header */}
        <div className="relative flex-shrink-0" style={{ background: work.gradient, padding: '1.5rem 1.75rem 1.25rem', minHeight: 110 }}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full border border-white/10" />
            <div className="absolute -bottom-4 -left-4 w-28 h-28 rounded-full border border-white/10" />
          </div>
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>{work.icon}</span>
              <div>
                <div className="text-white/60 text-xs uppercase tracking-widest mb-0.5">{work.field}</div>
                <div className="text-white font-bold text-base leading-snug max-w-md" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>{work.title}</div>
              </div>
            </div>
            <button onClick={onClose} className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}>
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex-shrink-0 px-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex gap-1">
            {tabs.map(({ key, label, icon: Icon, badge }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className="relative flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold transition-all"
                style={{
                  color: activeTab === key ? work.accent : 'rgba(255,255,255,0.35)',
                  borderBottom: activeTab === key ? `2.5px solid ${work.accent}` : '2.5px solid transparent',
                  marginBottom: -1,
                }}>
                <Icon size={14} />{label}
                {badge !== null && badge !== undefined && (
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: activeTab === key ? `${work.accent}20` : 'rgba(255,255,255,0.07)', color: activeTab === key ? work.accent : 'rgba(255,255,255,0.35)', fontSize: 10 }}>
                    {badge}
                  </span>
                )}
                {key === 'video' && hasVideo && <span className="w-1.5 h-1.5 rounded-full bg-red-400 absolute top-2.5 right-1" />}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: `${work.accent}30 transparent` }}>
          <div className="p-5">

            {activeTab === 'info' && (
              <div style={{ animation: 'fadeModal 0.2s ease' }}>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[['Niveau', work.level], ['Slides', `${work.slides}`], ['Établissement', work.university.split(' ').slice(0,2).join(' ')]].map(([label, value]) => (
                    <div key={label} className="text-center rounded-2xl py-3 px-2"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div className="text-xs text-white/40 mb-1">{label}</div>
                      <div className="text-xs font-bold text-white/80 leading-tight">{value}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {work.tags.map(t => (
                    <span key={t} className="text-xs font-semibold px-3 py-1.5 rounded-full"
                      style={{ background: `${work.accent}15`, color: work.accent }}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mb-5">
                  <div className="text-[10px] font-bold tracking-[2px] uppercase text-white/35 mb-3" style={{ fontFamily: 'monospace' }}>Ce que nous avons créé</div>
                  <ul className="space-y-2.5">
                    {work.highlights.map(h => (
                      <li key={h} className="flex items-start gap-3 text-sm text-white/60">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: `${work.accent}20` }}>
                          <span style={{ color: work.accent, fontSize: 10, fontWeight: 700 }}>✓</span>
                        </div>{h}
                      </li>
                    ))}
                  </ul>
                </div>
                {(hasImages || hasVideo) && (
                  <div className="flex gap-2 mb-5">
                    {hasImages && (
                      <button onClick={() => setActiveTab('slides')}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                        style={{ background: `${work.accent}10`, color: work.accent, border: `1px solid ${work.accent}20` }}
                        onMouseEnter={e => e.currentTarget.style.background = `${work.accent}20`}
                        onMouseLeave={e => e.currentTarget.style.background = `${work.accent}10`}>
                        <Image size={14} /> Voir les slides ({work.images.length})
                      </button>
                    )}
                    {hasVideo && (
                      <button onClick={() => setActiveTab('video')}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                        style={{ background: `${work.accent}10`, color: work.accent, border: `1px solid ${work.accent}20` }}
                        onMouseEnter={e => e.currentTarget.style.background = `${work.accent}20`}
                        onMouseLeave={e => e.currentTarget.style.background = `${work.accent}10`}>
                        <Play size={14} /> Voir la vidéo
                      </button>
                    )}
                  </div>
                )}
                <Link to="/rendez-vous" onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm transition-all"
                  style={{ background: work.gradient, boxShadow: `0 8px 24px ${work.accent}40` }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${work.accent}55` }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 8px 24px ${work.accent}40` }}>
                  <Zap size={15} /> Je veux le même pour moi <ChevronRight size={14} />
                </Link>
              </div>
            )}

            {activeTab === 'slides' && (
              <div style={{ animation: 'fadeModal 0.2s ease' }}>
                <SlideCarousel images={work.images} accent={work.accent} />
                <Link to="/rendez-vous" onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm transition-all mt-5"
                  style={{ background: work.gradient, boxShadow: `0 8px 24px ${work.accent}40` }}>
                  <Zap size={15} /> Je veux le même pour moi <ChevronRight size={14} />
                </Link>
              </div>
            )}

            {activeTab === 'video' && (
              <div style={{ animation: 'fadeModal 0.2s ease' }}>
                <VideoPlayer videoUrl={work.videoUrl} />
                <Link to="/rendez-vous" onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm transition-all mt-5"
                  style={{ background: work.gradient, boxShadow: `0 8px 24px ${work.accent}40` }}>
                  <Zap size={15} /> Je veux le même pour moi <ChevronRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function PortfolioPage() {
  const [works, setWorks] = useState<PortfolioWork[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedWork, setSelectedWork] = useState<PortfolioWork | null>(null)

  useEffect(() => {
    const fetchWorks = async () => {
      const { data } = await supabase
        .from('portfolio_works')
        .select('*, images:portfolio_slides(url, order)')
        .eq('published', true)
        .order('created_at', { ascending: false })
      if (data && data.length > 0) {
        const normalized = data.map((w: any) => ({
          ...w,
          images: (w.images || []).sort((a: any, b: any) => a.order - b.order).map((i: any) => i.url),
          tags: Array.isArray(w.tags) ? w.tags : [],
          highlights: Array.isArray(w.highlights) ? w.highlights : [],
        }))
        setWorks(normalized)
      } else {
        setWorks(fallbackWorks)
      }
      setLoading(false)
    }
    fetchWorks()
  }, [])

   const categories = [
    { key: 'all', label: 'Tous', count: works.length },
    { key: 'informatique', label: 'Informatique', count: works.filter(w => w.category === 'informatique').length },
    { key: 'management', label: 'Management', count: works.filter(w => w.category === 'management').length },
    { key: 'finance', label: 'Finance', count: works.filter(w => w.category === 'finance').length },
    { key: 'education', label: 'Education', count: works.filter(w => w.category === 'education').length },
    { key: 'science', label: 'Sciences', count: works.filter(w => w.category === 'science').length },
  ]

  const filtered = activeCategory === 'all' ? works : works.filter(w => w.category === activeCategory)

  return (
    <div>
      <style>{`
        @keyframes pulseOrb { 0%,100%{opacity:0.2;transform:scale(1)} 50%{opacity:0.1;transform:scale(1.06)} }
        @keyframes heroFade { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .orb-hero { animation: pulseOrb 8s ease-in-out infinite; }
        .hero-a { animation: heroFade 0.7s ease-out both; }
        .hero-b { animation: heroFade 0.7s ease-out 0.12s both; }
        .hero-c { animation: heroFade 0.7s ease-out 0.24s both; }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 overflow-hidden text-center"
        style={{ background: 'linear-gradient(150deg, #060918 0%, #0d1640 40%, #0a2448 70%, #071428 100%)' }}>
        <div className="orb-hero absolute w-[550px] h-[550px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', top: -200, left: -150, opacity: 0.2 }} />
        <div className="orb-hero absolute w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', bottom: -100, right: -100, opacity: 0.15, animationDelay: '2s' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-8">
          <div className="hero-a inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 glass-card-dark text-white/80">
            <Award size={12} /> Nos réalisations
          </div>
          <h1 className="hero-b font-bold text-white leading-[1.05] mb-5" style={{ fontSize: 'clamp(2.5rem,6vw,4rem)' }}>
            Des présentations qui ont{' '}
            <span style={{ background: 'linear-gradient(135deg, #a5b4fc, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              fait la différence
            </span>
          </h1>
          <p className="hero-c text-white/50 max-w-xl mx-auto mb-10 leading-relaxed" style={{ fontSize: 17 }}>
            Découvre les PowerPoints que nous avons créés pour d'autres étudiants. Clique sur une réalisation pour voir les slides.
          </p>

          {/* Stats bar */}
          <div className="hero-c inline-flex items-center gap-8 px-8 py-4 rounded-2xl glass-card-dark">
            {[
              { value: '9+',    label: 'Projets réalisés' },
              { value: '5 j',   label: 'Délai de livraison' },
              { value: '100%',  label: 'Clients satisfaits' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-bold text-white leading-none mb-0.5" style={{ fontSize: '1.6rem' }}>{value}</div>
                <div className="text-xs text-white/40">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FILTER TABS ── */}
      <section className="sticky top-16 lg:top-20 z-30"
        style={{ background: 'rgba(6,9,24,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-4" style={{ scrollbarWidth: 'none' }}>
            {categories.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className="whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all flex-shrink-0 flex items-center gap-2"
                style={activeCategory === key
                  ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }
                  : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.08)' }
                }
              >
                {label}
                <span className="text-xs opacity-60 font-normal">{count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── GRID ── */}
      <section className="py-16" style={{ background: 'linear-gradient(160deg, #060918 0%, #0a1229 100%)' }}>
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-white/35 text-sm mb-8">
            <span className="font-semibold text-white/60">{filtered.length}</span> réalisation{filtered.length > 1 ? 's' : ''}
          </p>
            {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 size={36} className="animate-spin" style={{ color: '#6366f1' }} />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(work => (
                <TiltCard key={work.id} work={work} onClick={() => setSelectedWork(work)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-24 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #312e81 0%, #4f46e5 40%, #0891b2 100%)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full border border-white/5 translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full border border-white/5 -translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="max-w-3xl mx-auto px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 glass-card-dark text-white/80">
            <Sparkles size={12} /> Prêt à impressionner ton jury ?
          </div>
          <h2 className="font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem,5vw,3rem)' }}>
            Tu veux le même pour ta soutenance ?
          </h2>
          <p className="mb-10 text-white/65" style={{ fontSize: 17 }}>
            Prends rendez-vous et reçois ta présentation en <strong className="text-white">5 jours</strong>.
          </p>
          <Link
            to="/rendez-vous"
            className="inline-flex items-center gap-3 font-bold text-base px-8 py-4 rounded-2xl transition-all"
            style={{ background: '#fff', color: '#4f46e5', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.25)' }}
          >
            <Zap size={18} /> Prendre rendez-vous <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {selectedWork && <WorkModal work={selectedWork} onClose={() => setSelectedWork(null)} />}
    </div>
  )
}