import { createRouter, createWebHistory } from 'vue-router'

// Layout
import DefaultLayout from '@/layouts/DefaultLayout.vue'

// Main
import Dashboard from '@/views/Dashboard.vue'
import HomeView from '@/views/HomeView.vue'

// Posts
import PostsView from '@/views/Posts/PostsView.vue'
import CreatePostView from '@/views/Posts/CreatePostView.vue'
import EditPostView from '@/views/Posts/EditPostView.vue'

// Authors
import AuthorsView from '@/views/Authors/AuthorsView.vue'
import CreateAuthorView from '@/views/Authors/CreateAuthorView.vue'
import EditAuthorView from '@/views/Authors/EditAuthorView.vue'

// Auth 
import LoginView from '@/views/Auth/LoginView.vue'
import RegisterView from '@/views/Auth/RegisterView.vue'
import Logout from '@/views/Auth/Logout.vue'
import Users from '@/views/Auth/Users.vue'
import Profile from '@/views/Auth/Profile.vue'

import { LS_TOKEN_KEY, LS_USER_KEY } from '@/services/src/constants/auth'
import { useAuthStore } from '@/stores/auth'
import { showAlerta} from '@/funciones'

function hasSession() {
  const token = localStorage.getItem(LS_TOKEN_KEY)
  const user = localStorage.getItem(LS_USER_KEY)
  return !!token && !!user
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        { path: '', 
          name: 'dashboard', 
          component: Dashboard, 
          meta: { title: '📊 Dashboard', authenticated: true } },

        // Home y módulos
        { path: 'home', 
          name: 'home', 
          component: HomeView, 
          meta: { title: '🏠 Home', authenticated: true } },

        // Posts
        { path: 'posts', 
          name: 'posts', 
          component: PostsView, 
          meta: 
          { title: '📝 Posts', authenticated: true, permission:'ver posts' } },

        { path: 'posts/create', 
          name: 'createPost', 
          component: CreatePostView, 
          meta: { title: '➕ Crear Post', authenticated: true , permission: 'crear posts'}},

        { path: 'posts/:id/edit', 
          name: 'editPost', 
          component: EditPostView, 
          meta: { title: '✏️ Editar Post', authenticated: true, permission: 'editar posts' } },

        // Authors
        { path: 'authors', 
          name: 'authors', 
          component: AuthorsView, 
          meta: { title: '👥 Autores', authenticated: true, permission: 'ver autores' } },
          
        { path: 'authors/create',
          name: 'createAuthor', 
          component: CreateAuthorView, 
          meta: { title: '➕ Crear Autor', authenticated: true, permission: 'crear autores' } },

        { path: 'authors/:id/edit', 
          name: 'editAuthor', 
          component: EditAuthorView, 
          meta: { title: '✏️ Editar Autor', authenticated: true, permission:'editar autores' } },

        // Datos de la cuenta
        { path: 'auth/profile', 
          name: 'profile', 
          component: Profile, 
          meta: { title: '👤 Profile', authenticated: true } },

        { 
          path: 'auth/users', 
          name: 'users', 
          component: Users, 
          meta: { title: '👥 Users', authenticated: true, permission: 'ver usuarios' } },

        { 
          path: 'auth/logout', 
          name: 'logout', 
          component: Logout, 
          meta: { title: '🔒 Logout', authenticated: true } 
        },

        {
          path: 'auth/users/create',
          name: 'userCreate',
          component: RegisterView,
          meta: { title: '➕ Crear usuario', authenticated: true, permission:'crear usuarios' }
        },

      ],
    },

    // Público
    { path: '/login', name: 'login', component: LoginView, meta: { guest: true, title: '🔐 Login' } },
    { path: '/register', name: 'register', component: RegisterView, meta: { guest: true, title: '📝 Register' } },
  ],
})

router.beforeEach((to) => {
  const logged = hasSession()
  const needsAuth = to.matched.some(r => r.meta?.authenticated)
  const onlyGuests = to.matched.some(r => r.meta?.guest)
  const auth = useAuthStore()

  if (needsAuth && !logged) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (onlyGuests && logged) {
    return { name: 'home' }
  }

  const requiredPerms = to.matched.flatMap(r => r.meta?.permission ?? [])
  if (requiredPerms.length && !auth.user?.permissions?.some(p => requiredPerms.includes(p))) {
    showAlerta('No tiene permisos para realizar esta acción','error')
    return { name: 'home' }
  }

  const requiredRoles = to.matched.flatMap(r => r.meta?.roles ?? [])
  if (requiredRoles.length && !requiredRoles.some(r => auth.user?.roles?.includes(r))) {
    showAlerta('No puede realizar esta acción','error')
    return { name: 'home' }
  }
})

router.afterEach((to) => {
  const nearestWithTitle = [...to.matched].reverse().find(r => r.meta?.title)
  document.title = nearestWithTitle ? nearestWithTitle.meta.title : 'Cristopher´s App'
})

export default router
