import api from '@/lib/api'

// Métodos CRUD
export function listPosts() {
  return api.get('/posts').then(res => res.data)
}

export function getPost(id) {
  return api.get(`/posts/${id}`).then(res => res.data)
}

export function createPost(post) {
  // post = { title, body, author_id }
  return api.post('/posts', post).then(res => res.data)
}

export function updatePost(id, post) {
  // post = { title, body, author_id }
  return api.put(`/posts/${id}`, post).then(res => res.data)
}

export function deletePost(id) {
  return api.delete(`/posts/${id}`).then(res => res.data)
}
