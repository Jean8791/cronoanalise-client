import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { pt } from 'vuetify/locale'

export default createVuetify({
  locale: { locale: 'pt', messages: { pt } },
  theme: {
    defaultTheme: 'crono',
    themes: {
      crono: {
        dark: false,
        colors: {
          primary: '#3949ab',
          secondary: '#00897b',
          background: '#f5f6fa',
          surface: '#ffffff',
          error: '#c62828',
          warning: '#ef6c00',
          success: '#2e7d32',
        },
      },
    },
  },
  defaults: {
    VTextField: { variant: 'outlined', density: 'comfortable', color: 'primary' },
    VSelect: { variant: 'outlined', density: 'comfortable', color: 'primary' },
    VAutocomplete: { variant: 'outlined', density: 'comfortable', color: 'primary' },
    VCard: { rounded: 'lg' },
    VBtn: { rounded: 'lg' },
  },
})
