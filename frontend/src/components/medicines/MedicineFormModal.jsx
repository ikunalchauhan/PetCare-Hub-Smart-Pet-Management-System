import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import ModalBase from '../ui/Modal'

export default function MedicineFormModal({ open, onClose, onSubmit, pets, defaultValues, submitting }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues })

  useEffect(() => {
    reset(defaultValues || {
      petId: pets[0]?.id || '', name: '', dosage: '', frequency: '', startDate: '', endDate: '',
      prescribedBy: '', instructions: '', active: true,
    })
  }, [defaultValues, open, reset, pets])

  return (
    <ModalBase open={open} onClose={onClose} title={defaultValues ? 'Edit Medicine' : 'Add Medicine'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="input-label">Pet</label>
          <select className="input-field" disabled={!!defaultValues} {...register('petId', { required: 'Please select a pet' })}>
            <option value="">Select a pet</option>
            {pets.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {errors.petId && <p className="input-error">{errors.petId.message}</p>}
        </div>

        <div>
          <label className="input-label">Medicine name</label>
          <input className="input-field" placeholder="Amoxicillin" {...register('name', { required: 'Required' })} />
          {errors.name && <p className="input-error">{errors.name.message}</p>}
        </div>

        <div>
          <label className="input-label">Dosage</label>
          <input className="input-field" placeholder="250mg" {...register('dosage', { required: 'Required' })} />
          {errors.dosage && <p className="input-error">{errors.dosage.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="input-label">Frequency</label>
          <input className="input-field" placeholder="Twice daily with food" {...register('frequency', { required: 'Required' })} />
          {errors.frequency && <p className="input-error">{errors.frequency.message}</p>}
        </div>

        <div>
          <label className="input-label">Start date</label>
          <input type="date" className="input-field" {...register('startDate', { required: 'Required' })} />
          {errors.startDate && <p className="input-error">{errors.startDate.message}</p>}
        </div>

        <div>
          <label className="input-label">End date (optional)</label>
          <input type="date" className="input-field" {...register('endDate')} />
        </div>

        <div className="sm:col-span-2">
          <label className="input-label">Prescribed by</label>
          <input className="input-field" placeholder="Dr. Smith" {...register('prescribedBy')} />
        </div>

        <div className="sm:col-span-2">
          <label className="input-label">Instructions</label>
          <textarea rows={2} className="input-field" {...register('instructions')} />
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-600 sm:col-span-2">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-400" {...register('active')} />
          Currently active
        </label>

        <div className="flex gap-3 pt-2 sm:col-span-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? 'Saving…' : 'Save Medicine'}</button>
        </div>
      </form>
    </ModalBase>
  )
}
