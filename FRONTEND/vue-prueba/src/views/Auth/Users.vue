<script setup>
import { useUsersStore } from '@/stores/users';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import EasyDataTable from 'vue3-easy-data-table'

const headers = [
    { text: 'ID', value: 'id' },
    { text: 'Name', value: 'name' },
    { text: 'Email', value: 'email' },
]

const usersStore = useUsersStore()
const {items: users} = storeToRefs(usersStore)
const {fetchAll} = usersStore;

onMounted(() => {
  fetchAll()
})
</script>

<template>
    <div class="main-page">
        <!-- Page Header -->
        <div class="page-header">
            <h2 class="title">👥 Listado de usuarios</h2>
            <div class="mb-3 d-flex justify-content-end">
                <RouterLink :to="{ name: 'userCreate' }" class="btn btn-success">
                    Crear usuario
                </RouterLink>
            </div>
        </div>

        <!-- Users Table -->
        <EasyDataTable :headers="headers" :items="users" :rows-per-page="5" table-class="rounded-xl shadow bg-white">
        </EasyDataTable>
    </div>
</template>