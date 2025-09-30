import { defineStore } from 'pinia'
import { listUsers, createUsers, updateUsers, deleteUsers, getUsers } from '@/services/users'
import { confirmarEliminacion, showAlerta,showErroresDeValidacion } from '@/funciones'

export const useUsersStore = defineStore('users', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    byId: (state) => (id) => state.items.find(u => u.id === id),
    count: (state) => state.items.length,
  },

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        this.items = await listUsers()
      } catch (e) {
        this.error = e?.message || 'Error al listar'
      } finally {
        this.loading = false
      }
    },

    async fetchOne(id) {
      this.loading = true
      this.error = null
      try {
        const user = await getUsers(id)
        const idx = this.items.findIndex(u => u.id === id)
        if (idx === -1) this.items.unshift(user)
        else this.items[idx] = user
      } catch (e) {
        this.error = e?.message || 'Error al obtener'
      } finally {
        this.loading = false
      }
    },

    async add(user) {
      try {
        const created = await createUsers(user)
        const idx = this.items.findIndex(u => u.id === created.id)
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

    async save(id, user) {
      try {
        const updated = await updateUsers(id, user)
        const idx = this.items.findIndex(u => u.id === id)
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
    async remove(id, nombre ) {
      const ok = await confirmarEliminacion(nombre)
      if (!ok) {
        showAlerta('Operación cancelada', 'info')
        return false
      }

      try {
        await deleteUsers(id)
        this.items = this.items.filter(u => u.id !== id)
        showAlerta('Eliminado correctamente', 'success')
        return true
      } catch (e) {
        showAlerta(e?.message || 'No se pudo eliminar', 'error')
        return false
      }
    },
  },
})
