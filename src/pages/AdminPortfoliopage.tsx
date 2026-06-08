import { useState, useEffect, useRef, type DragEvent } from 'react'
import {
  Plus, Trash2, Upload, X, Save, Loader2,
  AlertCircle, Image, Edit3, ChevronDown,
  Eye, EyeOff, LogOut, Layers, Users,
  FileText, Phone, Mail, GraduationCap,
  CheckCircle, Clock, XCircle, RefreshCw,
  ExternalLink, Calendar, BookOpen
} from 'lucide-react'
import { supabase } from '../services/supabase'

// ─── AUTH GUARD ───────────────────────────────────────────────────────────────
function useAdminAuth() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => subscription.unsubscribe()
  }, [])

  return { session, loading }
}

// ─── TYPES ────────────────────────────────────────────────────────────────────
type SlideImage = { url: string; order: number }

type WorkForm = {
  id?: string
  title: string; field: string; category: string; level: string
  university: string; slides: number; gradient: string; accent: string
  icon: string; tags: string; highlights: string; video_url: string
  published: boolean
}

type Work = WorkForm & { id: string; images: SlideImage[]; created_at: string }

type Reservation = {
  id: string
  created_at: string
  full_name: string
  phone: string
  email: string
  university: string
  field: string
  level: string
  thesis_title: string
  defense_date: string
  file_url: string | null
  status: string
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const CATEGORIES = ['management', 'informatique', 'finance', 'education', 'science', 'autre']
const LEVELS = ['Licence 1', 'Licence 2', 'Licence 3', 'Licence Pro', 'Master 1', 'Master 2', 'Doctorat', 'BTS', 'HND']
const GRADIENTS = [
  { label: 'Bleu–Cyan',       value: 'linear-gradient(135deg, #1d4ed8 0%, #0891b2 60%, #06b6d4 100%)', accent: '#06b6d4' },
  { label: 'Indigo–Violet',   value: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)', accent: '#9333ea' },
  { label: 'Vert–Teal',       value: 'linear-gradient(135deg, #059669 0%, #0d9488 50%, #0891b2 100%)', accent: '#0d9488' },
  { label: 'Orange–Ambre',    value: 'linear-gradient(135deg, #ea580c 0%, #d97706 50%, #ca8a04 100%)', accent: '#d97706' },
  { label: 'Rose–Rouge',      value: 'linear-gradient(135deg, #db2777 0%, #e11d48 50%, #dc2626 100%)', accent: '#e11d48' },
  { label: 'Bleu–Indigo',     value: 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #4f46e5 100%)', accent: '#2563eb' },
  { label: 'Navy–Bleu',       value: 'linear-gradient(135deg, #1e293b 0%, #1e3a5f 50%, #1d4ed8 100%)', accent: '#1d4ed8' },
  { label: 'Violet–Fuchsia',  value: 'linear-gradient(135deg, #7c3aed 0%, #a21caf 50%, #c026d3 100%)', accent: '#a21caf' },
  { label: 'Vert vif',        value: 'linear-gradient(135deg, #16a34a 0%, #059669 50%, #0d9488 100%)', accent: '#059669' },
]

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
  pending:    { label: 'En attente',  color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',   border: 'rgba(251,191,36,0.25)',  icon: Clock },
  en_cours:   { label: 'En cours',    color: '#4f8eff', bg: 'rgba(79,142,255,0.1)',   border: 'rgba(79,142,255,0.25)',  icon: RefreshCw },
  livre:      { label: 'Livré',       color: '#34d399', bg: 'rgba(52,211,153,0.1)',   border: 'rgba(52,211,153,0.25)', icon: CheckCircle },
  annule:     { label: 'Annulé',      color: '#f87171', bg: 'rgba(248,113,113,0.1)',  border: 'rgba(248,113,113,0.25)', icon: XCircle },
}

const emptyForm = (): WorkForm => ({
  title: '', field: '', category: 'management', level: 'Master 2',
  university: '', slides: 20,
  gradient: GRADIENTS[0].value, accent: GRADIENTS[0].accent,
  icon: '📊', tags: '', highlights: '', video_url: '', published: false,
})

// ─── IMAGE DROPZONE ───────────────────────────────────────────────────────────
function ImageDropzone({ workId, images, onImagesChange, accent }: {
  workId: string; images: SlideImage[]; onImagesChange: (imgs: SlideImage[]) => void; accent: string
}) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFiles = async (files: File[]) => {
    const imgs = files.filter(f => f.type.startsWith('image/'))
    if (!imgs.length) return
    setUploading(true); setProgress(0)
    const uploaded: SlideImage[] = []
    for (let i = 0; i < imgs.length; i++) {
      const file = imgs[i]
      const path = `portfolio/${workId}/slide_${Date.now()}_${i}.${file.name.split('.').pop()}`
      const { error } = await supabase.storage.from('portfolio-slides').upload(path, file, { contentType: file.type, upsert: false })
      if (!error) {
        const { data } = supabase.storage.from('portfolio-slides').getPublicUrl(path)
        uploaded.push({ url: data.publicUrl, order: images.length + i })
      }
      setProgress(Math.round(((i + 1) / imgs.length) * 100))
    }
    if (uploaded.length) {
      const newImgs = [...images, ...uploaded]
      await supabase.from('portfolio_slides').insert(uploaded.map(img => ({ work_id: workId, url: img.url, order: img.order })))
      onImagesChange(newImgs)
    }
    setUploading(false)
  }

  const removeImage = async (img: SlideImage) => {
    const path = img.url.split('/portfolio-slides/')[1]
    await supabase.storage.from('portfolio-slides').remove([path])
    await supabase.from('portfolio_slides').delete().eq('work_id', workId).eq('url', img.url)
    onImagesChange(images.filter(i => i.url !== img.url))
  }

  const moveImage = async (from: number, to: number) => {
    if (to < 0 || to >= images.length) return
    const reordered = [...images]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)
    const updated = reordered.map((img, idx) => ({ ...img, order: idx }))
    onImagesChange(updated)
    for (const img of updated) await supabase.from('portfolio_slides').update({ order: img.order }).eq('url', img.url).eq('work_id', workId)
  }

  return (
    <div>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragging(false); uploadFiles(Array.from(e.dataTransfer.files)) }}
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-3 rounded-2xl p-8 cursor-pointer transition-all duration-200"
        style={{ border: `2px dashed ${dragging ? accent : 'rgba(255,255,255,0.15)'}`, background: dragging ? `${accent}08` : 'rgba(255,255,255,0.03)', minHeight: 120 }}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => uploadFiles(Array.from(e.target.files || []))} />
        {uploading ? (
          <div className="text-center">
            <Loader2 size={24} className="animate-spin mx-auto mb-2" style={{ color: accent }} />
            <p className="text-sm text-white/60">Upload… {progress}%</p>
            <div className="mt-2 rounded-full overflow-hidden" style={{ width: 160, height: 4, background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: accent }} />
            </div>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${accent}15`, border: `1px solid ${accent}25` }}>
              <Upload size={22} style={{ color: accent }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white/70">Glisse tes PNG ici ou clique</p>
              <p className="text-xs text-white/35 mt-0.5">PNG, JPG — plusieurs fichiers</p>
            </div>
          </>
        )}
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {images.sort((a, b) => a.order - b.order).map((img, i) => (
            <div key={img.url} className="relative group rounded-xl overflow-hidden" style={{ aspectRatio: '16/9', background: '#0f172a' }}>
              <img src={img.url} alt={`Slide ${i + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-1">
                <div className="flex items-center gap-1">
                  <button onClick={() => moveImage(i, i - 1)} disabled={i === 0} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors disabled:opacity-30">
                    <ChevronDown size={14} style={{ transform: 'rotate(180deg)' }} />
                  </button>
                  <button onClick={() => moveImage(i, i + 1)} disabled={i === images.length - 1} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors disabled:opacity-30">
                    <ChevronDown size={14} />
                  </button>
                  <button onClick={() => removeImage(img)} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
                <span className="text-white/50 text-xs">Slide {i + 1}</span>
              </div>
              <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center" style={{ background: accent, color: '#fff', fontSize: 10 }}>{i + 1}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── WORK FORM MODAL ──────────────────────────────────────────────────────────
function WorkFormModal({ work, onClose, onSaved }: { work: Work | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!work?.id
  const [form, setForm] = useState<WorkForm>(work ? {
    title: work.title, field: work.field, category: work.category, level: work.level,
    university: work.university, slides: work.slides, gradient: work.gradient, accent: work.accent,
    icon: work.icon,
    tags: Array.isArray(work.tags) ? (work.tags as unknown as string[]).join(', ') : work.tags,
    highlights: Array.isArray(work.highlights) ? (work.highlights as unknown as string[]).join('\n') : work.highlights,
    video_url: work.video_url || '', published: work.published,
  } : emptyForm())
  const [images, setImages] = useState<SlideImage[]>(work?.images || [])
  const [saving, setSaving] = useState(false)
  const [workId, setWorkId] = useState<string>(work?.id || '')
  const [error, setError] = useState('')

  const selectedGradient = GRADIENTS.find(g => g.value === form.gradient) || GRADIENTS[0]
  const f = (key: keyof WorkForm, val: string | number | boolean) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSave = async () => {
    if (!form.title.trim() || !form.field.trim()) { setError('Titre et filière sont requis'); return }
    setSaving(true); setError('')
    const payload = {
      title: form.title.trim(), field: form.field.trim(), category: form.category,
      level: form.level, university: form.university.trim(), slides: Number(form.slides),
      gradient: form.gradient, accent: selectedGradient.accent, icon: form.icon.trim() || '📊',
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      highlights: form.highlights.split('\n').map(h => h.trim()).filter(Boolean),
      video_url: form.video_url.trim(), published: form.published,
    }
    try {
      if (isEdit) {
        await supabase.from('portfolio_works').update(payload).eq('id', work!.id)
      } else {
        const { data, error: err } = await supabase.from('portfolio_works').insert([payload]).select().single()
        if (err) throw err
        setWorkId(data.id)
      }
      onSaved()
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de la sauvegarde')
    } finally { setSaving(false) }
  }

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all"
  const inputStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }
  const labelCls = "block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,6,23,0.92)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl flex flex-col"
        style={{ background: 'linear-gradient(160deg, #0d1640 0%, #060918 100%)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="font-bold text-white text-xl">{isEdit ? 'Modifier le projet' : 'Nouveau projet'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className={labelCls}>Couleur du projet</label>
            <div className="flex flex-wrap gap-2">
              {GRADIENTS.map(g => (
                <button key={g.value} onClick={() => { f('gradient', g.value); f('accent', g.accent) }}
                  className="w-9 h-9 rounded-xl transition-all"
                  style={{ background: g.value, border: form.gradient === g.value ? '2.5px solid #fff' : '2.5px solid transparent', boxShadow: form.gradient === g.value ? `0 0 0 1px ${g.accent}` : 'none', transform: form.gradient === g.value ? 'scale(1.15)' : 'scale(1)' }}
                  title={g.label} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-3">
            <div><label className={labelCls}>Icône</label><input value={form.icon} onChange={e => f('icon', e.target.value)} className={inputCls} style={inputStyle} placeholder="📊" /></div>
            <div><label className={labelCls}>Titre du mémoire *</label><input value={form.title} onChange={e => f('title', e.target.value)} className={inputCls} style={inputStyle} placeholder="Ex : Impact du e-commerce..." /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>Filière *</label><input value={form.field} onChange={e => f('field', e.target.value)} className={inputCls} style={inputStyle} placeholder="Ex : Commerce & Marketing" /></div>
            <div><label className={labelCls}>Catégorie</label><select value={form.category} onChange={e => f('category', e.target.value)} className={inputCls} style={{ ...inputStyle, appearance: 'none' }}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>Niveau</label><select value={form.level} onChange={e => f('level', e.target.value)} className={inputCls} style={{ ...inputStyle, appearance: 'none' }}>{LEVELS.map(l => <option key={l} value={l}>{l}</option>)}</select></div>
            <div><label className={labelCls}>Université</label><input value={form.university} onChange={e => f('university', e.target.value)} className={inputCls} style={inputStyle} placeholder="Ex : Université de Yaoundé I" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>Nombre de slides</label><input type="number" value={form.slides} onChange={e => f('slides', e.target.value)} className={inputCls} style={inputStyle} min={1} max={100} /></div>
            <div><label className={labelCls}>URL vidéo (optionnel)</label><input value={form.video_url} onChange={e => f('video_url', e.target.value)} className={inputCls} style={inputStyle} placeholder="YouTube URL..." /></div>
          </div>
          <div><label className={labelCls}>Tags <span className="text-white/30 font-normal normal-case">(séparés par virgule)</span></label><input value={form.tags} onChange={e => f('tags', e.target.value)} className={inputCls} style={inputStyle} placeholder="E-commerce, Marketing digital..." /></div>
          <div><label className={labelCls}>Points forts <span className="text-white/30 font-normal normal-case">(un par ligne)</span></label><textarea value={form.highlights} onChange={e => f('highlights', e.target.value)} rows={3} className={inputCls} style={{ ...inputStyle, resize: 'none' }} /></div>
          <div className="flex items-center justify-between px-4 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div><div className="text-sm font-semibold text-white/80">Publié</div><div className="text-xs text-white/40 mt-0.5">Visible par les visiteurs</div></div>
            <button onClick={() => f('published', !form.published)} className="relative w-12 h-6 rounded-full transition-all duration-200" style={{ background: form.published ? '#34d399' : 'rgba(255,255,255,0.12)' }}>
              <span className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200" style={{ left: form.published ? 28 : 4 }} />
            </button>
          </div>
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}
          <button onClick={handleSave} disabled={saving} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm transition-all" style={{ background: 'linear-gradient(135deg, #4f8eff, #7c3aed)', boxShadow: '0 8px 24px rgba(79,142,255,0.3)', opacity: saving ? 0.7 : 1 }}>
            {saving ? <><Loader2 size={16} className="animate-spin" /> Sauvegarde...</> : <><Save size={16} /> {isEdit ? 'Enregistrer' : 'Créer le projet'}</>}
          </button>
          {(workId || isEdit) && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.1)' }} />
                <label className={labelCls + ' mb-0'}>Slides (images)</label>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
              </div>
              <ImageDropzone workId={workId || work!.id} images={images} onImagesChange={setImages} accent={selectedGradient.accent} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const Icon = cfg.icon
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
      <Icon size={10} /> {cfg.label}
    </span>
  )
}

// ─── RESERVATION DETAIL MODAL ─────────────────────────────────────────────────
function ReservationModal({ res, onClose, onStatusChange }: {
  res: Reservation; onClose: () => void; onStatusChange: (id: string, status: string) => void
}) {
  const [updating, setUpdating] = useState(false)

  const handleStatus = async (newStatus: string) => {
    setUpdating(true)
    await supabase.from('reservations').update({ status: newStatus }).eq('id', res.id)
    onStatusChange(res.id, newStatus)
    setUpdating(false)
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,6,23,0.92)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl"
        style={{ background: 'linear-gradient(160deg, #0d1640 0%, #060918 100%)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div>
            <h2 className="font-bold text-white text-lg">{res.full_name}</h2>
            <p className="text-white/40 text-xs mt-0.5">{formatDate(res.created_at)}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"><X size={16} /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Contact */}
          <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-[10px] font-bold tracking-[2px] uppercase text-white/35 mb-2" style={{ fontFamily: 'monospace' }}>Contact</div>
            {[
              { icon: Phone, label: res.phone, href: `tel:${res.phone}` },
              { icon: Mail, label: res.email, href: `mailto:${res.email}` },
            ].map(({ icon: Icon, label, href }) => (
              <a key={href} href={href} className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(79,142,255,0.12)' }}>
                  <Icon size={13} style={{ color: '#4f8eff' }} />
                </div>
                {label}
              </a>
            ))}
          </div>

          {/* Cursus */}
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-[10px] font-bold tracking-[2px] uppercase text-white/35 mb-3" style={{ fontFamily: 'monospace' }}>Cursus académique</div>
            {[
              { icon: GraduationCap, label: 'Établissement', value: res.university },
              { icon: BookOpen,      label: 'Filière',        value: res.field },
              { icon: GraduationCap, label: 'Niveau',          value: res.level },
              { icon: Calendar,      label: 'Soutenance',      value: res.defense_date ? formatDate(res.defense_date) : '—' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 py-2 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <Icon size={13} className="mt-0.5 shrink-0" style={{ color: '#a78bfa' }} />
                <div>
                  <div className="text-[10px] text-white/35 uppercase tracking-wider">{label}</div>
                  <div className="text-sm text-white/80 font-medium mt-0.5">{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Titre mémoire */}
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-[10px] font-bold tracking-[2px] uppercase text-white/35 mb-2" style={{ fontFamily: 'monospace' }}>Titre du mémoire</div>
            <p className="text-sm text-white/80 font-medium leading-relaxed">{res.thesis_title}</p>
          </div>

          {/* Fichier PDF */}
          <div className="rounded-2xl p-4" style={{
            background: res.file_url ? 'rgba(52,211,153,0.06)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${res.file_url ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.08)'}`,
          }}>
            <div className="text-[10px] font-bold tracking-[2px] uppercase mb-3" style={{ fontFamily: 'monospace', color: res.file_url ? 'rgba(52,211,153,0.6)' : 'rgba(255,255,255,0.35)' }}>Rapport PDF</div>
            {res.file_url ? (
              <a href={res.file_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm font-semibold transition-all"
                style={{ color: '#34d399' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.15)' }}>
                  <FileText size={16} style={{ color: '#34d399' }} />
                </div>
                <span className="flex-1">Ouvrir le rapport</span>
                <ExternalLink size={14} />
              </a>
            ) : (
              <div className="flex items-center gap-3 text-sm text-white/40">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <FileText size={16} style={{ color: 'rgba(255,255,255,0.25)' }} />
                </div>
                Aucun fichier envoyé
              </div>
            )}
          </div>

          {/* Statut */}
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-[10px] font-bold tracking-[2px] uppercase text-white/35 mb-3" style={{ fontFamily: 'monospace' }}>Changer le statut</div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                const Icon = cfg.icon
                const isActive = res.status === key
                return (
                  <button key={key} onClick={() => handleStatus(key)} disabled={updating || isActive}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: isActive ? cfg.bg : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isActive ? cfg.border : 'rgba(255,255,255,0.08)'}`,
                      color: isActive ? cfg.color : 'rgba(255,255,255,0.45)',
                      opacity: updating ? 0.6 : 1,
                    }}>
                    <Icon size={12} /> {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── RESERVATIONS TAB ─────────────────────────────────────────────────────────
function ReservationsTab() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Reservation | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const fetch = async () => {
    setLoading(true)
    const { data } = await supabase.from('reservations').select('*').order('created_at', { ascending: false })
    setReservations((data || []) as Reservation[])
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  const handleStatusChange = (id: string, status: string) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev)
  }

  const filtered = filterStatus === 'all' ? reservations : reservations.filter(r => r.status === filterStatus)

  const counts: Record<string, number> = {
    all: reservations.length,
    ...Object.fromEntries(Object.keys(STATUS_CONFIG).map(k => [k, reservations.filter(r => r.status === k).length]))
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div>
      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button onClick={() => setFilterStatus('all')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
          style={filterStatus === 'all' ? { background: 'rgba(255,255,255,0.12)', color: '#fff' } : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
          Toutes <span className="opacity-60">{counts.all}</span>
        </button>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <button key={key} onClick={() => setFilterStatus(key)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
            style={filterStatus === key
              ? { background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }
              : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {cfg.label} <span className="opacity-60">{counts[key] ?? 0}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin" style={{ color: '#4f8eff' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 rounded-3xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <Users size={48} className="mx-auto mb-4 text-white/20" />
          <p className="text-white/50 text-lg font-semibold mb-1">Aucune réservation</p>
          <p className="text-white/30 text-sm">Les demandes de rendez-vous apparaîtront ici</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((res, i) => {
            const hasPdf = !!res.file_url
            return (
              <div
                key={res.id}
                onClick={() => setSelected(res)}
                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  animation: `fadeIn 0.3s ease ${i * 0.04}s both`,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #4f8eff22, #7c3aed22)', border: '1px solid rgba(79,142,255,0.2)', color: '#a78bfa' }}>
                  {res.full_name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-white/90 truncate">{res.full_name}</span>
                    <StatusBadge status={res.status} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/35 flex-wrap">
                    <span className="truncate max-w-[200px]">{res.thesis_title}</span>
                    <span>·</span>
                    <span>{res.level}</span>
                    <span>·</span>
                    <span>{formatDate(res.created_at)}</span>
                  </div>
                </div>

                {/* PDF indicator */}
                <div className="shrink-0 flex items-center gap-2">
                  <div
                    className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg"
                    style={hasPdf
                      ? { background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }
                      : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.08)' }
                    }
                  >
                    <FileText size={11} />
                    {hasPdf ? 'PDF reçu' : 'Pas de PDF'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selected && (
        <ReservationModal
          res={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}

// ─── PORTFOLIO TAB ────────────────────────────────────────────────────────────
function PortfolioTab() {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Work | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchWorks = async () => {
    setLoading(true)
    const { data } = await supabase.from('portfolio_works').select('*, images:portfolio_slides(url, order)').order('created_at', { ascending: false })
    setWorks((data || []) as Work[])
    setLoading(false)
  }

  useEffect(() => { fetchWorks() }, [])

  const openNew = () => { setEditing(null); setShowModal(true) }
  const openEdit = (w: Work) => { setEditing(w); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditing(null) }

  const deleteWork = async (id: string) => {
    if (!confirm('Supprimer ce projet et toutes ses images ?')) return
    setDeleting(id)
    await supabase.from('portfolio_slides').delete().eq('work_id', id)
    await supabase.from('portfolio_works').delete().eq('id', id)
    setDeleting(null)
    fetchWorks()
  }

  const togglePublished = async (w: Work) => {
    await supabase.from('portfolio_works').update({ published: !w.published }).eq('id', w.id)
    fetchWorks()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/40 text-sm">{works.length} projet{works.length > 1 ? 's' : ''} · {works.filter(w => w.published).length} publiés</p>
        <button onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all"
          style={{ background: 'linear-gradient(135deg, #4f8eff, #7c3aed)', boxShadow: '0 8px 24px rgba(79,142,255,0.3)' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <Plus size={16} /> Nouveau projet
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 size={32} className="animate-spin" style={{ color: '#4f8eff' }} /></div>
      ) : works.length === 0 ? (
        <div className="text-center py-24 rounded-3xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <Image size={48} className="mx-auto mb-4 text-white/20" />
          <p className="text-white/50 text-lg font-semibold mb-1">Aucun projet</p>
          <button onClick={openNew} className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold text-sm" style={{ background: 'linear-gradient(135deg, #4f8eff, #7c3aed)' }}>
            <Plus size={16} /> Créer un projet
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {works.map((work, i) => (
            <div key={work.id}
              className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', animation: `fadeIn 0.3s ease ${i * 0.05}s both` }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}>
              <div className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-2xl" style={{ background: work.gradient }}>{work.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-white/90 truncate">{work.title}</span>
                  {work.published
                    ? <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}>Publié</span>
                    : <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>Brouillon</span>
                  }
                </div>
                <div className="flex items-center gap-3 text-xs text-white/35">
                  <span>{work.level}</span><span>·</span><span>{work.field}</span><span>·</span>
                  <span className="flex items-center gap-1"><Image size={11} /> {work.images?.length || 0} slides</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => togglePublished(work)} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all" style={{ background: 'rgba(255,255,255,0.06)', color: work.published ? '#34d399' : 'rgba(255,255,255,0.35)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
                  {work.published ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button onClick={() => openEdit(work)} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all text-white/50 hover:text-white" style={{ background: 'rgba(255,255,255,0.06)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(79,142,255,0.15)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
                  <Edit3 size={14} />
                </button>
                <button onClick={() => deleteWork(work.id)} disabled={deleting === work.id} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all text-red-400/60 hover:text-red-400" style={{ background: 'rgba(255,255,255,0.06)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
                  {deleting === work.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && <WorkFormModal work={editing} onClose={closeModal} onSaved={fetchWorks} />}
    </div>
  )
}

// ─── MAIN ADMIN DASHBOARD ─────────────────────────────────────────────────────
function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'reservations' | 'portfolio'>('reservations')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email || ''))
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/sp-admin-x7'
  }

  const tabs = [
    { key: 'reservations' as const, label: 'Réservations', icon: Users },
    { key: 'portfolio' as const,    label: 'Portfolio',     icon: Layers },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 lg:px-8"
      style={{ background: 'linear-gradient(150deg, #060918 0%, #0d1640 40%, #071428 100%)' }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-[10px] font-bold tracking-[3px] uppercase text-white/35 mb-2" style={{ fontFamily: 'monospace' }}>— Administration</div>
            <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
            <p className="text-white/40 text-xs mt-1">{userEmail}</p>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-white/60 hover:text-white"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)'; e.currentTarget.style.color = '#f87171' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}>
            <LogOut size={15} /> Déconnexion
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 p-1 rounded-2xl mb-8 w-fit" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={activeTab === key
                ? { background: 'linear-gradient(135deg, #4f8eff, #7c3aed)', color: '#fff', boxShadow: '0 4px 16px rgba(79,142,255,0.3)' }
                : { color: 'rgba(255,255,255,0.45)' }}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'reservations' ? <ReservationsTab /> : <PortfolioTab />}
      </div>
    </div>
  )
}

// ─── ROOT: AUTH GUARD ─────────────────────────────────────────────────────────
export default function AdminPortfolioPage() {
  const { session, loading } = useAdminAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(150deg, #060918 0%, #0d1640 40%, #071428 100%)' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: '#4f8eff' }} />
      </div>
    )
  }

  if (!session) {
    // Redirect to login
    window.location.href = '/sp-admin-x7'
    return null
  }

  return <AdminDashboard />
}