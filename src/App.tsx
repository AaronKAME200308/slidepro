import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import ProcessPage from "./pages/ProcessPage";
import PortfolioPage from "./pages/PortfolioPage";
import BookingPage from "./pages/BookingPage";
import AboutPage from "./pages/AboutPage";
import AdminPortfolioPage from "./pages/AdminPortfoliopage";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/* ─────────────────────────────────────────────
   Configuration WhatsApp
───────────────────────────────────────────── */
const WHATSAPP_NUMBER = "237673846813";

const WHATSAPP_MESSAGE =
  "Bonjour, je souhaite discuter d'un projet avec vous.";

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

export default function App() {
  return (
    <>
      <ScrollToTop />

      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/processus" element={<ProcessPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/rendez-vous" element={<BookingPage />} />
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="/admin/portfolio" element={<AdminPortfolioPage />} />
        </Routes>
      </main>

      <Footer />

      {/* ── Bouton WhatsApp flottant ── */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter sur WhatsApp"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:-translate-y-1"
        style={{
          background: "linear-gradient(135deg, #25D366, #128C7E)",
          boxShadow:
            "0 6px 24px rgba(37,211,102,0.45), 0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <FaWhatsapp size={28} color="white" />

        {/* Effet pulse */}
        <span
          className="absolute w-14 h-14 rounded-full animate-ping"
          style={{
            background: "rgba(37,211,102,0.25)",
          }}
        />
      </a>
    </>
  );
}