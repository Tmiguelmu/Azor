import { Chip, ChipProps } from '@mui/material'
import { EstadoOrden, EstadoTarea } from '../types/common.types'

type StatusType = EstadoOrden | EstadoTarea

interface StatusConfig {
  label: string
  color: ChipProps['color']
  variant?: ChipProps['variant']
}

const ordenStatus: Record<EstadoOrden, StatusConfig> = {
  activa: { label: 'Activa', color: 'info' },
  en_proceso: { label: 'En Proceso', color: 'warning' },
  terminada: { label: 'Terminada', color: 'success' },
  cancelada: { label: 'Cancelada', color: 'error' },
  pre_factura: { label: 'Pre-Factura', color: 'secondary' },
}

const tareaStatus: Record<EstadoTarea, StatusConfig> = {
  pendiente: { label: 'Pendiente', color: 'default' },
  asignada: { label: 'Asignada', color: 'info' },
  autorizada: { label: 'Autorizada', color: 'secondary' },
  en_proceso: { label: 'En Proceso', color: 'warning' },
  completada: { label: 'Completada', color: 'primary' },
  validada: { label: 'Validada', color: 'success' },
  rechazada: { label: 'Rechazada', color: 'error' },
}

interface StatusBadgeProps {
  status: StatusType
  type?: 'orden' | 'tarea'
  size?: 'small' | 'medium'
}

export function StatusBadge({ status, type = 'tarea', size = 'small' }: StatusBadgeProps) {
  const config = type === 'orden'
    ? ordenStatus[status as EstadoOrden]
    : tareaStatus[status as EstadoTarea]

  if (!config) return null

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      sx={{ fontWeight: 600, fontSize: 11 }}
    />
  )
}
