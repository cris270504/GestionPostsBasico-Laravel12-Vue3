<script setup>
import { onMounted, computed } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { storeToRefs } from 'pinia'
import { useAuthorsStore } from '@/stores/authors'
import { Pencil, Trash } from 'lucide-vue-next';

const posts = usePostsStore()
const { items } = storeToRefs(posts)
const { fetchAll, remove } = posts

const authorStore = useAuthorsStore()
const { fetchAll: fetchAuthors } = authorStore

onMounted(() => {
  fetchAll()
  fetchAuthors()
})

const prettyItems = computed(() =>
  (items.value || []).map(p => ({
    ...p,
    authorName: p.author?.name ?? null,
    authorId: p.author_id ?? p.author?.id ?? null,
    description: p.body,
  }))
)
</script>

<template>
  <div class="row">
    <div class="col-lg-8 offset-lg-2">
      <div class="mb-3 d-flex justify-content-end">
        <RouterLink :to="{ name: 'createPost' }" class="btn btn-success">
          Crear Post
        </RouterLink>
      </div>
      <div class="table-responsive">
        <table class="table table-bordered table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Título</th>
              <th>Autor</th>
              <th>Cuerpo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody class="table-group-divider" id="contenido">
            <tr v-for="p, i in prettyItems" :key="p.id">
              <td>{{ (i + 1) }}</td>
              <td>{{ p.title }}</td>
              <td>{{ p.authorName }}</td>
              <td>{{ p.body }}</td>
              <td>
                <RouterLink :to="{ path: 'posts/' + p.id + '/edit' }" class="btn btn-warning">
                  <Pencil />
                </RouterLink> &nbsp;
                <button class="btn btn-danger" @click="remove(p.id, p.title)">
                  <Trash />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>