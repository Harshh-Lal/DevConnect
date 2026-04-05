import { Code2, GitFork, Users } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: <Code2 size={20} className="text-[#f5a623]" />,
    title: 'Projects that tell a story',
    body: 'Post projects with context — the problem, the stack, the decisions.',
    id: 'features-card-projects',
  },
  {
    icon: <GitFork size={20} className="text-[#f5a623]" />,
    title: 'GitHub, but with narrative',
    body: 'Auto-sync your top repos. Show what you built, not just what you committed.',
    id: 'features-card-github',
  },
  {
    icon: <Users size={20} className="text-[#f5a623]" />,
    title: 'A feed built for builders',
    body: 'Follow developers you admire. See what they\'re shipping.',
    id: 'features-card-feed',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="bg-[#0a0a0a] border-t border-[#1a1a1a] py-24"
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <p className="font-mono text-xs text-[#f5a623] uppercase tracking-widest mb-3">
            WHY DEVCONNECT
          </p>
          <h2
            className="text-4xl text-[#f0f0f0] tracking-tight"
            style={{ fontFamily: '"Instrument Serif", serif' }}
          >
            Built the way developers actually work
          </h2>
        </motion.div>

        {/* 3-column grid with gap-px border trick */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-[#222]">
          {features.map((feature, i) => (
            <motion.div
              key={feature.id}
              id={feature.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-[#0a0a0a] p-8 hover:bg-[#0f0f0f] transition-colors duration-200 group"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="font-sans font-semibold text-[#f0f0f0] text-base mb-2">
                {feature.title}
              </h3>
              <p className="font-sans text-sm text-[#888] leading-relaxed">
                {feature.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
