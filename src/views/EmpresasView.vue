<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { api, mensagemErro } from '@/services/api'
import { sessao } from '@/services/sessao'
import { cnpj as formatarCnpj, decimal, lerDecimal, minutosParaHora, percentual } from '@/utils/formato'

const empresas = ref([])
const carregando = ref(true)
const busca = ref('')
const incluirBloqueadas = ref(false)
const aviso = ref({ mostrar: false, texto: '', cor: 'success' })

const dialogo = ref(false)
const salvando = ref(false)
const erroForm = ref('')
const form = ref(vazio())

function vazio() {
  return { id: null, cnpj: '', nome: '', turnoMinutos: 480, fatorVelocidade: '1,00', nivelConfianca: 95, paradas: [] }
}

const cabecalhos = [
  { title: 'Empresa', key: 'nome' },
  { title: 'CNPJ', key: 'cnpj' },
  { title: 'Turno', key: 'turnoMinutos', align: 'end' },
  { title: 'Paradas', key: 'totalParadasMinutos', align: 'end' },
  { title: 'Fator de velocidade', key: 'fatorVelocidade', align: 'end' },
  { title: 'Confiança', key: 'nivelConfianca', align: 'end' },
  { title: '', key: 'acoes', sortable: false, align: 'end' },
]

