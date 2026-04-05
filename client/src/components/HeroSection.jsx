import { GitBranch, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

const developerCards = [
  {
    username: '@alex_builds',
    avatar: 'AB',
    skills: ['React', 'TypeScript', 'Node.js'],
  },
  {
    username: '@priya_dev',
    avatar: 'PD',
    skills: ['Python', 'ML', 'FastAPI'],
  },
  {
    username: '@james_io',
    avatar: 'JI',
    skills: ['Rust', 'WebAssembly', 'Go'],
  },
]

// Stagger container for hero children
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

const fadeVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.7, delay: 0.5 },
  },
}

const HeroSection = () => {
  const globeContainerRef = useRef(null)

  // Dynamically load the Framer globe embed script
  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://framer.com/m/Globe-prod-gCnI.js"]'
    )
    if (!existingScript) {
      const script = document.createElement('script')
      script.src = 'https://framer.com/m/Globe-prod-gCnI.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-[#0a0a0a]"
    >
      {/* ---------- Globe (background) ---------- */}
      <div
        ref={globeContainerRef}
        className="absolute pointer-events-none"
        style={{
          bottom: '-18%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(900px, 110vw)',
          zIndex: 0,
          opacity: 0.55,
        }}
        aria-hidden="true"
      >
        {/* Framer Globe web component injected by the script above */}
        {/* eslint-disable-next-line react/no-unknown-property */}
        <framer-component id="globe-embed" style={{ width: '100%', height: '640px', display: 'block' }} />
      </div>

      {/* Gradient fade globe → background at bottom */}
      <div
        className="absolute bottom-0 w-full h-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #0a0a0a 40%, transparent)',
          zIndex: 2,
        }}
        aria-hidden="true"
      />

      {/* ---------- Dot grid ---------- */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #2a2a2a 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.6,
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* ---------- Hero content ---------- */}
      <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto px-6 pt-40 pb-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center w-full"
        >
          {/* 1. Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 border border-[#333] bg-[#111] rounded-full px-3 py-1">
              <GitBranch size={12} className="text-[#f5a623]" />
              <span className="font-mono text-xs text-[#888]">
                Developer Portfolio × Community
              </span>
              <ArrowRight size={10} className="text-[#555]" />
            </span>
          </motion.div>

          {/* 2. H1 Headline */}
          <motion.h1
            variants={itemVariants}
            className="mt-8 text-center leading-[1.05] tracking-tight text-[#f0f0f0]"
            style={{
              fontFamily: '"Instrument Serif", serif',
              fontSize: 'clamp(3rem, 8vw, 5rem)',
            }}
          >
            Where developers
            <br />
            don&apos;t just list skills —
            <br />
            they{' '}
            <em
              style={{ fontStyle: 'italic', color: '#f5a623' }}
            >
              prove
            </em>{' '}
            them.
          </motion.h1>

          {/* 3. Subtext */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-center text-base md:text-lg text-[#888888] max-w-md mx-auto leading-relaxed font-sans"
          >
            Showcase projects. Connect with developers. Get discovered.
          </motion.p>

          {/* 4. CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap gap-3 justify-center"
          >
            <button
              id="hero-get-started-btn"
              className="bg-[#f5a623] text-black font-semibold text-sm px-6 py-3 rounded-sm hover:bg-[#e09620] transition-colors duration-150 cursor-pointer font-sans"
            >
              Get Started →
            </button>
            <button
              id="hero-explore-btn"
              className="border border-[#333] text-[#f0f0f0] text-sm px-6 py-3 rounded-sm hover:bg-[#181818] transition-colors duration-150 cursor-pointer font-sans"
            >
              Explore Developers
            </button>
          </motion.div>

          {/* 5. Social proof */}
          <motion.p
            variants={fadeVariant}
            initial="hidden"
            animate="visible"
            className="mt-6 font-mono text-xs text-[#555] text-center"
          >
            Join developers already building their identity
          </motion.p>
        </motion.div>
      </div>

      {/* ---------- Developer cards peek ---------- */}
      <div
        className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 px-6 overflow-hidden"
        style={{ zIndex: 10, height: '120px' }}
        aria-hidden="true"
      >
        {developerCards.map((dev) => (
          <div
            key={dev.username}
            className="bg-[#111] border border-[#222] rounded-sm p-4 w-64 flex-shrink-0"
            style={{ marginTop: '60px' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-sm bg-[#222] flex items-center justify-center">
                <span className="font-mono text-[10px] text-[#555]">
                  {dev.avatar}
                </span>
              </div>
              <span className="font-mono text-xs text-[#888]">
                {dev.username}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {dev.skills.map((skill) => (
                <span
                  key={skill}
                  className="border border-[#333] font-mono text-[10px] text-[#666] px-2 py-0.5 uppercase"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* Gradient overlay on card strip */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, #0a0a0a 30%, transparent 100%)',
          }}
        />
      </div>
    </section>
  )
}

export default HeroSection
