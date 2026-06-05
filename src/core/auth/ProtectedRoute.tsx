import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { usePermissions } from '../../shared/hooks/usePermissions'
import { RolePermissions } from '../../shared/utils/permissions'

interface ProtectedRouteProps {
  requiredPermission?: keyof RolePermissions
}

export function ProtectedRoute({ requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()
  const { can } = usePermissions()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredPermission && !can(requiredPermission)) {
    return <Navigate to="/sin-acceso" replace />
  }

  return <Outlet />
}