async function carregar() {
  carregando.value = true
  try {
    const { data } = await api.get('/empresas', { params: { busca: busca.value || undefined, incluirBloqueadas: incluirBloqueadas.value } })
    empresas.value = data
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
watch(incluirBloqueadas, carregar)
onMounted(carregar)

function avisar(texto, cor = 'success') {
  aviso.value = { mostrar: true, texto, cor }
}

function abrir(empresa) {
  erroForm.value = ''
  form.value = empresa
    ? {
        id: empresa.id,
        cnpj: formatarCnpj(empresa.cnpj),
        nome: empresa.nome,
        turnoMinutos: empresa.turnoMinutos,
        fatorVelocidade: decimal(empresa.fatorVelocidade, 2),
        nivelConfianca: Math.round(Number(empresa.nivelConfianca) * 1000) / 10,
        paradas: empresa.paradas.map((p) => ({ ...p })),
      }
    : vazio()
  dialogo.value = true
}

const totalParadas = computed(() => form.value.paradas.reduce((s, p) => s + (Number(p.minutos) || 0), 0))

async function salvar() {
  erroForm.value = ''
  const corpo = {
    cnpj: form.value.cnpj,
    nome: form.value.nome,
    turnoMinutos: Number(form.value.turnoMinutos),
    fatorVelocidade: lerDecimal(form.value.fatorVelocidade),
    nivelConfianca: Number(form.value.nivelConfianca) / 100,
    paradas: form.value.paradas.map((p) => ({ descricao: p.descricao, minutos: Number(p.minutos) })),
  }
  salvando.value = true
  try {
    if (form.value.id) await api.put(`/empresas/${form.value.id}`, corpo)
    else await api.post('/empresas', corpo)
    dialogo.value = false
    avisar('Empresa salva.')
    carregar()
  } catch (e) {
    erroForm.value = mensagemErro(e)
  } finally {
    salvando.value = false
  }
}

async function alternarBloqueio(empresa) {
  try {
    await api.post(`/empresas/${empresa.id}/${empresa.bloqueada ? 'desbloquear' : 'bloquear'}`)
    avisar(empresa.bloqueada ? 'Empresa desbloqueada.' : 'Empresa bloqueada.')
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
        <h1 class="text-h5 font-weight-bold">Empresas</h1>
        <p class="text-medium-emphasis">Turno, paradas e parâmetros usados no cálculo das cronoanálises.</p>
      </div>
      <v-btn v-if="sessao.podeGerenciar.value" color="primary" prepend-icon="mdi-plus" @click="abrir()">Nova empresa</v-btn>
    </div>

    <v-card border flat>
      <div class="d-flex flex-wrap ga-4 pa-4">
        <v-text-field v-model="busca" placeholder="Buscar por nome ou CNPJ" prepend-inner-icon="mdi-magnify" hide-details
                      clearable style="max-width: 360px" />
        <v-switch v-if="sessao.podeGerenciar.value" v-model="incluirBloqueadas" label="Mostrar bloqueadas" color="primary"
                  hide-details inset />
      </div>
      <v-data-table :headers="cabecalhos" :items="empresas" :loading="carregando" items-per-page="10"
                    no-data-text="Nenhuma empresa encontrada." loading-text="Carregando…">
        <template #item.nome="{ item }">
          <span :class="{ 'text-disabled': item.bloqueada }">{{ item.nome }}</span>
          <v-chip v-if="item.bloqueada" size="x-small" color="error" variant="tonal" class="ml-2">Bloqueada</v-chip>
        </template>
        <template #item.cnpj="{ item }">{{ formatarCnpj(item.cnpj) }}</template>
        <template #item.turnoMinutos="{ item }">{{ minutosParaHora(item.turnoMinutos) }}</template>
        <template #item.totalParadasMinutos="{ item }">{{ item.totalParadasMinutos }} min</template>
        <template #item.fatorVelocidade="{ item }">{{ decimal(item.fatorVelocidade, 2) }}</template>
        <template #item.nivelConfianca="{ item }">{{ percentual(item.nivelConfianca, 1) }}</template>
        <template #item.acoes="{ item }">
          <v-btn icon="mdi-eye-outline" variant="text" size="small" title="Ver" @click="abrir(item)" />
          <v-btn v-if="sessao.podeGerenciar.value" :icon="item.bloqueada ? 'mdi-lock-open-variant-outline' : 'mdi-lock-outline'"
                 variant="text" size="small" :title="item.bloqueada ? 'Desbloquear' : 'Bloquear'" @click="alternarBloqueio(item)" />
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialogo" max-width="760" scrollable>
      <v-card>
        <v-card-title class="pa-5">{{ form.id ? (sessao.podeGerenciar.value ? 'Editar empresa' : 'Empresa') : 'Nova empresa' }}</v-card-title>
        <v-card-text>
          <fieldset :disabled="!sessao.podeGerenciar.value" style="border: 0">
            <v-row>
              <v-col cols="12" sm="8"><v-text-field v-model="form.nome" label="Nome" /></v-col>
              <v-col cols="12" sm="4"><v-text-field v-model="form.cnpj" label="CNPJ" placeholder="00.000.000/0000-00" /></v-col>
              <v-col cols="12" sm="4">
                <v-text-field v-model="form.turnoMinutos" label="Turno (minutos)" type="number" min="1"
                              :hint="`= ${minutosParaHora(Number(form.turnoMinutos) || 0)}`" persistent-hint />
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field v-model="form.fatorVelocidade" label="Fator de velocidade"
                              hint="Ritmo do operador observado; 1,00 = normal" persistent-hint />
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field v-model="form.nivelConfianca" label="Nível de confiança (%)" type="number" min="50" max="99.9"
                              hint="Define o z: 95% → 1,96" persistent-hint />
              </v-col>
            </v-row>

            <div class="d-flex align-center justify-space-between mt-6 mb-2">
              <div>
                <div class="text-subtitle-2 font-weight-bold">Paradas previstas no turno</div>
                <div class="text-caption text-medium-emphasis">Entram no fator de tolerância. Total: {{ totalParadas }} min.</div>
              </div>
              <v-btn v-if="sessao.podeGerenciar.value" variant="text" color="primary" prepend-icon="mdi-plus"
                     @click="form.paradas.push({ descricao: '', minutos: 10 })">Adicionar parada</v-btn>
            </div>
            <div v-for="(p, i) in form.paradas" :key="i" class="d-flex ga-3 align-center">
              <v-text-field v-model="p.descricao" label="Descrição" density="compact" />
              <v-text-field v-model="p.minutos" label="Minutos" type="number" min="1" density="compact" style="max-width: 130px" />
              <v-btn v-if="sessao.podeGerenciar.value" icon="mdi-delete-outline" variant="text" class="mb-5"
                     @click="form.paradas.splice(i, 1)" />
            </div>
            <p v-if="!form.paradas.length" class="text-body-2 text-medium-emphasis">Nenhuma parada cadastrada.</p>
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
