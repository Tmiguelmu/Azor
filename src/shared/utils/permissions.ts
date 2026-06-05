import { UserRole } from '../types/auth.types'

export interface RolePermissions {
  dashboard: boolean
  ordenes: boolean
  ordenes_write: boolean
  tareas: boolean
  tareas_write: boolean
  tareas_assign: boolean
  tareas_authorize: boolean
  tareas_validate: boolean
  inventario: boolean
  inventario_write: boolean
  clientes: boolean
  clientes_write: boolean
  servicios: boolean
  servicios_write: boolean
  catalogos: boolean
  catalogos_write: boolean
  usuarios: boolean
  usuarios_write: boolean
  reportes: boolean
  mis_tareas: boolean
  tareas_validar: boolean
}

const permissionsByRole: Record<UserRole, RolePermissions> = {
  admin: {
    dashboard: true, ordenes: true, ordenes_write: true, tareas: true, tareas_write: true,
    tareas_assign: true, tareas_authorize: true, tareas_validate: true,
    inventario: true, inventario_write: true, clientes: true, clientes_write: true,
    servicios: true, servicios_write: true, catalogos: true, catalogos_write: true,
    usuarios: true, usuarios_write: true, reportes: true, mis_tareas: true, tareas_validar: true,
  },
  gerencia: {
    dashboard: true, ordenes: true, ordenes_write: true, tareas: true, tareas_write: true,
    tareas_assign: true, tareas_authorize: true, tareas_validate: true,
    inventario: true, inventario_write: true, clientes: true, clientes_write: true,
    servicios: true, servicios_write: true, catalogos: true, catalogos_write: true,
    usuarios: true, usuarios_write: true, reportes: true, mis_tareas: true, tareas_validar: true,
  },
  ingenieria: {
    dashboard: true, ordenes: true, ordenes_write: false, tareas: true, tareas_write: true,
    tareas_assign: false, tareas_authorize: true, tareas_validate: false,
    inventario: true, inventario_write: false, clientes: false, clientes_write: false,
    servicios: true, servicios_write: false, catalogos: false, catalogos_write: false,
    usuarios: false, usuarios_write: false, reportes: false, mis_tareas: false, tareas_validar: false,
  },
  inspector: {
    dashboard: true, ordenes: true, ordenes_write: false, tareas: true, tareas_write: false,
    tareas_assign: true, tareas_authorize: false, tareas_validate: false,
    inventario: false, inventario_write: false, clientes: false, clientes_write: false,
    servicios: false, servicios_write: false, catalogos: false, catalogos_write: false,
    usuarios: false, usuarios_write: false, reportes: false, mis_tareas: false, tareas_validar: false,
  },
  mecanico: {
    dashboard: true, ordenes: false, ordenes_write: false, tareas: false, tareas_write: false,
    tareas_assign: false, tareas_authorize: false, tareas_validate: false,
    inventario: false, inventario_write: false, clientes: false, clientes_write: false,
    servicios: false, servicios_write: false, catalogos: false, catalogos_write: false,
    usuarios: false, usuarios_write: false, reportes: false, mis_tareas: true, tareas_validar: false,
  },
  mecanico_certificado: {
    dashboard: true, ordenes: false, ordenes_write: false, tareas: false, tareas_write: false,
    tareas_assign: false, tareas_authorize: false, tareas_validate: true,
    inventario: false, inventario_write: false, clientes: false, clientes_write: false,
    servicios: false, servicios_write: false, catalogos: false, catalogos_write: false,
    usuarios: false, usuarios_write: false, reportes: false, mis_tareas: false, tareas_validar: true,
  },
  almacen: {
    dashboard: true, ordenes: false, ordenes_write: false, tareas: false, tareas_write: false,
    tareas_assign: false, tareas_authorize: false, tareas_validate: false,
    inventario: true, inventario_write: true, clientes: false, clientes_write: false,
    servicios: false, servicios_write: false, catalogos: false, catalogos_write: false,
    usuarios: false, usuarios_write: false, reportes: false, mis_tareas: false, tareas_validar: false,
  },
}

export function getPermissions(rol: UserRole): RolePermissions {
  return permissionsByRole[rol]
}

export function hasPermission(rol: UserRole, permission: keyof RolePermissions): boolean {
  return permissionsByRole[rol]?.[permission] ?? false
}
