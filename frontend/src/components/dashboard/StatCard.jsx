import { motion } from 'framer-motion'

const COLOR_MAP = {
  primary: 'from-primary-500 to-primary-600 shadow-primary-600/25',
  ocean: 'from-ocean-500 to-ocean-600 shadow-ocean-600/25',
  sand: 'from-sand-400 to-sand-300 shadow-sand-400/25',
  red: 'from-red-400 to-red-500 shadow-red-500/25',
}

export default function StatCard({ icon: Icon, label, value, hint, color = 'primary', index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="glass-card p-5"
    >
      <div className={`mb-3 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br text-white shadow-md ${COLOR_MAP[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-display text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </motion.div>
  )
}
