import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Pencil, Trash2, Cake, Weight, Fingerprint, Palette,
  Syringe, Stethoscope, Pill, CalendarClock, Receipt, FileText,
} from 'lucide-react'
import Topbar from '../components/layout/Topbar'
import PetFormModal from '../components/pets/PetFormModal'
import { ConfirmDialog } from '../components/ui/Controls'
import {
  petsApi, vaccinationsApi, medicalRecordsApi, medicinesApi, appointmentsApi, expensesApi, documentsApi,
} from '../api/endpoints'
import { useToast } from '../context/ToastContext'
import { SPECIES_EMOJI, calculateAge, formatDate, formatCurrency, isOverdue } from '../utils/format'

const TABS = [
  { key: 'vaccinations', label: 'Vaccinations', icon: Syringe },
  { key: 'medical', label: 'Medical History', icon: Stethoscope },
  { key: 'medicines', label: 'Medicines', icon: Pill },
  { key: 'appointments', label: 'Appointments', icon: CalendarClock },
  { key: 'expenses', label: 'Expenses', icon: Receipt },
  { key: 'documents', label: 'Documents', icon: FileText },
]

export default function PetDetailPage() {
  const { id } = useParams()
  const { openMobileMenu } = useOutletContext()
  const navigate = useNavigate()
  const toast = useToast()

  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('vaccinations')
  const [tabData, setTabData] = useState({});
  const [tabLoading, setTabLoading] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    petsApi.getById(id)
      .then((res) => setPet(res.data))
      .catch(() => toast.error('Pet not found'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!pet) return
    setTabLoading(true)
    const loaders = {
      vaccinations: () => vaccinationsApi.getForPet(id),
      medical: () => medicalRecordsApi.getForPet(id),
      medicines: () => medicinesApi.getForPet(id),
      appointments: () => appointmentsApi.getForPet(id),
      expenses: () => expensesApi.getForPet(id),
      documents: () => documentsApi.getForPet(id),
    }
    loaders[activeTab]()
      .then((res) => setTabData((prev) => ({ ...prev, [activeTab]: res.data })))
      .catch(() => toast.error('Failed to load records'))
      .finally(() => setTabLoading(false))
  }, [activeTab, pet, id])

  const handleUpdate = async (data) => {
    setSubmitting(true)
    try {
      const payload = { ...data, weightKg: data.weightKg ? parseFloat(data.weightKg) : null }
      const res = await petsApi.update(id, payload)
      setPet(res.data)
      toast.success('Pet profile updated')
      setEditOpen(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update pet')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await petsApi.delete(id)
      toast.success(`${pet.name}'s profile has been removed`)
      navigate('/pets')
    } catch {
      toast.error('Failed to delete pet')
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="grid h-64 place-items-center text-slate-400">Loading pet profile…</div>
  }

  if (!pet) {
    return <div className="grid h-64 place-items-center text-slate-400">Pet not found.</div>
  }

  return (
    <div className="animate-fade-in">
      <Topbar
        title=""
        onMenuClick={openMobileMenu}
        actions={
          <div className="flex gap-2">
            <button onClick={() => setEditOpen(true)} className="btn-secondary"><Pencil className="h-4 w-4" /> Edit</button>
            <button onClick={() => setDeleteOpen(true)} className="btn-danger"><Trash2 className="h-4 w-4" /> Delete</button>
          </div>
        }
      />

      <Link to="/pets" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary-600">
        <ArrowLeft className="h-4 w-4" /> Back to My Pets
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-panel mb-6 p-6">
        <div className="flex flex-wrap items-center gap-5">
          <div className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-primary-100 to-primary-50 text-5xl shadow-inner">
            {pet.photoUrl ? <img src={pet.photoUrl} alt={pet.name} className="h-full w-full rounded-3xl object-cover" /> : SPECIES_EMOJI[pet.species] || '🐾'}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-3xl font-bold text-slate-800">{pet.name}</h1>
            <p className="text-slate-500">{pet.breed || pet.species} · {pet.species} · {pet.gender}</p>
            {pet.notes && <p className="mt-2 max-w-xl text-sm text-slate-600">{pet.notes}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MiniStat icon={Cake} label="Age" value={calculateAge(pet.dateOfBirth)} />
            <MiniStat icon={Weight} label="Weight" value={pet.weightKg ? `${pet.weightKg} kg` : '—'} />
            <MiniStat icon={Palette} label="Color" value={pet.color || '—'} />
            <MiniStat icon={Fingerprint} label="Microchip" value={pet.microchipId || '—'} />
          </div>
        </div>
      </motion.div>

      <div className="mb-5 flex flex-wrap gap-2 overflow-x-auto">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === key ? 'bg-primary-600 text-white shadow-md shadow-primary-600/25' : 'bg-white/60 text-slate-600 hover:bg-white'
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      <div className="glass-card p-5 min-h-[200px]">
        {tabLoading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-14 w-full" />)}</div>
        ) : (
          <TabContent tab={activeTab} data={tabData[activeTab] || []} />
        )}
      </div>

      <PetFormModal open={editOpen} onClose={() => setEditOpen(false)} onSubmit={handleUpdate} defaultValues={pet} submitting={submitting} />
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        description={`Delete ${pet.name}'s profile and all related records (vaccinations, medical history, medicines, appointments, expenses, documents)? This cannot be undone.`}
        loading={submitting}
      />
    </div>
  )
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-white/60 px-3 py-2 text-center">
      <Icon className="mx-auto mb-1 h-4 w-4 text-primary-500" />
      <p className="truncate text-xs font-semibold text-slate-700">{value}</p>
      <p className="text-[10px] text-slate-400">{label}</p>
    </div>
  )
}

