<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { showAlerta } from '@/funciones'

const router = useRouter()
const auth = useAuthStore()

const roles = ref([])

onMounted(async () => {
  const { data } = await api.get('/roles') 
  roles.value = data                      
})

const draft = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: ''            
})

const saving = ref(false)
const fieldErrors = ref({})

const submit = async () => {
  saving.value = true
  fieldErrors.value = {}

  try {
    const payload = {
      name: draft.value.name,
      email: draft.value.email,
      password: draft.value.password,
      password_confirmation: draft.value.password_confirmation,
      roles: [draft.value.role],           
    }
    await api.post('/users', payload)     

    showAlerta?.('Usuario creado', 'success')
    router.push({ name: 'users' })
  } catch (e) {
    const data = e?.response?.data
    fieldErrors.value = data?.errors || {}
    showAlerta?.(data?.message || 'No se pudo crear el usuario', 'error')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="row mt-3">
    <div class="card card-outline card-primary col-md-6 offset-md-3">
      <div class="card-header text-center">
        <h1><b>REGISTRAR NUEVO USUARIO</b></h1>
      </div>
      <div class="card-body">
        <form @submit.prevent="submit">
          <div class="input-group mb-2">
            <input v-model="draft.name" type="text" class="form-control" maxlength="50" placeholder="Nombre" required>
          </div>
          <div class="text-danger small" v-if="fieldErrors.name">{{ fieldErrors.name[0] }}</div>

          <div class="input-group mb-2">
            <input v-model="draft.email" type="email" class="form-control" maxlength="50" placeholder="Email" required>
          </div>
          <div class="text-danger small" v-if="fieldErrors.email">{{ fieldErrors.email[0] }}</div>

          <div class="input-group mb-2">
            <input v-model="draft.password" type="password" class="form-control" maxlength="50" placeholder="Contraseña" required>
          </div>
          <div class="input-group mb-2">
            <input v-model="draft.password_confirmation" type="password" class="form-control" maxlength="50" placeholder="Verificar contraseña" required>
          </div>
          <div class="text-danger small" v-if="fieldErrors.password">{{ fieldErrors.password[0] }}</div>

          <div class="input-group mb-3">
            <select v-model="draft.role" required class="form-control">
              <option value="" disabled>Selecciona un rol</option>
              <option v-for="r in roles" :key="r.id" :value="r.name">{{ r.name }}</option>
            </select>
          </div>
          <div class="text-danger small" v-if="fieldErrors.roles">{{ fieldErrors.roles[0] }}</div>

          <div class="d-grid col-4 mx-auto">
            <button type="submit" class="btn btn-success" :disabled="saving">
              {{ saving ? 'Guardando…' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
