<script setup>
import { onMounted, ref, watch } from 'vue'
import { api, mensagemErro } from '@/services/api'
import { sessao } from '@/services/sessao'

const produtos = ref([])
const empresas = ref([])
const carregando = ref(true)
const busca = ref('')
const filtroEmpresa = ref(null)
const incluirBloqueados = ref(false)
const aviso = ref({ mostrar: false, texto: '', cor: 'success' })

const dialogo = ref(false)
const salvando = ref(false)
const erroForm = ref('')
const form = ref(vazio())

function vazio() {
  return { id: null, empresaId: null, codigo: '', nome: '', operacoes: [{ nome: '', descricao: '', quantidadeOperadores: 1 }] }
}

const cabecalhos = [
  { title: 'Código', key: 'codigo' },
  { title: 'Produto', key: 'nome' },
  { title: 'Empresa', key: 'empresa.nome' },
  { title: 'Operações', key: 'operacoes', align: 'end' },
  { title: '', key: 'acoes', sortable: false, align: 'end' },
]

async function carregar() {
  carregando.value = true
  try {
    const { data } = await api.get('/produtos', {
      params: { busca: busca.value || undefined, empresaId: filtroEmpresa.value || undefined, incluirBloqueados: incluirBloqueados.value },
    })
    produtos.value = data
  } catch (e) {
    avisar(mensagemErro(e), 'error')
  } finally {
    carregando.value = false
  }
}

let atraso
watch(busca, () => {
  clearTimeout(atraso)
  atraso = setTimeout(carregar, 300)
})
watch([filtroEmpresa, incluirBloqueados], carregar)

onMounted(async () => {
  carregar()
  try {
    empresas.value = (await api.get('/empresas')).data
  } catch {
    /* a listagem de produtos já mostra o erro de conexão */
  }
})

function avisar(texto, cor = 'success') {
  aviso.value = { mostrar: true, texto, cor }
}

function abrir(produto) {
  erroForm.value = ''
  form.value = produto
    ? { id: produto.id, empresaId: produto.empresa.id, codigo: produto.codigo, nome: produto.nome,
        operacoes: produto.operacoes.map((o) => ({ ...o, descricao: o.descricao || '' })) }
    : vazio()
  dialogo.value = true
}

function mover(i, delta) {
  const ops = form.value.operacoes
  const j = i + delta
  if (j < 0 || j >= ops.length) return
  ;[ops[i], ops[j]] = [ops[j], ops[i]]
}

async function salvar() {
  erroForm.value = ''
  const corpo = {
    empresaId: form.value.empresaId,
    codigo: form.value.codigo,
    nome: form.value.nome,
    operacoes: form.value.operacoes.map((o) => ({
      nome: o.nome, descricao: o.descricao || null, quantidadeOperadores: Number(o.quantidadeOperadores),
    })),
  }
  salvando.value = true
  try {
    if (form.value.id) await api.put(`/produtos/${form.value.id}`, corpo)
    else await api.post('/produtos', corpo)
    dialogo.value = false
    avisar('Produto salvo.')
    carregar()
  } catch (e) {
    erroForm.value = mensagemErro(e)
  } finally {
    salvando.value = false
  }
}

async function alternarBloqueio(produto) {
  try {
    await api.post(`/produtos/${produto.id}/${produto.bloqueado ? 'desbloquear' : 'bloquear'}`)
    avisar(produto.bloqueado ? 'Produto desbloqueado.' : 'Produto bloqueado.')
    carregar()
  } catch (e) {
    avisar(mensagemErro(e), 'error')
  }
}
</script>

