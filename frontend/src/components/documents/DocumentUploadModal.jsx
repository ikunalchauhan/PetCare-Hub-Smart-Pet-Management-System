import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { UploadCloud } from 'lucide-react'
import ModalBase from '../ui/Modal'

const CATEGORY_OPTIONS = ['VACCINATION', 'MEDICAL', 'INSURANCE', 'OTHER']

export default function DocumentUploadModal({ open, onClose, onSubmit, pets, submitting }) {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()
  const fileList = watch('file')

  useEffect(() => {
    reset({ petId: pets[0]?.id || '', category: 'OTHER', description: '' })
  }, [open, reset, pets])

  const submitForm = (data) => {
    if (!data.file || data.file.length === 0) return
    const formData = new FormData()
    formData.append('file', data.file[0])
    formData.append('category', data.category)
    formData.append('description', data.description || '')
    onSubmit(data.petId, formData)
  }

  return (
    <ModalBase open={open} onClose={onClose} title="Upload Document" size="md">
      <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
        <div>
          <label className="input-label">Pet</label>
          <select className="input-field" {...register('petId', { required: 'Please select a pet' })}>
            <option value="">Select a pet</option>
            {pets.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {errors.petId && <p className="input-error">{errors.petId.message}</p>}
        </div>

        <div>
          <label className="input-label">Category</label>
          <select className="input-field" {...register('category')}>
            {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>)}
          </select>
        </div>

        <div>
          <label className="input-label">Description (optional)</label>
          <input className="input-field" placeholder="Rabies certificate 2026…" {...register('description')} />
        </div>

        <div>
          <label className="input-label">File</label>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white/50 px-4 py-8 text-center transition-colors hover:border-primary-400 hover:bg-primary-50/40">
            <UploadCloud className="h-7 w-7 text-primary-500" />
            <span className="text-sm font-medium text-slate-600">
              {fileList && fileList.length > 0 ? fileList[0].name : 'Click to choose a file (PDF, JPG, PNG — up to 10MB)'}
            </span>
            <input
              type="file"
              className="hidden"
              {...register('file', {
                validate: (value) => (value && value.length > 0) || 'Please choose a file',
              })}
            />
          </label>
          {errors.file && <p className="input-error">{errors.file.message}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? 'Uploading…' : 'Upload'}</button>
        </div>
      </form>
    </ModalBase>
  )
}
