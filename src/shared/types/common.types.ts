export type EstadoOrden =
  | 'activa'
  | 'en_proceso'
  | 'terminada'
  | 'cancelada'
  | 'pre_factura'

export type EstadoTarea =
  | 'pendiente'
  | 'asignada'
  | 'autorizada'
  | 'en_proceso'
  | 'completada'
  | 'validada'
  | 'rechazada'

export type PrioridadTarea = 'baja' | 'media' | 'alta' | 'critica'

export type TipoMovimiento = 'entrada' | 'salida'

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface SelectOption {
  value: string
  label: string
}
