import { useMemo } from 'react'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { Toaster } from 'react-hot-toast'
import { useAppSelector } from './store'
import { createAppTheme } from './core/theme/theme'
import { AppRouter } from './core/router/AppRouter'
import { AuthProvider } from './core/auth/AuthContext'

function App() {
  const themeMode = useAppSelector((state) => state.ui.themeMode)
  const theme = useMemo(() => createAppTheme(themeMode), [themeMode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </HashRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '8px',
            fontFamily: 'Roboto, sans-serif',
            fontSize: '14px',
          },
        }}
      />
    </ThemeProvider>
  )
}

export default App
