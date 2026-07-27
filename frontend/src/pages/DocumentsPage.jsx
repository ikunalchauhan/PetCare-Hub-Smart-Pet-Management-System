import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, FileText, Download, Trash2, FileImage, File as FileIcon } from 'lucide-react'
import Topbar from '../components/layout/Topbar'
import DocumentUploadModal from '../components/documents/DocumentUploadModal'
import { SkeletonRow } from '../components/ui/Skeletons'
import { EmptyState, SearchBar, FilterSelect, Pagination, ConfirmDialog } from '../components/ui/Controls'
import { useListControls } from '../hooks/useListControls'
import { documentsApi, petsApi } from '../api/endpoints'
import { useToast } from '../context/ToastContext'
import { formatDate } from '../utils/format'

function bytesToSize(bytes) {
  if (!bytes) return '0 KB'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(0)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

export default function DocumentsPage() {
  const { openMobileMenu } = useOutletContext()
  const toast = useToast()
  const [records, setRecords] = useState([])
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([documentsApi.getAll(), petsApi.getAll()])
      .then(([dRes, pRes]) => { setRecords(dRes.data); setPets(pRes.data) })
      .catch(() => toast.error('Failed to load documents'))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const petNames = Object.fromEntries(pets.map((p) => [p.id, p.name]))
  const searchPredicate = (r, q) => (r.originalFileName || '').toLowerCase().includes(q) || (petNames[r.petId] || '').toLowerCase().includes(q)
  const { query, setQuery, filters, setFilter, page, setPage, totalPages, filteredCount, items } =
    useListControls(records, searchPredicate, { pageSize: 8 })

  const handleUpload = async (petId, formData) => {
    setSubmitting(true)
    try {
      await documentsApi.upload(petId, formData)
      toast.success('Document uploaded')
      setModalOpen(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload document')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await documentsApi.delete(deleting.id)
      toast.success('Document deleted')
      setDeleting(null)
      load()
    } catch {
      toast.error('Failed to delete document')
    } finally {
      setSubmitting(false)
    }
  }

  const isImage = (contentType) => contentType?.startsWith('image/')

  return (
    <div className="animate-fade-in">
      <Topbar
        title="Documents"
        subtitle={`${records.length} file${records.length === 1 ? '' : 's'} stored`}
        onMenuClick={openMobileMenu}
        actions={
          <button onClick={() => setModalOpen(true)} className="btn-primary" disabled={pets.length === 0}>
            <Plus className="h-4 w-4" /> Upload Document
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search file or pet…" />
        <FilterSelect value={filters.petId || ''} onChange={(v) => setFilter('petId', v)} options={pets.map((p) => ({ value: p.id, label: p.name }))} placeholder="All pets" />
        <FilterSelect
          value={filters.category || ''}
          onChange={(v) => setFilter('category', v)}
          options={['VACCINATION', 'MEDICAL', 'INSURANCE', 'OTHER'].map((c) => ({ value: c, label: c.charAt(0) + c.slice(1).toLowerCase() }))}
          placeholder="All categories"
        />
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}</div>
      ) : pets.length === 0 ? (
        <EmptyState icon={FileText} title="Add a pet first" description="You'll need at least one pet profile before uploading documents." />
      ) : filteredCount === 0 ? (
        <EmptyState icon={FileText} title="No documents uploaded" description="Store vaccination certificates, insurance papers and more." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {items.map((d) => (
              <div key={d.id} className="glass-card flex items-center gap-3 p-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ocean-100 text-ocean-600">
                  {isImage(d.contentType) ? <FileImage className="h-5 w-5" /> : <FileIcon className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{d.originalFileName}</p>
                  <div className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-slate-500">
                    <span className="badge bg-slate-100 text-slate-600">{petNames[d.petId]}</span>
                    <span>{d.category}</span>
                    <span>{bytesToSize(d.fileSize)}</span>
                    <span>{formatDate(d.uploadedAt)}</span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <a href={d.storedPath} target="_blank" rel="noreferrer" className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-primary-600">
                    <Download className="h-4 w-4" />
                  </a>
                  <button onClick={() => setDeleting(d)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6"><Pagination page={page} totalPages={totalPages} onPageChange={setPage} /></div>
        </>
      )}

      <DocumentUploadModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleUpload} pets={pets} submitting={submitting} />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        description={`Delete "${deleting?.originalFileName}"? This cannot be undone.`}
        loading={submitting}
      />
    </div>
  )
}
