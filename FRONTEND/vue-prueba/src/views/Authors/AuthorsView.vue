<script setup>
import { ref, onMounted } from 'vue';
import { useAuthorsStore } from '@/stores/authors';
import { storeToRefs } from 'pinia';
import { Pencil, Trash } from 'lucide-vue-next';
import HomeView from '../HomeView.vue';

const authorsStore = useAuthorsStore();
const { items: authors } = storeToRefs(authorsStore);
const { fetchAll, remove } = authorsStore;

onMounted(() => {
  fetchAll()
})
</script>

<template>
  <HomeView></HomeView>
  <div class="row">
    <div class="col-lg-8 offset-lg-2">
      <div class="mb-3 d-flex justify-content-end">
        <RouterLink :to="{ name: 'createAuthor' }" class="btn btn-success">
          Crear autor
        </RouterLink>
      </div>
      <div class="table-responsive">
        <table class="table table-bordered table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody class="table-group-divider" id="contenido">
            <tr v-for="a, i in authors" :key="a.id">
              <td>{{ (i + 1) }}</td>
              <td>{{ a.name }}</td>
              <td>
                <RouterLink :to="{ path: 'authors/' + a.id + '/edit' }" class="btn btn-warning">
                  <Pencil />
                </RouterLink> &nbsp;
                <button class="btn btn-danger" @click="remove(a.id, a.name)">
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