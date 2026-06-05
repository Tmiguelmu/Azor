import { useState } from 'react'
import {
  Box, Card, CardContent, Grid, Typography, Button, Chip, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Divider, IconButton, Tooltip, useTheme,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import CloseIcon from '@mui/icons-material/Close'
import { PageHeader } from '../../shared/components/PageHeader'
import { PermisoMatrix, PermisosRol, MODULOS_PERMISOS } from './components/PermisoMatrix'
import toast from 'react-hot-toast'

/** Definición de un Rol */
interface Rol {
  id: string
  nombre: string
  descripcion: string
  color: string
  usuarios: number
  permisos: PermisosRol
}

// Permisos predefinidos por rol
const PERMISOS_ADMIN: PermisosRol = Object.fromEntries(
  MODULOS_PERMISOS.flatMap((m) => m.permisos.map((p) => [p.key, true]))
)

const PERMISOS_GERENCIA: PermisosRol = {
  ordenes_read: true, ordenes_write: true, ordenes_export: true,
  tareas_read: true, tareas_write: true, tareas_validate: true, tareas_assign: true,
  inventario_read: true, inventario_write: true, movimientos_write: true,
  clientes_read: true, clientes_write: true,
  reportes_read: true, reportes_export: true,
  usuarios_read: true,
}

const PERMISOS_INGENIERIA: PermisosRol = {
  ordenes_read: true, ordenes_write: true,
  tareas_read: true, tareas_write: true, tareas_assign: true,
  inventario_read: true,
  reportes_read: true,
}

const PERMISOS_MECANICO: PermisosRol = {
  tareas_read: true,
  inventario_read: true,
}

const PERMISOS_ALMACEN: PermisosRol = {
  inventario_read: true, inventario_write: true, movimientos_write: true,
}

const ROLES_INICIALES: Rol[] = [
  { id: 'r1', nombre: 'Administrador', descripcion: 'Acceso total al sistema', color: '#2563EB', usuarios: 1, permisos: PERMISOS_ADMIN },
  { id: 'r2', nombre: 'Gerencia', descripcion: 'Gestión operativa y reportes', color: '#7C3AED', usuarios: 2, permisos: PERMISOS_GERENCIA },
  { id: 'r3', nombre: 'Ingeniería', descripcion: 'Creación y seguimiento de OTs', color: '#059669', usuarios: 3, permisos: PERMISOS_INGENIERIA },
  { id: 'r4', nombre: 'Mecánico', descripcion: 'Ejecución de tareas asignadas', color: '#D97706', usuarios: 5, permisos: PERMISOS_MECANICO },
  { id: 'r5', nombre: 'Almacén', descripcion: 'Gestión de inventario', color: '#0EA5E9', usuarios: 2, permisos: PERMISOS_ALMACEN },
]

/** Menú de preview segun permisos */
function MenuPreview({ permisos }: { permisos: PermisosRol }) {
  const items: { label: string; key: string }[] = [
    { label: 'Dashboard', key: 'tareas_read' },
    { label: 'Órdenes de Trabajo', key: 'ordenes_read' },
    { label: 'Tareas', key: 'tareas_read' },
    { label: 'Inventario', key: 'inventario_read' },
    { label: 'Clientes', key: 'clientes_read' },
    { label: 'Reportes', key: 'reportes_read' },
    { label: 'Usuarios', key: 'usuarios_read' },
    { label: 'Roles', key: 'roles_write' },
  ]

  const visible = items.filter((i) => permisos[i.key])

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1, display: 'block' }}>
        Menú visible para este rol
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
        {visible.map((item) => (
          <Chip key={item.key} label={item.label} size="small" variant="outlined" sx={{ fontSize: 12, fontWeight: 500 }} />
        ))}
        {visible.length === 0 && (
          <Typography variant="caption" color="text.disabled">Sin acceso</Typography>
        )}
      </Box>
    </Box>
  )
}

/**
 * Página de gestión de roles con matriz de permisos.
 * Solo visible para admin y gerencia.
 */
