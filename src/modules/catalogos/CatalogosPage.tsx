import { useState } from 'react'
import {
  Box, Card, CardContent, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Tooltip, Button, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAppSelector, useAppDispatch } from '../../store'
import { addAgrupacion, updateAgrupacion, deleteAgrupacion } from '../../store/slices/catalogosSlice'
import { PageHeader } from '../../shared/components/PageHeader'
import { usePermissions } from '../../shared/hooks/usePermissions'
import { AgrupacionFacturacion } from './types/catalogo.types'
import { ConfirmDialog } from '../../shared/components/ConfirmDialog'
import { generateId, formatFecha } from '../../shared/utils/formatters'
import toast from 'react-hot-toast'

export function CatalogosPage() {
  const dispatch = useAppDispatch()
  const { can } = usePermissions()
  const agrupaciones = useAppSelector((s) => s.catalogos.agrupaciones)
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<AgrupacionFacturacion | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ clave: '', nombre: '', descripcion: '' })

  const openCreate = () => { setEditItem(null); setForm({ clave: '', nombre: '', descripcion: '' }); setFormOpen(true) }
  const openEdit = (a: AgrupacionFacturacion) => { setEditItem(a); setForm({ clave: a.clave, nombre: a.nombre, descripcion: a.descripcion ?? '' }); setFormOpen(true) }

  const handleSave = () => {
    if (editItem) {
      dispatch(updateAgrupacion({ ...editItem, ...form }))
      toast.success('Agrupación actualizada')
    } else {
      dispatch(addAgrupacion({ id: generateId(), ...form, fechaCreacion: new Date().toISOString().slice(0, 10) }))
      toast.success('Agrupación creada')
    }
    setFormOpen(false)
  }

  return (
    <Box>
      <PageHeader
        title="Catálogos"
        subtitle="Agrupaciones de Facturación"
        actions={
          can('catalogos_write') ? (
            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
              Nueva Agrupación
            </Button>
          ) : undefined
        }
      />

      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>Agrupaciones de Facturación</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Clave</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Fecha Creación</TableCell>
                  {can('catalogos_write') && <TableCell align="center">Acciones</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {agrupaciones.map((ag) => (
                  <TableRow key={ag.id} hover>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontFamily: 'monospace' }}>{ag.clave}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{ag.nombre}</TableCell>
                    <TableCell>{ag.descripcion ?? '-'}</TableCell>
                    <TableCell>{formatFecha(ag.fechaCreacion)}</TableCell>
                    {can('catalogos_write') && (
                      <TableCell align="center">
                        <Tooltip title="Editar">
                          <IconButton size="small" onClick={() => openEdit(ag)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton size="small" color="error" onClick={() => setDeleteId(ag.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{editItem ? 'Editar Agrupación' : 'Nueva Agrupación'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={4}>
              <TextField label="Clave" value={form.clave} onChange={(e) => setForm((p) => ({ ...p, clave: e.target.value }))} fullWidth required />
            </Grid>
            <Grid item xs={8}>
              <TextField label="Nombre" value={form.nombre} onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))} fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Descripción" value={form.descripcion} onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))} fullWidth multiline rows={2} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setFormOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.clave || !form.nombre}>
            {editItem ? 'Guardar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Eliminar Agrupación"
        message="Esta acción eliminará la agrupación. Los servicios asociados quedarán sin agrupación."
        onConfirm={() => { if (deleteId) { dispatch(deleteAgrupacion(deleteId)); toast.success('Agrupación eliminada') } setDeleteId(null) }}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  )
}
