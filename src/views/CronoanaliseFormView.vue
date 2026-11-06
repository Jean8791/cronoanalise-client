<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api, mensagemErro } from '@/services/api'
import { sessao } from '@/services/sessao'
import { decimal, lerDecimal, minutosParaHora, percentual } from '@/utils/formato'

const route = useRoute()
const router = useRouter()
const editando = computed(() => !!route.params.id)

const carregando = ref(true)
const salvando = ref(false)
const erro = ref('')

const produtos = ref([])
const produtoId = ref(null)
const produto = ref(null)
const empresa = ref(null)
const cronoanalista = ref(sessao.usuario?.nome ?? '')
const erroRelativo = ref(5)
const ciclos = ref(10)
const operacoes = ref([])

const MIN_CICLOS = 2
const MAX_CICLOS = 30

function montarGrade(ops, tempos = null) {
  operacoes.value = ops.map((o, i) => ({
    nome: o.nome,
    tempos: tempos ? tempos[i].map((t) => decimal(t, 2)) : Array.from({ length: ciclos.value }, () => ''),
  }))
}

watch(ciclos, (n) => {
  const total = Math.min(Math.max(Number(n) || MIN_CICLOS, MIN_CICLOS), MAX_CICLOS)
  operacoes.value.forEach((o) => {
    while (o.tempos.length < total) o.tempos.push('')
    o.tempos.length = total
  })
})

watch(produtoId, async (id) => {
  if (!id || editando.value) return
  erro.value = ''
  try {
    produto.value = (await api.get(`/produtos/${id}`)).data
    empresa.value = (await api.get(`/empresas/${produto.value.empresa.id}`)).data
    montarGrade(produto.value.operacoes)
  } catch (e) {
    erro.value = mensagemErro(e)
  }
})

onMounted(async () => {
  try {
    if (editando.value) {
      const { data } = await api.get(`/cronoanalises/${route.params.id}`)
      if (!data.podeEditar) {
        router.replace({ name: 'cronoanalise', params: { id: data.id } })
        return
      }
      produto.value = { codigo: data.produtoCodigo, nome: data.produtoNome, empresa: { nome: data.empresaNome } }
      empresa.value = {
        nome: data.empresaNome, turnoMinutos: data.resultado.turnoMinutos, paradas: data.resultado.paradas,
        totalParadasMinutos: data.resultado.totalParadasMinutos, fatorVelocidade: data.resultado.fatorVelocidade,
        nivelConfianca: data.resultado.nivelConfianca,
      }
      cronoanalista.value = data.cronoanalista
      erroRelativo.value = Number(data.resultado.erroRelativo) * 100
      ciclos.value = data.resultado.observacoesRealizadas
      montarGrade(data.operacoes, data.operacoes.map((o) => o.temposSegundos))
    } else {
      produtos.value = (await api.get('/produtos')).data
      if (route.query.produto) produtoId.value = route.query.produto
    }
  } catch (e) {
    erro.value = mensagemErro(e)
  } finally {
    carregando.value = false
  }
})

const valores = computed(() => operacoes.value.map((o) => o.tempos.map(lerDecimal)))
const celulaInvalida = (i, c) => {
  const texto = operacoes.value[i].tempos[c]
  return texto !== '' && !(valores.value[i][c] > 0)
}
const mediaOperacao = (i) => {
  const v = valores.value[i].filter((x) => x > 0)
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null
}
const tempoCiclo = (c) => {
  const v = valores.value.map((linha) => linha[c])
  return v.every((x) => x > 0) ? v.reduce((a, b) => a + b, 0) : null
}
const preenchidas = computed(() => valores.value.flat().filter((x) => x > 0).length)
const totalCelulas = computed(() => operacoes.value.length * Number(ciclos.value || 0))
const completo = computed(() => totalCelulas.value > 0 && preenchidas.value === totalCelulas.value)

function preencherExemplo() {
  operacoes.value.forEach((o, i) => {
    const base = 8 + i * 6 + Math.random() * 6
    o.tempos = o.tempos.map(() => decimal(base * (0.93 + Math.random() * 0.14), 2))
  })
}

async function salvar() {
  erro.value = ''
  if (!completo.value) {
    erro.value = 'Preencha todos os tempos com valores maiores que zero.'
    return
  }
  const corpo = {
    cronoanalista: cronoanalista.value,
    erroRelativo: Number(erroRelativo.value) / 100,
    temposPorOperacao: valores.value,
  }
  salvando.value = true
  try {
    const { data } = editando.value
      ? await api.put(`/cronoanalises/${route.params.id}`, corpo)
      : await api.post('/cronoanalises', { ...corpo, produtoId: produtoId.value })
    router.push({ name: 'cronoanalise', params: { id: data.id } })
  } catch (e) {
    erro.value = mensagemErro(e)
  } finally {
    salvando.value = false
  }
}
</script>

