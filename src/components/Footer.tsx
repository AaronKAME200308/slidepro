import { Link } from 'react-router-dom'
import { Presentation, Mail, Phone, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl btn-primary flex items-center justify-center">
                <Presentation size={18} className="text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white">
                Slide<span className="gradient-text">Pro</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
              Nous transformons ton mémoire en une présentation PowerPoint professionnelle,
              animée et percutante en moins de 3 jours.
            </p>
            {/* <div className="flex items-center gap-3">
              {[
                { icon: Circle, label: 'Instagram' },
                { icon: Square, label: 'LinkedIn' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors duration-200"
                >
                  <Icon size={15} className="text-slate-300" />
                </a>
              ))}
            </div> */}
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-3">
              {[
                { label: 'Accueil', to: '/' },
                { label: 'Comment ça marche', to: '/processus' },
                { label: 'Nos réalisations', to: '/portfolio' },
                { label: 'À propos', to: '/a-propos' },
                { label: 'Prendre rendez-vous', to: '/rendez-vous' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm hover:text-blue-400 transition-colors flex items-center gap-1 group"
                  >
                    {label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:+237673846813" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors">
                  <Phone size={14} />
                  +237 6 73 84 68 13
                </a>
              </li>
              <li>
                <a href="mailto:contact@slidePro.cm" className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors">
                  <Mail size={14} />
                  contact@slidePro.cm
                </a>
              </li>
            </ul>

            <div className="mt-6 p-3 rounded-lg bg-blue-600/10 border border-blue-600/20">
              <p className="text-xs text-blue-400 font-medium">Délai garanti</p>
              <p className="text-xs text-slate-400 mt-1">Livraison en 05 jours maximum</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} SlidePro Studio. Tous droits réservés.
          </p>
          <p className="text-xs text-slate-600">
            Conçu et développé par <a href="https://kame-aaron-portfolio.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">SlidePro Team</a>.
          </p>
        </div>
      </div>
    </footer>
  )
}