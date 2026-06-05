import { useState } from 'react'
import {
  Box, Card, CardContent, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Tooltip, Button, Chip, Typography, Badge
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { useAppSelector, useAppDispatch } from '../../store'
import { addItem, updateItem, deleteItem } from '../../store/slices/inventarioSlice'
import { PageHeader } from '../../shared/components/PageHeader'
import { SearchBar } from '../../shared/components/SearchBar'
import { usePermissions } from '../../shared/hooks/usePermissions'
import { ItemInventario } from './types/inventario.types'
import { InventarioFormDialog } from './components/InventarioFormDialog'
import { ConfirmDialog } from '../../shared/components/ConfirmDialog'
import { generateId, formatMoneda } from '../../shared/utils/formatters'
import toast from 'react-hot-toast'

export function InventarioPage() {
  const dispatch = useAppDispatch()
  const { can } = usePermissions()
  const items = useAppSelector((s) => s.inventario.items)
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<ItemInventario | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = items.filter((i) =>
    search === '' || [i.codigo, i.descripcion, i.categoria, i.proveedor].some(
      (f) => f.toLowerCase().includes(search.toLowerCase())
    )
  )

  const stockBajoCount = items.filter((i) => i.cantidad <= i.stockMinimo).length

  const handleSave = (data: Omit<ItemInventario, 'id' | 'fechaActualizacion'>) => {
    if (editItem) {
      dispatch(updateItem({ ...data, id: editItem.id, fechaActualizacion: new Date().toISOString().slice(0, 10) }))
      toast.success('Item actualizado')
    } else {
      dispatch(addItem({ ...data, id: generateId(), fechaActualizacion: new Date().toISOString().slice(0, 10) }))
      toast.success('Item agregado al inventario')
    }
    setFormOpen(false)
    setEditItem(null)
  }

  return (
    <Box>
      <PageHeader
        title="Inventario"
        subtitle={`${filtered.length} items`}
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            {stockBajoCount > 0 && (
              <Chip icon={<WarningAmberIcon />} label={`${stockBajoCount} Stock Bajo`} color="warning" variant="outlined" />
            )}
            {can('inventario_write') && (
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditItem(null); setFormOpen(true) }}>
                Agregar Item
              </Button>
            )}
          </Box>
        }
      />

      <Card>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Código, descripción, categoría..." />
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell align="center">Cantidad</TableCell>
                  <TableCell align="center">Mínimo</TableCell>
                  <TableCell>Ubicación</TableCell>
                  <TableCell>Proveedor</TableCell>
                  <TableCell align="right">Precio</TableCell>
                  {can('inventario_write') && <TableCell align="center">Acciones</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((item) => {
                  const stockBajo = item.cantidad <= item.stockMinimo
                  return (
                    <TableRow key={item.id} hover sx={stockBajo ? { backgroundColor: 'error.light' + '10' } : {}}>
                      <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>{item.codigo}</TableCell>
                      <TableCell>{item.descripcion}</TableCell>
                      <TableCell>
                        <Chip label={item.categoria} size="small" variant="outlined" sx={{ fontSize: 11 }} />
                      </TableCell>
                      <TableCell align="center">
                        {stockBajo ? (
                          <Badge badgeContent={<WarningAmberIcon sx={{ fontSize: 10 }} />} color="warning">
                            <Typography variant="body2" fontWeight={700} color="error.main">{item.cantidad}</Typography>
                          </Badge>
                        ) : (
                          <Typography variant="body2" fontWeight={600}>{item.cantidad}</Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">{item.stockMinimo}</Typography>
                      </TableCell>
                      <TableCell>{item.ubicacion}</TableCell>
                      <TableCell>{item.proveedor}</TableCell>
                      <TableCell align="right">{formatMoneda(item.precioUnitario)}</TableCell>
                      {can('inventario_write') && (
                        <TableCell align="center">
                          <Tooltip title="Editar">
                            <IconButton size="small" onClick={() => { setEditItem(item); setFormOpen(true) }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton size="small" color="error" onClick={() => setDeleteId(item.id)}>
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
                    <TableCell colSpan={9} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No se encontraron items
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <InventarioFormDialog
        open={formOpen}
        item={editItem}
        onClose={() => { setFormOpen(false); setEditItem(null) }}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Eliminar Item"
        message="Esta acción no se puede deshacer."
        onConfirm={() => {
          if (deleteId) { dispatch(deleteItem(deleteId)); toast.success('Item eliminado') }
          setDeleteId(null)
        }}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  )
}
