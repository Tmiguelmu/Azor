import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { AppHeader } from './AppHeader'
import { AppSidebar } from './AppSidebar'
import { useAppSelector } from '../../store'

const DRAWER_WIDTH = 260

export function MainLayout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleMobileToggle = () => setMobileOpen((prev) => !prev)

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <AppSidebar
        drawerWidth={DRAWER_WIDTH}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        isMobile={isMobile}
        desktopOpen={sidebarOpen}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ml: !isMobile && !sidebarOpen ? 0 : undefined,
        }}
      >
        <AppHeader drawerWidth={DRAWER_WIDTH} onMobileMenuToggle={handleMobileToggle} />
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: { xs: 2, md: 3 },
            backgroundColor: 'background.default',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