function TabContent({ tab, data }) {
  if (data.length === 0) {
    return <div className="grid h-32 place-items-center text-sm text-slate-400">No records yet</div>
  }

  if (tab === 'vaccinations') {
    return (
      <div className="space-y-3">
        {data.map((v) => (
          <div key={v.id} className="flex items-center justify-between rounded-xl bg-white/50 p-3">
            <div>
              <p className="font-semibold text-slate-700">{v.vaccineName}</p>
              <p className="text-xs text-slate-500">Given {formatDate(v.dateAdministered)} · Due {formatDate(v.nextDueDate)}</p>
            </div>
            {isOverdue(v.nextDueDate) && <span className="badge bg-red-100 text-red-600">Overdue</span>}
          </div>
        ))}
      </div>
    )
  }

  if (tab === 'medical') {
    return (
      <div className="space-y-3">
        {data.map((m) => (
          <div key={m.id} className="rounded-xl bg-white/50 p-3">
            <p className="font-semibold text-slate-700">{m.diagnosis}</p>
            <p className="text-xs text-slate-500">{formatDate(m.visitDate)} {m.veterinarianName ? `· ${m.veterinarianName}` : ''}</p>
            {m.treatment && <p className="mt-1 text-sm text-slate-600">{m.treatment}</p>}
          </div>
        ))}
      </div>
    )
  }

  if (tab === 'medicines') {
    return (
      <div className="space-y-3">
        {data.map((m) => (
          <div key={m.id} className="flex items-center justify-between rounded-xl bg-white/50 p-3">
            <div>
              <p className="font-semibold text-slate-700">{m.name} <span className="font-normal text-slate-400">· {m.dosage}</span></p>
              <p className="text-xs text-slate-500">{m.frequency} · since {formatDate(m.startDate)}</p>
            </div>
            <span className={`badge ${m.active ? 'bg-primary-50 text-primary-700' : 'bg-slate-100 text-slate-500'}`}>{m.active ? 'Active' : 'Done'}</span>
          </div>
        ))}
      </div>
    )
  }

  if (tab === 'appointments') {
    return (
      <div className="space-y-3">
        {data.map((a) => (
          <div key={a.id} className="rounded-xl bg-white/50 p-3">
            <p className="font-semibold text-slate-700">{a.title}</p>
            <p className="text-xs text-slate-500">{formatDate(a.appointmentDate)} · {a.status}</p>
          </div>
        ))}
      </div>
    )
  }

  if (tab === 'expenses') {
    return (
      <div className="space-y-3">
        {data.map((e) => (
          <div key={e.id} className="flex items-center justify-between rounded-xl bg-white/50 p-3">
            <div>
              <p className="font-semibold text-slate-700">{formatCurrency(e.amount)} <span className="font-normal text-slate-400">· {e.category}</span></p>
              <p className="text-xs text-slate-500">{formatDate(e.expenseDate)}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.id} className="flex items-center justify-between rounded-xl bg-white/50 p-3">
          <div>
            <p className="font-semibold text-slate-700">{d.originalFileName}</p>
            <p className="text-xs text-slate-500">{d.category} · {formatDate(d.uploadedAt)}</p>
          </div>
          <a href={d.storedPath} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary-600 hover:text-primary-700">Open →</a>
        </div>
      ))}
    </div>
  )
}
