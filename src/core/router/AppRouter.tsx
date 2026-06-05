import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ProtectedRoute } from '../auth/ProtectedRoute'
import { MainLayout } from '../layout/MainLayout'
import { LoginPage } from '../../modules/login/LoginPage'
import { DashboardPage } from '../../modules/dashboard/DashboardPage'
import { OrdenesPage } from '../../modules/ordenes-trabajo/OrdenesPage'
import { OrdenDetallePage } from '../../modules/ordenes-trabajo/OrdenDetallePage'
import { TareasPage } from '../../modules/tareas/TareasPage'
import { InventarioPage } from '../../modules/inventario/InventarioPage'
import { MovimientosPage } from '../../modules/inventario/MovimientosPage'
import { ClientesPage } from '../../modules/clientes/ClientesPage'
import { ServiciosPage } from '../../modules/servicios/ServiciosPage'
import { CatalogosPage } from '../../modules/catalogos/CatalogosPage'
import { UsuariosPage } from '../../modules/usuarios/UsuariosPage'
import { ReportesPage } from '../../modules/reportes/ReportesPage'
import { RolesPage } from '../../modules/roles/RolesPage'
import { SinAccesoPage } from './SinAccesoPage'
import { usePermissions } from '../../shared/hooks/usePermissions'

function HomeRedirect() {
  const { isAuthenticated } = useAuth()
  const { rol } = usePermissions()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (rol === 'mecanico') return <Navigate to="/mis-tareas" replace />
  if (rol === 'mecanico_certificado') return <Navigate to="/tareas-validar" replace />
  return <Navigate to="/dashboard" replace />
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sin-acceso" element={<SinAccesoPage />} />
      <Route path="/" element={<HomeRedirect />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/ordenes" element={<OrdenesPage />} />
          <Route path="/ordenes/:id" element={<OrdenDetallePage />} />
          <Route path="/tareas" element={<TareasPage />} />
          <Route path="/mis-tareas" element={<TareasPage misTareas />} />
          <Route path="/tareas-validar" element={<TareasPage soloValidar />} />
          <Route path="/inventario" element={<InventarioPage />} />
          <Route path="/inventario/movimientos" element={<MovimientosPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/servicios" element={<ServiciosPage />} />
          <Route path="/catalogos" element={<CatalogosPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/reportes" element={<ReportesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
