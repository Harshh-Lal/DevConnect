import { useState, useEffect, useRef } from 'react'
import { cn } from '../lib/utils'
import { useScroll } from './ui/use-scroll'
import { MenuToggleIcon } from './ui/menu-toggle-icon'
import AuthModal from './AuthModal'
import { AuthView } from './ui/auth-form'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Explore', href: '#explore' },
  { label: 'Developers', href: '#developers' },
]

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const scrolled = useScroll(10)

  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authInitialView, setAuthInitialView] = useState(AuthView.SIGN_IN)

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [profileOpen, setProfileOpen] = useState(false)
  const profileDropdownRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the dropdown is open, AND the click happened outside of our ref, close it!
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
    }
    // Listen for mouse clicks on the whole page
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    window.location.href = '/' // Kick them back to landing page
  }

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
          {isLoggedIn ? (
            /* ── STATE: LOGGED IN ── */
            <div className="relative cursor-pointer" ref={profileDropdownRef}>
              {/* Profile Picture */}
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center justify-center rounded-full outline-none focus:ring-2 focus:ring-[#f5a623]"
              >
                <img 
                  src="https://github.com/shadcn.png" // Placeholder image
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-[#333] hover:border-[#666] transition-colors"
                />
              </button>
              
              {/* Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 p-2 bg-[#111] border border-[#2a2a2a] rounded-md shadow-xl z-[100]">
                  <a href="/profile" className="block w-full text-left px-3 py-2 text-sm text-[#ccc] hover:bg-[#181818] hover:text-[#f0f0f0] rounded-sm transition-colors">
                    View Account
                  </a>
                  <a href="/settings" className="block w-full text-left px-3 py-2 text-sm text-[#ccc] hover:bg-[#181818] hover:text-[#f0f0f0] rounded-sm transition-colors">
                    Settings
                  </a>
                  <div className="h-px bg-[#2a2a2a] my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-[#181818] hover:text-red-300 rounded-sm transition-colors"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── STATE: LOGGED OUT ── */
            <>
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
            </>
          )}
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
            {isLoggedIn ? (
              /* ── STATE: LOGGED IN (MOBILE) ── */
              <>
                <div className="flex items-center gap-3 mb-4 px-2">
                  <img src="https://github.com/shadcn.png" alt="Profile" className="w-10 h-10 rounded-full border border-[#333]" />
                  <span className="text-[#f0f0f0] font-medium">My Account</span>
                </div>
                <a href="/profile" className="w-full text-center border border-[#333] text-[#f0f0f0] px-4 py-3 text-sm rounded-sm hover:bg-[#181818]">
                  View Account
                </a>
                <button onClick={handleLogout} className="w-full bg-red-500/10 text-red-400 border border-red-500/20 font-semibold px-4 py-3 text-sm rounded-sm hover:bg-red-500/20">
                  Log out
                </button>
              </>
            ) : (
              /* ── STATE: LOGGED OUT (MOBILE) ── */
              <>
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
              </>
            )}
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
