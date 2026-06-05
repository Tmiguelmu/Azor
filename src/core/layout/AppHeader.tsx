import { AppBar, Toolbar, IconButton, Typography, Box, Tooltip, Avatar, Menu, MenuItem, Divider, Breadcrumbs, Link, useTheme } from '@mui/material'
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { toggleTheme, toggleSidebar } from '../../store/slices/uiSlice'
import { useAuth } from '../auth/AuthContext'
import { getRolLabel } from '../../shared/utils/rolLabels'
import { UserRole } from '../../shared/types/auth.types'
import { useNavigate, useLocation } from 'react-router-dom'
import { getPageTitle } from './pageTitle'

interface AppHeaderProps {
  drawerWidth: number
  onMobileMenuToggle: () => void
}

/** Genera breadcrumbs simples a partir del pathname */
function useBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return []

  const labelMap: Record<string, string> = {
    dashboard: 'Dashboard',
    ordenes: 'Órdenes de Trabajo',
    tareas: 'Tareas',
    'mis-tareas': 'Mis Tareas',
    'tareas-validar': 'Por Validar',
    inventario: 'Inventario',
    movimientos: 'Movimientos',
    clientes: 'Clientes',
    servicios: 'Servicios',
    catalogos: 'Catálogos',
    usuarios: 'Usuarios',
    roles: 'Roles',
    reportes: 'Reportes',
  }

  return segments.map((seg, i) => ({
    label: labelMap[seg] ?? seg.toUpperCase(),
    path: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }))
}

export function AppHeader({ onMobileMenuToggle }: AppHeaderProps) {
  const dispatch = useAppDispatch()
  const themeMode = useAppSelector((state) => state.ui.themeMode)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const breadcrumbs = useBreadcrumbs(location.pathname)
  const pageTitle = getPageTitle(location.pathname)
  const initials = user?.nombre.split(' ').map((n) => n[0]).slice(0, 2).join('') ?? 'AZ'

  const handleLogout = () => {
    setAnchorEl(null)
    logout()
    navigate('/login')
  }

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: isLight ? '#FFFFFF' : 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: (t) => t.zIndex.drawer - 1,
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ gap: 1, minHeight: '60px !important' }}>
        {/* Toggle sidebar */}
        <IconButton
          onClick={() => { dispatch(toggleSidebar()); onMobileMenuToggle() }}
          size="small"
          sx={{ color: 'text.secondary', mr: 0.5 }}
        >
          <MenuOutlinedIcon fontSize="small" />
        </IconButton>

        {/* Breadcrumbs / Titulo */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          {breadcrumbs.length > 1 ? (
            <Breadcrumbs
              separator={<NavigateNextIcon sx={{ fontSize: 14, color: 'text.disabled' }} />}
              sx={{ '& .MuiBreadcrumbs-ol': { flexWrap: 'nowrap' } }}
            >
              {breadcrumbs.map((bc) =>
                bc.isLast ? (
                  <Typography
                    key={bc.path}
                    sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary' }}
                    noWrap
                  >
                    {bc.label}
                  </Typography>
                ) : (
                  <Link
                    key={bc.path}
                    component="button"
                    underline="hover"
                    onClick={() => navigate(bc.path)}
                    sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 400 }}
                  >
                    {bc.label}
                  </Link>
                )
              )}
            </Breadcrumbs>
          ) : (
            <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary' }} noWrap>
              {pageTitle}
            </Typography>
          )}
        </Box>

        {/* Acciones */}
        <Tooltip title={themeMode === 'light' ? 'Modo oscuro' : 'Modo claro'}>
          <IconButton
            onClick={() => dispatch(toggleTheme())}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            {themeMode === 'light'
              ? <DarkModeOutlinedIcon fontSize="small" />
              : <LightModeOutlinedIcon fontSize="small" />
            }
          </IconButton>
        </Tooltip>

        {/* Avatar */}
        <Box>
          <Tooltip title={user?.nombre ?? ''}>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small" sx={{ p: 0.5 }}>
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: '#2563EB',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {initials}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                minWidth: 220,
                mt: 1,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 8px 24px rgba(15,23,42,0.12)',
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={700}>{user?.nombre}</Typography>
              <Typography variant="caption" color="primary.main">
                {getRolLabel(user?.rol as UserRole)}
              </Typography>
              <br />
              <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
            </Box>
            <Divider />
            <MenuItem
              onClick={handleLogout}
              sx={{ color: 'error.main', gap: 1.5, py: 1.2, fontSize: 14, fontWeight: 500 }}
            >
              <LogoutOutlinedIcon fontSize="small" />
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
