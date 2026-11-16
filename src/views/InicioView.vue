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
  <v-container class="py-6" style="max-width: 1100px">
    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold">Olá, {{ sessao.usuario?.nome?.split(' ')[0] }}</h1>
        <p class="text-medium-emphasis">Cronometre as operações de um produto e veja o tempo padrão e a capacidade de produção.</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" :to="{ name: 'nova-cronoanalise' }">Nova cronoanálise</v-btn>
    </div>

    <v-alert v-if="erro" type="warning" variant="tonal" class="mb-6">{{ erro }}</v-alert>

    <div class="faixa mb-4">
      <router-link v-for="c in cartoes" :key="c.chave" :to="{ name: c.rota }" class="faixa-item">
        <v-icon :icon="c.icone" size="small" :color="c.cor" />
        <span class="rotulo">{{ c.titulo }}</span>
        <v-progress-circular v-if="carregando" indeterminate size="14" width="2" />
        <span v-else class="leitura faixa-valor">{{ totais[c.chave] }}</span>
      </router-link>
    </div>

    <v-row dense>
      <v-col cols="12" md="7">
        <v-card class="painel">
          <v-card-title>Últimas cronoanálises</v-card-title>
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
        <v-card class="painel h-100">
          <v-card-title>Como funciona</v-card-title>
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

<style scoped>
.faixa {
  display: flex;
  flex-wrap: wrap;
  border: 1px solid var(--crono-linha);
  background: rgb(var(--v-theme-surface));
}
.faixa-item {
  flex: 1 1 180px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  color: inherit;
  text-decoration: none;
  border-right: 1px solid var(--crono-linha);
}
.faixa-item:last-child {
  border-right: 0;
}
.faixa-item:hover {
  background: var(--crono-etiqueta);
}
.faixa-valor {
  font-size: 1.5rem;
  margin-left: auto;
}
</style>
