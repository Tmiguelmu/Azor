import { useAppSelector } from '../../store'
import { getPermissions, hasPermission, RolePermissions } from '../utils/permissions'
import { UserRole } from '../types/auth.types'

export function usePermissions() {
  const user = useAppSelector((state) => state.auth.user)
  const rol = user?.rol as UserRole | undefined

  return {
    can: (permission: keyof RolePermissions): boolean => {
      if (!rol) return false
      return hasPermission(rol, permission)
    },
    permissions: rol ? getPermissions(rol) : null,
    rol,
  }
}
