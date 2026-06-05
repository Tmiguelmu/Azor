import { Usuario } from '../types/usuario.types'

export const mockUsuarios: Usuario[] = [
  { id: 'u1', nombre: 'Carlos Rodríguez', email: 'admin@azor.com', rol: 'admin', activo: true, telefono: '55 1234 5678', fechaCreacion: '2022-01-01', ultimoAcceso: '2025-06-02T08:30:00' },
  { id: 'u2', nombre: 'Ana Martínez', email: 'gerencia@azor.com', rol: 'gerencia', activo: true, telefono: '55 8765 4321', fechaCreacion: '2022-01-05', ultimoAcceso: '2025-06-01T17:00:00' },
  { id: 'u3', nombre: 'Luis Hernández', email: 'ingenieria@azor.com', rol: 'ingenieria', activo: true, telefono: '55 2345 6789', fechaCreacion: '2022-03-10', ultimoAcceso: '2025-06-02T07:45:00' },
  { id: 'u4', nombre: 'Roberto García', email: 'inspector@azor.com', rol: 'inspector', activo: true, telefono: '55 3456 7890', fechaCreacion: '2022-04-15', ultimoAcceso: '2025-06-01T16:30:00' },
  { id: 'u5', nombre: 'José López', email: 'mecanico@azor.com', rol: 'mecanico', activo: true, telefono: '55 4567 8901', fechaCreacion: '2022-05-01', ultimoAcceso: '2025-06-02T08:00:00' },
  { id: 'u6', nombre: 'Miguel Torres', email: 'certificado@azor.com', rol: 'mecanico_certificado', activo: true, telefono: '55 5678 9012', fechaCreacion: '2022-05-01', ultimoAcceso: '2025-05-30T18:00:00' },
  { id: 'u7', nombre: 'Patricia Flores', email: 'almacen@azor.com', rol: 'almacen', activo: true, telefono: '55 6789 0123', fechaCreacion: '2022-06-15', ultimoAcceso: '2025-06-02T09:00:00' },
  { id: 'u8', nombre: 'Juan Ramírez', email: 'mecanico2@azor.com', rol: 'mecanico', activo: false, telefono: '55 7890 1234', fechaCreacion: '2023-01-20', ultimoAcceso: '2025-04-10T10:00:00' },
]
