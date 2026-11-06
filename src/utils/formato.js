const numero = (casas) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })

export function decimal(valor, casas = 2) {
  if (valor === null || valor === undefined || valor === '') return '—'
  return numero(casas).format(Number(valor))
}

export function percentual(fracao, casas = 0) {
  if (fracao === null || fracao === undefined) return '—'
  return `${decimal(Number(fracao) * 100, casas)}%`
}

export function minutosParaHora(minutos) {
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  return `${h}h${m ? String(m).padStart(2, '0') : ''}`
}

export function cnpj(valor) {
  const d = String(valor || '').replace(/\D/g, '')
  if (d.length !== 14) return valor
  return d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

export function dataHora(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

export function lerDecimal(texto) {
  if (texto === null || texto === undefined) return NaN
  const t = String(texto).trim()
  return Number(t.includes(',') ? t.replace(/\./g, '').replace(',', '.') : t)
}
