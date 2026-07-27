import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import ModalBase from '../ui/Modal'

export default function VaccinationFormModal({ open, onClose, onSubmit, pets, defaultValues, submitting }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues })

  useEffect(() => {
    reset(defaultValues || {
      petId: pets[0]?.id || '', vaccineName: '', dateAdministered: '', nextDueDate: '',
      veterinarianName: '', clinicName: '', batchNumber: '', notes: '',
    })
  }, [defaultValues, open, reset, pets])

  return (
    <ModalBase open={open} onClose={onClose} title={defaultValues ? 'Edit Vaccination Record' : 'Add Vaccination Record'} size="lg">
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
          <label className="input-label">Vaccine name</label>
          <input className="input-field" placeholder="Rabies, DHPP, FVRCP…" {...register('vaccineName', { required: 'Vaccine name is required' })} />
          {errors.vaccineName && <p className="input-error">{errors.vaccineName.message}</p>}
        </div>

        <div>
          <label className="input-label">Date administered</label>
          <input type="date" className="input-field" {...register('dateAdministered', { required: 'Required' })} />
          {errors.dateAdministered && <p className="input-error">{errors.dateAdministered.message}</p>}
        </div>

        <div>
          <label className="input-label">Next due date</label>
          <input type="date" className="input-field" {...register('nextDueDate', { required: 'Required' })} />
          {errors.nextDueDate && <p className="input-error">{errors.nextDueDate.message}</p>}
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
          <label className="input-label">Batch number</label>
          <input className="input-field" placeholder="Optional" {...register('batchNumber')} />
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
