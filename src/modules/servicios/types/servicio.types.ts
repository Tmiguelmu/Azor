export interface Servicio {
  id: string
  clave: string
  descripcion: string
  agrupacionId: string
  agrupacionNombre: string
  precioVenta: number
  precioAnterior?: number
  unidad: string
  activo: boolean
  fechaCreacion: string
}
