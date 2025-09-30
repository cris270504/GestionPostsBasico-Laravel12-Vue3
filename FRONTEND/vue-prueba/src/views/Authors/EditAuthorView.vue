<script setup>
import { onMounted, ref } from 'vue';
import { useAuthorsStore } from '@/stores/authors';
import { useRouter,useRoute } from 'vue-router';
import { getAuthor } from '@/services/author';
import HomeView from '../HomeView.vue';

const router = useRouter()
const route = useRoute()

const authorStore = useAuthorsStore()
const {save} = authorStore

const draft = ref({ id:'', name: ''})
const saving = ref(false)
const serverErrors = ref(null)  

onMounted(async () =>{
    const id = Number(route.params.id)
    const a = await getAuthor(id)

    draft.value = {
        id: a.id,
        name: a.name
    }
})

async function updateAuthor(){

    const name = draft.value.name
    if (!name) return

    try {
    saving.value = true
    serverErrors.value = null
    
    await save(draft.value.id,{name})
    await router.push({ name: 'authors' })
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
    draft = ref({ id:'', name: ''})
  }

}
</script>

<template>
    <HomeView></HomeView>
    <div class="row mt-3">
        <div class="col-md-6 offset-md-3">
            <div class="card">
                <div class="card-header bg-dark text-white text-center">Editar autor</div>
                <div class="card-body">
                    <form @submit.prevent="updateAuthor">
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