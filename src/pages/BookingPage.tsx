import { useState, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  User, Phone, Mail, GraduationCap, BookOpen, Calendar,
  Upload, CheckCircle, ArrowRight, ArrowLeft, Zap, FileText,
  AlertCircle, Loader2, X, type LucideIcon
} from 'lucide-react'
import { supabase } from '../services/supabase'

// ─── TYPES ───────────────────────────────────────────────────────────────────
type BookingForm = {
  full_name: string; phone: string; email: string
  university: string; field: string; level: string
  thesis_title: string; defense_date: string
  file: File | null; fileUrl: string; notes: string
}
type BookingErrors = Partial<Record<keyof BookingForm, string>>
type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string; icon: LucideIcon; error?: string }
type SelectFieldProps = { label: string; icon: LucideIcon; options: string[]; error?: string; value: string; onChange: (e: ChangeEvent<HTMLSelectElement>) => void; name: string }

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const LEVELS = ['Licence 1','Licence 2','Licence 3','Licence Pro','Master 1','Master 2','Doctorat','BTS','HND','Autre']
const FIELDS = [
  "Informatique & Systèmes d'information","Gestion & Management","Finance & Comptabilité",
  "Marketing & Commerce","Droit","Médecine & Santé","Sciences de l'Éducation",
  "Génie Civil & BTP","Génie Électrique","Communication & Journalisme",
  "Sciences Économiques","Ressources Humaines","Logistique & Transport","Autre",
]

const steps = [
  { label: 'Informations', icon: User,         color: '#4f8eff' },
  { label: 'Cursus',       icon: GraduationCap, color: '#a78bfa' },
  { label: 'Document',     icon: Upload,         color: '#f472b6' },
  { label: 'Confirmation', icon: CheckCircle,    color: '#34d399' },
]

const initialForm: BookingForm = {
  full_name:'', phone:'', email:'', university:'', field:'', level:'',
  thesis_title:'', defense_date:'', file:null, fileUrl:'', notes:'',
}

// ─── FIELD COMPONENTS ────────────────────────────────────────────────────────
function InputField({ label, icon: Icon, error, ...props }: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-white/80 mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10">
          <Icon size={16} />
        </div>
        <input
          className={`input-field w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-white ${error ? 'border-red-400' : ''}`}
          {...props}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
  )
}

