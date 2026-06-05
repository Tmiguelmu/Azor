import { useState } from 'react'
import {
  Box, Card, CardContent, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Tooltip, Button, Chip, Switch, Typography
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAppSelector, useAppDispatch } from '../../store'
import { addCliente, updateCliente, deleteCliente, toggleClienteActivo } from '../../store/slices/clientesSlice'
import { PageHeader } from '../../shared/components/PageHeader'
import { SearchBar } from '../../shared/components/SearchBar'
import { usePermissions } from '../../shared/hooks/usePermissions'
import { Cliente } from './types/cliente.types'
import { ClienteFormDialog } from './components/ClienteFormDialog'
import { ConfirmDialog } from '../../shared/components/ConfirmDialog'
import { generateId } from '../../shared/utils/formatters'
import toast from 'react-hot-toast'

export function ClientesPage() {
  const dispatch = useAppDispatch()
  const { can } = usePermissions()
  const clientes = useAppSelector((s) => s.clientes.clientes)
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editCliente, setEditCliente] = useState<Cliente | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = clientes.filter((c) =>
    search === '' || [c.clave, c.nombre, c.rfc, c.ciudad, c.contacto].some(
      (f) => f.toLowerCase().includes(search.toLowerCase())
    )
  )

  const handleSave = (data: Omit<Cliente, 'id' | 'fechaCreacion'>) => {
    if (editCliente) {
      dispatch(updateCliente({ ...data, id: editCliente.id, fechaCreacion: editCliente.fechaCreacion }))
      toast.success('Cliente actualizado')
    } else {
      dispatch(addCliente({ ...data, id: generateId(), fechaCreacion: new Date().toISOString().slice(0, 10) }))
      toast.success('Cliente creado')
    }
    setFormOpen(false)
    setEditCliente(null)
  }

  return (
    <Box>
      <PageHeader
        title="Catálogo de Clientes"
        subtitle={`${filtered.length} clientes`}
        actions={
          can('clientes_write') ? (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditCliente(null); setFormOpen(true) }}>
              Nuevo Cliente
            </Button>
          ) : undefined
        }
      />

      <Card>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Clave, nombre, RFC..." />
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Clave</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>RFC</TableCell>
                  <TableCell>Ciudad</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Contacto</TableCell>
                  <TableCell align="center">Activo</TableCell>
                  {can('clientes_write') && <TableCell align="center">Acciones</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((cliente) => (
                  <TableRow key={cliente.id} hover>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>{cliente.clave}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{cliente.nombre}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace' }}>{cliente.rfc}</TableCell>
                    <TableCell>{cliente.ciudad}</TableCell>
                    <TableCell>{cliente.estado}</TableCell>
                    <TableCell>{cliente.telefono}</TableCell>
                    <TableCell>{cliente.contacto}</TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={cliente.activo}
                        onChange={() => { dispatch(toggleClienteActivo(cliente.id)); toast.success('Estado actualizado') }}
                        size="small"
                        disabled={!can('clientes_write')}
                      />
                    </TableCell>
                    {can('clientes_write') && (
                      <TableCell align="center">
                        <Tooltip title="Editar">
                          <IconButton size="small" onClick={() => { setEditCliente(cliente); setFormOpen(true) }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton size="small" color="error" onClick={() => setDeleteId(cliente.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No se encontraron clientes
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <ClienteFormDialog
        open={formOpen}
        cliente={editCliente}
        onClose={() => { setFormOpen(false); setEditCliente(null) }}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Eliminar Cliente"
        message="Esta acción eliminará el cliente del catálogo."
        onConfirm={() => { if (deleteId) { dispatch(deleteCliente(deleteId)); toast.success('Cliente eliminado') } setDeleteId(null) }}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  )
}
