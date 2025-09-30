<script setup> 
import {onMounted, ref } from 'vue';
import { useRouter,useRoute } from 'vue-router'
import { storeToRefs } from 'pinia';
import { useAuthorsStore } from '@/stores/authors';
import { usePostsStore } from '@/stores/posts'
import { getPost } from '@/services/posts';
import HomeView from '../HomeView.vue';

const router = useRouter()
const route = useRoute()

// Autores
const authorsStore = useAuthorsStore()
const { items: authors } = storeToRefs(authorsStore)

// Posts
const {save} = usePostsStore()

const draft = ref({ id: null, title: '', body: '', author_id: null })
const saving = ref(false)
const serverErrors = ref(null)


onMounted(async () => {
  await authorsStore.fetchAll()

  const id = Number(route.params.id)
  const p = await getPost(id)
  draft.value = {
    id: p.id,
    title: p.title,
    body: p.body,
    author_id: p.author_id
  }
})

async function submitUpdate() {
  const title = draft.value.title?.trim()
  const body  = draft.value.body?.trim()
  const author_id = draft.value.author_id
  if (!title || !author_id || !body) return

  try {
    saving.value = true
    serverErrors.value = null

    await save(draft.value.id, { title, body, author_id })
    await router.push({ name: 'posts' })
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
    draft = ref({ id: null, title: '', body: '', author_id: null })
  }
}
</script>

<template>
    <HomeView></HomeView>
    <div class="row mt-3">
        <div class="col-md-6 offset-md-3">
            <div class="card">
                <div class="card-header bg-dark text-white text-center">Editar post</div>
                <div class="card-body">
                    <form @submit.prevent="submitUpdate">
                        <div class="input-group mb-3">
                            <input v-model="draft.title" type="text" class="form-control" maxlength="50" placeholder="Título" required>
                        </div>
                        <div class="input-group mb-3">
                            <select v-model.number="draft.author_id" required class="form-control">
                                <option value="" disabled>Selecciona un autor</option>
                                <option v-for="a in authors" :key="a.id" :value="a.id">
                                    {{ a.name }}
                                </option>

                            </select>
                        </div>
                        <div class="input-group mb-3">
                            <input v-model="draft.body" type="text" class="form-control" maxlength="50" placeholder="Cuerpo del post" required>
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