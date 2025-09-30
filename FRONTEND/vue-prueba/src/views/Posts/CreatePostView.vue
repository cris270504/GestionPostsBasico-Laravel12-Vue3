<script setup> 
import {onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import { useAuthorsStore } from '@/stores/authors';
import { storeToRefs } from 'pinia';
import HomeView from '../HomeView.vue';

const router = useRouter()

// Autores
const authorsStore = useAuthorsStore()
const { items: authors } = storeToRefs(authorsStore)
onMounted(authorsStore.fetchAll)

// Posts
const {add} = usePostsStore()

const draft = ref({ title: '', body: '', author_id: null })
const saving = ref(false)
const serverErrors = ref(null)  

async function savePost() {
  const title = draft.value.title?.trim()
  const body  = draft.value.body?.trim()
  const author_id = draft.value.author_id
  if (!title || !author_id || !body) return

  try {
    saving.value = true
    serverErrors.value = null
    await add({ title, body, author_id })
    await router.push({ name: 'posts' })
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
                <div class="card-header bg-dark text-white text-center">Crear post</div>
                <div class="card-body">
                    <form @submit.prevent="savePost">
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
                            <button type="submit" class="btn btn-success">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>