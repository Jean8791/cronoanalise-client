import { computed, reactive } from 'vue'

const CHAVE = 'cronoanalise.sessao'

function carregar() {
  try {
    const salva = JSON.parse(localStorage.getItem(CHAVE) || 'null')
    if (salva && new Date(salva.expiraEm) > new Date()) return salva
  } catch {
    /* sessão corrompida é descartada */
  }
  return null
}

const estado = reactive({ dados: carregar() })

export const sessao = {
  get token() {
    return estado.dados?.token ?? null
  },
  get usuario() {
    return estado.dados?.usuario ?? null
  },
  logado: computed(() => !!estado.dados),
  perfil: computed(() => estado.dados?.usuario?.perfil ?? null),
  podeGerenciar: computed(() => ['ADMIN', 'PROFESSOR'].includes(estado.dados?.usuario?.perfil)),
  ehAdmin: computed(() => estado.dados?.usuario?.perfil === 'ADMIN'),
  entrar(resposta) {
    estado.dados = { token: resposta.token, expiraEm: resposta.expiraEm, usuario: resposta.usuario }
    localStorage.setItem(CHAVE, JSON.stringify(estado.dados))
  },
  sair() {
    estado.dados = null
    localStorage.removeItem(CHAVE)
  },
}
