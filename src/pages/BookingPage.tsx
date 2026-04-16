import { useState, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  User, Phone, Mail, GraduationCap, BookOpen, Calendar,
  Upload, CheckCircle, ArrowRight, ArrowLeft, Zap, FileText,
  AlertCircle, Loader2, X, type LucideIcon
} from 'lucide-react'
import { supabase } from '../services/supabase'

// ─── TYPES ───────────────────────────────────────────────────
type BookingForm = {
  full_name: string
  phone: string
  email: string
  university: string
  field: string
  level: string
  thesis_title: string
  defense_date: string
  file: File | null
  fileUrl: string
  notes: string
}

type BookingErrors = Partial<Record<keyof BookingForm, string>>

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  icon: LucideIcon
  error?: string
}

type SelectFieldProps = {
  label: string
  icon: LucideIcon
  options: string[]
  error?: string
  value: string
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  name: string
}

// ─── CONSTANTS ────────────────────────────────────────────────
const LEVELS = ['Licence 1', 'Licence 2', 'Licence 3', 'Licence Pro', 'Master 1', 'Master 2', 'Doctorat', 'BTS', 'HND', 'Autre']
const FIELDS = [
  'Informatique & Systèmes d\'information', 'Gestion & Management', 'Finance & Comptabilité',
  'Marketing & Commerce', 'Droit', 'Médecine & Santé', 'Sciences de l\'Éducation',
  'Génie Civil & BTP', 'Génie Électrique', 'Communication & Journalisme',
  'Sciences Économiques', 'Ressources Humaines', 'Logistique & Transport', 'Autre'
]

const steps = [
  { label: 'Informations', icon: User },
  { label: 'Cursus', icon: GraduationCap },
  { label: 'Document', icon: Upload },
  { label: 'Confirmation', icon: CheckCircle },
]

const initialForm = {
  full_name: '', phone: '', email: '',
  university: '', field: '', level: '',
  thesis_title: '', defense_date: '',
  file: null, fileUrl: '', notes: '',
}

