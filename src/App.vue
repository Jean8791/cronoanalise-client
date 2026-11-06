<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { sessao } from '@/services/sessao'
import AvisoAcademico from '@/components/AvisoAcademico.vue'

const route = useRoute()
const router = useRouter()
const { mobile } = useDisplay()
const gaveta = ref(null)

const menu = computed(() => [
  { titulo: 'Início', icone: 'mdi-view-dashboard-outline', rota: 'inicio' },
  { titulo: 'Cronoanálises', icone: 'mdi-timer-outline', rota: 'cronoanalises' },
  { titulo: 'Empresas', icone: 'mdi-factory', rota: 'empresas' },
  { titulo: 'Produtos', icone: 'mdi-package-variant-closed', rota: 'produtos' },
  ...(sessao.ehAdmin.value ? [{ titulo: 'Usuários', icone: 'mdi-account-group-outline', rota: 'usuarios' }] : []),
])

const nomesPerfil = { ADMIN: 'Administrador', PROFESSOR: 'Professor', ALUNO: 'Aluno' }

function sair() {
  sessao.sair()
  router.push({ name: 'login' })
}
</script>

<template>
  <v-app>
    <template v-if="!route.meta.publica">
      <v-navigation-drawer v-model="gaveta" :permanent="!mobile" color="primary" width="232">
        <div class="pa-5 d-flex align-center ga-2">
          <v-icon icon="mdi-timer-cog-outline" size="28" />
          <span class="text-h6 font-weight-bold">Cronoanálise</span>
        </div>
        <v-list nav density="comfortable">
          <v-list-item v-for="item in menu" :key="item.rota" :to="{ name: item.rota }" :prepend-icon="item.icone"
                       :title="item.titulo" rounded="lg" />
        </v-list>
      </v-navigation-drawer>

      <v-app-bar flat border="b" color="surface">
        <v-app-bar-nav-icon v-if="mobile" @click="gaveta = !gaveta" />
        <AvisoAcademico class="ml-4 d-none d-sm-flex" />
        <v-spacer />
        <div class="text-right mr-3">
          <div class="text-body-2 font-weight-medium">{{ sessao.usuario?.nome }}</div>
          <div class="text-caption text-medium-emphasis">{{ nomesPerfil[sessao.perfil.value] }}</div>
        </div>
        <v-btn icon="mdi-logout" variant="text" title="Sair" @click="sair" />
      </v-app-bar>
    </template>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
