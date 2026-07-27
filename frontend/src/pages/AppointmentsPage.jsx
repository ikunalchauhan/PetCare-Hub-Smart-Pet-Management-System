import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, CalendarClock, Pencil, Trash2, MapPin, Stethoscope } from 'lucide-react'
import Topbar from '../components/layout/Topbar'
import AppointmentFormModal from '../components/appointments/AppointmentFormModal'
import { SkeletonRow } from '../components/ui/Skeletons'
import { EmptyState, SearchBar, FilterSelect, Pagination, ConfirmDialog } from '../components/ui/Controls'
import { useListControls } from '../hooks/useListControls'
import { appointmentsApi, petsApi } from '../api/endpoints'
import { useToast } from '../context/ToastContext'
import { formatDateTime, APPOINTMENT_STATUS_STYLES } from '../utils/format'

const STATUS_FILTERS = [
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

export default function AppointmentsPage() {
  const { openMobileMenu } = useOutletContext()
  const toast = useToast()
  const [records, setRecords] = useState([])
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([appointmentsApi.getAll(), petsApi.getAll()])
      .then(([aRes, pRes]) => { setRecords(aRes.data); setPets(pRes.data) })
      .catch(() => toast.error('Failed to load appointments'))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const petNames = Object.fromEntries(pets.map((p) => [p.id, p.name]))
  const searchPredicate = (r, q) => r.title.toLowerCase().includes(q) || (petNames[r.petId] || '').toLowerCase().includes(q)
  const { query, setQuery, filters, setFilter, page, setPage, totalPages, filteredCount, items } =
    useListControls(records, searchPredicate, { pageSize: 8 })

  const handleSubmit = async (data) => {
    setSubmitting(true)
    try {
      if (editing) {
        await appointmentsApi.update(editing.id, data)
        toast.success('Appointment updated')
      } else {
        await appointmentsApi.create(data.petId, data)
        toast.success('Appointment scheduled')
      }
      setModalOpen(false)
      setEditing(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save appointment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await appointmentsApi.delete(deleting.id)
      toast.success('Appointment deleted')
      setDeleting(null)
      load()
    } catch {
      toast.error('Failed to delete appointment')
    } finally {
      setSubmitting(false)
    }
  }

  const quickStatusUpdate = async (id, status) => {
    try {
      await appointmentsApi.updateStatus(id, status)
      toast.success(`Marked as ${status.toLowerCase()}`)
      load()
    } catch {
      toast.error('Failed to update status')
    }
  }

  return (
    <div className="animate-fade-in">
      <Topbar
        title="Appointments"
        subtitle={`${records.length} appointment${records.length === 1 ? '' : 's'} scheduled`}
        onMenuClick={openMobileMenu}
        actions={
          <button onClick={() => { setEditing(null); setModalOpen(true) }} className="btn-primary" disabled={pets.length === 0}>
            <Plus className="h-4 w-4" /> New Appointment
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search title or pet…" />
        <FilterSelect value={filters.petId || ''} onChange={(v) => setFilter('petId', v)} options={pets.map((p) => ({ value: p.id, label: p.name }))} placeholder="All pets" />
        <FilterSelect value={filters.status || ''} onChange={(v) => setFilter('status', v)} options={STATUS_FILTERS} placeholder="All statuses" />
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}</div>
      ) : pets.length === 0 ? (
        <EmptyState icon={CalendarClock} title="Add a pet first" description="You'll need at least one pet profile before scheduling appointments." />
      ) : filteredCount === 0 ? (
        <EmptyState icon={CalendarClock} title="No appointments" description="Schedule vet visits, groomings and checkups here." />
      ) : (
        <>
          <div className="space-y-3">
            {items.map((r) => (
              <div key={r.id} className="glass-card flex flex-wrap items-start gap-4 p-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ocean-100 text-ocean-600">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-slate-800">{r.title}</h4>
                    <span className="badge bg-slate-100 text-slate-600">{petNames[r.petId]}</span>
                    <span className={`badge ${APPOINTMENT_STATUS_STYLES[r.status]}`}>{r.status}</span>
                  </div>
                  {r.reason && <p className="mt-1 text-sm text-slate-600">{r.reason}</p>}
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-500">
                    <span>{formatDateTime(r.appointmentDate)}</span>
                    {r.clinicName && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {r.clinicName}</span>}
                    {r.veterinarianName && <span className="flex items-center gap-1"><Stethoscope className="h-3 w-3" /> {r.veterinarianName}</span>}
                  </div>
                  {r.status === 'SCHEDULED' && (
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => quickStatusUpdate(r.id, 'COMPLETED')} className="rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700 hover:bg-primary-100">Mark Completed</button>
                      <button onClick={() => quickStatusUpdate(r.id, 'CANCELLED')} className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100">Cancel</button>
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button onClick={() => { setEditing(r); setModalOpen(true) }} className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-primary-600">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleting(r)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6"><Pagination page={page} totalPages={totalPages} onPageChange={setPage} /></div>
        </>
      )}

      <AppointmentFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        onSubmit={handleSubmit}
        pets={pets}
        defaultValues={editing}
        submitting={submitting}
      />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        description={`Delete the "${deleting?.title}" appointment?`}
        loading={submitting}
      />
    </div>
  )
}
