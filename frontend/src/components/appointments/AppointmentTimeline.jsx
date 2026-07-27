import { motion } from 'framer-motion'
import { Clock, MapPin, Stethoscope } from 'lucide-react'
import { formatDateTime, APPOINTMENT_STATUS_STYLES } from '../../utils/format'

export default function AppointmentTimeline({ appointments = [], petNames = {} }) {
  if (appointments.length === 0) {
    return <div className="grid h-40 place-items-center text-sm text-slate-400">No upcoming appointments</div>
  }

  return (
    <div className="relative space-y-5 pl-6">
      <div className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-primary-300 via-primary-200 to-transparent" />
      {appointments.map((appt, i) => (
        <motion.div
          key={appt.id}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className="relative"
        >
          <span className="absolute -left-6 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-primary-500 shadow" />
          <div className="glass-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-semibold text-slate-800">{appt.title}</h4>
              <span className={`badge ${APPOINTMENT_STATUS_STYLES[appt.status] || 'bg-slate-100 text-slate-600'}`}>{appt.status}</span>
            </div>
            {petNames[appt.petId] && <p className="text-xs font-medium text-primary-600">{petNames[appt.petId]}</p>}
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {formatDateTime(appt.appointmentDate)}</span>
              {appt.clinicName && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {appt.clinicName}</span>}
              {appt.veterinarianName && <span className="flex items-center gap-1"><Stethoscope className="h-3.5 w-3.5" /> {appt.veterinarianName}</span>}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
