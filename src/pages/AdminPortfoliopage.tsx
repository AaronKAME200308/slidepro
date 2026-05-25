import { useState, useEffect, useRef, type DragEvent } from 'react'
import {
  Plus, Trash2, Upload, X, Save, Loader2,
  AlertCircle, Image, Edit3, ChevronDown,
  Eye, EyeOff
} from 'lucide-react'
import { supabase } from '../services/supabase'

// ─── TYPES ────────────────────────────────────────────────────────────────────
type SlideImage = {
  url: string
  order: number
}

type WorkForm = {
  id?: string
  title: string
  field: string
  category: string
  level: string
  university: string
  slides: number
  gradient: string
  accent: string
  icon: string
  tags: string
  highlights: string
  video_url: string
  published: boolean
}

type Work = WorkForm & {
  id: string
  images: SlideImage[]
  created_at: string
}

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

const emptyForm = (): WorkForm => ({
  title: '', field: '', category: 'management', level: 'Master 2',
  university: '', slides: 20,
  gradient: GRADIENTS[0].value, accent: GRADIENTS[0].accent,
  icon: '📊', tags: '', highlights: '', video_url: '', published: false,
})

// ─── DRAG & DROP IMAGE UPLOADER ───────────────────────────────────────────────
function ImageDropzone({
  workId,
  images,
  onImagesChange,
  accent,
}: {
  workId: string
  images: SlideImage[]
  onImagesChange: (imgs: SlideImage[]) => void
  accent: string
}) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFiles = async (files: File[]) => {
    const pngs = files.filter(f => f.type.startsWith('image/'))
    if (!pngs.length) return
    setUploading(true)
    setProgress(0)
    const uploaded: SlideImage[] = []
    for (let i = 0; i < pngs.length; i++) {
      const file = pngs[i]
      const path = `portfolio/${workId}/slide_${Date.now()}_${i}.${file.name.split('.').pop()}`
      const { error } = await supabase.storage.from('portfolio-slides').upload(path, file, {
        contentType: file.type, upsert: false,
      })
      if (!error) {
        const { data } = supabase.storage.from('portfolio-slides').getPublicUrl(path)
        uploaded.push({ url: data.publicUrl, order: images.length + i })
      }
      setProgress(Math.round(((i + 1) / pngs.length) * 100))
    }
    // Save URLs to DB
    if (uploaded.length) {
      const newImgs = [...images, ...uploaded]
      await supabase.from('portfolio_slides').insert(
        uploaded.map(img => ({ work_id: workId, url: img.url, order: img.order }))
      )
      onImagesChange(newImgs)
    }
    setUploading(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    uploadFiles(Array.from(e.dataTransfer.files))
  }

  const removeImage = async (img: SlideImage) => {
    // Extract path from URL
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
    // Update order in DB
    for (const img of updated) {
      await supabase.from('portfolio_slides').update({ order: img.order }).eq('url', img.url).eq('work_id', workId)
    }
  }

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-3 rounded-2xl p-8 cursor-pointer transition-all duration-200"
        style={{
          border: `2px dashed ${dragging ? accent : 'rgba(255,255,255,0.15)'}`,
          background: dragging ? `${accent}08` : 'rgba(255,255,255,0.03)',
          minHeight: 120,
        }}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => uploadFiles(Array.from(e.target.files || []))} />
        {uploading ? (
          <div className="text-center">
            <Loader2 size={24} className="animate-spin mx-auto mb-2" style={{ color: accent }} />
            <p className="text-sm text-white/60">Upload en cours… {progress}%</p>
            <div className="mt-2 rounded-full overflow-hidden" style={{ width: 160, height: 4, background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: accent }} />
            </div>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: `${accent}15`, border: `1px solid ${accent}25` }}>
              <Upload size={22} style={{ color: accent }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white/70">Glisse tes PNG ici ou clique</p>
              <p className="text-xs text-white/35 mt-0.5">PNG, JPG — plusieurs fichiers acceptés</p>
            </div>
          </>
        )}
      </div>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {images.sort((a, b) => a.order - b.order).map((img, i) => (
            <div key={img.url} className="relative group rounded-xl overflow-hidden"
              style={{ aspectRatio: '16/9', background: '#0f172a' }}>
              <img src={img.url} alt={`Slide ${i + 1}`} className="w-full h-full object-cover" />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-1">
                <div className="flex items-center gap-1">
                  <button onClick={() => moveImage(i, i - 1)} disabled={i === 0}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors disabled:opacity-30">
                    <ChevronDown size={14} style={{ transform: 'rotate(180deg)' }} />
                  </button>
                  <button onClick={() => moveImage(i, i + 1)} disabled={i === images.length - 1}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors disabled:opacity-30">
                    <ChevronDown size={14} />
                  </button>
                  <button onClick={() => removeImage(img)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
                <span className="text-white/50 text-xs">Slide {i + 1}</span>
              </div>
              {/* Order badge */}
              <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                style={{ background: accent, color: '#fff', fontSize: 10 }}>
                {i + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── WORK FORM MODAL ──────────────────────────────────────────────────────────
function WorkFormModal({
  work,
  onClose,
  onSaved,
}: {
  work: Work | null
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = !!work?.id
  const [form, setForm] = useState<WorkForm>(work ? {
    title: work.title, field: work.field, category: work.category,
    level: work.level, university: work.university, slides: work.slides,
    gradient: work.gradient, accent: work.accent, icon: work.icon,
    tags: Array.isArray(work.tags) ? (work.tags as unknown as string[]).join(', ') : work.tags,
    highlights: Array.isArray(work.highlights) ? (work.highlights as unknown as string[]).join('\n') : work.highlights,
    video_url: work.video_url || '', published: work.published,
  } : emptyForm())
  const [images, setImages] = useState<SlideImage[]>(work?.images || [])
  const [saving, setSaving] = useState(false)
  const [workId, setWorkId] = useState<string>(work?.id || '')
  const [error, setError] = useState('')

  const selectedGradient = GRADIENTS.find(g => g.value === form.gradient) || GRADIENTS[0]

  const f = (key: keyof WorkForm, val: string | number | boolean) =>
    setForm(prev => ({ ...prev, [key]: val }))

  const handleSave = async () => {
    if (!form.title.trim() || !form.field.trim()) {
      setError('Titre et filière sont requis')
      return
    }
    setSaving(true)
    setError('')
    const payload = {
      title: form.title.trim(),
      field: form.field.trim(),
      category: form.category,
      level: form.level,
      university: form.university.trim(),
      slides: Number(form.slides),
      gradient: form.gradient,
      accent: selectedGradient.accent,
      icon: form.icon.trim() || '📊',
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      highlights: form.highlights.split('\n').map(h => h.trim()).filter(Boolean),
      video_url: form.video_url.trim(),
      published: form.published,
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
    } finally {
      setSaving(false)
    }
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

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="font-bold text-white text-xl">{isEdit ? 'Modifier le projet' : 'Nouveau projet'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Gradient picker */}
          <div>
            <label className={labelCls}>Couleur du projet</label>
            <div className="flex flex-wrap gap-2">
              {GRADIENTS.map(g => (
                <button key={g.value} onClick={() => { f('gradient', g.value); f('accent', g.accent) }}
                  className="w-9 h-9 rounded-xl transition-all"
                  style={{
                    background: g.value,
                    border: form.gradient === g.value ? `2.5px solid #fff` : '2.5px solid transparent',
                    boxShadow: form.gradient === g.value ? `0 0 0 1px ${g.accent}` : 'none',
                    transform: form.gradient === g.value ? 'scale(1.15)' : 'scale(1)',
                  }}
                  title={g.label}
                />
              ))}
            </div>
          </div>

          {/* Icon + Titre */}
          <div className="grid grid-cols-[80px_1fr] gap-3">
            <div>
              <label className={labelCls}>Icône</label>
              <input value={form.icon} onChange={e => f('icon', e.target.value)}
                className={inputCls} style={inputStyle} placeholder="📊" />
            </div>
            <div>
              <label className={labelCls}>Titre du mémoire *</label>
              <input value={form.title} onChange={e => f('title', e.target.value)}
                className={inputCls} style={inputStyle} placeholder="Ex : Impact du e-commerce..." />
            </div>
          </div>

          {/* Filière + Catégorie */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Filière *</label>
              <input value={form.field} onChange={e => f('field', e.target.value)}
                className={inputCls} style={inputStyle} placeholder="Ex : Commerce & Marketing" />
            </div>
            <div>
              <label className={labelCls}>Catégorie</label>
              <select value={form.category} onChange={e => f('category', e.target.value)}
                className={inputCls} style={{ ...inputStyle, appearance: 'none' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Niveau + Université */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Niveau</label>
              <select value={form.level} onChange={e => f('level', e.target.value)}
                className={inputCls} style={{ ...inputStyle, appearance: 'none' }}>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Université</label>
              <input value={form.university} onChange={e => f('university', e.target.value)}
                className={inputCls} style={inputStyle} placeholder="Ex : Université de Yaoundé I" />
            </div>
          </div>

          {/* Slides + Vidéo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Nombre de slides</label>
              <input type="number" value={form.slides} onChange={e => f('slides', e.target.value)}
                className={inputCls} style={inputStyle} min={1} max={100} />
            </div>
            <div>
              <label className={labelCls}>URL vidéo (optionnel)</label>
              <input value={form.video_url} onChange={e => f('video_url', e.target.value)}
                className={inputCls} style={inputStyle} placeholder="YouTube URL..." />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={labelCls}>Tags <span className="text-white/30 font-normal normal-case">(séparés par des virgules)</span></label>
            <input value={form.tags} onChange={e => f('tags', e.target.value)}
              className={inputCls} style={inputStyle} placeholder="Ex : E-commerce, Marketing digital, Commerce" />
          </div>

          {/* Highlights */}
          <div>
            <label className={labelCls}>Points forts <span className="text-white/30 font-normal normal-case">(un par ligne)</span></label>
            <textarea value={form.highlights} onChange={e => f('highlights', e.target.value)}
              rows={3} className={inputCls} style={{ ...inputStyle, resize: 'none' }}
              placeholder={"Graphiques de données animés\nCarte géographique interactive\nAnalyse comparative en infographies"} />
          </div>

          {/* Published toggle */}
          <div className="flex items-center justify-between px-4 py-3 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div>
              <div className="text-sm font-semibold text-white/80">Publié sur le portfolio</div>
              <div className="text-xs text-white/40 mt-0.5">Visible par les visiteurs</div>
            </div>
            <button onClick={() => f('published', !form.published)}
              className="relative w-12 h-6 rounded-full transition-all duration-200"
              style={{ background: form.published ? '#34d399' : 'rgba(255,255,255,0.12)' }}>
              <span className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200"
                style={{ left: form.published ? 28 : 4 }} />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {/* Save button */}
          <button onClick={handleSave} disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm transition-all"
            style={{ background: 'linear-gradient(135deg, #4f8eff, #7c3aed)', boxShadow: '0 8px 24px rgba(79,142,255,0.3)', opacity: saving ? 0.7 : 1 }}>
            {saving ? <><Loader2 size={16} className="animate-spin" /> Sauvegarde...</> : <><Save size={16} /> {isEdit ? 'Enregistrer les modifications' : 'Créer le projet'}</>}
          </button>

          {/* Image upload — disponible après création */}
          {(workId || isEdit) && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.1)' }} />
                <label className={labelCls + ' mb-0'}>Slides (images PNG/JPG)</label>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
              </div>
              <ImageDropzone
                workId={workId || work!.id}
                images={images}
                onImagesChange={setImages}
                accent={selectedGradient.accent}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN ADMIN PAGE ──────────────────────────────────────────────────────────
export default function AdminPortfolioPage() {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Work | null | 'new'>('new' as any)
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchWorks = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('portfolio_works')
      .select('*, images:portfolio_slides(url, order)')
      .order('created_at', { ascending: false })
    setWorks((data || []) as Work[])
    setLoading(false)
  }

  useEffect(() => { fetchWorks() }, [])

  const openNew = () => { setEditing(null); setShowModal(true) }
  const openEdit = (w: Work) => { setEditing(w); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditing(null) }
  const handleSaved = () => { fetchWorks() }

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
    <div className="min-h-screen pt-24 pb-16 px-8"
      style={{ background: 'linear-gradient(150deg, #060918 0%, #0d1640 40%, #071428 100%)' }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .work-row { animation: fadeIn 0.3s ease both; }
      `}</style>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-[10px] font-bold tracking-[3px] uppercase text-white/35 mb-2" style={{ fontFamily: 'monospace' }}>
              — Administration
            </div>
            <h1 className="text-3xl font-bold text-white">Gestion du portfolio</h1>
            <p className="text-white/40 text-sm mt-1">{works.length} projet{works.length > 1 ? 's' : ''} · {works.filter(w => w.published).length} publiés</p>
          </div>
          <button onClick={openNew}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold text-sm transition-all"
            style={{ background: 'linear-gradient(135deg, #4f8eff, #7c3aed)', boxShadow: '0 8px 24px rgba(79,142,255,0.3)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}>
            <Plus size={16} /> Nouveau projet
          </button>
        </div>

        {/* Works list */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="animate-spin" style={{ color: '#4f8eff' }} />
          </div>
        ) : works.length === 0 ? (
          <div className="text-center py-24 rounded-3xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <Image size={48} className="mx-auto mb-4 text-white/20" />
            <p className="text-white/50 text-lg font-semibold mb-1">Aucun projet pour l'instant</p>
            <p className="text-white/30 text-sm mb-6">Crée ton premier projet portfolio</p>
            <button onClick={openNew}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg, #4f8eff, #7c3aed)' }}>
              <Plus size={16} /> Créer un projet
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {works.map((work, i) => (
              <div key={work.id} className="work-row flex items-center gap-4 p-4 rounded-2xl transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', animationDelay: `${i * 0.05}s` }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}>

                {/* Color preview */}
                <div className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-2xl"
                  style={{ background: work.gradient }}>
                  {work.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-white/90 truncate">{work.title}</span>
                    {work.published ? (
                      <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}>
                        Publié
                      </span>
                    ) : (
                      <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        Brouillon
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/35">
                    <span>{work.level}</span>
                    <span>·</span>
                    <span>{work.field}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Image size={11} /> {work.images?.length || 0} slides
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => togglePublished(work)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                    style={{ background: 'rgba(255,255,255,0.06)', color: work.published ? '#34d399' : 'rgba(255,255,255,0.35)' }}
                    title={work.published ? 'Dépublier' : 'Publier'}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
                    {work.published ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button onClick={() => openEdit(work)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all text-white/50 hover:text-white"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(79,142,255,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => deleteWork(work.id)} disabled={deleting === work.id}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all text-red-400/60 hover:text-red-400"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
                    {deleting === work.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <WorkFormModal
          work={editing as Work | null}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}