import { useState, useEffect } from 'react'
import { cn } from '../lib/utils'
import { useScroll } from './ui/use-scroll'
import { MenuToggleIcon } from './ui/menu-toggle-icon'
import AuthModal from './AuthModal'
import { AuthView } from './ui/auth-form'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Explore',  href: '#explore'  },
  { label: 'Developers', href: '#developers' },
]

const Navbar = () => {
  const [open, setOpen]   = useState(false)
  const scrolled          = useScroll(10)

  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authInitialView, setAuthInitialView] = useState(AuthView.SIGN_IN)

  const openAuth = (view) => {
    setAuthInitialView(view)
    setAuthModalOpen(true)
    setOpen(false) // ensure modal cleanly overlays mobile menu
  }

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header
      className={cn(
        // base — sticky full-width bar
        'sticky top-0 z-50 mx-auto w-full',
        // desktop: pill/card shrink on scroll
        'md:max-w-6xl md:rounded-md md:border md:border-transparent md:transition-all md:duration-300 md:ease-out',
        scrolled && !open
          ? [
              // scrolled desktop state — floating card
              'md:top-4 md:max-w-5xl md:border-[#222222] md:shadow-lg',
              'bg-[#0a0a0a]/90 backdrop-blur-md',
            ]
          : open
          ? 'bg-[#0a0a0a]/95'
          : 'bg-transparent',
      )}
    >
      <nav
        className={cn(
          'flex h-14 w-full items-center justify-between px-6',
          'md:transition-all md:duration-300 md:ease-out',
          scrolled && 'md:h-12 md:px-4',
        )}
      >
        {/* ── Logo ── */}
        <a
          href="/"
          id="navbar-logo"
          className="flex items-center font-mono text-sm text-[#f0f0f0] tracking-tight select-none"
        >
          <span className="w-2 h-2 bg-[#f5a623] inline-block mr-2 rounded-none flex-shrink-0" />
          devconnect
        </a>

        {/* ── Desktop nav links ── */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              id={`nav-link-${link.label.toLowerCase()}`}
              className={cn(
                'px-3 py-1.5 rounded-sm text-sm font-sans',
                'text-[#888888] hover:text-[#f0f0f0] hover:bg-[#181818]',
                'transition-colors duration-150',
              )}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* ── Desktop action buttons ── */}
        <div className="hidden md:flex items-center gap-2">
          <button
            id="navbar-login-btn"
            onClick={() => openAuth(AuthView.SIGN_IN)}
            className={cn(
              'border border-[#333] text-[#f0f0f0] font-sans',
              'px-4 py-1.5 text-sm rounded-sm',
              'hover:bg-[#181818] transition-colors duration-150 cursor-pointer',
            )}
          >
            Log In
          </button>
          <button
            id="navbar-cta-btn"
            onClick={() => openAuth(AuthView.SIGN_UP)}
            className={cn(
              'bg-[#f5a623] text-black font-semibold font-sans',
              'px-4 py-1.5 text-sm rounded-sm',
              'hover:bg-[#e09620] transition-colors duration-150 cursor-pointer',
            )}
          >
            Get Started →
          </button>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          id="navbar-hamburger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className={cn(
            'md:hidden flex items-center justify-center',
            'w-9 h-9 rounded-sm border border-[#333]',
            'text-[#f0f0f0] hover:bg-[#181818] transition-colors duration-150',
          )}
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </button>
      </nav>

      {/* ══════════════════════════════════════
          Mobile full-screen overlay menu
      ══════════════════════════════════════ */}
      <div
        className={cn(
          'fixed inset-0 top-14 z-50 md:hidden',
          'bg-[#0a0a0a]/95 backdrop-blur-md border-t border-[#222222]',
          'flex flex-col overflow-hidden',
          open ? 'block' : 'hidden',
        )}
      >
        <div
          data-slot={open ? 'open' : 'closed'}
          className={cn(
            'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95',
            'data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95',
            'ease-out flex h-full w-full flex-col justify-between gap-y-2 p-6',
          )}
        >
          {/* Links */}
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center px-3 py-3 rounded-sm text-lg font-sans',
                  'text-[#f0f0f0] hover:text-[#888888] hover:bg-[#111111]',
                  'transition-colors duration-150 border-b border-[#1a1a1a]',
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Bottom action buttons */}
          <div className="flex flex-col gap-3 pb-4">
            <button
              id="mobile-login-btn"
              onClick={() => openAuth(AuthView.SIGN_IN)}
              className={cn(
                'w-full border border-[#333] text-[#f0f0f0] font-sans',
                'px-4 py-3 text-sm rounded-sm',
                'hover:bg-[#181818] transition-colors duration-150 cursor-pointer',
              )}
            >
              Log In
            </button>
            <button
              id="mobile-cta-btn"
              onClick={() => openAuth(AuthView.SIGN_UP)}
              className={cn(
                'w-full bg-[#f5a623] text-black font-semibold font-sans',
                'px-4 py-3 text-sm rounded-sm',
                'hover:bg-[#e09620] transition-colors duration-150 cursor-pointer',
              )}
            >
              Get Started →
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          Auth Modal Overlay
      ══════════════════════════════════════ */}
      <AuthModal
        isOpen={authModalOpen}
        initialView={authInitialView}
        onClose={() => setAuthModalOpen(false)}
      />
    </header>
  )
}

export default Navbar
