<script setup>
import { useAuthStore } from '@/stores/auth'
import {ref } from 'vue'

const tabs = ['Overview', 'Edit Profile']
const currentTab = ref('Overview')
const auth = useAuthStore()

const user = ref({
    name: auth.user.name,
    email: auth.user.email,
    password: '',
    password_confirmation: ''
    })

const draft = ref({ ...user.value })

const updateProfile = async () => {
  const ok = await auth.updateProfile(draft.value)
  if (ok) {
    currentTab.value = 'Overview'
  }
}
</script>

<template>
    <div class="main-page">
        <div class="page-header">
            <h2 class="title">👤 Perfil</h2>
            <p class="subtitle">Gestiona tu información personal y actividad</p>
        </div>

        <div class="tabs">
            <button v-for="tab in tabs" :key="tab" :class="['tab-button', { active: currentTab === tab }]"
                @click="currentTab = tab">
                {{ tab }}
            </button>
        </div>

        <div class="tab-content card">
            <div v-if="currentTab === 'Overview'">
                <h3>📄 Overview</h3>
                <div class="info-group">
                    <label>Nombre completo</label>
                    <p>{{ auth.user.name }}</p>
                </div>
                <div class="info-group">
                    <label>Email</label>
                    <p>{{ auth.user.email }}</p>
                </div>
                
            </div>

            <div v-else-if="currentTab === 'Edit Profile'">
                <h3>✏️ Editar Perfil</h3>
                <form @submit.prevent="updateProfile(draft)">
                    <input v-model="draft.name" type="text" placeholder="Tu Nombre" />
                    <input v-model="draft.email" type="email" placeholder="Tu Email" />
                    <input v-model="draft.password" type="password" placeholder="Tu Contraseña" />
                    <input v-model="draft.password_confirmation" type="password" placeholder="Confirma Tu Contraseña" />
                    <button type="submit">Guardar Cambios</button>
                </form>
            </div>

        </div>
    </div>
</template>

<style scoped>
.tab-button {
    background: #e5e7eb;
    border: none;
    padding: 0.5rem 1.25rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
    color: #111827;
}

.tab-button.active {
    background: #3b82f6;
    color: #fff;
}

/* Card */
.card {
    background: #fff;
    padding: 1rem;
    border-radius: 8px;
    box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.05),
        0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Forms */
form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

button {
    align-self: flex-start;
    padding: 0.5rem 1.5rem;
    background: #3b82f6;
    color: white;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease;
}

button:hover {
    background: #2563eb;
}

/* Display Info */
.info-group {
    margin-bottom: 1rem;
}

.info-group label {
    font-weight: 600;
    display: block;
    margin-bottom: 0.5rem;
    color: #334155;
}

.info-group p {
    background-color: #f9fafb;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    border: 1px solid #dbeafe;
    color: #0f172a;
}
</style>