<template>
  <v-container class="py-8" style="max-width: 1300px">
    <div class="d-flex align-center ga-2 mb-6">
      <v-btn icon="mdi-arrow-left" variant="text" @click="router.back()" />
      <div>
        <h1 class="text-h5 font-weight-bold">{{ editando ? 'Corrigir cronoanálise' : 'Nova cronoanálise' }}</h1>
        <p class="text-medium-emphasis">Os tempos são em segundos. Cada coluna é um ciclo cronometrado.</p>
      </div>
    </div>

    <v-progress-linear v-if="carregando" indeterminate color="primary" />

    <template v-else>
      <v-row>
        <v-col cols="12" md="7">
          <v-card border flat class="pa-5 h-100">
            <div class="text-subtitle-2 font-weight-bold mb-4">1. Produto e parâmetros</div>
            <v-autocomplete v-if="!editando" v-model="produtoId" :items="produtos" item-value="id"
                            :item-title="(p) => `${p.codigo} · ${p.nome} (${p.empresa.nome})`" label="Produto"
                            no-data-text="Nenhum produto ativo." />
            <v-text-field v-else :model-value="`${produto.codigo} · ${produto.nome}`" label="Produto" readonly />
            <v-row>
              <v-col cols="12" sm="6"><v-text-field v-model="cronoanalista" label="Cronoanalista" /></v-col>
              <v-col cols="6" sm="3">
                <v-text-field v-model="erroRelativo" label="Erro relativo (%)" type="number" min="0.1" max="50" step="0.5" />
              </v-col>
              <v-col cols="6" sm="3">
                <v-text-field v-model.number="ciclos" label="Ciclos" type="number" :min="MIN_CICLOS" :max="MAX_CICLOS"
                              :disabled="editando || !operacoes.length" />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="12" md="5">
          <v-card border flat class="pa-5 h-100" color="grey-lighten-5">
            <div class="text-subtitle-2 font-weight-bold mb-3">Parâmetros da empresa</div>
            <template v-if="empresa">
              <div class="text-body-1 font-weight-medium mb-2">{{ empresa.nome }}</div>
              <div class="d-flex flex-wrap ga-2 mb-3">
                <v-chip size="small" prepend-icon="mdi-clock-outline">Turno {{ minutosParaHora(empresa.turnoMinutos) }}</v-chip>
                <v-chip size="small" prepend-icon="mdi-coffee-outline">Paradas {{ empresa.totalParadasMinutos }} min</v-chip>
                <v-chip size="small" prepend-icon="mdi-speedometer">FV {{ decimal(empresa.fatorVelocidade, 2) }}</v-chip>
                <v-chip size="small" prepend-icon="mdi-chart-bell-curve">Confiança {{ percentual(empresa.nivelConfianca, 1) }}</v-chip>
              </div>
              <p class="text-caption text-medium-emphasis">
                Esses valores ficam gravados na cronoanálise: mudar o cadastro da empresa depois não altera este resultado.
              </p>
            </template>
            <p v-else class="text-body-2 text-medium-emphasis">Escolha um produto para ver o turno, as paradas e os fatores.</p>
          </v-card>
        </v-col>
      </v-row>

      <v-card v-if="operacoes.length" border flat class="mt-6">
        <div class="d-flex flex-wrap align-center justify-space-between ga-3 pa-5 pb-2">
          <div>
            <div class="text-subtitle-2 font-weight-bold">2. Tempos observados (segundos)</div>
            <div class="text-caption text-medium-emphasis">{{ preenchidas }} de {{ totalCelulas }} preenchidos</div>
          </div>
          <v-btn v-if="!editando" variant="text" size="small" prepend-icon="mdi-dice-multiple-outline" @click="preencherExemplo">
            Preencher com valores de exemplo
          </v-btn>
        </div>
        <div style="overflow-x: auto">
          <v-table density="compact" class="tabela-numerica grade-tempos">
            <thead>
              <tr>
                <th style="min-width: 180px">Operação</th>
                <th v-for="c in Number(ciclos)" :key="c" class="num" style="min-width: 86px">{{ c }}</th>
                <th class="num" style="min-width: 90px">Média</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(o, i) in operacoes" :key="i">
                <td class="font-weight-medium">{{ i + 1 }}. {{ o.nome }}</td>
                <td v-for="(_, c) in o.tempos" :key="c" class="px-1">
                  <v-text-field v-model="o.tempos[c]" density="compact" variant="outlined" hide-details inputmode="decimal"
                                :error="celulaInvalida(i, c)" :aria-label="`${o.nome}, ciclo ${c + 1}`" />
                </td>
                <td class="num font-weight-bold">{{ mediaOperacao(i) === null ? '—' : decimal(mediaOperacao(i)) }}</td>
              </tr>
              <tr class="bg-grey-lighten-4">
                <td class="text-medium-emphasis">Tempo do ciclo</td>
                <td v-for="c in Number(ciclos)" :key="c" class="num text-medium-emphasis">
                  {{ tempoCiclo(c - 1) === null ? '—' : decimal(tempoCiclo(c - 1)) }}
                </td>
                <td />
              </tr>
            </tbody>
          </v-table>
        </div>
      </v-card>

      <v-alert v-if="erro" type="error" variant="tonal" class="mt-6">{{ erro }}</v-alert>

      <div class="d-flex justify-end ga-3 mt-6">
        <v-btn variant="text" @click="router.back()">Cancelar</v-btn>
        <v-btn color="primary" size="large" prepend-icon="mdi-calculator-variant-outline" :loading="salvando"
               :disabled="!operacoes.length" @click="salvar">
          {{ editando ? 'Salvar e recalcular' : 'Calcular e salvar' }}
        </v-btn>
      </div>
    </template>
  </v-container>
</template>
