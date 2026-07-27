import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, PawPrint, Syringe, Stethoscope, Pill,
  CalendarClock, Receipt, FileText, LogOut, X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/pets', label: 'My Pets', icon: PawPrint },
  { to: '/vaccinations', label: 'Vaccinations', icon: Syringe },
  { to: '/medical-records', label: 'Medical History', icon: Stethoscope },
  { to: '/medicines', label: 'Medicines', icon: Pill },
  { to: '/appointments', label: 'Appointments', icon: CalendarClock },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/documents', label: 'Documents', icon: FileText },
]

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth()

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}
      <motion.aside
        initial={false}
        animate={{ x: 0 }}
        className={`fixed lg:sticky top-0 z-50 h-screen w-72 shrink-0 transform transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col gap-6 border-r border-white/60 bg-white/60 backdrop-blur-xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-lg shadow-md shadow-primary-600/30">
                🐾
              </div>
              <div>
                <p className="font-display text-base font-bold leading-tight text-slate-800">PetCare Hub</p>
                <p className="text-[11px] font-medium text-slate-400">Smart Pet Management</p>
              </div>
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-white lg:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md shadow-primary-600/25'
                      : 'text-slate-600 hover:bg-white/80 hover:text-primary-700'
                  }`
                }
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="space-y-3 border-t border-white/60 pt-4">
            <div className="flex items-center gap-3 rounded-xl bg-white/60 px-3 py-2.5">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-700">{user?.fullName}</p>
                <p className="truncate text-xs text-slate-400">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-[18px] w-[18px]" />
              Log Out
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
