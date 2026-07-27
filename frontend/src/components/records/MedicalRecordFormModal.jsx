import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import ModalBase from '../ui/Modal'

export default function MedicalRecordFormModal({ open, onClose, onSubmit, pets, defaultValues, submitting }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues })

  useEffect(() => {
    reset(defaultValues || {
      petId: pets[0]?.id || '', visitDate: '', diagnosis: '', treatment: '',
      veterinarianName: '', clinicName: '', notes: '',
    })
  }, [defaultValues, open, reset, pets])

  return (
    <ModalBase open={open} onClose={onClose} title={defaultValues ? 'Edit Medical Record' : 'Add Medical Record'} size="lg">
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
          <label className="input-label">Visit date</label>
          <input type="date" className="input-field" {...register('visitDate', { required: 'Required' })} />
          {errors.visitDate && <p className="input-error">{errors.visitDate.message}</p>}
        </div>

        <div>
          <label className="input-label">Veterinarian</label>
          <input className="input-field" placeholder="Dr. Smith" {...register('veterinarianName')} />
        </div>

        <div className="sm:col-span-2">
          <label className="input-label">Diagnosis</label>
          <input className="input-field" placeholder="Ear infection, sprained leg…" {...register('diagnosis', { required: 'Diagnosis is required' })} />
          {errors.diagnosis && <p className="input-error">{errors.diagnosis.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="input-label">Treatment</label>
          <textarea rows={2} className="input-field" placeholder="Prescribed antibiotics, rest for 1 week…" {...register('treatment')} />
        </div>

        <div>
          <label className="input-label">Clinic name</label>
          <input className="input-field" placeholder="Sunrise Animal Clinic" {...register('clinicName')} />
        </div>

        <div className="sm:col-span-2">
          <label className="input-label">Notes</label>
          <textarea rows={2} className="input-field" {...register('notes')} />
        </div>

        <div className="flex gap-3 pt-2 sm:col-span-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? 'Saving…' : 'Save Record'}</button>
        </div>
      </form>
    </ModalBase>
  )
}
