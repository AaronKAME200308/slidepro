import { Link } from 'react-router-dom'
import {
  FileText, Phone, Wand2, Presentation, CheckCircle, Clock,
  Upload, Zap, ArrowRight, Layers, Palette, Play, Shield
} from 'lucide-react'

const timelineSteps = [
  {
    num: '01', icon: FileText, title: 'Tu soumets ta demande', subtitle: 'En quelques minutes',
    gradient: 'linear-gradient(135deg, #1d4ed8 0%, #0891b2 100%)', accent: '#1d4ed8',
    desc: "Remplis notre formulaire de rendez-vous en ligne avec tes informations personnelles, le titre de ton mémoire, ta filière et ta date de soutenance. Tu uploades ensuite ton rapport PDF directement depuis la plateforme, qui le sauvegarde automatiquement dans notre Google Drive sécurisé.",
    details: ['Formulaire rapide 5 minutes', 'Upload PDF sécurisé', 'Aucun compte requis'],
  },
  {
    num: '02', icon: Phone, title: 'On te contacte dans les 24h', subtitle: 'Appel de cadrage',
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', accent: '#4f46e5',
    desc: "Notre équipe te rappelle par téléphone pour discuter de tes attentes spécifiques : couleurs préférées, style de présentation, nombre de slides, éléments à mettre en avant, et toute autre instruction particulière. Cet appel dure 10 à 20 minutes maximum.",
    details: ['Appel sous 24h maximum', 'Discussion de tes attentes', 'Choix du style & couleurs'],
  },
  {
    num: '03', icon: Wand2, title: 'On crée ta présentation', subtitle: 'Notre studio au travail',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)', accent: '#7c3aed',
    desc: "Nos designers créent ton PowerPoint avec une attention particulière aux détails : hiérarchie de l'information, visuels percutants, animations fluides, transitions élégantes et cohérence graphique. Nous structurons le contenu de façon claire pour impacter ton jury dès la première slide.",
    details: ['Animations & transitions modernes', 'Design professionnel personnalisé', 'Contenu structuré & synthétisé'],
  },
  {
    num: '04', icon: Presentation, title: 'Tu reçois ton PPT en 72h', subtitle: 'Livraison finale',
    gradient: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)', accent: '#059669',
    desc: "Tu reçois ton fichier PowerPoint par email ou WhatsApp, prêt à être présenté. Si nécessaire, une révision mineure est incluse. Tu es maintenant armé pour impressionner ton jury et défendre ton travail avec confiance.",
    details: ['Livraison par email & WhatsApp', '1 révision incluse', 'Fichier .pptx & PDF fournis'],
  },
]

const advantages = [
  { icon: Palette, title: 'Design sur-mesure', desc: 'Chaque présentation est unique, conçue selon tes instructions et les codes de ta filière.', accent: '#db2777', bg: 'rgba(219,39,119,0.08)', border: 'rgba(219,39,119,0.15)' },
  { icon: Play, title: 'Animations modernes', desc: "Transitions fluides, apparitions progressives, graphiques animés qui captivent l'attention.", accent: '#2563eb', bg: 'rgba(37,99,235,0.08)', border: 'rgba(37,99,235,0.15)' },
  { icon: Clock, title: '72h garanties', desc: 'Nous respectons ton délai. Si tu as ta soutenance dans 3 jours, on livre dans 2.', accent: '#d97706', bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.15)' },
  { icon: Layers, title: 'Contenu synthétisé', desc: "On extrait l'essentiel de ton rapport pour créer des slides claires, percutantes et mémorables.", accent: '#059669', bg: 'rgba(5,150,105,0.08)', border: 'rgba(5,150,105,0.15)' },
  { icon: Shield, title: 'Confidentialité totale', desc: 'Ton rapport et tes données sont protégés. Accès restreint à notre équipe uniquement.', accent: '#4f46e5', bg: 'rgba(79,70,229,0.08)', border: 'rgba(79,70,229,0.15)' },
  { icon: Upload, title: 'Livraison multiple', desc: 'Tu reçois le fichier en format .pptx modifiable ET en PDF prêt à imprimer.', accent: '#7c3aed', bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.15)' },
]

