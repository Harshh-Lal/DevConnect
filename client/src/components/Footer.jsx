import { GitFork } from 'lucide-react'
import { motion } from 'framer-motion'

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="border-t border-[#1a1a1a] py-6"
    >
      <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
        <span className="font-mono text-xs text-[#555]">devconnect · 2026</span>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-[#555]">Made by Harsh</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            id="footer-github-link"
          >
            <GitFork size={14} className="text-[#555] hover:text-[#888] transition-colors duration-150 cursor-pointer" />
          </a>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer
