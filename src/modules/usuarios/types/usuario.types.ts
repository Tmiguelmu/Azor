import { UserRole } from '../../../shared/types/auth.types'

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: UserRole
  activo: boolean
  telefono?: string
  fechaCreacion: string
  ultimoAcceso?: string
}
