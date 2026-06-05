import { useState } from 'react'
import {
  Box, Card, CardContent, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Typography, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid, TextField, FormControl, InputLabel, Select, MenuItem
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { useAppSelector, useAppDispatch } from '../../store'
import { addMovimiento, updateItem } from '../../store/slices/inventarioSlice'
import { PageHeader } from '../../shared/components/PageHeader'
import { SearchBar } from '../../shared/components/SearchBar'
import { formatFechaHora, generateId } from '../../shared/utils/formatters'
import { usePermissions } from '../../shared/hooks/usePermissions'
import { MovimientoInventario } from './types/inventario.types'
import toast from 'react-hot-toast'
import { useAuth } from '../../core/auth/AuthContext'

export function MovimientosPage() {
  const dispatch = useAppDispatch()
  const { can } = usePermissions()
  const { user } = useAuth()
  const movimientos = useAppSelector((s) => s.inventario.movimientos)
  const items = useAppSelector((s) => s.inventario.items)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ itemId: '', tipo: 'entrada' as 'entrada' | 'salida', cantidad: 1, motivo: '' })

  const filtered = movimientos.filter((m) =>
    search === '' || [m.itemCodigo, m.itemDescripcion, m.motivo].some(
      (f) => f.toLowerCase().includes(search.toLowerCase())
    )
  )

  const handleSave = () => {
    const item = items.find((i) => i.id === form.itemId)
    if (!item) return
    const saldoAnterior = item.cantidad
    const saldoNuevo = form.tipo === 'entrada' ? saldoAnterior + form.cantidad : saldoAnterior - form.cantidad
    const mov: MovimientoInventario = {
      id: generateId(), itemId: form.itemId, itemCodigo: item.codigo, itemDescripcion: item.descripcion,
      tipo: form.tipo, cantidad: form.cantidad, motivo: form.motivo,
      realizadoPor: user?.nombre ?? 'Sistema',
      fecha: new Date().toISOString(),
      saldoAnterior, saldoNuevo,
    }
    dispatch(addMovimiento(mov))
    dispatch(updateItem({ ...item, cantidad: saldoNuevo, fechaActualizacion: new Date().toISOString().slice(0, 10) }))
    setDialogOpen(false)
    setForm({ itemId: '', tipo: 'entrada', cantidad: 1, motivo: '' })
    toast.success(`Movimiento de ${form.tipo} registrado`)
  }

  return (
    <Box>
      <PageHeader
        title="Movimientos de Inventario"
        subtitle={`${filtered.length} movimientos`}
        breadcrumbs={[{ label: 'Inventario', path: '/inventario' }, { label: 'Movimientos' }]}
        actions={
          can('inventario_write') ? (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
              Registrar Movimiento
            </Button>
          ) : undefined
        }
      />

      <Card>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Código, descripción, motivo..." />
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell align="center">Cantidad</TableCell>
                  <TableCell>Motivo</TableCell>
                  <TableCell>Orden</TableCell>
                  <TableCell>Realizado por</TableCell>
                  <TableCell align="center">Saldo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((mov) => (
                  <TableRow key={mov.id} hover>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatFechaHora(mov.fecha)}</TableCell>
                    <TableCell>
                      <Chip
                        icon={mov.tipo === 'entrada' ? <ArrowUpwardIcon sx={{ fontSize: '14px !important' }} /> : <ArrowDownwardIcon sx={{ fontSize: '14px !important' }} />}
                        label={mov.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                        size="small"
                        color={mov.tipo === 'entrada' ? 'success' : 'error'}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>{mov.itemCodigo}</TableCell>
                    <TableCell>{mov.itemDescripcion}</TableCell>
                    <TableCell align="center">
                      <Typography fontWeight={700} color={mov.tipo === 'entrada' ? 'success.main' : 'error.main'}>
                        {mov.tipo === 'entrada' ? '+' : '-'}{mov.cantidad}
                      </Typography>
                    </TableCell>
                    <TableCell>{mov.motivo}</TableCell>
                    <TableCell>{mov.ordenFolio ?? '-'}</TableCell>
                    <TableCell>{mov.realizadoPor}</TableCell>
                    <TableCell align="center">
                      <Typography variant="caption" color="text.secondary">{mov.saldoAnterior} → </Typography>
                      <Typography variant="caption" fontWeight={700}>{mov.saldoNuevo}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No se encontraron movimientos
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>Registrar Movimiento</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Item de Inventario</InputLabel>
                <Select value={form.itemId} onChange={(e) => setForm((p) => ({ ...p, itemId: e.target.value }))} label="Item de Inventario">
                  {items.map((i) => (
                    <MenuItem key={i.id} value={i.id}>{i.codigo} - {i.descripcion} (Stock: {i.cantidad})</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo</InputLabel>
                <Select value={form.tipo} onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value as 'entrada' | 'salida' }))} label="Tipo">
                  <MenuItem value="entrada">Entrada</MenuItem>
                  <MenuItem value="salida">Salida</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField label="Cantidad" type="number" value={form.cantidad} onChange={(e) => setForm((p) => ({ ...p, cantidad: Number(e.target.value) }))} fullWidth required inputProps={{ min: 1 }} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Motivo / Referencia" value={form.motivo} onChange={(e) => setForm((p) => ({ ...p, motivo: e.target.value }))} fullWidth required />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.itemId || !form.motivo || form.cantidad < 1}>
            Registrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
