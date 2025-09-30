import { defineStore } from 'pinia'
import { listAuthors, createAuthor, updateAuthor, deleteAuthor, getAuthor } from '@/services/author'
import { confirmarEliminacion, showAlerta, showErroresDeValidacion } from '@/funciones'

export const useAuthorsStore = defineStore('authors', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    byId: (state) => (id) => state.items.find(a => a.id === id),
    count: (state) => state.items.length,
  },

  actions: {
    async fetchAll(params = {}) {
      this.loading = true
      this.error = null
      try {
        this.items = await listAuthors(params)
      } catch (e) {
        this.error = e?.message || 'Error al listar autores'
      } finally {
        this.loading = false
      }
    },

    async fetchOne(id, params = {}) {
      this.loading = true
      this.error = null
      try {
        const author = await getAuthor(id, params)
        const idx = this.items.findIndex(a => a.id === id)
        if (idx === -1) this.items.unshift(author)
        else this.items[idx] = author
      } catch (e) {
        this.error = e?.message || 'Error al obtener autor'
      } finally {
        this.loading = false
      }
    },

    async add(author) {
      try {
        const created = await createAuthor(author)
        const idx = this.items.findIndex(a => a.id === created.id)
        if (idx !== -1) this.items[idx] = created
        else this.items.unshift(created)
        showAlerta('Creado correctamente', 'success')
        return created
      } catch (e) {
        const errors = e?.response?.data?.errors
        showErroresDeValidacion(errors)
        throw e
      }
    },

    async save(id, author) {
      try {
        const updated = await updateAuthor(id, author)
        const idx = this.items.findIndex(a => a.id === id)
        if (idx !== -1) this.items[idx] = updated
        showAlerta('Actualizado correctamente', 'success')
        return updated
      } catch (e) {
        const errors = e?.response?.data?.errors
        showErroresDeValidacion(errors)
        throw e
      }
    },

    /**
         * Confirma y, si aceptan, elimina el post desde el store
         * @param {number|string} id
         * @param {string} nombre para mostrar (ej: título)
         */
    async remove(id, nombre) {
      const ok = await confirmarEliminacion(nombre)
      if (!ok) {
        showAlerta('Operación cancelada', 'info')
        return false
      }

      try {
        await deleteAuthor(id)
        this.items = this.items.filter(p => p.id !== id)
        showAlerta('Eliminado correctamente', 'success')
        return true
      } catch (e) {
        showAlerta(e?.message || 'No se pudo eliminar', 'error')
        return false
      }
    },
  },
})