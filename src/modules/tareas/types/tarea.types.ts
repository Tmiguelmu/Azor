import { EstadoTarea, PrioridadTarea } from '../../../shared/types/common.types'

export interface Tarea {
  id: string
  folio: string
  ordenId: string
  ordenFolio: string
  descripcion: string
  detalle?: string
  estado: EstadoTarea
  prioridad: PrioridadTarea
  asignadoA?: string
  asignadoAId?: string
  creadoPor: string
  autorizadoPor?: string
  avance: number
  notas?: string
  fechaCreacion: string
  fechaActualizacion: string
  fechaLimite?: string
  evidencias: string[]
  materiales: MaterialTarea[]
}

export interface MaterialTarea {
  id: string
  codigo: string
  descripcion: string
  cantidad: number
  unidad: string
  entregado: boolean
}

export interface CreateTareaDto {
  ordenId: string
  descripcion: string
  detalle?: string
  prioridad: PrioridadTarea
  fechaLimite?: string
}
