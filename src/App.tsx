import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProcessPage from './pages/ProcessPage'
import PortfolioPage from './pages/PortfolioPage'
import BookingPage from './pages/BookingPage'
import AboutPage from './pages/AboutPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

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
        </Routes>
      </main>
      <Footer />
    </>
  )
}