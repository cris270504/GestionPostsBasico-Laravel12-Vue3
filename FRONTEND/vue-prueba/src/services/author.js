import api from '@/lib/api'

// CRUD Autores
export function listAuthors(params = {}) {
  return api.get('/authors', { params }).then(res => res.data)
}

export function getAuthor(id, params = {}) {
  return api.get(`/authors/${id}`, { params }).then(res => res.data)
}

export function createAuthor(payload) {
  return api.post('/authors', payload).then(res => res.data)
}

export function updateAuthor(id, payload) {
  return api.put(`/authors/${id}`, payload).then(res => res.data)
}

export function deleteAuthor(id) {
  return api.delete(`/authors/${id}`).then(res => res.data)
}