<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { api, mensagemErro } from '@/services/api'
import { dataHora } from '@/utils/formato'

const router = useRouter()
const itens = ref([])
const carregando = ref(true)
const erro = ref('')
const busca = ref('')

const cabecalhos = [
  { title: 'Data', key: 'criadoEm' },
  { title: 'Produto', key: 'produtoNome' },
  { title: 'Empresa', key: 'empresaNome' },
  { title: 'Cronoanalista', key: 'cronoanalista' },
  { title: 'Operações', key: 'operacoes', align: 'end' },
  { title: 'Ciclos', key: 'observacoes', align: 'end' },
  { title: 'Registrada por', key: 'criadoPor' },
]

async function carregar() {
  carregando.value = true
  erro.value = ''
  try {
    itens.value = (await api.get('/cronoanalises', { params: { busca: busca.value || undefined } })).data
  } catch (e) {
    erro.value = mensagemErro(e)
  } finally {
    carregando.value = false
  }
}

let atraso
watch(busca, () => {
  clearTimeout(atraso)
  atraso = setTimeout(carregar, 300)
})
onMounted(carregar)

function abrir(_, { item }) {
  router.push({ name: 'cronoanalise', params: { id: item.id } })
}
</script>

<template>
  <v-container class="py-8" style="max-width: 1200px">
    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold">Cronoanálises</h1>
        <p class="text-medium-emphasis">Clique em uma cronoanálise para ver o cálculo completo.</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" :to="{ name: 'nova-cronoanalise' }">Nova cronoanálise</v-btn>
    </div>

    <v-alert v-if="erro" type="warning" variant="tonal" class="mb-4">{{ erro }}</v-alert>

    <v-card border flat>
      <div class="pa-4">
        <v-text-field v-model="busca" placeholder="Buscar por produto, empresa ou cronoanalista" prepend-inner-icon="mdi-magnify"
                      hide-details clearable style="max-width: 420px" />
      </div>
      <v-data-table :headers="cabecalhos" :items="itens" :loading="carregando" items-per-page="10" hover
                    no-data-text="Nenhuma cronoanálise registrada." loading-text="Carregando…" @click:row="abrir">
        <template #item.criadoEm="{ item }">{{ dataHora(item.criadoEm) }}</template>
        <template #item.produtoNome="{ item }">
          <span class="text-medium-emphasis">{{ item.produtoCodigo }}</span> · {{ item.produtoNome }}
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
