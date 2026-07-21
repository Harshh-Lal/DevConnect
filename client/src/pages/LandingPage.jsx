import { useState } from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import FeaturesSection from '../components/FeaturesSection'
import CtaSection from '../components/CtaSection'
import Footer from '../components/Footer'
import AuthModal from '../components/AuthModal'
import { AuthView } from '../components/ui/auth-form'

const LandingPage = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authInitialView, setAuthInitialView] = useState(AuthView.SIGN_IN)

  const openAuth = (view = AuthView.SIGN_IN) => {
    setAuthInitialView(view)
    setAuthModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar openAuth={openAuth} />
      <main>
        <HeroSection openAuth={openAuth} />
        <FeaturesSection />
        <CtaSection openAuth={openAuth} />
      </main>
      <Footer />

      <AuthModal
        isOpen={authModalOpen}
        initialView={authInitialView}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  )
}

export default LandingPage
