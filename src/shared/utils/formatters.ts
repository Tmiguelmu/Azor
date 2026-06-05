export function formatFecha(fechaStr: string): string {
  const fecha = new Date(fechaStr)
  return fecha.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

export function formatMoneda(valor: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(valor)
}

export function formatFolioOrden(num: number): string {
  return `OT-${String(num).padStart(4, '0')}`
}

export function formatFolioTarea(num: number): string {
  return `TK-${String(num).padStart(4, '0')}`
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function formatFechaHora(fechaStr: string): string {
  const fecha = new Date(fechaStr)
  return fecha.toLocaleString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
