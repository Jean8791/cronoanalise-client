import { createRouter, createWebHistory } from 'vue-router'
import { sessao } from '@/services/sessao'

const routes = [
  { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { publica: true } },
  { path: '/', name: 'inicio', component: () => import('@/views/InicioView.vue') },
  { path: '/cronoanalises', name: 'cronoanalises', component: () => import('@/views/CronoanalisesView.vue') },
  { path: '/cronoanalises/nova', name: 'nova-cronoanalise', component: () => import('@/views/CronoanaliseFormView.vue') },
  { path: '/cronoanalises/:id', name: 'cronoanalise', component: () => import('@/views/CronoanaliseDetalheView.vue') },
  { path: '/cronoanalises/:id/editar', name: 'editar-cronoanalise', component: () => import('@/views/CronoanaliseFormView.vue') },
  { path: '/empresas', name: 'empresas', component: () => import('@/views/EmpresasView.vue') },
  { path: '/produtos', name: 'produtos', component: () => import('@/views/ProdutosView.vue') },
  { path: '/usuarios', name: 'usuarios', component: () => import('@/views/UsuariosView.vue'), meta: { perfis: ['ADMIN'] } },
  { path: '/:caminho(.*)*', redirect: '/' },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to) => {
  if (!to.meta.publica && !sessao.logado.value) return { name: 'login', query: { voltar: to.fullPath } }
  if (to.name === 'login' && sessao.logado.value) return { name: 'inicio' }
  if (to.meta.perfis && !to.meta.perfis.includes(sessao.perfil.value)) return { name: 'inicio' }
  return true
})

export default router
