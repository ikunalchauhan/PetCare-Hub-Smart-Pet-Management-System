import { Syringe, Pill, AlertCircle } from 'lucide-react'
import { formatDate, isOverdue } from '../../utils/format'

export function VaccinationReminderList({ items = [], overdueItems = [], petNames = {} }) {
  const all = [
    ...overdueItems.map((v) => ({ ...v, overdue: true })),
    ...items.map((v) => ({ ...v, overdue: false })),
  ]

  if (all.length === 0) {
    return <div className="grid h-32 place-items-center text-sm text-slate-400">No reminders — all caught up! 🎉</div>
  }

  return (
    <div className="space-y-3">
      {all.slice(0, 6).map((v) => (
        <div key={v.id} className={`flex items-center gap-3 rounded-xl border p-3 ${v.overdue ? 'border-red-200 bg-red-50/60' : 'border-primary-100 bg-primary-50/50'}`}>
          <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${v.overdue ? 'bg-red-100 text-red-600' : 'bg-primary-100 text-primary-600'}`}>
            {v.overdue ? <AlertCircle className="h-4.5 w-4.5" /> : <Syringe className="h-4.5 w-4.5" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-700">{v.vaccineName}</p>
            <p className="truncate text-xs text-slate-500">{petNames[v.petId] || 'Pet'} · Due {formatDate(v.nextDueDate)}</p>
          </div>
          {v.overdue && <span className="badge bg-red-100 text-red-600 shrink-0">Overdue</span>}
        </div>
      ))}
    </div>
  )
}

export function ActiveMedicineList({ items = [], petNames = {} }) {
  if (items.length === 0) {
    return <div className="grid h-32 place-items-center text-sm text-slate-400">No active medicines right now</div>
  }

  return (
    <div className="space-y-3">
      {items.slice(0, 6).map((m) => (
        <div key={m.id} className="flex items-center gap-3 rounded-xl border border-ocean-100 bg-ocean-50/50 p-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ocean-100 text-ocean-600">
            <Pill className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-700">{m.name} <span className="font-normal text-slate-400">· {m.dosage}</span></p>
            <p className="truncate text-xs text-slate-500">{petNames[m.petId] || 'Pet'} · {m.frequency}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
