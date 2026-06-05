import { useState } from 'react'
import {
  Box, Card, CardContent, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Tooltip, Button, Chip, Switch, Typography
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import { useAppSelector, useAppDispatch } from '../../store'
import { addServicio, updateServicio, deleteServicio, toggleServicioActivo } from '../../store/slices/serviciosSlice'
import { PageHeader } from '../../shared/components/PageHeader'
import { SearchBar } from '../../shared/components/SearchBar'
import { usePermissions } from '../../shared/hooks/usePermissions'
import { Servicio } from './types/servicio.types'
import { ServicioFormDialog } from './components/ServicioFormDialog'
import { ConfirmDialog } from '../../shared/components/ConfirmDialog'
import { generateId, formatMoneda } from '../../shared/utils/formatters'
import toast from 'react-hot-toast'

export function ServiciosPage() {
  const dispatch = useAppDispatch()
  const { can } = usePermissions()
  const servicios = useAppSelector((s) => s.servicios.servicios)
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editServicio, setEditServicio] = useState<Servicio | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = servicios.filter((s) =>
    search === '' || [s.clave, s.descripcion, s.agrupacionNombre].some(
      (f) => f.toLowerCase().includes(search.toLowerCase())
    )
  )

  const handleSave = (data: Omit<Servicio, 'id' | 'fechaCreacion'>) => {
    if (editServicio) {
      dispatch(updateServicio({ ...data, id: editServicio.id, fechaCreacion: editServicio.fechaCreacion }))
      toast.success('Servicio actualizado')
    } else {
      dispatch(addServicio({ ...data, id: generateId(), fechaCreacion: new Date().toISOString().slice(0, 10) }))
      toast.success('Servicio creado')
    }
    setFormOpen(false)
    setEditServicio(null)
  }

  return (
    <Box>
      <PageHeader
        title="Catálogo de Servicios"
        subtitle={`${filtered.length} servicios`}
        actions={
          can('servicios_write') ? (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditServicio(null); setFormOpen(true) }}>
              Nuevo Servicio
            </Button>
          ) : undefined
        }
      />

      <Card>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Clave, descripción, agrupación..." />
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Clave</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Agrupación</TableCell>
                  <TableCell>Unidad</TableCell>
                  <TableCell align="right">Precio Venta</TableCell>
                  <TableCell align="right">Precio Anterior</TableCell>
                  <TableCell align="center">Activo</TableCell>
                  {can('servicios_write') && <TableCell align="center">Acciones</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((s) => {
                  const subio = s.precioAnterior && s.precioVenta > s.precioAnterior
                  const bajo = s.precioAnterior && s.precioVenta < s.precioAnterior
                  return (
                    <TableRow key={s.id} hover>
                      <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>{s.clave}</TableCell>
                      <TableCell>{s.descripcion}</TableCell>
                      <TableCell>
                        <Chip label={s.agrupacionNombre} size="small" variant="outlined" sx={{ fontSize: 11 }} />
                      </TableCell>
                      <TableCell>{s.unidad}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                          {subio && <TrendingUpIcon fontSize="small" color="error" />}
                          {bajo && <TrendingDownIcon fontSize="small" color="success" />}
                          <Typography variant="body2" fontWeight={700}>{formatMoneda(s.precioVenta)}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="text.secondary">
                          {s.precioAnterior ? formatMoneda(s.precioAnterior) : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={s.activo}
                          onChange={() => { dispatch(toggleServicioActivo(s.id)); toast.success('Estado actualizado') }}
                          size="small"
                          disabled={!can('servicios_write')}
                        />
                      </TableCell>
                      {can('servicios_write') && (
                        <TableCell align="center">
                          <Tooltip title="Editar">
                            <IconButton size="small" onClick={() => { setEditServicio(s); setFormOpen(true) }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton size="small" color="error" onClick={() => setDeleteId(s.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No se encontraron servicios
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <ServicioFormDialog
        open={formOpen}
        servicio={editServicio}
        onClose={() => { setFormOpen(false); setEditServicio(null) }}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Eliminar Servicio"
        message="Esta acción eliminará el servicio del catálogo."
        onConfirm={() => { if (deleteId) { dispatch(deleteServicio(deleteId)); toast.success('Servicio eliminado') } setDeleteId(null) }}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  )
}