<template>
  <v-container class="py-8" style="max-width: 1200px">
    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold">Produtos</h1>
        <p class="text-medium-emphasis">Cada produto tem as operações na ordem em que são cronometradas.</p>
      </div>
      <v-btn v-if="sessao.podeGerenciar.value" color="primary" prepend-icon="mdi-plus" @click="abrir()">Novo produto</v-btn>
    </div>

    <v-card border flat>
      <div class="d-flex flex-wrap ga-4 pa-4">
        <v-text-field v-model="busca" placeholder="Buscar por código ou nome" prepend-inner-icon="mdi-magnify" hide-details
                      clearable style="max-width: 320px" />
        <v-select v-model="filtroEmpresa" :items="empresas" item-title="nome" item-value="id" label="Empresa" hide-details
                  clearable style="max-width: 320px" />
        <v-switch v-if="sessao.podeGerenciar.value" v-model="incluirBloqueados" label="Mostrar bloqueados" color="primary"
                  hide-details inset />
      </div>
      <v-data-table :headers="cabecalhos" :items="produtos" :loading="carregando" items-per-page="10"
                    no-data-text="Nenhum produto encontrado." loading-text="Carregando…">
        <template #item.nome="{ item }">
          <span :class="{ 'text-disabled': item.bloqueado }">{{ item.nome }}</span>
          <v-chip v-if="item.bloqueado" size="x-small" color="error" variant="tonal" class="ml-2">Bloqueado</v-chip>
        </template>
        <template #item.operacoes="{ item }">{{ item.operacoes.length }}</template>
        <template #item.acoes="{ item }">
          <v-btn icon="mdi-eye-outline" variant="text" size="small" title="Ver" @click="abrir(item)" />
          <v-btn v-if="!item.bloqueado" icon="mdi-timer-play-outline" variant="text" size="small" color="primary"
                 title="Nova cronoanálise deste produto" :to="{ name: 'nova-cronoanalise', query: { produto: item.id } }" />
          <v-btn v-if="sessao.podeGerenciar.value" :icon="item.bloqueado ? 'mdi-lock-open-variant-outline' : 'mdi-lock-outline'"
                 variant="text" size="small" :title="item.bloqueado ? 'Desbloquear' : 'Bloquear'" @click="alternarBloqueio(item)" />
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialogo" max-width="820" scrollable>
      <v-card>
        <v-card-title class="pa-5">{{ form.id ? (sessao.podeGerenciar.value ? 'Editar produto' : 'Produto') : 'Novo produto' }}</v-card-title>
        <v-card-text>
          <fieldset :disabled="!sessao.podeGerenciar.value" style="border: 0">
            <v-row>
              <v-col cols="12" sm="6">
                <v-select v-model="form.empresaId" :items="empresas" item-title="nome" item-value="id" label="Empresa" />
              </v-col>
              <v-col cols="12" sm="2"><v-text-field v-model="form.codigo" label="Código" /></v-col>
              <v-col cols="12" sm="4"><v-text-field v-model="form.nome" label="Nome" /></v-col>
            </v-row>

            <div class="d-flex align-center justify-space-between mt-2 mb-2">
              <div class="text-subtitle-2 font-weight-bold">Operações (em ordem)</div>
              <v-btn v-if="sessao.podeGerenciar.value" variant="text" color="primary" prepend-icon="mdi-plus"
                     @click="form.operacoes.push({ nome: '', descricao: '', quantidadeOperadores: 1 })">Adicionar operação</v-btn>
            </div>
            <div v-for="(o, i) in form.operacoes" :key="i" class="d-flex ga-3 align-start">
              <v-chip class="mt-3" size="small" variant="tonal" color="primary">{{ i + 1 }}</v-chip>
              <v-text-field v-model="o.nome" label="Operação" density="compact" />
              <v-text-field v-model="o.descricao" label="Descrição (opcional)" density="compact" />
              <v-text-field v-model="o.quantidadeOperadores" label="Operadores" type="number" min="1" density="compact"
                            style="max-width: 120px" />
              <template v-if="sessao.podeGerenciar.value">
                <v-btn icon="mdi-arrow-up" variant="text" size="small" class="mt-1" :disabled="i === 0" @click="mover(i, -1)" />
                <v-btn icon="mdi-arrow-down" variant="text" size="small" class="mt-1" :disabled="i === form.operacoes.length - 1"
                       @click="mover(i, 1)" />
                <v-btn icon="mdi-delete-outline" variant="text" size="small" class="mt-1" :disabled="form.operacoes.length === 1"
                       @click="form.operacoes.splice(i, 1)" />
              </template>
            </div>
          </fieldset>
          <v-alert v-if="erroForm" type="error" variant="tonal" density="compact" class="mt-4">{{ erroForm }}</v-alert>
        </v-card-text>
        <v-card-actions class="pa-5">
          <v-spacer />
          <v-btn variant="text" @click="dialogo = false">{{ sessao.podeGerenciar.value ? 'Cancelar' : 'Fechar' }}</v-btn>
          <v-btn v-if="sessao.podeGerenciar.value" color="primary" variant="flat" :loading="salvando" @click="salvar">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="aviso.mostrar" :color="aviso.cor" timeout="3500">{{ aviso.texto }}</v-snackbar>
  </v-container>
</template>
