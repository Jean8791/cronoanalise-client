<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api, mensagemErro } from '@/services/api'
import { cnpj, dataHora, decimal, minutosParaHora, percentual } from '@/utils/formato'

const route = useRoute()
const router = useRouter()
const dados = ref(null)
const erro = ref('')
const confirmarExclusao = ref(false)
const excluindo = ref(false)

onMounted(async () => {
  try {
    dados.value = (await api.get(`/cronoanalises/${route.params.id}`)).data
  } catch (e) {
    erro.value = mensagemErro(e, 'Cronoanálise não encontrada.')
  }
})

const r = computed(() => dados.value?.resultado)
const faltam = computed(() => (r.value ? Math.max(r.value.ciclosNecessariosArredondado - r.value.observacoesRealizadas, 0) : 0))

const destaques = computed(() => r.value && [
  { titulo: 'Tempo padrão', valor: `${decimal(r.value.tempoPadrao)} s`, icone: 'mdi-timer-check-outline', cor: 'primary',
    nota: 'por peça, já com fator de velocidade e tolerância' },
  { titulo: 'Peças por hora', valor: decimal(r.value.pecasPorHora), icone: 'mdi-speedometer', cor: 'secondary', nota: '3600 / tempo padrão' },
  { titulo: 'Peças por turno', valor: decimal(r.value.pecasPorTurno), icone: 'mdi-factory', cor: 'warning',
    nota: `turno de ${minutosParaHora(r.value.turnoMinutos)}` },
])

async function excluir() {
  excluindo.value = true
  try {
    await api.delete(`/cronoanalises/${route.params.id}`)
    router.replace({ name: 'cronoanalises' })
  } catch (e) {
    erro.value = mensagemErro(e)
    confirmarExclusao.value = false
  } finally {
    excluindo.value = false
  }
}
</script>

