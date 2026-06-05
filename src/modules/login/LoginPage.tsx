import { useState } from 'react'
import {
  Box, Card, CardContent, TextField, Button, Typography,
  InputAdornment, IconButton, FormControlLabel, Checkbox,
  Alert, CircularProgress, Divider, useTheme
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useAuth } from '../../core/auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import AzorLogo from '../../assets/AzorLogo'
import toast from 'react-hot-toast'
import { mockCredentials } from '../../core/auth/mockCredentials'
import { getRolLabel } from '../../shared/utils/rolLabels'
import { UserRole } from '../../shared/types/auth.types'

export function LoginPage() {
  const theme = useTheme()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const ok = await login({ email, password, rememberMe })
      if (ok) {
        toast.success('Bienvenido al sistema Azor')
        navigate('/')
      } else {
        setError('Credenciales incorrectas. Verifica tu email y contraseña.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleQuickLogin = (credEmail: string, credPassword: string) => {
    setEmail(credEmail)
    setPassword(credPassword)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.mode === 'light'
          ? 'linear-gradient(135deg, #1B2A4A 0%, #2C4A7C 40%, #3B6CB4 70%, #5A9BD5 100%)'
          : 'linear-gradient(135deg, #0A1628 0%, #1B2A4A 50%, #2C4A7C 100%)',
        p: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 3, width: '100%', maxWidth: 900, alignItems: 'flex-start' }}>
        {/* Left panel - Branding */}
        <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 2, pt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AzorLogo size={60} />
            <Box>
              <Typography variant="h3" fontWeight={900} sx={{ color: '#E8EDF5', letterSpacing: 4, lineHeight: 1 }}>
                AZOR
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                SISTEMA DE GESTIÓN AERONÁUTICA
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.75)', mt: 2, lineHeight: 1.7, maxWidth: 360 }}>
            Plataforma integral de gestión para mantenimiento aeronáutico. Administra órdenes de trabajo, inventario, tareas y más desde un solo lugar.
          </Typography>
          <Box sx={{ mt: 3 }}>
            {['Órdenes de Trabajo', 'Gestión de Inventario', 'Control de Tareas', 'Reportes Ejecutivos'].map((item) => (
              <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#5A9BD5' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)' }}>{item}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right panel - Form */}
        <Box sx={{ width: { xs: '100%', md: 400 } }}>
          <Card elevation={24} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <AzorLogo size={42} />
                <Box>
                  <Typography variant="h6" fontWeight={800} color="primary.dark">
                    AZOR
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Gestión Aeronáutica
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h6" fontWeight={700} mb={0.5}>Iniciar Sesión</Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Ingresa tus credenciales para continuar
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Correo electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  label="Contraseña"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPass(!showPass)} edge="end" size="small">
                          {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControlLabel
                  control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} size="small" />}
                  label={<Typography variant="body2">Recordarme</Typography>}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  size="large"
                  sx={{ mt: 1 }}
                >
                  {loading ? <CircularProgress size={22} color="inherit" /> : 'Iniciar Sesión'}
                </Button>
              </Box>

              <Divider sx={{ my: 3 }}>
                <Typography variant="caption" color="text.disabled">Acceso rápido (demo)</Typography>
              </Divider>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.7 }}>
                {mockCredentials.map((cred) => (
                  <Button
                    key={cred.email}
                    variant="outlined"
                    size="small"
                    onClick={() => handleQuickLogin(cred.email, cred.password)}
                    sx={{ fontSize: 11, py: 0.4 }}
                  >
                    {getRolLabel(cred.user.rol as UserRole)}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', textAlign: 'center', mt: 2 }}>
            Azor Aero 2025 - Sistema Interno v1.0.0
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