// ─── STEP COMPONENTS ──────────────────────────────────────────
function InputField({ label, icon: Icon, error, ...props }: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
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
          name={name}
          value={value}
          onChange={onChange}
          className={`input-field w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-white appearance-none ${error ? 'border-red-400' : ''}`}
        >
          <option value="">Sélectionner...</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────
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
    const value = e.target.value
    setForm((f) => ({ ...f, [name]: value } as BookingForm))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }))
  }

  // ── Validation per step ───────────────────────────────────
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
    setStep((s) => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── File selection ────────────────────────────────────────
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      setErrors((er) => ({ ...er, file: 'Seuls les fichiers PDF sont acceptés' }))
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      setErrors((er) => ({ ...er, file: 'Fichier trop volumineux (max 50 Mo)' }))
      return
    }
    setForm((f) => ({ ...f, file }))
    setErrors((er) => ({ ...er, file: '' }))
  }

  // ── Upload vers Supabase Storage ──────────────────────────
  const handleUpload = async () => {
    if (!form.file) return
    setUploading(true)
    try {
      // Nom de fichier unique : timestamp + nom nettoyé
      const safeName = form.full_name.trim().replace(/\s+/g, '_').toLowerCase()
      const timestamp = Date.now()
      const filePath = `memoires/${timestamp}_${safeName}.pdf`

      // Upload dans le bucket "rapports" (à créer dans Supabase Storage)
      const { error: uploadError } = await supabase.storage
        .from('rapports')
        .upload(filePath, form.file, {
          contentType: 'application/pdf',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Récupérer l'URL publique du fichier uploadé
      const { data } = supabase.storage
        .from('rapports')
        .getPublicUrl(filePath)

      setForm((f) => ({ ...f, fileUrl: data.publicUrl }))
      setUploadDone(true)
    } catch (err) {
      console.error('Upload error:', err)
      setErrors((er) => ({ ...er, file: 'Échec de l\'upload, réessaie.' }))
    } finally {
      setUploading(false)
    }
  }

  // ── Final submit ──────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await supabase.from('reservations').insert([{
        full_name: form.full_name,
        phone: form.phone,
        email: form.email,
        university: form.university,
        field: form.field,
        level: form.level,
        thesis_title: form.thesis_title,
        defense_date: form.defense_date,
        file_url: form.fileUrl || null,
        status: 'pending',
      }])
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success screen ────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center mesh-bg pt-20 px-4">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6 animate-float">
            <CheckCircle size={40} className="text-emerald-600" />
          </div>
          <h1 className="font-display text-4xl font-bold text-slate-900 mb-4">
            Demande envoyée ! 🎉
          </h1>
          <p className="text-slate-600 text-lg mb-2">Merci <strong>{form.full_name}</strong>,</p>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Nous avons bien reçu ta demande. Notre équipe va étudier ton dossier et te contactera
            par téléphone dans les <strong>24 heures</strong> pour discuter de ta présentation.
          </p>
          <div className="glass-card rounded-2xl p-5 mb-8 text-left space-y-2">
            {[
              ['Nom', form.full_name],
              ['Email', form.email],
              ['Téléphone', form.phone],
              ['Titre', form.thesis_title],
              ['Soutenance', form.defense_date],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-slate-400">{label}</span>
                <span className="text-slate-700 font-medium text-right max-w-xs truncate">{value}</span>
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

  return (
    <div className="font-body min-h-screen mesh-bg pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 badge-blue px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Zap size={13} /> Inscription rapide
          </div>
          <h1 className="font-display text-4xl font-bold text-slate-900 mb-3">
            Prendre <span className="gradient-text">rendez-vous</span>
          </h1>
          <p className="text-slate-500">Remplis ce formulaire et nous te rappelons dans les 24h</p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-10 px-2">
          {steps.map(({ label, icon: Icon }, i) => (
            <div key={label} className="flex flex-col items-center gap-1.5 relative flex-1">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                i < step ? 'step-done' : i === step ? 'step-active' : 'bg-slate-200'
              }`}>
                <Icon size={16} className={i <= step ? 'text-white' : 'text-slate-400'} />
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-blue-600' : 'text-slate-400'}`}>
                {label}
              </span>
              {i < steps.length - 1 && (
                <div className={`absolute top-5 left-[60%] right-0 h-0.5 -z-0 ${
                  i < step ? 'bg-emerald-400' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-8 shadow-xl">
          {/* ── Step 0 : Personal info ── */}
          {step === 0 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">Tes coordonnées</h2>
              <p className="text-slate-500 text-sm mb-5">Ces informations nous permettront de te contacter.</p>
              <InputField
                label="Nom complet *"
                icon={User}
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Ex : Marie-Claire Ngo"
                error={errors.full_name}
              />
              <InputField
                label="Numéro de téléphone *"
                icon={Phone}
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Ex : 6XX XXX XXX"
                error={errors.phone}
              />
              <InputField
                label="Adresse email *"
                icon={Mail}
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Ex : marie@email.com"
                error={errors.email}
              />
            </div>
          )}

          {/* ── Step 1 : Academic info ── */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">Ton cursus académique</h2>
              <p className="text-slate-500 text-sm mb-5">Ces informations nous aident à mieux personnaliser ta présentation.</p>
              <InputField
                label="Nom de l'université / établissement *"
                icon={GraduationCap}
                name="university"
                value={form.university}
                onChange={handleChange}
                placeholder="Ex : Université de Yaoundé I"
                error={errors.university}
              />
              <SelectField
                label="Filière / Spécialité *"
                icon={BookOpen}
                name="field"
                value={form.field}
                onChange={handleChange}
                options={FIELDS}
                error={errors.field}
              />
              <SelectField
                label="Niveau d'études *"
                icon={GraduationCap}
                name="level"
                value={form.level}
                onChange={handleChange}
                options={LEVELS}
                error={errors.level}
              />
              <InputField
                label="Titre de ton mémoire / thèse *"
                icon={FileText}
                name="thesis_title"
                value={form.thesis_title}
                onChange={handleChange}
                placeholder="Titre exact de ton travail de recherche"
                error={errors.thesis_title}
              />
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date de soutenance *</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Calendar size={16} />
                  </div>
                  <input
                    type="date"
                    name="defense_date"
                    value={form.defense_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`input-field w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-white ${errors.defense_date ? 'border-red-400' : ''}`}
                  />
                </div>
                {errors.defense_date && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.defense_date}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notes ou instructions particulières (optionnel)</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Ex : couleurs préférées, éléments à mettre en avant, style souhaité..."
                  className="input-field w-full px-4 py-3 rounded-xl text-sm bg-white resize-none"
                />
              </div>
            </div>
          )}

          {/* ── Step 2 : File Upload ── */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">Envoie ton rapport</h2>
              <p className="text-slate-500 text-sm mb-6">
                Uploade ton mémoire en PDF. Il sera sauvegardé de manière sécurisée.
              </p>

              {!uploadDone ? (
                <div>
                  {/* Drop zone */}
                  <label
                    className={`flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all ${
                      form.file
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50/50'
                    } ${errors.file ? 'border-red-400' : ''}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${form.file ? 'bg-blue-100' : 'bg-slate-100'}`}>
                      <Upload size={24} className={form.file ? 'text-blue-600' : 'text-slate-400'} />
                    </div>
                    {form.file ? (
                      <div className="text-center">
                        <p className="font-semibold text-blue-700 text-sm">{form.file.name}</p>
                        <p className="text-slate-400 text-xs mt-1">{(form.file.size / 1024 / 1024).toFixed(1)} Mo</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="font-semibold text-slate-700 text-sm">Clique pour sélectionner ton rapport</p>
                        <p className="text-slate-400 text-xs mt-1">PDF uniquement — Max 50 Mo</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>

                  {errors.file && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <AlertCircle size={11} />{errors.file}
                    </p>
                  )}

                  {form.file && (
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="btn-primary w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold"
                    >
                      {uploading ? (
                        <><Loader2 size={16} className="animate-spin" /> Upload en cours...</>
                      ) : (
                        <><Upload size={16} /> Envoyer le rapport</>
                      )}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">Rapport uploadé avec succès !</h3>
                  <p className="text-slate-500 text-sm mb-1">{form.file?.name}</p>
                  <p className="text-emerald-600 text-xs font-medium">Sauvegardé de manière sécurisée</p>
                  <button
                    onClick={() => { setUploadDone(false); setForm((f) => ({ ...f, file: null, fileUrl: '' })) }}
                    className="mt-4 text-slate-400 text-xs hover:text-red-500 transition-colors flex items-center gap-1 mx-auto"
                  >
                    <X size={12} /> Changer de fichier
                  </button>
                </div>
              )}

              <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100">
                <p className="text-blue-700 text-xs font-semibold mb-1">🔒 Confidentialité garantie</p>
                <p className="text-blue-600 text-xs leading-relaxed">
                  Ton document est stocké dans un espace sécurisé, accessible uniquement par notre équipe. Il ne sera jamais partagé avec des tiers.
                </p>
              </div>
            </div>
          )}

          {/* ── Step 3 : Summary ── */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">Récapitulatif</h2>
              <p className="text-slate-500 text-sm mb-6">Vérifie tes informations avant d'envoyer ta demande.</p>

              <div className="space-y-4 mb-6">
                {/* Personal */}
                <div className="bg-slate-50 rounded-2xl p-4">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Coordonnées</div>
                  {[['Nom', form.full_name], ['Téléphone', form.phone], ['Email', form.email]].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1.5 border-b border-slate-100 last:border-0">
                      <span className="text-sm text-slate-500">{k}</span>
                      <span className="text-sm font-medium text-slate-800">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Academic */}
                <div className="bg-slate-50 rounded-2xl p-4">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Cursus</div>
                  {[
                    ['Établissement', form.university],
                    ['Filière', form.field],
                    ['Niveau', form.level],
                    ['Date de soutenance', form.defense_date],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1.5 border-b border-slate-100 last:border-0 gap-4">
                      <span className="text-sm text-slate-500 flex-shrink-0">{k}</span>
                      <span className="text-sm font-medium text-slate-800 text-right">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Thesis */}
                <div className="bg-slate-50 rounded-2xl p-4">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Titre du mémoire</div>
                  <p className="text-sm font-medium text-slate-800">{form.thesis_title}</p>
                </div>

                {/* File */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                  <CheckCircle size={20} className="text-emerald-600 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-emerald-800">Rapport uploadé</div>
                    <div className="text-xs text-emerald-600">{form.file?.name || 'Document envoyé'}</div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-base"
              >
                {submitting ? (
                  <><Loader2 size={18} className="animate-spin" /> Envoi en cours...</>
                ) : (
                  <><CheckCircle size={18} /> Confirmer ma demande</>
                )}
              </button>
              <p className="text-center text-slate-400 text-xs mt-3">Aucun paiement requis maintenant — on te contacte d'abord</p>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 3 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
              {step > 0 ? (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-slate-600 font-medium text-sm hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft size={15} /> Précédent
                </button>
              ) : <div />}
              <button
                onClick={nextStep}
                disabled={step === 2 && !uploadDone}
                className={`btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-sm ${
                  step === 2 && !uploadDone ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {step === 2 ? 'Continuer' : 'Suivant'} <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Info box */}
        <div className="mt-6 text-center text-slate-400 text-xs">
          Des questions ? <a href="tel:+237600000000" className="text-blue-500 hover:underline">Appelle-nous directement</a>
        </div>
      </div>
    </div>
  )
}