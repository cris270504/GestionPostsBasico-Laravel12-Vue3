<script setup>
import { ref } from 'vue';
import { useAuthorsStore } from '@/stores/authors';
import { useRouter } from 'vue-router';
import HomeView from '../HomeView.vue';

const router = useRouter()

const authorStore = useAuthorsStore()
const {add} = authorStore

const draft = ref({ name: ''})
const saving = ref(false)
const serverErrors = ref(null)  

async function saveAuthor(){
    const name = draft.value.name
    if (!name) return
    try {
    saving.value = true
    serverErrors.value = null
    await add({name})
    await router.push({ name: 'authors' })
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }

}
</script>

<template>
    <HomeView></HomeView>
    <div class="row mt-3">
        <div class="col-md-6 offset-md-3">
            <div class="card">
                <div class="card-header bg-dark text-white text-center">Crear autor</div>
                <div class="card-body">
                    <form @submit.prevent="saveAuthor">
                        <div class="input-group mb-3">
                            <input v-model="draft.name" type="text" class="form-control" maxlength="50" placeholder="Nombre" required>
                        </div>
                        <div class="d-grid col-2 mx-auto">
                            <button type="submit" class="btn btn-success" :disabled="saving">
                                {{ saving ? 'Guardando…' : 'Guardar' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>