import { useState } from 'react'
import {
  Box, Card, CardContent, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Tooltip, Button, Switch, Avatar, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, MenuItem
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import { useAppSelector, useAppDispatch } from '../../store'
import { addUsuario, updateUsuario, toggleUsuarioActivo } from '../../store/slices/usuariosSlice'
import { PageHeader } from '../../shared/components/PageHeader'
import { SearchBar } from '../../shared/components/SearchBar'
import { usePermissions } from '../../shared/hooks/usePermissions'
import { Usuario } from './types/usuario.types'
import { getRolLabel } from '../../shared/utils/rolLabels'
import { UserRole } from '../../shared/types/auth.types'
import { generateId, formatFecha, formatFechaHora } from '../../shared/utils/formatters'
import toast from 'react-hot-toast'

const ROLES: UserRole[] = ['admin', 'gerencia', 'ingenieria', 'inspector', 'mecanico', 'mecanico_certificado', 'almacen']

export function UsuariosPage() {
  const dispatch = useAppDispatch()
  const { can } = usePermissions()
  const usuarios = useAppSelector((s) => s.usuarios.usuarios)
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editUsuario, setEditUsuario] = useState<Usuario | null>(null)
  const [form, setForm] = useState({ nombre: '', email: '', rol: 'mecanico' as UserRole, telefono: '', activo: true })

  const filtered = usuarios.filter((u) =>
    search === '' || [u.nombre, u.email, getRolLabel(u.rol)].some(
      (f) => f.toLowerCase().includes(search.toLowerCase())
    )
  )

  const openCreate = () => { setEditUsuario(null); setForm({ nombre: '', email: '', rol: 'mecanico', telefono: '', activo: true }); setFormOpen(true) }
  const openEdit = (u: Usuario) => { setEditUsuario(u); setForm({ nombre: u.nombre, email: u.email, rol: u.rol, telefono: u.telefono ?? '', activo: u.activo }); setFormOpen(true) }

  const handleSave = () => {
    if (editUsuario) {
      dispatch(updateUsuario({ ...editUsuario, ...form }))
      toast.success('Usuario actualizado')
    } else {
      dispatch(addUsuario({ ...form, id: generateId(), fechaCreacion: new Date().toISOString().slice(0, 10) }))
      toast.success('Usuario creado')
    }
    setFormOpen(false)
  }

  return (
    <Box>
      <PageHeader
        title="Gestión de Usuarios"
        subtitle={`${filtered.length} usuarios`}
        actions={
          can('usuarios_write') ? (
            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
              Nuevo Usuario
            </Button>
          ) : undefined
        }
      />

      <Card>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Nombre, email, rol..." />
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Último Acceso</TableCell>
                  <TableCell align="center">Activo</TableCell>
                  {can('usuarios_write') && <TableCell align="center">Acciones</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((u) => {
                  const initials = u.nombre.split(' ').map((n) => n[0]).slice(0, 2).join('')
                  return (
                    <TableRow key={u.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: 'primary.main' }}>{initials}</Avatar>
                          <Typography variant="body2" fontWeight={600}>{u.nombre}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{getRolLabel(u.rol)}</TableCell>
                      <TableCell>{u.telefono ?? '-'}</TableCell>
                      <TableCell>{u.ultimoAcceso ? formatFechaHora(u.ultimoAcceso) : 'Nunca'}</TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={u.activo}
                          onChange={() => { dispatch(toggleUsuarioActivo(u.id)); toast.success('Estado actualizado') }}
                          size="small"
                          disabled={!can('usuarios_write')}
                        />
                      </TableCell>
                      {can('usuarios_write') && (
                        <TableCell align="center">
                          <Tooltip title="Editar">
                            <IconButton size="small" onClick={() => openEdit(u)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>No se encontraron usuarios</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{editUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}><TextField label="Nombre completo" value={form.nombre} onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))} fullWidth required /></Grid>
            <Grid item xs={6}><TextField label="Email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} fullWidth required /></Grid>
            <Grid item xs={6}><TextField label="Teléfono" value={form.telefono} onChange={(e) => setForm((p) => ({ ...p, telefono: e.target.value }))} fullWidth /></Grid>
            <Grid item xs={12}>
              <TextField select label="Rol" value={form.rol} onChange={(e) => setForm((p) => ({ ...p, rol: e.target.value as UserRole }))} fullWidth>
                {ROLES.map((r) => <MenuItem key={r} value={r}>{getRolLabel(r)}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setFormOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.nombre || !form.email}>
            {editUsuario ? 'Guardar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
