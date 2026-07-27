import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, Stethoscope, Pencil, Trash2, Building2, UserRound } from 'lucide-react'
import Topbar from '../components/layout/Topbar'
import MedicalRecordFormModal from '../components/records/MedicalRecordFormModal'
import { SkeletonRow } from '../components/ui/Skeletons'
import { EmptyState, SearchBar, FilterSelect, Pagination, ConfirmDialog } from '../components/ui/Controls'
import { useListControls } from '../hooks/useListControls'
import { medicalRecordsApi, petsApi } from '../api/endpoints'
import { useToast } from '../context/ToastContext'
import { formatDate } from '../utils/format'

export default function MedicalRecordsPage() {
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
    Promise.all([medicalRecordsApi.getAll(), petsApi.getAll()])
      .then(([rRes, pRes]) => { setRecords(rRes.data); setPets(pRes.data) })
      .catch(() => toast.error('Failed to load medical records'))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const petNames = Object.fromEntries(pets.map((p) => [p.id, p.name]))
  const searchPredicate = (r, q) => r.diagnosis.toLowerCase().includes(q) || (petNames[r.petId] || '').toLowerCase().includes(q)
  const { query, setQuery, filters, setFilter, page, setPage, totalPages, filteredCount, items } =
    useListControls(records, searchPredicate, { pageSize: 8 })

  const handleSubmit = async (data) => {
    setSubmitting(true)
    try {
      if (editing) {
        await medicalRecordsApi.update(editing.id, data)
        toast.success('Medical record updated')
      } else {
        await medicalRecordsApi.create(data.petId, data)
        toast.success('Medical record added')
      }
      setModalOpen(false)
      setEditing(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save record')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await medicalRecordsApi.delete(deleting.id)
      toast.success('Medical record deleted')
      setDeleting(null)
      load()
    } catch {
      toast.error('Failed to delete record')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <Topbar
        title="Medical History"
        subtitle={`${records.length} visit${records.length === 1 ? '' : 's'} recorded`}
        onMenuClick={openMobileMenu}
        actions={
          <button onClick={() => { setEditing(null); setModalOpen(true) }} className="btn-primary" disabled={pets.length === 0}>
            <Plus className="h-4 w-4" /> Add Record
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search diagnosis or pet…" />
        <FilterSelect value={filters.petId || ''} onChange={(v) => setFilter('petId', v)} options={pets.map((p) => ({ value: p.id, label: p.name }))} placeholder="All pets" />
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}</div>
      ) : pets.length === 0 ? (
        <EmptyState icon={Stethoscope} title="Add a pet first" description="You'll need at least one pet profile before adding medical records." />
      ) : filteredCount === 0 ? (
        <EmptyState icon={Stethoscope} title="No medical records" description="Log vet visits, diagnoses and treatments here." />
      ) : (
        <>
          <div className="space-y-3">
            {items.map((r) => (
              <div key={r.id} className="glass-card flex flex-wrap items-start gap-4 p-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ocean-100 text-ocean-600">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-slate-800">{r.diagnosis}</h4>
                    <span className="badge bg-slate-100 text-slate-600">{petNames[r.petId]}</span>
                  </div>
                  {r.treatment && <p className="mt-1 text-sm text-slate-600">{r.treatment}</p>}
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-500">
                    <span>Visited {formatDate(r.visitDate)}</span>
                    {r.veterinarianName && <span className="flex items-center gap-1"><UserRound className="h-3 w-3" /> {r.veterinarianName}</span>}
                    {r.clinicName && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {r.clinicName}</span>}
                  </div>
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

      <MedicalRecordFormModal
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
        description="Delete this medical record? This cannot be undone."
        loading={submitting}
      />
    </div>
  )
}
