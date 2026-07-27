import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, Receipt, Pencil, Trash2 } from 'lucide-react'
import Topbar from '../components/layout/Topbar'
import ExpenseFormModal from '../components/expenses/ExpenseFormModal'
import { ExpenseCategoryChart } from '../components/dashboard/ExpenseCharts'
import { SkeletonRow } from '../components/ui/Skeletons'
import { EmptyState, SearchBar, FilterSelect, Pagination, ConfirmDialog } from '../components/ui/Controls'
import { useListControls } from '../hooks/useListControls'
import { expensesApi, petsApi } from '../api/endpoints'
import { useToast } from '../context/ToastContext'
import { formatDate, formatCurrency, EXPENSE_CATEGORY_COLORS } from '../utils/format'

const CATEGORY_FILTERS = Object.keys(EXPENSE_CATEGORY_COLORS).map((c) => ({ value: c, label: c.charAt(0) + c.slice(1).toLowerCase() }))

export default function ExpensesPage() {
  const { openMobileMenu } = useOutletContext()
  const toast = useToast()
  const [records, setRecords] = useState([])
  const [pets, setPets] = useState([])
  const [breakdown, setBreakdown] = useState({})
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([expensesApi.getAll(), petsApi.getAll(), expensesApi.getBreakdown()])
      .then(([eRes, pRes, bRes]) => { setRecords(eRes.data); setPets(pRes.data); setBreakdown(bRes.data) })
      .catch(() => toast.error('Failed to load expenses'))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const petNames = Object.fromEntries(pets.map((p) => [p.id, p.name]))
  const searchPredicate = (r, q) => (r.description || '').toLowerCase().includes(q) || (petNames[r.petId] || '').toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
  const { query, setQuery, filters, setFilter, page, setPage, totalPages, filteredCount, items } =
    useListControls(records, searchPredicate, { pageSize: 8 })

  const total = records.reduce((sum, r) => sum + r.amount, 0)

  const handleSubmit = async (data) => {
    setSubmitting(true)
    try {
      const payload = { ...data, amount: parseFloat(data.amount) }
      if (editing) {
        await expensesApi.update(editing.id, payload)
        toast.success('Expense updated')
      } else {
        await expensesApi.create(payload.petId, payload)
        toast.success('Expense added')
      }
      setModalOpen(false)
      setEditing(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save expense')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await expensesApi.delete(deleting.id)
      toast.success('Expense deleted')
      setDeleting(null)
      load()
    } catch {
      toast.error('Failed to delete expense')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <Topbar
        title="Expenses"
        subtitle={`${formatCurrency(total)} spent in total`}
        onMenuClick={openMobileMenu}
        actions={
          <button onClick={() => { setEditing(null); setModalOpen(true) }} className="btn-primary" disabled={pets.length === 0}>
            <Plus className="h-4 w-4" /> Add Expense
          </button>
        }
      />

      {!loading && records.length > 0 && (
        <div className="glass-card mb-5 p-5">
          <p className="mb-2 font-semibold text-slate-700">Spending Breakdown</p>
          <ExpenseCategoryChart data={breakdown} />
        </div>
      )}

      <div className="mb-5 flex flex-wrap gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search description, category or pet…" />
        <FilterSelect value={filters.petId || ''} onChange={(v) => setFilter('petId', v)} options={pets.map((p) => ({ value: p.id, label: p.name }))} placeholder="All pets" />
        <FilterSelect value={filters.category || ''} onChange={(v) => setFilter('category', v)} options={CATEGORY_FILTERS} placeholder="All categories" />
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}</div>
      ) : pets.length === 0 ? (
        <EmptyState icon={Receipt} title="Add a pet first" description="You'll need at least one pet profile before tracking expenses." />
      ) : filteredCount === 0 ? (
        <EmptyState icon={Receipt} title="No expenses recorded" description="Track food, medical, grooming and other costs here." />
      ) : (
        <>
          <div className="space-y-3">
            {items.map((r) => (
              <div key={r.id} className="glass-card flex flex-wrap items-center gap-4 p-4">
                <div
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white"
                  style={{ backgroundColor: EXPENSE_CATEGORY_COLORS[r.category] }}
                >
                  <Receipt className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-slate-800">{formatCurrency(r.amount)}</h4>
                    <span className="badge bg-slate-100 text-slate-600">{petNames[r.petId]}</span>
                    <span className="badge" style={{ backgroundColor: `${EXPENSE_CATEGORY_COLORS[r.category]}18`, color: EXPENSE_CATEGORY_COLORS[r.category] }}>{r.category}</span>
                  </div>
                  {r.description && <p className="mt-1 text-sm text-slate-600">{r.description}</p>}
                  <p className="mt-1 text-xs text-slate-500">{formatDate(r.expenseDate)}</p>
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

      <ExpenseFormModal
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
        description={`Delete this ${formatCurrency(deleting?.amount || 0)} expense?`}
        loading={submitting}
      />
    </div>
  )
}
