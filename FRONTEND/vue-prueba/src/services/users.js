import api from '@/lib/api'

// Métodos CRUD
// post = { name, email, password }
export function listUsers() {
  return api.get('/users').then(res => res.data)
}

export function getUsers(id) {
  return api.get(`/users/${id}`).then(res => res.data)
}

export function createUsers(user) {
  return api.post('/users', user).then(res => res.data)
}

export function updateUsers(id, user) {
  return api.put(`/users/${id}`, user).then(res => res.data)
}

export function deleteUsers(id) {
  return api.delete(`/users/${id}`).then(res => res.data)
}
