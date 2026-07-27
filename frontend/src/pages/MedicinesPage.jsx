import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, Pill, Pencil, Trash2, UserRound } from 'lucide-react'
import Topbar from '../components/layout/Topbar'
import MedicineFormModal from '../components/medicines/MedicineFormModal'
import { SkeletonRow } from '../components/ui/Skeletons'
import { EmptyState, SearchBar, FilterSelect, Pagination, ConfirmDialog } from '../components/ui/Controls'
import { useListControls } from '../hooks/useListControls'
import { medicinesApi, petsApi } from '../api/endpoints'
import { useToast } from '../context/ToastContext'
import { formatDate } from '../utils/format'

export default function MedicinesPage() {
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
    Promise.all([medicinesApi.getAll(), petsApi.getAll()])
      .then(([mRes, pRes]) => { setRecords(mRes.data); setPets(pRes.data) })
      .catch(() => toast.error('Failed to load medicines'))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const petNames = Object.fromEntries(pets.map((p) => [p.id, p.name]))
  const searchPredicate = (r, q) => r.name.toLowerCase().includes(q) || (petNames[r.petId] || '').toLowerCase().includes(q)
  const { query, setQuery, filters, setFilter, page, setPage, totalPages, filteredCount, items } =
    useListControls(records, searchPredicate, { pageSize: 8 })

  const handleSubmit = async (data) => {
    setSubmitting(true)
    try {
      if (editing) {
        await medicinesApi.update(editing.id, data)
        toast.success('Medicine updated')
      } else {
        await medicinesApi.create(data.petId, data)
        toast.success('Medicine added')
      }
      setModalOpen(false)
      setEditing(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save medicine')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await medicinesApi.delete(deleting.id)
      toast.success('Medicine deleted')
      setDeleting(null)
      load()
    } catch {
      toast.error('Failed to delete medicine')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <Topbar
        title="Medicines"
        subtitle={`${records.filter((r) => r.active).length} active prescription${records.filter((r) => r.active).length === 1 ? '' : 's'}`}
        onMenuClick={openMobileMenu}
        actions={
          <button onClick={() => { setEditing(null); setModalOpen(true) }} className="btn-primary" disabled={pets.length === 0}>
            <Plus className="h-4 w-4" /> Add Medicine
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search medicine or pet…" />
        <FilterSelect value={filters.petId || ''} onChange={(v) => setFilter('petId', v)} options={pets.map((p) => ({ value: p.id, label: p.name }))} placeholder="All pets" />
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}</div>
      ) : pets.length === 0 ? (
        <EmptyState icon={Pill} title="Add a pet first" description="You'll need at least one pet profile before tracking medicines." />
      ) : filteredCount === 0 ? (
        <EmptyState icon={Pill} title="No medicines tracked" description="Add prescriptions and supplements to keep dosing on schedule." />
      ) : (
        <>
          <div className="space-y-3">
            {items.map((r) => (
              <div key={r.id} className="glass-card flex flex-wrap items-start gap-4 p-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sand-100 text-sand-500">
                  <Pill className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-slate-800">{r.name} <span className="font-normal text-slate-400">· {r.dosage}</span></h4>
                    <span className="badge bg-slate-100 text-slate-600">{petNames[r.petId]}</span>
                    <span className={`badge ${r.active ? 'bg-primary-50 text-primary-700' : 'bg-slate-100 text-slate-500'}`}>{r.active ? 'Active' : 'Completed'}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{r.frequency}</p>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-500">
                    <span>Since {formatDate(r.startDate)}</span>
                    {r.endDate && <span>Until {formatDate(r.endDate)}</span>}
                    {r.prescribedBy && <span className="flex items-center gap-1"><UserRound className="h-3 w-3" /> {r.prescribedBy}</span>}
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

      <MedicineFormModal
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
        description={`Delete "${deleting?.name}" from medicine tracking?`}
        loading={submitting}
      />
    </div>
  )
}
