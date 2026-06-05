import { UserRole } from '../types/auth.types'

export function getRolLabel(rol?: UserRole): string {
  const map: Record<UserRole, string> = {
    admin: 'Administrador',
    gerencia: 'Gerencia',
    ingenieria: 'Ingeniería',
    inspector: 'Inspector',
    mecanico: 'Mecánico',
    mecanico_certificado: 'Mecánico Certificado',
    almacen: 'Almacén',
  }
  return rol ? (map[rol] ?? rol) : ''
}
