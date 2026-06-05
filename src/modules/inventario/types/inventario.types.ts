import { TipoMovimiento } from '../../../shared/types/common.types'

export interface ItemInventario {
  id: string
  codigo: string
  descripcion: string
  marca?: string
  modelo?: string
  cantidad: number
  stockMinimo: number
  unidad: string
  ubicacion: string
  proveedor: string
  precioUnitario: number
  categoria: string
  fechaActualizacion: string
}

export interface MovimientoInventario {
  id: string
  itemId: string
  itemCodigo: string
  itemDescripcion: string
  tipo: TipoMovimiento
  cantidad: number
  ordenId?: string
  ordenFolio?: string
  tareaId?: string
  motivo: string
  realizadoPor: string
  fecha: string
  saldoAnterior: number
  saldoNuevo: number
}
