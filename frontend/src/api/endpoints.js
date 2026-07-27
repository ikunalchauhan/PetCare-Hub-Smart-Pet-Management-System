import api from './axios'

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
}

export const petsApi = {
  getAll: () => api.get('/pets'),
  getById: (id) => api.get(`/pets/${id}`),
  create: (data) => api.post('/pets', data),
  update: (id, data) => api.put(`/pets/${id}`, data),
  delete: (id) => api.delete(`/pets/${id}`),
}

export const vaccinationsApi = {
  getForPet: (petId) => api.get(`/pets/${petId}/vaccinations`),
  getAll: () => api.get('/vaccinations'),
  getReminders: (daysAhead = 30) => api.get(`/vaccinations/reminders?daysAhead=${daysAhead}`),
  create: (petId, data) => api.post(`/pets/${petId}/vaccinations`, data),
  update: (id, data) => api.put(`/vaccinations/${id}`, data),
  delete: (id) => api.delete(`/vaccinations/${id}`),
}

export const medicalRecordsApi = {
  getForPet: (petId) => api.get(`/pets/${petId}/medical-records`),
  getAll: () => api.get('/medical-records'),
  create: (petId, data) => api.post(`/pets/${petId}/medical-records`, data),
  update: (id, data) => api.put(`/medical-records/${id}`, data),
  delete: (id) => api.delete(`/medical-records/${id}`),
}

export const medicinesApi = {
  getForPet: (petId) => api.get(`/pets/${petId}/medicines`),
  getAll: () => api.get('/medicines'),
  getActive: () => api.get('/medicines/active'),
  create: (petId, data) => api.post(`/pets/${petId}/medicines`, data),
  update: (id, data) => api.put(`/medicines/${id}`, data),
  delete: (id) => api.delete(`/medicines/${id}`),
}

export const appointmentsApi = {
  getForPet: (petId) => api.get(`/pets/${petId}/appointments`),
  getAll: () => api.get('/appointments'),
  getUpcoming: (daysAhead = 30) => api.get(`/appointments/upcoming?daysAhead=${daysAhead}`),
  create: (petId, data) => api.post(`/pets/${petId}/appointments`, data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  updateStatus: (id, status) => api.patch(`/appointments/${id}/status`, { status }),
  delete: (id) => api.delete(`/appointments/${id}`),
}

export const expensesApi = {
  getForPet: (petId) => api.get(`/pets/${petId}/expenses`),
  getAll: () => api.get('/expenses'),
  getBreakdown: () => api.get('/expenses/breakdown'),
  getTrend: (months = 6) => api.get(`/expenses/trend?months=${months}`),
  create: (petId, data) => api.post(`/pets/${petId}/expenses`, data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
}

export const documentsApi = {
  getForPet: (petId) => api.get(`/pets/${petId}/documents`),
  getAll: () => api.get('/documents'),
  upload: (petId, formData) => api.post(`/pets/${petId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/documents/${id}`),
}

export const dashboardApi = {
  getSummary: () => api.get('/dashboard/summary'),
}
