export type UserRole =
  | 'admin'
  | 'gerencia'
  | 'ingenieria'
  | 'inspector'
  | 'mecanico'
  | 'mecanico_certificado'
  | 'almacen'

export interface AuthUser {
  id: string
  nombre: string
  email: string
  rol: UserRole
  activo: boolean
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe: boolean
}

export interface MockCredential {
  email: string
  password: string
  user: AuthUser
}
