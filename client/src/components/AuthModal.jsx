import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Auth, AuthView } from './ui/auth-form'

/**
 * AuthModal
 * Props:
 *  - isOpen: boolean
 *  - initialView: 'sign-in' | 'sign-up'  (AuthView constant)
 *  - onClose: () => void
 */
const AuthModal = ({ isOpen, initialView = AuthView.SIGN_IN, onClose }) => {
  // Escape key closes modal
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ───────────────────────────── */}
          <motion.div
            key="auth-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-[6px]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* ── Modal card ─────────────────────────── */}
          <motion.div
            key="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-label={initialView === AuthView.SIGN_IN ? 'Sign in' : 'Create account'}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.96, y: 16  }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-md pointer-events-auto">

              {/* The Auth form */}
              <Auth initialView={initialView} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AuthModal
