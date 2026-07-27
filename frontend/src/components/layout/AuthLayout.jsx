import { motion } from 'framer-motion'
import { PawPrint, HeartPulse, Syringe, CalendarCheck2 } from 'lucide-react'

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left showcase panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-ocean-700 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-primary-400/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 text-xl backdrop-blur">🐾</div>
          <span className="font-display text-xl font-bold text-white">PetCare Hub</span>
        </div>

        <div className="relative z-10 space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-md font-display text-4xl font-bold leading-tight text-white"
          >
            Every wag, purr, and checkup — organized in one place.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-sm text-primary-50/90"
          >
            Track vaccinations, medical history, medicines, appointments and expenses for every pet in your family.
          </motion.p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { icon: Syringe, label: 'Vaccination Reminders' },
              { icon: HeartPulse, label: 'Medical Records' },
              { icon: CalendarCheck2, label: 'Appointment Timeline' },
              { icon: PawPrint, label: 'Multi-Pet Profiles' },
            ].map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                className="flex items-center gap-2.5 rounded-2xl bg-white/10 px-3.5 py-3 backdrop-blur"
              >
                <Icon className="h-5 w-5 text-white" />
                <span className="text-sm font-medium text-white">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-primary-100/70">© {new Date().getFullYear()} PetCare Hub. Built with care for pet parents.</p>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-lg">🐾</div>
            <span className="font-display text-lg font-bold text-slate-800">PetCare Hub</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-800">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>}
          <div className="mt-7">{children}</div>
        </motion.div>
      </div>
    </div>
  )
}
