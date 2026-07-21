import { motion } from 'framer-motion'

const CtaSection = ({ openAuth }) => {
  return (
    <section
      id="cta"
      className="bg-[#0a0a0a] border-t border-[#1a1a1a] py-28 text-center px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto"
      >
        <h2
          className="text-4xl md:text-5xl text-[#f0f0f0] tracking-tight"
          style={{ fontFamily: '"Instrument Serif", serif' }}
        >
          Ready to build your developer identity?
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          viewport={{ once: true }}
        >
          <button
            id="cta-create-profile-btn"
            onClick={() => openAuth?.('sign-up')}
            className="mt-8 bg-[#f5a623] text-black font-semibold text-sm px-8 py-4 rounded-sm hover:bg-[#e09620] transition-colors duration-150 cursor-pointer font-sans"
          >
            Create Your Profile →
          </button>

          <p className="font-mono text-xs text-[#555] mt-4">
            Already have an account?{' '}
            <button
              id="cta-login-link"
              onClick={() => openAuth?.('sign-in')}
              className="text-[#888] hover:text-[#f0f0f0] transition-colors duration-150 bg-transparent border-none cursor-pointer font-mono text-xs p-0"
            >
              Log in
            </button>
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default CtaSection

