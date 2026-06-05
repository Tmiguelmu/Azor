import { MockCredential } from '../../shared/types/auth.types'

export const mockCredentials: MockCredential[] = [
  {
    email: 'admin@azor.com',
    password: 'Admin123!',
    user: { id: 'u1', nombre: 'Carlos Rodríguez', email: 'admin@azor.com', rol: 'admin', activo: true },
  },
  {
    email: 'gerencia@azor.com',
    password: 'Gerencia123!',
    user: { id: 'u2', nombre: 'Ana Martínez', email: 'gerencia@azor.com', rol: 'gerencia', activo: true },
  },
  {
    email: 'ingenieria@azor.com',
    password: 'Ingenieria123!',
    user: { id: 'u3', nombre: 'Luis Hernández', email: 'ingenieria@azor.com', rol: 'ingenieria', activo: true },
  },
  {
    email: 'inspector@azor.com',
    password: 'Inspector123!',
    user: { id: 'u4', nombre: 'Roberto García', email: 'inspector@azor.com', rol: 'inspector', activo: true },
  },
  {
    email: 'mecanico@azor.com',
    password: 'Mecanico123!',
    user: { id: 'u5', nombre: 'José López', email: 'mecanico@azor.com', rol: 'mecanico', activo: true },
  },
  {
    email: 'certificado@azor.com',
    password: 'Certificado123!',
    user: { id: 'u6', nombre: 'Miguel Torres', email: 'certificado@azor.com', rol: 'mecanico_certificado', activo: true },
  },
  {
    email: 'almacen@azor.com',
    password: 'Almacen123!',
    user: { id: 'u7', nombre: 'Patricia Flores', email: 'almacen@azor.com', rol: 'almacen', activo: true },
  },
]
