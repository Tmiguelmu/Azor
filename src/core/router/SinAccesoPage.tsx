import { Box, Typography, Button } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useNavigate } from 'react-router-dom'

export function SinAccesoPage() {
  const navigate = useNavigate()
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" gap={2}>
      <LockOutlinedIcon sx={{ fontSize: 64, color: 'error.main' }} />
      <Typography variant="h5" fontWeight={700}>Acceso no autorizado</Typography>
      <Typography color="text.secondary">No tienes permisos para ver esta sección.</Typography>
      <Button variant="contained" onClick={() => navigate('/')}>Volver al inicio</Button>
    </Box>
  )
}