function SelectField({ label, icon: Icon, options, error, value, onChange, name }: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10">
          <Icon size={16} />
        </div>
        <select
          name={name} value={value} onChange={onChange}
          className={`input-field w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-white appearance-none ${error ? 'border-red-400' : ''}`}
        >
          <option value="">Sélectionner...</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function BookingPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<BookingForm>(initialForm)
  const [errors, setErrors] = useState<BookingErrors>({})
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [uploadDone, setUploadDone] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const name = e.target.name as keyof BookingForm
    setForm(f => ({ ...f, [name]: e.target.value } as BookingForm))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }

  const validateStep = (s: number) => {
    const errs: BookingErrors = {}
    if (s === 0) {
      if (!form.full_name.trim()) errs.full_name = 'Nom requis'
      if (!form.phone.trim()) errs.phone = 'Téléphone requis'
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email valide requis'
    }
    if (s === 1) {
      if (!form.university.trim()) errs.university = 'Université requise'
      if (!form.field) errs.field = 'Filière requise'
      if (!form.level) errs.level = 'Niveau requis'
      if (!form.thesis_title.trim()) errs.thesis_title = 'Titre du mémoire requis'
      if (!form.defense_date) errs.defense_date = 'Date de soutenance requise'
    }
    if (s === 2) {
      if (!uploadDone && !form.file) errs.file = 'Merci de sélectionner ton rapport PDF'
    }
    return errs
  }

  const nextStep = () => {
    const errs = validateStep(step)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') { setErrors(er => ({ ...er, file: 'Seuls les fichiers PDF sont acceptés' })); return }
    if (file.size > 50 * 1024 * 1024) { setErrors(er => ({ ...er, file: 'Fichier trop volumineux (max 50 Mo)' })); return }
    setForm(f => ({ ...f, file }))
    setErrors(er => ({ ...er, file: '' }))
  }

  const handleUpload = async () => {
    if (!form.file) return
    setUploading(true)
    try {
      const safeName = form.full_name.trim().replace(/\s+/g, '_').toLowerCase()
      const filePath = `memoires/${Date.now()}_${safeName}.pdf`
      const { error: uploadError } = await supabase.storage.from('rapports').upload(filePath, form.file, { contentType: 'application/pdf', upsert: false })
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('rapports').getPublicUrl(filePath)
      setForm(f => ({ ...f, fileUrl: data.publicUrl }))
      setUploadDone(true)
    } catch (err) {
      console.error('Upload error:', err)
      setErrors(er => ({ ...er, file: "Échec de l'upload, réessaie." }))
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await supabase.from('reservations').insert([{
        full_name: form.full_name, phone: form.phone, email: form.email,
        university: form.university, field: form.field, level: form.level,
        thesis_title: form.thesis_title, defense_date: form.defense_date,
        file_url: form.fileUrl || null, status: 'pending',
      }])
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4"
        style={{ background: 'linear-gradient(150deg, #060918 0%, #0d1640 40%, #0a2448 70%, #071428 100%)' }}>
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-float"
            style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}>
            <CheckCircle size={40} style={{ color: '#34d399' }} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Demande envoyée ! 🎉</h1>
          <p className="text-white/70 mb-2">Merci <strong className="text-white">{form.full_name}</strong>,</p>
          <p className="text-white/55 mb-8 leading-relaxed">
            Notre équipe va étudier ton dossier et te contactera par téléphone dans les <strong className="text-white">24 heures</strong>.
          </p>
          {/* Recap card */}
          <div className="glass-card-dark rounded-2xl p-5 mb-8 text-left space-y-2">
            {[
              ['Nom', form.full_name], ['Email', form.email], ['Téléphone', form.phone],
              ['Titre', form.thesis_title], ['Soutenance', form.defense_date],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm border-b last:border-0 py-1.5" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <span className="text-white/40">{label}</span>
                <span className="text-white/80 font-medium text-right max-w-xs truncate">{value}</span>
              </div>
            ))}
          </div>
          <Link to="/" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  const currentColor = steps[step].color

  return (
    <div className="min-h-screen pt-24 pb-16"
      style={{ background: 'linear-gradient(150deg, #060918 0%, #0d1640 40%, #0a2448 70%, #071428 100%)' }}>
      <style>{`
        @keyframes pulseOrb { 0%,100%{opacity:0.2} 50%{opacity:0.1} }
        .orb-bg { animation: pulseOrb 8s ease-in-out infinite; }
        @keyframes fadeStep { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .step-content { animation: fadeStep 0.35s ease both; }
      `}</style>

      {/* Background orbs */}
      <div className="orb-bg fixed w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${currentColor} 0%, transparent 70%)`, top: -100, right: -100, opacity: 0.2, transition: 'background 0.5s ease', zIndex: 0 }} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium glass-card-dark text-white/80 mb-4">
            <Zap size={12} /> Inscription rapide
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Prendre{' '}
            <span style={{ background: 'linear-gradient(135deg, #a5b4fc, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              rendez-vous
            </span>
          </h1>
          <p className="text-white/50 text-sm">Remplis ce formulaire et nous te rappelons dans les 24h</p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-10 px-2">
          {steps.map(({ label, icon: Icon, color }, i) => (
            <div key={label} className="flex flex-col items-center gap-1.5 relative flex-1">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-400"
                style={{
                  background: i < step
                    ? 'linear-gradient(135deg, #34d399, #059669)'
                    : i === step
                      ? `linear-gradient(135deg, ${color}, ${color}cc)`
                      : 'rgba(255,255,255,0.07)',
                  border: i <= step ? 'none' : '1px solid rgba(255,255,255,0.12)',
                  boxShadow: i === step ? `0 0 0 6px ${color}20, 0 8px 24px ${color}30` : 'none',
                }}
              >
                <Icon size={17} style={{ color: i <= step ? '#fff' : 'rgba(255,255,255,0.35)' }} />
              </div>
              <span className="text-xs font-medium hidden sm:block"
                style={{ color: i === step ? color : i < step ? '#34d399' : 'rgba(255,255,255,0.3)' }}>
                {label}
              </span>
              {i < steps.length - 1 && (
                <div className="absolute top-5 left-[60%] right-0 h-px -z-0 transition-all duration-500"
                  style={{ background: i < step ? 'linear-gradient(90deg, #34d399, #34d39980)' : 'rgba(255,255,255,0.1)' }} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="glass-card-dark rounded-3xl p-8"
          style={{ border: `1px solid ${currentColor}20`, boxShadow: `0 0 0 1px ${currentColor}10, 0 32px 80px rgba(0,0,0,0.4)`, transition: 'border-color 0.4s ease, box-shadow 0.4s ease' }}>

          {/* ── Step 0 : Coordonnées ── */}
          {step === 0 && (
            <div className="space-y-5 step-content">
              <div className="mb-5">
                <div className="text-[10px] font-bold tracking-[3px] uppercase mb-1" style={{ color: `${currentColor}90`, fontFamily: 'monospace' }}>Étape 01</div>
                <h2 className="text-2xl font-bold text-white">Tes coordonnées</h2>
                <p className="text-white/40 text-sm mt-1">Ces informations nous permettront de te contacter.</p>
              </div>
              <InputField label="Nom complet *" icon={User}  name="full_name"  value={form.full_name}  onChange={handleChange} placeholder="Ex : Marie-Claire Ngo"  error={errors.full_name} />
              <InputField label="Numéro de téléphone *" icon={Phone} name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Ex : 6XX XXX XXX" error={errors.phone} />
              <InputField label="Adresse email *" icon={Mail} name="email" type="email" value={form.email} onChange={handleChange} placeholder="Ex : marie@email.com" error={errors.email} />
            </div>
          )}

          {/* ── Step 1 : Cursus ── */}
          {step === 1 && (
            <div className="space-y-5 step-content">
              <div className="mb-5">
                <div className="text-[10px] font-bold tracking-[3px] uppercase mb-1" style={{ color: `${currentColor}90`, fontFamily: 'monospace' }}>Étape 02</div>
                <h2 className="text-2xl font-bold text-white">Ton cursus académique</h2>
                <p className="text-white/40 text-sm mt-1">Ces informations nous aident à personnaliser ta présentation.</p>
              </div>
              <InputField label="Nom de l'université *" icon={GraduationCap} name="university" value={form.university} onChange={handleChange} placeholder="Ex : Université de Yaoundé I" error={errors.university} />
              <SelectField label="Filière / Spécialité *" icon={BookOpen} name="field" value={form.field} onChange={handleChange} options={FIELDS} error={errors.field} />
              <SelectField label="Niveau d'études *" icon={GraduationCap} name="level" value={form.level} onChange={handleChange} options={LEVELS} error={errors.level} />
              <InputField label="Titre de ton mémoire / thèse *" icon={FileText} name="thesis_title" value={form.thesis_title} onChange={handleChange} placeholder="Titre exact de ton travail de recherche" error={errors.thesis_title} />
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date de soutenance *</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Calendar size={16} /></div>
                  <input
                    type="date" name="defense_date" value={form.defense_date} onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`input-field w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-white ${errors.defense_date ? 'border-red-400' : ''}`}
                  />
                </div>
                {errors.defense_date && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.defense_date}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notes particulières <span className="text-slate-400 font-normal">(optionnel)</span></label>
                <textarea
                  name="notes" value={form.notes} onChange={handleChange} rows={3}
                  placeholder="Ex : couleurs préférées, éléments à mettre en avant, style souhaité..."
                  className="input-field w-full px-4 py-3 rounded-xl text-sm bg-white resize-none"
                />
              </div>
            </div>
          )}

          {/* ── Step 2 : Upload ── */}
          {step === 2 && (
            <div className="step-content">
              <div className="mb-6">
                <div className="text-[10px] font-bold tracking-[3px] uppercase mb-1" style={{ color: `${currentColor}90`, fontFamily: 'monospace' }}>Étape 03</div>
                <h2 className="text-2xl font-bold text-white">Envoie ton rapport</h2>
                <p className="text-white/40 text-sm mt-1">Uploade ton mémoire en PDF. Il sera sauvegardé de manière sécurisée.</p>
              </div>

              {!uploadDone ? (
                <div>
                  <label
                    className={`flex flex-col items-center justify-center gap-4 rounded-2xl p-10 cursor-pointer transition-all duration-300 ${form.file ? '' : ''}`}
                    style={{
                      border: `2px dashed ${form.file ? currentColor : 'rgba(255,255,255,0.15)'}`,
                      background: form.file ? `${currentColor}08` : 'rgba(255,255,255,0.03)',
                    }}
                    onMouseEnter={e => { if (!form.file) e.currentTarget.style.borderColor = `${currentColor}60` }}
                    onMouseLeave={e => { if (!form.file) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                  >
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background: form.file ? `${currentColor}20` : 'rgba(255,255,255,0.06)', border: `1px solid ${form.file ? currentColor + '40' : 'rgba(255,255,255,0.1)'}` }}>
                      <Upload size={26} style={{ color: form.file ? currentColor : 'rgba(255,255,255,0.35)' }} />
                    </div>
                    {form.file ? (
                      <div className="text-center">
                        <p className="font-semibold text-sm" style={{ color: currentColor }}>{form.file.name}</p>
                        <p className="text-white/40 text-xs mt-1">{(form.file.size / 1024 / 1024).toFixed(1)} Mo</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="font-semibold text-white/70 text-sm">Clique pour sélectionner ton rapport</p>
                        <p className="text-white text-xs mt-1">PDF uniquement — Max 50 Mo</p>
                      </div>
                    )}
                    <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                  </label>

                  {errors.file && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle size={11} />{errors.file}</p>}

                  {form.file && (
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="btn-primary w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold"
                    >
                      {uploading ? <><Loader2 size={16} className="animate-spin" /> Upload en cours...</> : <><Upload size={16} /> Envoyer le rapport</>}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 rounded-2xl"
                  style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)' }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'rgba(52,211,153,0.15)' }}>
                    <CheckCircle size={32} style={{ color: '#34d399' }} />
                  </div>
                  <h3 className="font-bold text-white mb-1">Rapport uploadé avec succès !</h3>
                  <p className="text-white/50 text-sm mb-1">{form.file?.name}</p>
                  <p className="text-xs font-medium" style={{ color: '#34d399' }}>Sauvegardé de manière sécurisée</p>
                  <button
                    onClick={() => { setUploadDone(false); setForm(f => ({ ...f, file: null, fileUrl: '' })) }}
                    className="mt-4 text-white text-xs hover:text-red-400 transition-colors flex items-center gap-1 mx-auto"
                  >
                    <X size={12} /> Changer de fichier
                  </button>
                </div>
              )}

              <div className="mt-5 p-4 rounded-xl flex items-start gap-3"
                style={{ background: 'rgba(79,142,255,0.06)', border: '1px solid rgba(79,142,255,0.15)' }}>
                <div className="text-[#4f8eff] text-base mt-0.5">🔒</div>
                <div>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: '#4f8eff' }}>Confidentialité garantie</p>
                  <p className="text-xs text-white/45 leading-relaxed">
                    Ton document est stocké dans un espace sécurisé, accessible uniquement par notre équipe.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3 : Récapitulatif ── */}
          {step === 3 && (
            <div className="step-content">
              <div className="mb-6">
                <div className="text-[10px] font-bold tracking-[3px] uppercase mb-1" style={{ color: `${currentColor}90`, fontFamily: 'monospace' }}>Étape 04</div>
                <h2 className="text-2xl font-bold text-white">Récapitulatif</h2>
                <p className="text-white/40 text-sm mt-1">Vérifie tes informations avant d'envoyer ta demande.</p>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { title: 'Coordonnées', rows: [['Nom', form.full_name], ['Téléphone', form.phone], ['Email', form.email]] },
                  { title: 'Cursus', rows: [['Établissement', form.university], ['Filière', form.field], ['Niveau', form.level], ['Soutenance', form.defense_date]] },
                ].map(({ title, rows }) => (
                  <div key={title} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="text-[10px] font-bold tracking-[2px] uppercase text-white mb-3" style={{ fontFamily: 'monospace' }}>{title}</div>
                    {rows.map(([k, v]) => (
                      <div key={k} className="flex justify-between py-1.5 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <span className="text-xs text-white/40">{k}</span>
                        <span className="text-xs font-medium text-white/80 text-right max-w-[55%] truncate">{v}</span>
                      </div>
                    ))}
                  </div>
                ))}

                <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="text-[10px] font-bold tracking-[2px] uppercase text-white mb-2" style={{ fontFamily: 'monospace' }}>Titre du mémoire</div>
                  <p className="text-sm font-medium text-white/80">{form.thesis_title}</p>
                </div>

                <div className="flex items-center gap-3 rounded-2xl p-4"
                  style={{ background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.2)' }}>
                  <CheckCircle size={18} style={{ color: '#34d399' }} className="shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-white/85">Rapport uploadé</div>
                    <div className="text-xs text-white/40">{form.file?.name || 'Document envoyé'}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-base"
              >
                {submitting ? <><Loader2 size={18} className="animate-spin" /> Envoi en cours...</> : <><CheckCircle size={18} /> Confirmer ma demande</>}
              </button>
              <p className="text-center text-white text-xs mt-3">Aucun paiement requis maintenant — on te contacte d'abord</p>
            </div>
          )}

          {/* Navigation */}
          {step < 3 && (
            <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              {step > 0 ? (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white/60 font-medium text-sm transition-colors hover:text-white hover:bg-white/08"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <ArrowLeft size={15} /> Précédent
                </button>
              ) : <div />}
              <button
                onClick={nextStep}
                disabled={step === 2 && !uploadDone}
                className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-white font-semibold text-sm transition-all"
                style={{
                  background: step === 2 && !uploadDone ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg, ${currentColor}, ${currentColor}cc)`,
                  boxShadow: step === 2 && !uploadDone ? 'none' : `0 8px 24px ${currentColor}35`,
                  opacity: step === 2 && !uploadDone ? 0.45 : 1,
                  cursor: step === 2 && !uploadDone ? 'not-allowed' : 'pointer',
                }}
              >
                {step === 2 ? 'Continuer' : 'Suivant'} <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>

        <div className="mt-5 text-center text-white text-xs">
          Des questions ?{' '}
          <a href="tel:+237600000000" className="hover:text-white/60 transition-colors" style={{ color: '#4f8eff' }}>
            Appelle-nous directement
          </a>
        </div>
      </div>
    </div>
  )
}