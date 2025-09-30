<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const draft = ref({ email: '', password: '' })
const saving = ref(false)
const errorMsg = ref('')

const submit = async () => {
    saving.value = true
    errorMsg.value = ''

    const ok = await auth.login(draft.value)
    if (!ok) {
        errorMsg.value = auth.error || 'Credenciales inválidas'
        saving.value = false
        return
    }

    const redirect =
        typeof route.query.redirect === 'string' ? route.query.redirect : '/home'
    await router.push(redirect)

    saving.value = false
    draft.value = { email: '', password: '' }
}
</script>

<template>
    <div class="row mt-3">
        <div class="card card-outline card-primary col-md-6 offset-md-3">
            <div class="card-header text-center">
                <h1><b>LOGIN</b></h1>
            </div>
            <div class="card-body">
                <form @submit.prevent="submit">
                    <div class="input-group mb-3">
                        <input v-model="draft.email" type="email" class="form-control" placeholder="Email" required>
                        <div class="input-group-append">
                            <div class="input-group-text">
                                <span class="fas fa-envelope"></span>
                            </div>
                        </div>
                    </div>
                    <div class="input-group mb-3">
                        <input v-model="draft.password" type="password" class="form-control" placeholder="Password"
                            required>
                        <div class="input-group-append">
                            <div class="input-group-text">
                                <span class="fas fa-lock"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <button type="submit" class="btn btn-primary btn-block" :disabled="saving">
                                {{ saving ? 'Cargando...' : 'Ingresar' }}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>