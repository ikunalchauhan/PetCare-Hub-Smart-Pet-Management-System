import { useEffect, useState } from 'react'
import { Plus, PawPrint } from 'lucide-react'
import Topbar from '../components/layout/Topbar'
import PetCard from '../components/pets/PetCard'
import PetFormModal from '../components/pets/PetFormModal'
import { SkeletonGrid } from '../components/ui/Skeletons'
import { EmptyState, SearchBar, FilterSelect, Pagination } from '../components/ui/Controls'
import { useListControls } from '../hooks/useListControls'
import { petsApi } from '../api/endpoints'
import { useToast } from '../context/ToastContext'
import { useOutletContext } from 'react-router-dom'

export default function PetsPage() {
  const { openMobileMenu } = useOutletContext()
  const toast = useToast()
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const load = () => {
    setLoading(true)
    petsApi.getAll()
      .then((res) => setPets(res.data))
      .catch(() => toast.error('Failed to load pets'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const searchPredicate = (pet, q) =>
    pet.name.toLowerCase().includes(q) || (pet.breed || '').toLowerCase().includes(q)

  const { query, setQuery, filters, setFilter, page, setPage, totalPages, filteredCount, items } =
    useListControls(pets, searchPredicate, { pageSize: 6 })

  const speciesOptions = [...new Set(pets.map((p) => p.species))].map((s) => ({ value: s, label: s }))

  const handleCreate = async (data) => {
    setSubmitting(true)
    try {
      const payload = { ...data, weightKg: data.weightKg ? parseFloat(data.weightKg) : null }
      await petsApi.create(payload)
      toast.success(`${data.name} was added to your pets!`)
      setModalOpen(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add pet')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <Topbar
        title="My Pets"
        subtitle={`${pets.length} pet${pets.length === 1 ? '' : 's'} in your care`}
        onMenuClick={openMobileMenu}
        actions={
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            <Plus className="h-4 w-4" /> Add Pet
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search by name or breed…" />
        <FilterSelect
          value={filters.species || ''}
          onChange={(v) => setFilter('species', v)}
          options={speciesOptions}
          placeholder="All species"
        />
      </div>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : filteredCount === 0 ? (
        <EmptyState
          icon={PawPrint}
          title={pets.length === 0 ? 'No pets yet' : 'No pets match your search'}
          description={pets.length === 0 ? 'Add your first pet to start tracking their care.' : 'Try a different search term or filter.'}
          action={pets.length === 0 && (
            <button onClick={() => setModalOpen(true)} className="btn-primary mt-2">
              <Plus className="h-4 w-4" /> Add Your First Pet
            </button>
          )}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((pet, i) => <PetCard key={pet.id} pet={pet} index={i} />)}
          </div>
          <div className="mt-6">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}

      <PetFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleCreate} submitting={submitting} />
    </div>
  )
}
