<script setup>
import { onMounted, ref } from 'vue'
import { api, mensagemErro } from '@/services/api'
import { sessao } from '@/services/sessao'
import { dataHora } from '@/utils/formato'

const carregando = ref(true)
const erro = ref('')
const totais = ref({ cronoanalises: 0, empresas: 0, produtos: 0 })
const recentes = ref([])

onMounted(async () => {
  try {
    const [c, e, p] = await Promise.all([api.get('/cronoanalises'), api.get('/empresas'), api.get('/produtos')])
    totais.value = { cronoanalises: c.data.length, empresas: e.data.length, produtos: p.data.length }
    recentes.value = c.data.slice(0, 5)
  } catch (e) {
    erro.value = mensagemErro(e)
  } finally {
    carregando.value = false
  }
})

const cartoes = [
  { chave: 'cronoanalises', titulo: 'Cronoanálises', icone: 'mdi-timer-outline', cor: 'primary', rota: 'cronoanalises' },
  { chave: 'empresas', titulo: 'Empresas ativas', icone: 'mdi-factory', cor: 'secondary', rota: 'empresas' },
  { chave: 'produtos', titulo: 'Produtos ativos', icone: 'mdi-package-variant-closed', cor: 'warning', rota: 'produtos' },
]
</script>

<template>
  <v-container class="py-8" style="max-width: 1100px">
    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold">Olá, {{ sessao.usuario?.nome?.split(' ')[0] }}</h1>
        <p class="text-medium-emphasis">Cronometre as operações de um produto e veja o tempo padrão e a capacidade de produção.</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" :to="{ name: 'nova-cronoanalise' }">Nova cronoanálise</v-btn>
    </div>

    <v-alert v-if="erro" type="warning" variant="tonal" class="mb-6">{{ erro }}</v-alert>

    <v-row>
      <v-col v-for="c in cartoes" :key="c.chave" cols="12" sm="4">
        <v-card :to="{ name: c.rota }" class="pa-4" border flat>
          <div class="d-flex align-center ga-4">
            <v-avatar :color="c.cor" variant="tonal" size="48"><v-icon :icon="c.icone" /></v-avatar>
            <div>
              <div class="text-caption text-medium-emphasis text-uppercase">{{ c.titulo }}</div>
              <div class="text-h5 font-weight-bold">
                <v-progress-circular v-if="carregando" indeterminate size="20" width="2" />
                <span v-else>{{ totais[c.chave] }}</span>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12" md="7">
        <v-card border flat>
          <v-card-title class="text-subtitle-1 font-weight-bold">Últimas cronoanálises</v-card-title>
          <v-list v-if="recentes.length" lines="two">
            <v-list-item v-for="c in recentes" :key="c.id" :to="{ name: 'cronoanalise', params: { id: c.id } }"
                         :title="`${c.produtoCodigo} · ${c.produtoNome}`"
                         :subtitle="`${c.empresaNome} · ${c.cronoanalista} · ${dataHora(c.criadoEm)}`"
                         append-icon="mdi-chevron-right" />
          </v-list>
          <v-card-text v-else-if="!carregando" class="text-medium-emphasis">Nenhuma cronoanálise registrada ainda.</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="5">
        <v-card border flat class="h-100">
          <v-card-title class="text-subtitle-1 font-weight-bold">Como funciona</v-card-title>
          <v-card-text>
            <ol class="pl-4 text-body-2" style="line-height: 1.8">
              <li>A empresa define o <strong>turno</strong>, as <strong>paradas</strong>, o <strong>fator de velocidade</strong> e o <strong>nível de confiança</strong>.</li>
              <li>O produto tem as <strong>operações</strong> em ordem.</li>
              <li>Você cronometra cada operação por alguns <strong>ciclos</strong>.</li>
              <li>O sistema calcula o <strong>tempo padrão</strong>, as <strong>peças por hora e por turno</strong> e se a amostra foi <strong>suficiente</strong>.</li>
            </ol>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
