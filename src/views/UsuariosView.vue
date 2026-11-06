<script setup>
import { onMounted, ref } from 'vue'
import { api, mensagemErro } from '@/services/api'
import { sessao } from '@/services/sessao'

const usuarios = ref([])
const carregando = ref(true)
const aviso = ref({ mostrar: false, texto: '', cor: 'success' })
const dialogo = ref(false)
const salvando = ref(false)
const erroForm = ref('')
const form = ref(vazio())

const perfis = [
  { title: 'Administrador', value: 'ADMIN' },
  { title: 'Professor', value: 'PROFESSOR' },
  { title: 'Aluno', value: 'ALUNO' },
]
const nomePerfil = Object.fromEntries(perfis.map((p) => [p.value, p.title]))

const cabecalhos = [
  { title: 'Nome', key: 'nome' },
  { title: 'Login', key: 'login' },
  { title: 'E-mail', key: 'email' },
  { title: 'Perfil', key: 'perfil' },
  { title: '', key: 'acoes', sortable: false, align: 'end' },
]

function vazio() {
  return { id: null, nome: '', email: '', login: '', senha: '', perfil: 'ALUNO' }
}

async function carregar() {
  carregando.value = true
  try {
    usuarios.value = (await api.get('/usuarios')).data
  } catch (e) {
    avisar(mensagemErro(e), 'error')
  } finally {
    carregando.value = false
  }
}
onMounted(carregar)

function avisar(texto, cor = 'success') {
  aviso.value = { mostrar: true, texto, cor }
}

function abrir(u) {
  erroForm.value = ''
  form.value = u ? { id: u.id, nome: u.nome, email: u.email || '', login: u.login, senha: '', perfil: u.perfil } : vazio()
  dialogo.value = true
}

async function salvar() {
  erroForm.value = ''
  const corpo = { nome: form.value.nome, email: form.value.email || null, login: form.value.login,
    senha: form.value.senha || null, perfil: form.value.perfil }
  salvando.value = true
  try {
    if (form.value.id) await api.put(`/usuarios/${form.value.id}`, corpo)
    else await api.post('/usuarios', corpo)
    dialogo.value = false
    avisar('Usuário salvo.')
    carregar()
  } catch (e) {
    erroForm.value = mensagemErro(e)
  } finally {
    salvando.value = false
  }
}

async function alternarBloqueio(u) {
  try {
    await api.post(`/usuarios/${u.id}/${u.bloqueado ? 'desbloquear' : 'bloquear'}`)
    avisar(u.bloqueado ? 'Usuário desbloqueado.' : 'Usuário bloqueado.')
    carregar()
  } catch (e) {
    avisar(mensagemErro(e), 'error')
  }
}
</script>

<template>
  <v-container class="py-8" style="max-width: 1100px">
    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold">Usuários</h1>
        <p class="text-medium-emphasis">Professores cadastram empresas e produtos; alunos registram cronoanálises.</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-account-plus-outline" @click="abrir()">Novo usuário</v-btn>
    </div>

    <v-card border flat>
      <v-data-table :headers="cabecalhos" :items="usuarios" :loading="carregando" items-per-page="10"
                    no-data-text="Nenhum usuário." loading-text="Carregando…">
        <template #item.nome="{ item }">
          <span :class="{ 'text-disabled': item.bloqueado }">{{ item.nome }}</span>
          <v-chip v-if="item.bloqueado" size="x-small" color="error" variant="tonal" class="ml-2">Bloqueado</v-chip>
        </template>
        <template #item.email="{ item }">{{ item.email || '—' }}</template>
        <template #item.perfil="{ item }">
          <v-chip size="small" variant="tonal" :color="item.perfil === 'ADMIN' ? 'primary' : item.perfil === 'PROFESSOR' ? 'secondary' : undefined">
            {{ nomePerfil[item.perfil] }}
          </v-chip>
        </template>
        <template #item.acoes="{ item }">
          <v-btn icon="mdi-pencil-outline" variant="text" size="small" title="Editar" @click="abrir(item)" />
          <v-btn v-if="item.id !== sessao.usuario?.id" :icon="item.bloqueado ? 'mdi-lock-open-variant-outline' : 'mdi-lock-outline'"
                 variant="text" size="small" :title="item.bloqueado ? 'Desbloquear' : 'Bloquear'" @click="alternarBloqueio(item)" />
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialogo" max-width="560">
      <v-card>
        <v-card-title class="pa-5">{{ form.id ? 'Editar usuário' : 'Novo usuário' }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="form.nome" label="Nome" />
          <v-text-field v-model="form.email" label="E-mail (opcional)" type="email" />
          <v-row>
            <v-col cols="12" sm="6"><v-text-field v-model="form.login" label="Login" autocomplete="off" /></v-col>
            <v-col cols="12" sm="6">
              <v-select v-model="form.perfil" :items="perfis" label="Perfil" :disabled="form.id === sessao.usuario?.id" />
            </v-col>
          </v-row>
          <v-text-field v-model="form.senha" :label="form.id ? 'Nova senha (deixe em branco para manter)' : 'Senha'"
                        type="password" autocomplete="new-password" hint="Mínimo de 8 caracteres" persistent-hint />
          <v-alert v-if="erroForm" type="error" variant="tonal" density="compact" class="mt-4">{{ erroForm }}</v-alert>
        </v-card-text>
        <v-card-actions class="pa-5">
          <v-spacer />
          <v-btn variant="text" @click="dialogo = false">Cancelar</v-btn>
          <v-btn color="primary" variant="flat" :loading="salvando" @click="salvar">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="aviso.mostrar" :color="aviso.cor" timeout="3500">{{ aviso.texto }}</v-snackbar>
  </v-container>
</template>
