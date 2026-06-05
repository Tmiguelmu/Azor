import { EstadoOrden } from '../../../shared/types/common.types'

export interface OrdenTrabajo {
  id: string
  folio: string
  clienteId: string
  clienteNombre: string
  matricula: string
  serie: string
  marca: string
  modelo: string
  planeadorHrs: number
  motor1Hrs: number
  motor2Hrs?: number
  motor3Hrs?: number
  motor4Hrs?: number
  ciclos1: number
  ciclos2?: number
  ciclos3?: number
  ciclos4?: number
  aterrizajes: number
  comentarios: string
  estado: EstadoOrden
  fechaCreacion: string
  fechaActualizacion: string
  creadoPor: string
  prioridad: 'normal' | 'urgente'
  prefactura?: PreFactura
}

export interface PreFactura {
  id: string
  ordenId: string
  subtotal: number
  iva: number
  total: number
  conceptos: ConceptoFactura[]
  fechaCreacion: string
}

export interface ConceptoFactura {
  id: string
  descripcion: string
  cantidad: number
  precioUnitario: number
  total: number
  agrupacion: string
}

export interface CreateOrdenDto {
  clienteId: string
  matricula: string
  serie: string
  marca: string
  modelo: string
  planeadorHrs: number
  motor1Hrs: number
  motor2Hrs?: number
  ciclos1: number
  aterrizajes: number
  comentarios: string
  prioridad: 'normal' | 'urgente'
}