export function RolesPage() {
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'
  const [roles, setRoles] = useState<Rol[]>(ROLES_INICIALES)
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRol, setEditingRol] = useState<Partial<Rol>>({})
  const [isNew, setIsNew] = useState(false)

  const handleOpenEdit = (rol: Rol) => {
    setEditingRol({ ...rol })
    setIsNew(false)
    setDialogOpen(true)
  }

  const handleOpenNew = () => {
    setEditingRol({
      nombre: '',
      descripcion: '',
      color: '#2563EB',
      usuarios: 0,
      permisos: {},
    })
    setIsNew(true)
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!editingRol.nombre?.trim()) {
      toast.error('El nombre del rol es obligatorio')
      return
    }

    if (isNew) {
      const nuevo: Rol = {
        ...editingRol as Rol,
        id: `r${Date.now()}`,
        permisos: editingRol.permisos ?? {},
      }
      setRoles((prev) => [...prev, nuevo])
      toast.success(`Rol "${nuevo.nombre}" creado`)
    } else {
      setRoles((prev) =>
        prev.map((r) => r.id === editingRol.id ? { ...r, ...editingRol } as Rol : r)
      )
      if (selectedRol?.id === editingRol.id) {
        setSelectedRol({ ...selectedRol, ...editingRol } as Rol)
      }
      toast.success('Rol actualizado')
    }
    setDialogOpen(false)
  }

  const COLORES = ['#2563EB', '#7C3AED', '#059669', '#D97706', '#0EA5E9', '#DC2626', '#64748B']

  return (
    <Box className="fade-in">
      <PageHeader
        title="Gestión de Roles"
        subtitle={`${roles.length} roles configurados`}
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenNew}>
            Nuevo Rol
          </Button>
        }
      />

      <Grid container spacing={2.5}>
        {/* Lista de roles */}
        <Grid item xs={12} md={selectedRol ? 5 : 12}>
          <Grid container spacing={2}>
            {roles.map((rol) => (
              <Grid item xs={12} sm={selectedRol ? 12 : 6} lg={selectedRol ? 12 : 4} key={rol.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: selectedRol?.id === rol.id ? rol.color : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'translateY(-2px)' },
                  }}
                  onClick={() => setSelectedRol(selectedRol?.id === rol.id ? null : rol)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 44,
                          height: 44,
                          bgcolor: `${rol.color}18`,
                          color: rol.color,
                        }}
                      >
                        <ShieldOutlinedIcon />
                      </Avatar>
                      <Tooltip title="Editar rol">
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); handleOpenEdit(rol) }}
                          sx={{ color: 'text.secondary' }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Typography variant="h4" sx={{ mb: 0.5 }}>{rol.nombre}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {rol.descripcion}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PeopleOutlineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {rol.usuarios} usuario{rol.usuarios !== 1 ? 's' : ''}
                      </Typography>
                      <Chip
                        label={`${Object.values(rol.permisos).filter(Boolean).length} permisos`}
                        size="small"
                        sx={{
                          ml: 'auto',
                          fontSize: 11,
                          height: 20,
                          fontWeight: 700,
                          backgroundColor: `${rol.color}15`,
                          color: rol.color,
                          border: 'none',
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Panel detalle del rol seleccionado */}
        {selectedRol && (
          <Grid item xs={12} md={7}>
            <Card sx={{ position: 'sticky', top: 16 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h3">{selectedRol.nombre}</Typography>
                    <Typography variant="body2" color="text.secondary">{selectedRol.descripcion}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditOutlinedIcon />}
                      onClick={() => handleOpenEdit(selectedRol)}
                    >
                      Editar
                    </Button>
                    <IconButton size="small" onClick={() => setSelectedRol(null)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Divider sx={{ mb: 2.5 }} />

                {/* Preview menú */}
                <Box sx={{ mb: 2.5 }}>
                  <MenuPreview permisos={selectedRol.permisos} />
                </Box>

                <Divider sx={{ mb: 2.5 }} />

                {/* Matriz de permisos (solo lectura en vista) */}
                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1.5, display: 'block' }}>
                  Matriz de Permisos
                </Typography>
                <PermisoMatrix
                  permisos={selectedRol.permisos}
                  onChange={() => {}}
                  readOnly
                />
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Dialog crear/editar */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h3">{isNew ? 'Nuevo Rol' : `Editar: ${editingRol.nombre}`}</Typography>
          <IconButton size="small" onClick={() => setDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {/* Datos básicos */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Nombre del Rol"
                fullWidth
                value={editingRol.nombre ?? ''}
                onChange={(e) => setEditingRol((p) => ({ ...p, nombre: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                  Color del rol
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {COLORES.map((c) => (
                    <Box
                      key={c}
                      onClick={() => setEditingRol((p) => ({ ...p, color: c }))}
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: c,
                        cursor: 'pointer',
                        border: editingRol.color === c ? `3px solid white` : '3px solid transparent',
                        outline: editingRol.color === c ? `2px solid ${c}` : 'none',
                        transition: 'all 0.15s',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                fullWidth
                multiline
                rows={2}
                value={editingRol.descripcion ?? ''}
                onChange={(e) => setEditingRol((p) => ({ ...p, descripcion: e.target.value }))}
              />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2.5 }} />

          <Typography variant="h4" sx={{ mb: 1.5 }}>Permisos</Typography>

          <PermisoMatrix
            permisos={editingRol.permisos ?? {}}
            onChange={(p) => setEditingRol((prev) => ({ ...prev, permisos: p }))}
          />

          <Divider sx={{ mt: 2.5, mb: 2 }} />

          <Typography variant="h4" sx={{ mb: 1 }}>Preview del Menú</Typography>
          <MenuPreview permisos={editingRol.permisos ?? {}} />
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button variant="outlined" onClick={() => setDialogOpen(false)}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSave}>
            {isNew ? 'Crear Rol' : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
