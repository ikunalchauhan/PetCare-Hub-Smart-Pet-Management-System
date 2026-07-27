import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import ModalBase from '../ui/Modal'

const STATUS_OPTIONS = ['SCHEDULED', 'COMPLETED', 'CANCELLED']

export default function AppointmentFormModal({ open, onClose, onSubmit, pets, defaultValues, submitting }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues })

  useEffect(() => {
    reset(defaultValues || {
      petId: pets[0]?.id || '', title: '', appointmentDate: '', veterinarianName: '',
      clinicName: '', reason: '', status: 'SCHEDULED', notes: '',
    })
  }, [defaultValues, open, reset, pets])

  return (
    <ModalBase open={open} onClose={onClose} title={defaultValues ? 'Edit Appointment' : 'Schedule Appointment'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="input-label">Pet</label>
          <select className="input-field" disabled={!!defaultValues} {...register('petId', { required: 'Please select a pet' })}>
            <option value="">Select a pet</option>
            {pets.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {errors.petId && <p className="input-error">{errors.petId.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="input-label">Title</label>
          <input className="input-field" placeholder="Annual checkup, Dental cleaning…" {...register('title', { required: 'Title is required' })} />
          {errors.title && <p className="input-error">{errors.title.message}</p>}
        </div>

        <div>
          <label className="input-label">Date &amp; time</label>
          <input type="datetime-local" className="input-field" {...register('appointmentDate', { required: 'Required' })} />
          {errors.appointmentDate && <p className="input-error">{errors.appointmentDate.message}</p>}
        </div>

        <div>
          <label className="input-label">Status</label>
          <select className="input-field" {...register('status')}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="input-label">Veterinarian</label>
          <input className="input-field" placeholder="Dr. Smith" {...register('veterinarianName')} />
        </div>

        <div>
          <label className="input-label">Clinic name</label>
          <input className="input-field" placeholder="Sunrise Animal Clinic" {...register('clinicName')} />
        </div>

        <div className="sm:col-span-2">
          <label className="input-label">Reason for visit</label>
          <input className="input-field" placeholder="Routine vaccination, limping…" {...register('reason')} />
        </div>

        <div className="sm:col-span-2">
          <label className="input-label">Notes</label>
          <textarea rows={2} className="input-field" {...register('notes')} />
        </div>

        <div className="flex gap-3 pt-2 sm:col-span-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? 'Saving…' : 'Save Appointment'}</button>
        </div>
      </form>
    </ModalBase>
  )
}
