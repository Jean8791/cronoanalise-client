import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { pt } from 'vuetify/locale'

const CHAVE_TEMA = 'crono-tema'
const TEMAS = ['crono', 'crono-claro']

export function temaSalvo() {
  try {
    const nome = localStorage.getItem(CHAVE_TEMA)
    return TEMAS.includes(nome) ? nome : 'crono'
  } catch {
    return 'crono'
  }
}

export function salvarTema(nome) {
  try {
    localStorage.setItem(CHAVE_TEMA, nome)
  } catch {
    // armazenamento bloqueado: o tema vale só nesta sessão
  }
}

export default createVuetify({
  locale: { locale: 'pt', messages: { pt } },
  theme: {
    defaultTheme: temaSalvo(),
    themes: {
      crono: {
        dark: true,
        colors: {
          primary: '#ff8a00',
          secondary: '#8a929c',
          background: '#14161a',
          surface: '#1d2025',
          'surface-variant': '#262a30',
          error: '#ff5c5c',
          warning: '#ffc233',
          success: '#4ee08a',
          info: '#5ab0ff',
        },
        variables: { 'border-color': '#2c3036', 'border-opacity': 1 },
      },
      'crono-claro': {
        dark: false,
        colors: {
          primary: '#c25e00',
          secondary: '#5b636d',
          background: '#eceef0',
          surface: '#ffffff',
          'surface-variant': '#e2e5e8',
          error: '#c62828',
          warning: '#b36b00',
          success: '#1b8a4a',
          info: '#1565c0',
        },
        variables: { 'border-color': '#cfd4d9', 'border-opacity': 1 },
      },
    },
  },
  defaults: {
    VTextField: { variant: 'outlined', density: 'compact', color: 'primary', rounded: 'sm' },
    VSelect: { variant: 'outlined', density: 'compact', color: 'primary', rounded: 'sm' },
    VAutocomplete: { variant: 'outlined', density: 'compact', color: 'primary', rounded: 'sm' },
    VCard: { rounded: 'sm', elevation: 0 },
    VBtn: { rounded: 'sm', elevation: 0 },
    VAlert: { rounded: 'sm' },
    VDialog: { scrim: '#000' },
  },
})
