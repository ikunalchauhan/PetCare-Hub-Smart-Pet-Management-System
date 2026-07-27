import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, Syringe, Pencil, Trash2, Building2, UserRound } from 'lucide-react'
import Topbar from '../components/layout/Topbar'
import VaccinationFormModal from '../components/vaccinations/VaccinationFormModal'
import { SkeletonRow } from '../components/ui/Skeletons'
import { EmptyState, SearchBar, FilterSelect, Pagination, ConfirmDialog } from '../components/ui/Controls'
import { useListControls } from '../hooks/useListControls'
import { vaccinationsApi, petsApi } from '../api/endpoints'
import { useToast } from '../context/ToastContext'
import { formatDate, isOverdue } from '../utils/format'

export default function VaccinationsPage() {
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
    Promise.all([vaccinationsApi.getAll(), petsApi.getAll()])
      .then(([vRes, pRes]) => { setRecords(vRes.data); setPets(pRes.data) })
      .catch(() => toast.error('Failed to load vaccination records'))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const petNames = Object.fromEntries(pets.map((p) => [p.id, p.name]))
  const searchPredicate = (r, q) => r.vaccineName.toLowerCase().includes(q) || (petNames[r.petId] || '').toLowerCase().includes(q)
  const { query, setQuery, filters, setFilter, page, setPage, totalPages, filteredCount, items } =
    useListControls(records, searchPredicate, { pageSize: 8 })

  const handleSubmit = async (data) => {
    setSubmitting(true)
    try {
      if (editing) {
        await vaccinationsApi.update(editing.id, data)
        toast.success('Vaccination record updated')
      } else {
        await vaccinationsApi.create(data.petId, data)
        toast.success('Vaccination record added')
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
      await vaccinationsApi.delete(deleting.id)
      toast.success('Vaccination record deleted')
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
        title="Vaccinations"
        subtitle={`${records.length} record${records.length === 1 ? '' : 's'} tracked`}
        onMenuClick={openMobileMenu}
        actions={
          <button onClick={() => { setEditing(null); setModalOpen(true) }} className="btn-primary" disabled={pets.length === 0}>
            <Plus className="h-4 w-4" /> Add Record
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search vaccine or pet…" />
        <FilterSelect value={filters.petId || ''} onChange={(v) => setFilter('petId', v)} options={pets.map((p) => ({ value: p.id, label: p.name }))} placeholder="All pets" />
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}</div>
      ) : pets.length === 0 ? (
        <EmptyState icon={Syringe} title="Add a pet first" description="You'll need at least one pet profile before adding vaccination records." />
      ) : filteredCount === 0 ? (
        <EmptyState icon={Syringe} title="No vaccination records" description="Keep track of every shot and booster by adding a record." />
      ) : (
        <>
          <div className="space-y-3">
            {items.map((r) => {
              const overdue = isOverdue(r.nextDueDate)
              return (
                <div key={r.id} className="glass-card flex flex-wrap items-center gap-4 p-4">
                  <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${overdue ? 'bg-red-100 text-red-600' : 'bg-primary-100 text-primary-600'}`}>
                    <Syringe className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-slate-800">{r.vaccineName}</h4>
                      <span className="badge bg-slate-100 text-slate-600">{petNames[r.petId]}</span>
                      {overdue && <span className="badge bg-red-100 text-red-600">Overdue</span>}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-500">
                      <span>Given {formatDate(r.dateAdministered)}</span>
                      <span className={overdue ? 'font-semibold text-red-500' : ''}>Due {formatDate(r.nextDueDate)}</span>
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
              )
            })}
          </div>
          <div className="mt-6"><Pagination page={page} totalPages={totalPages} onPageChange={setPage} /></div>
        </>
      )}

      <VaccinationFormModal
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
        description={`Delete the "${deleting?.vaccineName}" vaccination record? This cannot be undone.`}
        loading={submitting}
      />
    </div>
  )
}
