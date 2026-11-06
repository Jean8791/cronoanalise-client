<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api, mensagemErro } from '@/services/api'
import { sessao } from '@/services/sessao'
import AvisoAcademico from '@/components/AvisoAcademico.vue'

const route = useRoute()
const router = useRouter()

const DEMO = { login: import.meta.env.VITE_DEMO_LOGIN, senha: import.meta.env.VITE_DEMO_SENHA }
const demoDisponivel = !!(DEMO.login && DEMO.senha)

const login = ref('')
const senha = ref('')
const verSenha = ref(false)
const carregando = ref(false)
const erro = ref(route.query.expirou ? 'Sua sessão expirou. Entre novamente.' : '')

async function entrar(credenciais = { login: login.value, senha: senha.value }) {
  if (!credenciais.login || !credenciais.senha) {
    erro.value = 'Informe login e senha.'
    return
  }
  carregando.value = true
  erro.value = ''
  try {
    const { data } = await api.post('/auth/login', credenciais)
    sessao.entrar(data)
    router.replace(typeof route.query.voltar === 'string' ? route.query.voltar : { name: 'inicio' })
  } catch (e) {
    erro.value = mensagemErro(e, 'Não foi possível entrar.')
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <div class="text-center mb-6">
          <v-icon icon="mdi-timer-cog-outline" size="56" color="primary" />
          <h1 class="text-h4 font-weight-bold mt-2">Cronoanálise</h1>
          <p class="text-medium-emphasis">Tempos cronometrados, tempo padrão e capacidade de produção.</p>
        </div>

        <v-card class="pa-6" elevation="2">
          <v-form @submit.prevent="entrar()">
            <v-text-field v-model="login" label="Login" prepend-inner-icon="mdi-account-outline" autocomplete="username"
                          autofocus />
            <v-text-field v-model="senha" label="Senha" prepend-inner-icon="mdi-lock-outline"
                          :type="verSenha ? 'text' : 'password'" autocomplete="current-password"
                          :append-inner-icon="verSenha ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                          @click:append-inner="verSenha = !verSenha" />
            <v-alert v-if="erro" type="error" variant="tonal" density="compact" class="mb-4">{{ erro }}</v-alert>
            <v-btn type="submit" color="primary" size="large" block :loading="carregando">Entrar</v-btn>
          </v-form>

          <template v-if="demoDisponivel">
            <v-divider class="my-6" />
            <div class="text-center">
              <p class="text-overline text-primary mb-1">Quer só conhecer?</p>
              <p class="text-body-2 text-medium-emphasis mb-3">
                Entre como visitante (<code>{{ DEMO.login }}</code> / <code>{{ DEMO.senha }}</code>), com perfil de aluno:
                consulta empresas e produtos de exemplo e registra cronoanálises.
              </p>
              <v-btn variant="tonal" color="primary" block prepend-icon="mdi-account-eye-outline" :loading="carregando"
                     @click="entrar({ login: DEMO.login, senha: DEMO.senha })">
                Entrar como visitante
              </v-btn>
            </div>
          </template>
        </v-card>

        <AvisoAcademico class="justify-center mt-6" />
      </v-col>
    </v-row>
  </v-container>
</template>
