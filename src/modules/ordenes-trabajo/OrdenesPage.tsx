import { useState } from 'react'
import {
  Box, Button, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton, Tooltip,
  Select, MenuItem, FormControl, InputLabel, Typography, ToggleButtonGroup,
  ToggleButton, Grid, LinearProgress, Avatar, Divider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined'
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import FlightIcon from '@mui/icons-material/Flight'
import { useAppSelector, useAppDispatch } from '../../store'
import { addOrden, updateOrden } from '../../store/slices/ordenesSlice'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../shared/components/PageHeader'
import { SearchBar } from '../../shared/components/SearchBar'
import { StatusBadge } from '../../shared/components/StatusBadge'
import { formatFecha, generateId } from '../../shared/utils/formatters'
import { usePermissions } from '../../shared/hooks/usePermissions'
import { OrdenTrabajo, CreateOrdenDto } from './types/orden.types'
import { EstadoOrden } from '../../shared/types/common.types'
import { OrdenFormDialog } from './components/OrdenFormDialog'
import toast from 'react-hot-toast'
import { useTheme } from '@mui/material'

type Vista = 'tabla' | 'kanban' | 'cards'

const ESTADOS: { key: EstadoOrden; label: string; color: string; bg: string }[] = [
  { key: 'activa',      label: 'Activa',      color: '#0EA5E9', bg: 'rgba(14,165,233,0.08)' },
  { key: 'en_proceso',  label: 'En Proceso',  color: '#D97706', bg: 'rgba(217,119,6,0.08)' },
  { key: 'terminada',   label: 'Terminada',   color: '#059669', bg: 'rgba(5,150,105,0.08)' },
  { key: 'pre_factura', label: 'Pre-Factura', color: '#7C3AED', bg: 'rgba(124,58,237,0.08)' },
  { key: 'cancelada',   label: 'Cancelada',   color: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
]

function getEstadoMeta(estado: string) {
  return ESTADOS.find((e) => e.key === estado) ?? ESTADOS[0]
}

/** Card de OT para vista grid y kanban */
function OrdenCard({ orden, onClick, onEdit, canEdit }: {
  orden: OrdenTrabajo
  onClick: () => void
  onEdit?: () => void
  canEdit: boolean
}) {
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'
  const meta = getEstadoMeta(orden.estado)

  // Calcular progreso aproximado segun estado
  const progressMap: Record<string, number> = {
    activa: 10, en_proceso: 55, terminada: 100, pre_factura: 90, cancelada: 0,
  }
  const progress = progressMap[orden.estado] ?? 0

  return (
    <Card
      sx={{
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'translateY(-3px)' },
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      {/* Header con gradiente */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${meta.color}18 0%, ${meta.color}08 100%)`,
          borderBottom: `2px solid ${meta.color}30`,
          px: 2.5,
          pt: 2,
          pb: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Chip
            label={orden.folio}
            size="small"
            sx={{ fontWeight: 800, fontSize: 11, backgroundColor: meta.bg, color: meta.color, border: 'none' }}
          />
          <Chip
            label={orden.prioridad}
            size="small"
            sx={{
              fontSize: 11,
              fontWeight: 600,
              backgroundColor: orden.prioridad === 'urgente' ? 'rgba(220,38,38,0.1)' : 'rgba(100,116,139,0.1)',
              color: orden.prioridad === 'urgente' ? '#DC2626' : '#64748B',
              border: 'none',
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: meta.bg, color: meta.color }}>
            <FlightIcon sx={{ fontSize: 16 }} />
          </Avatar>
          <Typography variant="h3" sx={{ color: 'text.primary' }}>
            {orden.matricula}
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ pt: 1.75 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={500}>
          {orden.marca} {orden.modelo}
        </Typography>
        <Typography variant="body2" fontWeight={600} sx={{ mt: 0.25, mb: 1.25 }} noWrap>
          {orden.clienteNombre}
        </Typography>

        {/* Progress */}
        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">Progreso</Typography>
            <Typography variant="caption" fontWeight={700} sx={{ color: meta.color }}>
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 5,
              borderRadius: 3,
              backgroundColor: isLight ? '#F1F5F9' : '#0F172A',
              '& .MuiLinearProgress-bar': { backgroundColor: meta.color, borderRadius: 3 },
            }}
          />
        </Box>

        <Divider sx={{ mb: 1.5 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {formatFecha(orden.fechaActualizacion)}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Ver detalle">
              <IconButton size="small" color="primary" onClick={onClick} sx={{ width: 30, height: 30 }}>
                <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            {canEdit && onEdit && (
              <Tooltip title="Editar">
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit() }} sx={{ width: 30, height: 30 }}>
                  <EditOutlinedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

/** Columna Kanban */
function KanbanColumn({ estado, ordenes, onView, onEdit, canEdit }: {
  estado: typeof ESTADOS[number]
  ordenes: OrdenTrabajo[]
  onView: (o: OrdenTrabajo) => void
  onEdit: (o: OrdenTrabajo) => void
  canEdit: boolean
}) {
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'
  return (
    <Box
      sx={{
        minWidth: 280,
        maxWidth: 300,
        flexShrink: 0,
        backgroundColor: isLight ? '#F8FAFC' : 'rgba(30,41,59,0.5)',
        borderRadius: '16px',
        p: 1.5,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Header columna */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, px: 0.5 }}>
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: estado.color, flexShrink: 0 }} />
        <Typography variant="subtitle2" fontWeight={700}>
          {estado.label}
        </Typography>
        <Chip
          label={ordenes.length}
          size="small"
          sx={{ ml: 'auto', height: 20, fontSize: 11, fontWeight: 700, backgroundColor: estado.bg, color: estado.color, border: 'none' }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {ordenes.map((orden) => (
          <OrdenCard
            key={orden.id}
            orden={orden}
            onClick={() => onView(orden)}
            onEdit={() => onEdit(orden)}
            canEdit={canEdit}
          />
        ))}
        {ordenes.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="caption" color="text.disabled">Sin órdenes</Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export function OrdenesPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { can } = usePermissions()
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'
  const ordenes = useAppSelector((s) => s.ordenes.ordenes)
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [vista, setVista] = useState<Vista>('kanban')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editOrden, setEditOrden] = useState<OrdenTrabajo | null>(null)

  const filtered = ordenes.filter((o) => {
    const matchSearch = search === '' || [o.folio, o.clienteNombre, o.matricula, o.modelo].some(
      (f) => f.toLowerCase().includes(search.toLowerCase())
    )
    const matchEstado = filtroEstado === 'todos' || o.estado === filtroEstado
    return matchSearch && matchEstado
  })

  const handleCreate = (data: CreateOrdenDto) => {
    const nueva: OrdenTrabajo = {
      ...data,
      id: generateId(),
      folio: `OT-${String(ordenes.length + 1).padStart(4, '0')}`,
      clienteNombre: '',
      estado: 'activa',
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      creadoPor: 'Usuario actual',
      motor2Hrs: data.motor2Hrs,
      ciclos2: undefined,
      ciclos3: undefined,
      ciclos4: undefined,
    }
    dispatch(addOrden(nueva))
    setDialogOpen(false)
    toast.success('Orden de trabajo creada exitosamente')
  }

  const handleView = (orden: OrdenTrabajo) => navigate(`/ordenes/${orden.id}`)
  const handleEdit = (orden: OrdenTrabajo) => { setEditOrden(orden); setDialogOpen(true) }

  return (
    <Box className="fade-in">
      <PageHeader
        title="Órdenes de Trabajo"
        subtitle={`${filtered.length} órdenes encontradas`}
        actions={
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            {/* Toggle vista */}
            <ToggleButtonGroup
              value={vista}
              exclusive
              onChange={(_, v) => { if (v) setVista(v) }}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '8px !important',
                  px: 1.5,
                  py: 0.75,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(37,99,235,0.08)',
                    color: '#2563EB',
                  },
                },
              }}
            >
              <ToggleButton value="kanban"><ViewKanbanOutlinedIcon fontSize="small" /></ToggleButton>
              <ToggleButton value="cards"><GridViewOutlinedIcon fontSize="small" /></ToggleButton>
              <ToggleButton value="tabla"><TableRowsOutlinedIcon fontSize="small" /></ToggleButton>
            </ToggleButtonGroup>

            {can('ordenes_write') && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => { setEditOrden(null); setDialogOpen(true) }}
              >
                Nueva Orden
              </Button>
            )}
          </Box>
        }
      />

      {/* Filtros */}
      <Card sx={{ mb: 2.5 }}>
        <CardContent sx={{ py: '16px !important' }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Folio, matrícula, cliente..." />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Estado</InputLabel>
              <Select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} label="Estado">
                <MenuItem value="todos">Todos los estados</MenuItem>
                {ESTADOS.map((e) => (
                  <MenuItem key={e.key} value={e.key}>{e.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Vista Kanban */}
      {vista === 'kanban' && (
        <Box sx={{ overflowX: 'auto', pb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, minWidth: 'max-content' }}>
            {ESTADOS.map((estado) => (
              <KanbanColumn
                key={estado.key}
                estado={estado}
                ordenes={filtered.filter((o) => o.estado === estado.key)}
                onView={handleView}
                onEdit={handleEdit}
                canEdit={can('ordenes_write')}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Vista Cards */}
      {vista === 'cards' && (
        <Grid container spacing={2.5}>
          {filtered.map((orden) => (
            <Grid item xs={12} sm={6} lg={4} xl={3} key={orden.id}>
              <OrdenCard
                orden={orden}
                onClick={() => handleView(orden)}
                onEdit={() => handleEdit(orden)}
                canEdit={can('ordenes_write')}
              />
            </Grid>
          ))}
          {filtered.length === 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 5 }}>
                  <Typography color="text.secondary">No se encontraron órdenes</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {/* Vista Tabla */}
      {vista === 'tabla' && (
        <Card>
          <CardContent sx={{ p: '0 !important' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Folio</TableCell>
                    <TableCell>Matrícula</TableCell>
                    <TableCell>Aeronave</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Prioridad</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((orden) => {
                    const meta = getEstadoMeta(orden.estado)
                    return (
                      <TableRow
                        key={orden.id}
                        hover
                        sx={{ cursor: 'pointer', '&:hover td': { backgroundColor: isLight ? '#F8FAFC' : 'rgba(241,245,249,0.02)' } }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={700} color="primary.main">
                            {orden.folio}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{orden.matricula}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{orden.marca} {orden.modelo}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{orden.clienteNombre}</Typography>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={orden.estado as EstadoOrden} type="orden" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={orden.prioridad}
                            size="small"
                            sx={{
                              fontSize: 11,
                              fontWeight: 600,
                              backgroundColor: orden.prioridad === 'urgente' ? 'rgba(220,38,38,0.1)' : 'rgba(100,116,139,0.1)',
                              color: orden.prioridad === 'urgente' ? '#DC2626' : '#64748B',
                              border: 'none',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatFecha(orden.fechaCreacion)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Ver detalle">
                            <IconButton size="small" color="primary" onClick={() => handleView(orden)}>
                              <VisibilityOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {can('ordenes_write') && (
                            <Tooltip title="Editar">
                              <IconButton size="small" onClick={() => handleEdit(orden)}>
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                        No se encontraron órdenes con los filtros aplicados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      <OrdenFormDialog
        open={dialogOpen}
        orden={editOrden}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreate}
        onUpdate={(data) => {
          dispatch(updateOrden(data))
          setDialogOpen(false)
          toast.success('Orden actualizada')
        }}
      />
    </Box>
  )
}
