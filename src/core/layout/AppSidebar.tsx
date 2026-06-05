import { Box, Drawer, Typography, useTheme, Avatar, Divider, Tooltip } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { getNavSectionsForRole } from './navItems'
import { getRolLabel } from '../../shared/utils/rolLabels'
import { UserRole } from '../../shared/types/auth.types'
import AzorLogo from '../../assets/AzorLogo'

// Iconos outlined
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import SyncAltIcon from '@mui/icons-material/SyncAlt'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import MiscellaneousServicesOutlinedIcon from '@mui/icons-material/MiscellaneousServicesOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'

const iconMap: Record<string, React.ReactNode> = {
  Dashboard: <DashboardOutlinedIcon sx={{ fontSize: 18 }} />,
  Assignment: <AssignmentOutlinedIcon sx={{ fontSize: 18 }} />,
  Task: <TaskAltIcon sx={{ fontSize: 18 }} />,
  BuildCircle: <BuildOutlinedIcon sx={{ fontSize: 18 }} />,
  VerifiedUser: <VerifiedOutlinedIcon sx={{ fontSize: 18 }} />,
  Inventory: <Inventory2OutlinedIcon sx={{ fontSize: 18 }} />,
  SwapHoriz: <SyncAltIcon sx={{ fontSize: 18 }} />,
  People: <PeopleOutlineIcon sx={{ fontSize: 18 }} />,
  MiscellaneousServices: <MiscellaneousServicesOutlinedIcon sx={{ fontSize: 18 }} />,
  Category: <CategoryOutlinedIcon sx={{ fontSize: 18 }} />,
  ManageAccounts: <ManageAccountsOutlinedIcon sx={{ fontSize: 18 }} />,
  BarChart: <BarChartOutlinedIcon sx={{ fontSize: 18 }} />,
  Shield: <ShieldOutlinedIcon sx={{ fontSize: 18 }} />,
}

interface AppSidebarProps {
  drawerWidth: number
  mobileOpen: boolean
  onMobileClose: () => void
  isMobile: boolean
  desktopOpen: boolean
}

export function AppSidebar({ drawerWidth, mobileOpen, onMobileClose, isMobile, desktopOpen }: AppSidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'

  const sections = user ? getNavSectionsForRole(user.rol as UserRole) : []
  const initials = user?.nombre.split(' ').map((n) => n[0]).slice(0, 2).join('') ?? 'AZ'

  const handleNav = (path: string) => {
    navigate(path)
    if (isMobile) onMobileClose()
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const textPrimary   = isLight ? '#0F172A' : '#F1F5F9'
  const textSecondary = isLight ? '#64748B' : '#94A3B8'
  const activeBg      = 'rgba(37,99,235,0.08)'
  const hoverBg       = isLight ? 'rgba(15,23,42,0.04)' : 'rgba(241,245,249,0.05)'
  const sectionColor  = isLight ? '#94A3B8' : '#64748B'

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', userSelect: 'none' }}>
      {/* Logo */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          cursor: 'pointer',
          transition: 'opacity 0.2s',
          '&:hover': { opacity: 0.8 },
        }}
        onClick={() => handleNav('/dashboard')}
      >
        <AzorLogo size={32} />
        <Box>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: 16,
              letterSpacing: 2,
              color: textPrimary,
              lineHeight: 1.1,
            }}
          >
            AZOR
          </Typography>
          <Typography sx={{ fontSize: 10, color: textSecondary, letterSpacing: 1 }}>
            GESTIÓN AERONÁUTICA
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Nav sections */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1.5, py: 1.5 }}>
        {sections.map((section, sIdx) => (
          <Box key={section.sectionLabel} sx={{ mb: 0.5 }}>
            {/* Section label */}
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: sectionColor,
                px: 1.5,
                py: 0.8,
                mt: sIdx > 0 ? 1.5 : 0,
              }}
            >
              {section.sectionLabel}
            </Typography>

            {section.items.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path))

              return (
                <Box
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 1.5,
                    py: 1,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    mb: 0.25,
                    position: 'relative',
                    backgroundColor: isActive ? activeBg : 'transparent',
                    transition: 'background-color 0.15s ease',
                    '&:hover': { backgroundColor: isActive ? activeBg : hoverBg },
                  }}
                >
                  {/* Indicador activo */}
                  {isActive && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 3,
                        height: 18,
                        backgroundColor: '#2563EB',
                        borderRadius: '0 2px 2px 0',
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      color: isActive ? '#2563EB' : textSecondary,
                      display: 'flex',
                      alignItems: 'center',
                      flexShrink: 0,
                      transition: 'color 0.15s',
                    }}
                  >
                    {iconMap[item.icon]}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? textPrimary : textSecondary,
                      flexGrow: 1,
                      transition: 'color 0.15s',
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              )
            })}
          </Box>
        ))}
      </Box>

      <Divider />

      {/* User footer */}
      <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar
          sx={{
            width: 34,
            height: 34,
            bgcolor: '#2563EB',
            fontSize: 13,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {initials}
        </Avatar>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            sx={{ fontSize: 13, fontWeight: 600, color: textPrimary, lineHeight: 1.2 }}
            noWrap
          >
            {user?.nombre}
          </Typography>
          <Typography sx={{ fontSize: 11, color: '#2563EB' }}>
            {getRolLabel(user?.rol as UserRole)}
          </Typography>
        </Box>
        <Tooltip title="Cerrar sesión">
          <Box
            onClick={handleLogout}
            sx={{
              color: textSecondary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              p: 0.5,
              borderRadius: 1,
              '&:hover': { color: '#DC2626', backgroundColor: 'rgba(220,38,38,0.06)' },
              transition: 'all 0.15s',
            }}
          >
            <LogoutOutlinedIcon sx={{ fontSize: 18 }} />
          </Box>
        </Tooltip>
      </Box>
    </Box>
  )

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>
    )
  }

  return (
    <Drawer
      variant="persistent"
      open={desktopOpen}
      sx={{
        width: desktopOpen ? drawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width'),
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}