<template>
  <v-container class="py-8" style="max-width: 1200px">
    <v-alert v-if="erro" type="error" variant="tonal" class="mb-6">{{ erro }}</v-alert>
    <v-progress-linear v-if="!dados && !erro" indeterminate color="primary" />

    <template v-if="dados">
      <div class="d-flex flex-wrap align-start justify-space-between ga-4 mb-6">
        <div class="d-flex align-start ga-2">
          <v-btn icon="mdi-arrow-left" variant="text" :to="{ name: 'cronoanalises' }" />
          <div>
            <div class="text-caption text-medium-emphasis">Cronoanálise · {{ dataHora(dados.criadoEm) }}</div>
            <h1 class="text-h5 font-weight-bold">{{ dados.produtoCodigo }} · {{ dados.produtoNome }}</h1>
            <div class="text-medium-emphasis">
              {{ dados.empresaNome }} ({{ cnpj(dados.empresaCnpj) }}) · cronoanalista {{ dados.cronoanalista }} ·
              registrada por {{ dados.criadoPor }}
            </div>
          </div>
        </div>
        <div v-if="dados.podeEditar" class="d-flex ga-2">
          <v-btn variant="tonal" prepend-icon="mdi-pencil-outline" :to="{ name: 'editar-cronoanalise', params: { id: dados.id } }">Corrigir tempos</v-btn>
          <v-btn variant="text" color="error" prepend-icon="mdi-delete-outline" @click="confirmarExclusao = true">Excluir</v-btn>
        </div>
      </div>

      <v-row>
        <v-col v-for="d in destaques" :key="d.titulo" cols="12" sm="4">
          <v-card border flat class="pa-4 h-100">
            <div class="d-flex align-center ga-3">
              <v-avatar :color="d.cor" variant="tonal"><v-icon :icon="d.icone" /></v-avatar>
              <div>
                <div class="text-caption text-uppercase text-medium-emphasis">{{ d.titulo }}</div>
                <div class="text-h5 font-weight-bold">{{ d.valor }}</div>
                <div class="text-caption text-medium-emphasis">{{ d.nota }}</div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-alert class="mt-4" :type="r.amostraSuficiente ? 'success' : 'warning'" variant="tonal">
        <template v-if="r.amostraSuficiente">
          <strong>Amostra suficiente.</strong> Foram cronometrados {{ r.observacoesRealizadas }} ciclos e o método pede
          {{ r.ciclosNecessariosArredondado }} para {{ percentual(r.nivelConfianca, 0) }} de confiança e erro de
          {{ percentual(r.erroRelativo, 0) }}.
        </template>
        <template v-else>
          <strong>Amostra insuficiente.</strong> O método pede {{ r.ciclosNecessariosArredondado }} ciclos; foram
          cronometrados {{ r.observacoesRealizadas }}. Cronometre mais {{ faltam }} ciclo(s) para confiar no resultado.
        </template>
      </v-alert>

      <v-row class="mt-2">
        <v-col cols="12" lg="7">
          <v-card border flat>
            <v-card-title class="text-subtitle-1 font-weight-bold">Tempos por operação</v-card-title>
            <v-table density="comfortable" class="tabela-numerica">
              <thead>
                <tr>
                  <th>Operação</th>
                  <th class="num">Média (s)</th>
                  <th class="num">Mín.</th>
                  <th class="num">Máx.</th>
                  <th class="num">Peças/h</th>
                  <th style="min-width: 140px">Peso no ciclo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(o, i) in r.operacoes" :key="i">
                  <td>{{ i + 1 }}. {{ o.nome }}</td>
                  <td class="num font-weight-medium">{{ decimal(o.tempoMedio) }}</td>
                  <td class="num">{{ decimal(o.tempoMinimo) }}</td>
                  <td class="num">{{ decimal(o.tempoMaximo) }}</td>
                  <td class="num">{{ decimal(o.pecasPorHora) }}</td>
                  <td>
                    <div class="d-flex align-center ga-2">
                      <v-progress-linear :model-value="Number(o.participacaoNoCiclo)" color="primary" height="8" rounded />
                      <span class="text-caption">{{ decimal(o.participacaoNoCiclo, 1) }}%</span>
                    </div>
                  </td>
                </tr>
                <tr class="bg-grey-lighten-4">
                  <td class="font-weight-bold">Ciclo completo (x̄)</td>
                  <td class="num font-weight-bold">{{ decimal(r.tempoMedioCiclo) }}</td>
                  <td colspan="4" class="text-caption text-medium-emphasis">soma das médias das operações</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-col>

        <v-col cols="12" lg="5">
          <v-card border flat class="mb-4">
            <v-card-title class="text-subtitle-1 font-weight-bold">Ciclos necessários</v-card-title>
            <v-card-text>
              <div class="formula mb-2">N = ( z · R / (Er · d2 · x̄) )²</div>
              <v-table density="compact" class="tabela-numerica">
                <tbody>
                  <tr><td>z ({{ percentual(r.nivelConfianca, 0) }} de confiança)</td><td class="num">{{ decimal(r.z) }}</td></tr>
                  <tr><td>R (maior − menor tempo de ciclo)</td><td class="num">{{ decimal(r.amplitude) }} s</td></tr>
                  <tr><td>Er (erro relativo)</td><td class="num">{{ percentual(r.erroRelativo, 1) }}</td></tr>
                  <tr><td>d2 (para {{ r.observacoesRealizadas }} ciclos)</td><td class="num">{{ decimal(r.d2, 3) }}</td></tr>
                  <tr><td>x̄ (tempo médio do ciclo)</td><td class="num">{{ decimal(r.tempoMedioCiclo) }} s</td></tr>
                  <tr class="font-weight-bold">
                    <td>N</td><td class="num">{{ decimal(r.ciclosNecessarios) }} → {{ r.ciclosNecessariosArredondado }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>

          <v-card border flat>
            <v-card-title class="text-subtitle-1 font-weight-bold">Tempo padrão</v-card-title>
            <v-card-text>
              <v-table density="compact" class="tabela-numerica">
                <tbody>
                  <tr>
                    <td>TN = x̄ · FV<div class="formula">{{ decimal(r.tempoMedioCiclo) }} · {{ decimal(r.fatorVelocidade) }}</div></td>
                    <td class="num">{{ decimal(r.tempoNormal) }} s</td>
                  </tr>
                  <tr>
                    <td>FT = turno / (turno − paradas)<div class="formula">{{ r.turnoMinutos }} / ({{ r.turnoMinutos }} − {{ r.totalParadasMinutos }})</div></td>
                    <td class="num">{{ decimal(r.fatorTolerancia, 4) }}</td>
                  </tr>
                  <tr class="font-weight-bold">
                    <td>TP = TN · FT<div class="formula">{{ decimal(r.tempoNormal) }} · {{ decimal(r.fatorTolerancia, 4) }}</div></td>
                    <td class="num">{{ decimal(r.tempoPadrao) }} s</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="4">
          <v-card border flat class="h-100">
            <v-card-title class="text-subtitle-1 font-weight-bold">Paradas no turno</v-card-title>
            <v-list v-if="r.paradas.length" density="compact">
              <v-list-item v-for="(p, i) in r.paradas" :key="i" :title="p.descricao">
                <template #append><span class="text-medium-emphasis">{{ p.minutos }} min</span></template>
              </v-list-item>
              <v-divider />
              <v-list-item title="Total" class="font-weight-bold">
                <template #append>{{ r.totalParadasMinutos }} min</template>
              </v-list-item>
            </v-list>
            <v-card-text v-else class="text-medium-emphasis">Sem paradas cadastradas.</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="8">
          <v-card border flat>
            <v-card-title class="text-subtitle-1 font-weight-bold">Tempos observados (s)</v-card-title>
            <div style="overflow-x: auto">
              <v-table density="compact" class="tabela-numerica">
                <thead>
                  <tr>
                    <th>Operação</th>
                    <th v-for="c in r.observacoesRealizadas" :key="c" class="num">{{ c }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(o, i) in dados.operacoes" :key="i">
                    <td>{{ o.nome }}</td>
                    <td v-for="(t, c) in o.temposSegundos" :key="c" class="num">{{ decimal(t) }}</td>
                  </tr>
                  <tr class="bg-grey-lighten-4 font-weight-medium">
                    <td>Ciclo</td>
                    <td v-for="(t, c) in r.temposCiclo" :key="c" class="num">{{ decimal(t) }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <v-dialog v-model="confirmarExclusao" max-width="420">
      <v-card>
        <v-card-title class="pa-5">Excluir cronoanálise?</v-card-title>
        <v-card-text>Os tempos e o resultado serão apagados. Esta ação não pode ser desfeita.</v-card-text>
        <v-card-actions class="pa-5">
          <v-spacer />
          <v-btn variant="text" @click="confirmarExclusao = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" :loading="excluindo" @click="excluir">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
