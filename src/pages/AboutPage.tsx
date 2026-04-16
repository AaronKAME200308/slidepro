import { useState, type FormEvent } from 'react'
import {
  Zap, Target, Heart, Shield, Mail, Phone, MapPin,
  Send, Loader2, CheckCircle, Users, Lightbulb, Star
} from 'lucide-react'
import { supabase } from '../services/supabase'

const values = [
  { icon: Zap, title: 'Rapidité', desc: "Nous comprenons la pression des soutenances. C'est pourquoi nous garantissons une livraison en 72h.", accent: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)' },
  { icon: Target, title: 'Précision', desc: 'Chaque slide est pensée pour mettre en valeur ton travail et convaincre ton jury.', accent: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)' },
  { icon: Heart, title: 'Passion', desc: "On aime ce qu'on fait. Le design, la narration visuelle, et le succès de nos clients.", accent: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.15)' },
  { icon: Shield, title: 'Confiance', desc: 'Tes données et ton rapport sont en sécurité. Confidentialité totale garantie.', accent: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.15)' },
]

const team = [
  { name: 'Jean-Paul K.', role: 'Fondateur & Designer Principal', bio: "Designer PowerPoint depuis 5 ans, ancien étudiant de l'École Polytechnique. Passionné par la communication visuelle.", emoji: '🎨', gradient: 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 100%)' },
  { name: 'Aïcha M.', role: 'Directrice de Projet', bio: 'Coordinatrice de toutes les demandes. Elle veille à ce que chaque étudiant soit suivi avec attention.', emoji: '📋', gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' },
  { name: 'Boris T.', role: 'Designer & Animateur', bio: 'Spécialiste des animations PowerPoint et des visualisations de données. Maître des transitions.', emoji: '✨', gradient: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)' },
]

const faqs = [
  { q: 'Quelles sont vos heures de disponibilité ?', a: 'Notre équipe est disponible du lundi au samedi, de 8h à 20h (heure de Yaoundé). Pour les urgences de soutenance, nous nous adaptons.' },
  { q: 'Comment se passe le paiement ?', a: "Le paiement se fait directement entre vous et notre équipe lors de l'appel de cadrage. Nous acceptons Mobile Money (Orange Money, MTN MoMo) et le virement." },
  { q: 'Puis-je voir des exemples avant de commander ?', a: "Oui ! Consulte notre page \"Réalisations\" pour voir les projets que nous avons déjà livrés, ou demande à notre équipe de te partager des exemples lors de l'appel." },
  { q: 'Et si je ne suis pas satisfait du résultat ?', a: "Une révision mineure est incluse. Si le rendu est très éloigné de ce qui a été discuté lors de l'appel de cadrage, nous travaillons avec toi pour corriger." },
]

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
    <div className="font-body">
      {/* HERO */}
      <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: 'linear-gradient(160deg, #f8faff 0%, #eef2ff 40%, #f0fdf4 100%)' }}>
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', opacity: 0.12, filter: 'blur(80px)', transform: 'translate(-30%, -30%)' }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', opacity: 0.1, filter: 'blur(60px)', transform: 'translate(20%, 20%)' }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)' }}>
            <Users size={13} />Notre histoire
          </div>
          <h1 className="font-display font-bold text-slate-900 mb-6 leading-tight" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
            Qui se cache derrière{' '}
            <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SlideZen ?</span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Nous sommes une équipe de designers et d'anciens étudiants qui comprennent le stress de la soutenance. Notre mission : te donner une présentation qui te donne confiance.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)' }}>
                <Lightbulb size={13} />Notre mission
              </div>
              <h2 className="font-display font-bold text-slate-900 mb-5" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
                Donner à chaque étudiant les armes visuelles pour réussir
              </h2>
              <p className="text-slate-500 leading-relaxed mb-5">
                Au Cameroun, de nombreux étudiants arrivent en soutenance avec des présentations PowerPoint basiques qui ne font pas honneur à des mois de travail. Nous avons créé SlideZen pour changer ça.
              </p>
              <p className="text-slate-500 leading-relaxed mb-6">
                Un mémoire bien présenté, c'est un jury qui est déjà conquis avant même que tu commences à parler. C'est une mention supérieure. C'est la confiance en soi pour défendre 5 ans d'études.
              </p>
              <div className="flex flex-col gap-3">
                {['50+ étudiants accompagnés depuis 2023', 'Taux de satisfaction : 98%', 'Opérationnel dans tout le Cameroun'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-slate-700 text-sm">
                    <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />{item}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: '50+', label: 'Projets livrés', icon: '📊', gradient: 'linear-gradient(135deg, #eff6ff, #dbeafe)', accent: '#1d4ed8' },
                { val: '72h', label: 'Délai garanti', icon: '⚡', gradient: 'linear-gradient(135deg, #eef2ff, #e0e7ff)', accent: '#4f46e5' },
                { val: '98%', label: 'Satisfaction', icon: '⭐', gradient: 'linear-gradient(135deg, #fffbeb, #fef3c7)', accent: '#d97706' },
                { val: '3', label: "Ans d'expérience", icon: '🏆', gradient: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', accent: '#059669' },
              ].map(({ val, label, icon, gradient, accent }) => (
                <div
                  key={label}
                  className="rounded-3xl p-6 text-center transition-all duration-300"
                  style={{ background: gradient, border: `1px solid ${accent}20` }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${accent}20` }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div className="text-3xl mb-2">{icon}</div>
                  <div className="font-display text-3xl font-bold text-slate-900 mb-1">{val}</div>
                  <div className="text-slate-500 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #f8faff 0%, #eef2ff 50%, #f0fdf4 100%)' }}>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', opacity: 0.07, filter: 'blur(60px)', transform: 'translate(20%, -20%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-slate-900 mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Nos{' '}
              <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>valeurs</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc, accent, bg, border }) => (
              <div
                key={title}
                className="rounded-3xl p-7 text-center transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = `${accent}30`; e.currentTarget.style.boxShadow = `0 16px 40px ${accent}15` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.05)' }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ background: bg, border: `1px solid ${border}` }}>
                  <Icon size={26} style={{ color: accent }} />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-slate-900 mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              L'équipe{' '}
              <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SlideZen</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Des passionnés qui travaillent pour ton succès</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map(({ name, role, bio, emoji, gradient }) => (
              <div
                key={name}
                className="rounded-3xl overflow-hidden transition-all duration-300"
                style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(99,102,241,0.12)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#e2e8f0' }}
              >
                <div className="h-32 flex items-center justify-center relative overflow-hidden" style={{ background: gradient }}>
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border border-white/10" />
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full border border-white/10" />
                  </div>
                  <span className="text-5xl relative z-10" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}>{emoji}</span>
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-display text-xl font-bold text-slate-900 mb-1">{name}</h3>
                  <div className="inline-block text-xs px-3 py-1 rounded-full font-semibold mb-4" style={{ background: 'rgba(99,102,241,0.08)', color: '#4f46e5', border: '1px solid rgba(99,102,241,0.15)' }}>{role}</div>
                  <p className="text-slate-500 text-sm leading-relaxed">{bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #f8faff 0%, #eef2ff 50%, #f0fdf4 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-slate-900 mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Questions{' '}
              <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>fréquentes</span>
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group rounded-2xl cursor-pointer" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <summary className="flex items-center justify-between font-semibold text-slate-800 list-none text-sm leading-relaxed">
                  {q}
                  <span className="ml-4 w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 group-open:rotate-45 transition-transform" style={{ background: 'rgba(99,102,241,0.1)', color: '#4f46e5' }}>+</span>
                </summary>
                <p className="mt-4 text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-display font-bold text-slate-900 mb-4" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
                Contacte{' '}
                <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>notre équipe</span>
              </h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                Tu as des questions avant de prendre rendez-vous ? N'hésite pas à nous écrire ou nous appeler directement.
              </p>
              <div className="space-y-5">
                {[
                  { icon: Phone, label: 'Téléphone', value: '+237 6XX XXX XXX', href: 'tel:+237600000000', accent: '#4f46e5' },
                  { icon: Mail, label: 'Email', value: 'contact@slidezen.cm', href: 'mailto:contact@slidezen.cm', accent: '#0891b2' },
                  { icon: MapPin, label: 'Localisation', value: 'Yaoundé, Cameroun (100% en ligne)', href: '#', accent: '#059669' },
                ].map(({ icon: Icon, label, value, href, accent }) => (
                  <a key={label} href={href} className="flex items-start gap-4 group transition-all">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                      style={{ background: `${accent}10`, border: `1px solid ${accent}20` }}
                      onMouseEnter={e => { e.currentTarget.style.background = accent; e.currentTarget.style.borderColor = accent }}
                      onMouseLeave={e => { e.currentTarget.style.background = `${accent}10`; e.currentTarget.style.borderColor = `${accent}20` }}
                    >
                      <Icon size={18} style={{ color: accent }} className="group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
                      <div className="text-slate-800 font-medium text-sm">{value}</div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="mt-8 p-5 rounded-2xl text-white" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #0891b2 100%)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Star size={16} style={{ color: '#fde68a', fill: '#fde68a' }} />
                  <span className="text-sm font-bold">Horaires de réponse</span>
                </div>
                <p className="text-blue-100 text-sm">Lun–Sam · 8h00–20h00</p>
                <p className="text-blue-200 text-xs mt-1">Réponse garantie sous 24h ouvrables</p>
              </div>
            </div>
            <div className="rounded-3xl p-8" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', border: '1px solid #e2e8f0', boxShadow: '0 16px 48px rgba(99,102,241,0.08)' }}>
              {sent ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#dcfce7' }}>
                    <CheckCircle size={30} className="text-emerald-600" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">Message envoyé !</h3>
                  <p className="text-slate-500 text-sm">On te revient très bientôt.</p>
                </div>
              ) : (
                <form onSubmit={handleContact} className="space-y-5">
                  <h3 className="font-display text-2xl font-bold text-slate-900 mb-5">Envoie-nous un message</h3>
                  {[
                    { label: 'Ton nom', name: 'name', type: 'text', placeholder: 'Ex : Jean-Baptiste' },
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
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{ background: '#f8fafc', border: `1.5px solid ${cfErrors[name] ? '#f87171' : '#e2e8f0'}` }}
                        onFocus={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#fff' }}
                        onBlur={e => { e.currentTarget.style.borderColor = cfErrors[name] ? '#f87171' : '#e2e8f0'; e.currentTarget.style.background = '#f8fafc' }}
                      />
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
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all"
                      style={{ background: '#f8fafc', border: `1.5px solid ${cfErrors.message ? '#f87171' : '#e2e8f0'}` }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#fff' }}
                      onBlur={e => { e.currentTarget.style.borderColor = cfErrors.message ? '#f87171' : '#e2e8f0'; e.currentTarget.style.background = '#f8fafc' }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold transition-all"
                    style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #0891b2 100%)', boxShadow: '0 8px 24px rgba(99,102,241,0.3)', opacity: sending ? 0.8 : 1 }}
                    onMouseEnter={e => { if (!sending) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.4)' } }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.3)' }}
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