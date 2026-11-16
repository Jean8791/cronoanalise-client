<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay, useTheme } from 'vuetify'
import { sessao } from '@/services/sessao'
import { salvarTema } from '@/plugins/vuetify'
import AvisoAcademico from '@/components/AvisoAcademico.vue'

const route = useRoute()
const router = useRouter()
const { mobile } = useDisplay()
const tema = useTheme()
const escuro = computed(() => tema.global.name.value === 'crono')

const menu = computed(() => [
  { titulo: 'Início', icone: 'mdi-view-dashboard-outline', rota: 'inicio' },
  { titulo: 'Cronoanálises', icone: 'mdi-timer-outline', rota: 'cronoanalises' },
  { titulo: 'Empresas', icone: 'mdi-factory', rota: 'empresas' },
  { titulo: 'Produtos', icone: 'mdi-package-variant-closed', rota: 'produtos' },
  ...(sessao.ehAdmin.value ? [{ titulo: 'Usuários', icone: 'mdi-account-group-outline', rota: 'usuarios' }] : []),
])

const nomesPerfil = { ADMIN: 'Administrador', PROFESSOR: 'Professor', ALUNO: 'Aluno' }

function alternarTema() {
  tema.global.name.value = escuro.value ? 'crono-claro' : 'crono'
  salvarTema(tema.global.name.value)
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', escuro.value ? '#14161a' : '#eceef0')
}

function sair() {
  sessao.sair()
  router.push({ name: 'login' })
}
</script>

<template>
  <v-app>
    <template v-if="!route.meta.publica">
      <v-app-bar flat border="b" color="surface" density="compact">
        <router-link :to="{ name: 'inicio' }" class="logo d-flex align-center ga-2 ml-4 mr-6">
          <v-icon icon="mdi-timer-cog-outline" color="primary" />
          <span class="rotulo logo-texto">Cronoanálise</span>
        </router-link>

        <v-tabs v-if="!mobile" color="primary" density="compact" class="flex-grow-0">
          <v-tab v-for="item in menu" :key="item.rota" :to="{ name: item.rota }" :prepend-icon="item.icone" rounded="0">
            {{ item.titulo }}
          </v-tab>
        </v-tabs>

        <v-spacer />

        <div v-if="!mobile" class="text-right mr-2 lh-1">
          <div class="text-body-2 font-weight-medium">{{ sessao.usuario?.nome }}</div>
          <div class="rotulo">{{ nomesPerfil[sessao.perfil.value] }}</div>
        </div>
        <v-btn :icon="escuro ? 'mdi-weather-sunny' : 'mdi-weather-night'" variant="text" size="small"
               :title="escuro ? 'Tema claro' : 'Tema escuro'" @click="alternarTema" />
        <v-btn v-if="!mobile" icon="mdi-logout" variant="text" size="small" title="Sair" @click="sair" />

        <v-menu v-if="mobile">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon="mdi-menu" variant="text" size="small" title="Menu" />
          </template>
          <v-list density="compact" nav>
            <v-list-item v-for="item in menu" :key="item.rota" :to="{ name: item.rota }" :prepend-icon="item.icone"
                         :title="item.titulo" />
            <v-divider class="my-1" />
            <v-list-item :title="`${sessao.usuario?.nome} · ${nomesPerfil[sessao.perfil.value]}`" disabled />
            <v-list-item prepend-icon="mdi-logout" title="Sair" @click="sair" />
          </v-list>
        </v-menu>
      </v-app-bar>

      <v-footer app border="t" color="surface" class="py-1 justify-center">
        <AvisoAcademico />
      </v-footer>
    </template>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped>
.logo {
  color: inherit;
  text-decoration: none;
}
.logo-texto {
  opacity: 1;
  font-size: 0.8rem;
}
.lh-1 {
  line-height: 1.2;
}
</style>