const faqs = [
  { q: "Mon mémoire est très long (100+ pages). C'est possible ?", a: "Absolument. Nous lisons l'intégralité de ton rapport et sélectionnons les informations clés à présenter. Plus le rapport est riche, plus nous avons de matière pour créer des slides percutantes." },
  { q: 'Combien de slides vais-je avoir ?', a: "En général entre 15 et 25 slides selon la richesse de ton rapport. Nous discutons du nombre exact lors de l'appel de cadrage." },
  { q: 'Je peux demander des modifications après la livraison ?', a: "Oui, une révision mineure est incluse dans la prestation. Des modifications majeures peuvent faire l'objet d'un ajustement tarifaire." },
  { q: 'Dans quelle ville opérez-vous ?', a: 'Nous opérons à 100% en ligne. Peu importe où tu es au Cameroun (Yaoundé, Douala, Bafoussam, etc.), nous livrons partout.' },
]

export default function ProcessPage() {
  return (
    <div className="font-body">
      {/* HERO */}
      <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: 'linear-gradient(160deg, #f8faff 0%, #eef2ff 40%, #f0fdf4 100%)' }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', opacity: 0.12, filter: 'blur(80px)', transform: 'translate(20%, -20%)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', opacity: 0.1, filter: 'blur(60px)', transform: 'translate(-20%, 20%)' }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)' }}>
            <Zap size={13} />Processus transparent
          </div>
          <h1 className="font-display font-bold text-slate-900 mb-6 leading-tight" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
            Comment on transforme{' '}
            <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ton rapport</span>
            {' '}en chef-d'œuvre
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
            4 étapes simples, un résultat professionnel. Du dépôt de ton rapport à la livraison, voici exactement ce qui se passe.
          </p>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-0">
            {timelineSteps.map(({ num, icon: Icon, title, subtitle, gradient, accent, desc, details }, idx) => (
              <div key={num} className="relative flex gap-8 pb-16 last:pb-0">
                <div className="flex flex-col items-center w-16 flex-shrink-0">
                  <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg z-10 text-white" style={{ background: gradient }}>
                    <Icon size={24} />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white text-slate-700 text-xs font-bold flex items-center justify-center shadow">{idx + 1}</span>
                  </div>
                  {idx < timelineSteps.length - 1 && (
                    <div className="flex-1 w-0.5 mt-3 rounded-full min-h-[80px]" style={{ background: `linear-gradient(to bottom, ${accent}40, ${accent}10)` }} />
                  )}
                </div>
                <div
                  className="flex-1 pt-2 pb-8 last:pb-0 rounded-2xl px-6 transition-all duration-300"
                  style={{ border: '1px solid transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${accent}05`; e.currentTarget.style.borderColor = `${accent}15` }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}
                >
                  <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: accent }}>{subtitle}</div>
                  <h3 className="font-display text-2xl font-bold text-slate-900 mb-3">{title}</h3>
                  <p className="text-slate-500 leading-relaxed mb-5">{desc}</p>
                  <div className="flex flex-wrap gap-3">
                    {details.map(d => (
                      <div key={d} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full" style={{ background: `${accent}08`, color: accent, border: `1px solid ${accent}15` }}>
                        <CheckCircle size={13} />{d}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #f8faff 0%, #eef2ff 50%, #f0fdf4 100%)' }}>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', opacity: 0.07, filter: 'blur(60px)', transform: 'translate(20%, -20%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-slate-900 mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Pourquoi choisir{' '}
              <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>SlideZen ?</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Tout ce qui rend notre prestation unique et adaptée aux étudiants en soutenance</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map(({ icon: Icon, title, desc, accent, bg, border }) => (
              <div
                key={title}
                className="rounded-3xl p-7 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = `${accent}25`; e.currentTarget.style.boxShadow = `0 16px 40px ${accent}12` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.05)' }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4" style={{ background: bg, border: `1px solid ${border}` }}>
                  <Icon size={22} style={{ color: accent }} />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-slate-900 mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Questions{' '}
              <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>fréquentes</span>
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group rounded-2xl cursor-pointer" style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
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

      {/* CTA */}
      <section className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #312e81 0%, #4f46e5 40%, #0891b2 100%)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full border border-white/5 translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full border border-white/5 -translate-x-1/4 translate-y-1/4" />
          <div className="absolute top-0 left-0 w-80 h-80 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', filter: 'blur(60px)', transform: 'translate(-20%, -30%)' }} />
        </div>
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>Tu es convaincu ? Alors allons-y !</h2>
          <p className="text-blue-100 mb-8 text-lg">Prends rendez-vous maintenant, on s'occupe du reste.</p>
          <Link
            to="/rendez-vous"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all"
            style={{ background: '#fff', color: '#4f46e5', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.25)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)' }}
          >
            <Zap size={16} />Prendre rendez-vous <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}