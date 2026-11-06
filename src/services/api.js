import axios from 'axios'
import { sessao } from './sessao'
import router from '@/router'

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api`,
  timeout: 60000,
})

api.interceptors.request.use((config) => {
  if (sessao.token) config.headers.Authorization = `Bearer ${sessao.token}`
  return config
})

api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    const url = erro.config?.url ?? ''
    if (erro.response?.status === 401 && !url.includes('/auth/login')) {
      sessao.sair()
      router.push({ name: 'login', query: { expirou: '1' } })
    }
    return Promise.reject(erro)
  },
)

export function mensagemErro(erro, padrao = 'Não foi possível concluir a operação.') {
  if (erro?.code === 'ECONNABORTED' || !erro?.response) {
    return 'A API não respondeu. No plano gratuito ela pode levar até 1 minuto para acordar; tente de novo.'
  }
  return erro.response.data?.detail || padrao
}
