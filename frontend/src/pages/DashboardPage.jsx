import { useEffect, useState } from 'react'
import { useOutletContext, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PawPrint, Syringe, CalendarClock, Pill, Wallet, TrendingUp, Plus } from 'lucide-react'
import Topbar from '../components/layout/Topbar'
import StatCard from '../components/dashboard/StatCard'
import { ExpenseCategoryChart, ExpenseTrendChart } from '../components/dashboard/ExpenseCharts'
import AppointmentTimeline from '../components/appointments/AppointmentTimeline'
import { VaccinationReminderList, ActiveMedicineList } from '../components/dashboard/ReminderLists'
import { SkeletonStat } from '../components/ui/Skeletons'
import { dashboardApi, petsApi } from '../api/endpoints'
import { formatCurrency } from '../utils/format'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { openMobileMenu } = useOutletContext()
  const { user } = useAuth()
  const toast = useToast()
  const [summary, setSummary] = useState(null)
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([dashboardApi.getSummary(), petsApi.getAll()])
      .then(([summaryRes, petsRes]) => {
        setSummary(summaryRes.data)
        setPets(petsRes.data)
      })
      .catch(() => toast.error('Failed to load dashboard data'))
      .finally(() => setLoading(false))
  }, [])

  const petNames = Object.fromEntries(pets.map((p) => [p.id, p.name]))
  const firstName = user?.fullName?.split(' ')[0]

  return (
    <div className="animate-fade-in">
      <Topbar
        title={`Welcome back${firstName ? `, ${firstName}` : ''} 👋`}
        subtitle="Here's what's happening with your pets today"
        onMenuClick={openMobileMenu}
        actions={
          <Link to="/pets" className="btn-primary">
            <Plus className="h-4 w-4" /> Add Pet
          </Link>
        }
      />

      {loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonStat key={i} />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={PawPrint} label="Total Pets" value={summary.totalPets} color="primary" index={0} />
            <StatCard icon={Syringe} label="Vaccinations Due" value={summary.vaccinationsDueSoon} hint={`${summary.vaccinationsOverdue} overdue`} color="red" index={1} />
            <StatCard icon={CalendarClock} label="Upcoming Visits" value={summary.upcomingAppointmentsCount} color="ocean" index={2} />
            <StatCard icon={Pill} label="Active Medicines" value={summary.activeMedicinesCount} color="sand" index={3} />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">This Month</p>
                  <p className="font-display text-2xl font-bold text-slate-800">{formatCurrency(summary.thisMonthExpenses)}</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700">
                  <Wallet className="h-3.5 w-3.5" /> {formatCurrency(summary.totalExpenses)} total
                </div>
              </div>
              <ExpenseTrendChart data={summary.monthlyExpenseTrend} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-5">
              <div className="mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary-600" />
                <p className="font-semibold text-slate-700">Spending by Category</p>
              </div>
              <ExpenseCategoryChart data={summary.expensesByCategory} />
            </motion.div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-semibold text-slate-700">Upcoming Appointments</p>
                <Link to="/appointments" className="text-xs font-semibold text-primary-600 hover:text-primary-700">View all →</Link>
              </div>
              <AppointmentTimeline appointments={summary.upcomingAppointments} petNames={petNames} />
            </motion.div>

            <div className="space-y-5">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-semibold text-slate-700">Vaccination Reminders</p>
                  <Link to="/vaccinations" className="text-xs font-semibold text-primary-600 hover:text-primary-700">View all →</Link>
                </div>
                <VaccinationReminderList items={summary.vaccinationReminders} overdueItems={summary.overdueVaccinations} petNames={petNames} />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-semibold text-slate-700">Active Medicines</p>
                  <Link to="/medicines" className="text-xs font-semibold text-primary-600 hover:text-primary-700">View all →</Link>
                </div>
                <ActiveMedicineList items={summary.activeMedicines} petNames={petNames} />
              </motion.div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
