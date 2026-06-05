import { useState } from 'react'
import {
  Box, Card, CardContent, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Tooltip, Button, Chip,
  Select, MenuItem, FormControl, InputLabel, LinearProgress, Typography,
  ToggleButtonGroup, ToggleButton, Avatar, Divider, Drawer,
  useTheme,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined'
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined'
import CloseIcon from '@mui/icons-material/Close'
import { useAppSelector, useAppDispatch } from '../../store'
import { updateTarea, addTarea } from '../../store/slices/tareasSlice'
import { PageHeader } from '../../shared/components/PageHeader'
import { SearchBar } from '../../shared/components/SearchBar'
import { StatusBadge } from '../../shared/components/StatusBadge'
import { usePermissions } from '../../shared/hooks/usePermissions'
import { useAuth } from '../../core/auth/AuthContext'
import { Tarea } from './types/tarea.types'
import { TareaDetailDialog } from './components/TareaDetailDialog'
import { TareaFormDialog } from './components/TareaFormDialog'
import { generateId, formatFecha } from '../../shared/utils/formatters'
import { EstadoTarea, PrioridadTarea } from '../../shared/types/common.types'
import toast from 'react-hot-toast'

interface TareasPageProps {
  misTareas?: boolean
  soloValidar?: boolean
}

type VistaT = 'kanban' | 'tabla'

interface KanbanCol {
  key: EstadoTarea
  label: string
  color: string
  bg: string
}

const COLUMNAS: KanbanCol[] = [
  { key: 'pendiente',  label: 'Pendiente',  color: '#64748B', bg: 'rgba(100,116,139,0.08)' },
  { key: 'asignada',   label: 'Asignada',   color: '#0EA5E9', bg: 'rgba(14,165,233,0.08)' },
  { key: 'autorizada', label: 'Autorizada', color: '#D97706', bg: 'rgba(217,119,6,0.08)' },
  { key: 'en_proceso', label: 'En Proceso', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
  { key: 'completada', label: 'Completada', color: '#059669', bg: 'rgba(5,150,105,0.08)' },
  { key: 'validada',   label: 'Verificada', color: '#7C3AED', bg: 'rgba(124,58,237,0.08)' },
  { key: 'rechazada',  label: 'Cancelada',  color: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
]

const PRIORIDAD_META: Record<PrioridadTarea, { color: string; bg: string }> = {
  baja:    { color: '#64748B', bg: 'rgba(100,116,139,0.1)' },
  media:   { color: '#0EA5E9', bg: 'rgba(14,165,233,0.1)' },
  alta:    { color: '#D97706', bg: 'rgba(217,119,6,0.1)' },
  critica: { color: '#DC2626', bg: 'rgba(220,38,38,0.1)' },
}

/** Mini card de tarea para kanban */
function TareaCard({ tarea, onClick }: { tarea: Tarea; onClick: () => void }) {
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'
  const col = COLUMNAS.find((c) => c.key === tarea.estado) ?? COLUMNAS[0]
  const pri = PRIORIDAD_META[tarea.prioridad]

  return (
    <Box
      onClick={onClick}
      sx={{
        backgroundColor: isLight ? '#FFFFFF' : '#1E293B',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '12px',
        p: 1.75,
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, transform 0.2s',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(15,23,42,0.10)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      {/* Folio + prioridad */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="caption" fontWeight={700} color="primary.main">
          {tarea.folio}
        </Typography>
        <Chip
          label={tarea.prioridad}
          size="small"
          sx={{ fontSize: 10, height: 18, fontWeight: 700, backgroundColor: pri.bg, color: pri.color, border: 'none' }}
        />
      </Box>

      {/* Descripcion */}
      <Typography variant="body2" fontWeight={500} sx={{ mb: 1, lineHeight: 1.4 }}>
        {tarea.descripcion.length > 70 ? tarea.descripcion.slice(0, 70) + '…' : tarea.descripcion}
      </Typography>

      {/* Orden */}
      <Chip
        label={tarea.ordenFolio}
        size="small"
        variant="outlined"
        sx={{ fontSize: 10, height: 18, mb: 1.25 }}
      />

      {/* Progress */}
      {tarea.avance > 0 && (
        <Box sx={{ mb: 1 }}>
          <LinearProgress
            variant="determinate"
            value={tarea.avance}
            sx={{
              height: 4,
              borderRadius: 2,
              backgroundColor: isLight ? '#F1F5F9' : '#0F172A',
              '& .MuiLinearProgress-bar': { backgroundColor: col.color, borderRadius: 2 },
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ float: 'right', mt: 0.25 }}>
            {tarea.avance}%
          </Typography>
        </Box>
      )}

      {/* Mecánico */}
      {tarea.asignadoA && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 1 }}>
          <Avatar sx={{ width: 20, height: 20, fontSize: 10, bgcolor: 'rgba(37,99,235,0.12)', color: '#2563EB' }}>
            {tarea.asignadoA.slice(0, 1)}
          </Avatar>
          <Typography variant="caption" color="text.secondary" noWrap>
            {tarea.asignadoA}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

/** Panel detalle en Drawer */
function TareaDrawer({ tarea, open, onClose, onUpdate }: {
  tarea: Tarea | null
  open: boolean
  onClose: () => void
  onUpdate: (t: Tarea) => void
}) {
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'
  if (!tarea) return null
  const col = COLUMNAS.find((c) => c.key === tarea.estado) ?? COLUMNAS[0]
  const pri = PRIORIDAD_META[tarea.prioridad]

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 440 }, p: 0 } }}
    >
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${col.color}15 0%, ${col.color}05 100%)`,
          borderBottom: `2px solid ${col.color}30`,
          p: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box>
          <Typography variant="caption" fontWeight={700} color="primary.main">
            {tarea.folio}
          </Typography>
          <Typography variant="h3" sx={{ mt: 0.25, mb: 0.75 }}>
            {tarea.descripcion}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <StatusBadge status={tarea.estado} type="tarea" />
            <Chip
              label={tarea.prioridad}
              size="small"
              sx={{ fontSize: 11, height: 22, fontWeight: 600, backgroundColor: pri.bg, color: pri.color, border: 'none' }}
            />
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Contenido */}
      <Box sx={{ p: 2.5, overflowY: 'auto' }}>
        {tarea.detalle && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Descripción detallada
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>{tarea.detalle}</Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Orden
            </Typography>
            <Typography variant="body2" fontWeight={600} color="primary.main">{tarea.ordenFolio}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Asignado a
            </Typography>
            <Typography variant="body2" fontWeight={600}>{tarea.asignadoA ?? '—'}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Creado por
            </Typography>
            <Typography variant="body2">{tarea.creadoPor}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Actualización
            </Typography>
            <Typography variant="body2">{formatFecha(tarea.fechaActualizacion)}</Typography>
          </Box>
        </Box>

        {/* Avance */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Avance
            </Typography>
            <Typography variant="body2" fontWeight={700} sx={{ color: col.color }}>{tarea.avance}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={tarea.avance}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: isLight ? '#F1F5F9' : '#0F172A',
              '& .MuiLinearProgress-bar': { backgroundColor: col.color, borderRadius: 4 },
            }}
          />
        </Box>

        {/* Materiales */}
        {tarea.materiales.length > 0 && (
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1, display: 'block' }}>
              Materiales ({tarea.materiales.length})
            </Typography>
            {tarea.materiales.map((mat) => (
              <Box
                key={mat.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  py: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box>
                  <Typography variant="caption" fontWeight={600}>{mat.codigo}</Typography>
                  <Typography variant="body2">{mat.descripcion}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" color="text.secondary">{mat.cantidad} {mat.unidad}</Typography>
                  <Chip
                    label={mat.entregado ? 'Entregado' : 'Pendiente'}
                    size="small"
                    sx={{
                      display: 'block',
                      mt: 0.3,
                      fontSize: 10,
                      height: 18,
                      backgroundColor: mat.entregado ? 'rgba(5,150,105,0.1)' : 'rgba(217,119,6,0.1)',
                      color: mat.entregado ? '#059669' : '#D97706',
                      border: 'none',
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {tarea.notas && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Notas
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>{tarea.notas}</Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  )
}

export function TareasPage({ misTareas = false, soloValidar = false }: TareasPageProps) {
  const dispatch = useAppDispatch()
  const { can } = usePermissions()
  const { user } = useAuth()
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'
  const todasTareas = useAppSelector((s) => s.tareas.tareas)

  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [vista, setVista] = useState<VistaT>('kanban')
  const [selectedTarea, setSelectedTarea] = useState<Tarea | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerTarea, setDrawerTarea] = useState<Tarea | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  let tareas = todasTareas
  if (misTareas && user) tareas = todasTareas.filter((t) => t.asignadoAId === user.id)
  if (soloValidar) tareas = todasTareas.filter((t) => t.estado === 'completada')

  const filtered = tareas.filter((t) => {
    const matchSearch =
      search === '' ||
      [t.folio, t.descripcion, t.ordenFolio, t.asignadoA ?? ''].some((f) =>
        f.toLowerCase().includes(search.toLowerCase())
      )
    const matchEstado = filtroEstado === 'todos' || t.estado === filtroEstado
    return matchSearch && matchEstado
  })

  const handleOpenDetail = (tarea: Tarea) => {
    setSelectedTarea(tarea)
    setDetailOpen(true)
  }

  const handleOpenDrawer = (tarea: Tarea) => {
    setDrawerTarea(tarea)
    setDrawerOpen(true)
  }

  const handleUpdate = (tarea: Tarea) => {
    dispatch(updateTarea(tarea))
    setSelectedTarea(tarea)
    toast.success('Tarea actualizada')
  }

  const handleCreate = (data: Omit<Tarea, 'id' | 'folio' | 'fechaCreacion' | 'fechaActualizacion'>) => {
    const nueva: Tarea = {
      ...data,
      id: generateId(),
      folio: `TK-${String(todasTareas.length + 1).padStart(4, '0')}`,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    }
    dispatch(addTarea(nueva))
    setFormOpen(false)
    toast.success('Tarea creada exitosamente')
  }

  const title = misTareas ? 'Mis Tareas' : soloValidar ? 'Tareas por Validar' : 'Gestión de Tareas'

  // Columnas a mostrar en kanban segun contexto
  const columnas = soloValidar
    ? COLUMNAS.filter((c) => c.key === 'completada')
    : COLUMNAS

  return (
    <Box className="fade-in">
      <PageHeader
        title={title}
        subtitle={`${filtered.length} tareas`}
        actions={
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <ToggleButtonGroup
              value={vista}
              exclusive
              onChange={(_, v) => { if (v) setVista(v) }}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  border: '1px solid', borderColor: 'divider',
                  borderRadius: '8px !important', px: 1.5, py: 0.75,
                  '&.Mui-selected': { backgroundColor: 'rgba(37,99,235,0.08)', color: '#2563EB' },
                },
              }}
            >
              <ToggleButton value="kanban"><ViewKanbanOutlinedIcon fontSize="small" /></ToggleButton>
              <ToggleButton value="tabla"><TableRowsOutlinedIcon fontSize="small" /></ToggleButton>
            </ToggleButtonGroup>

            {can('tareas_write') && !misTareas && !soloValidar && (
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
                Nueva Tarea
              </Button>
            )}
          </Box>
        }
      />

      {/* Filtros */}
      <Card sx={{ mb: 2.5 }}>
        <CardContent sx={{ py: '16px !important' }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Folio, descripción, orden..." />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Estado</InputLabel>
              <Select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} label="Estado">
                <MenuItem value="todos">Todos</MenuItem>
                {COLUMNAS.map((c) => (
                  <MenuItem key={c.key} value={c.key}>{c.label}</MenuItem>
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
            {columnas.map((col) => {
              const tareasCol = filtered.filter((t) => t.estado === col.key)
              return (
                <Box
                  key={col.key}
                  sx={{
                    minWidth: 270,
                    maxWidth: 290,
                    flexShrink: 0,
                    backgroundColor: isLight ? '#F8FAFC' : 'rgba(30,41,59,0.5)',
                    borderRadius: '16px',
                    p: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, px: 0.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: col.color }} />
                    <Typography variant="subtitle2" fontWeight={700}>{col.label}</Typography>
                    <Chip
                      label={tareasCol.length}
                      size="small"
                      sx={{ ml: 'auto', height: 20, fontSize: 11, fontWeight: 700, backgroundColor: col.bg, color: col.color, border: 'none' }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                    {tareasCol.map((t) => (
                      <TareaCard key={t.id} tarea={t} onClick={() => handleOpenDrawer(t)} />
                    ))}
                    {tareasCol.length === 0 && (
                      <Box sx={{ textAlign: 'center', py: 3 }}>
                        <Typography variant="caption" color="text.disabled">Sin tareas</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Box>
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
                    <TableCell>Descripción</TableCell>
                    <TableCell>Orden</TableCell>
                    <TableCell>Asignado</TableCell>
                    <TableCell>Prioridad</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell sx={{ minWidth: 130 }}>Avance</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((tarea) => {
                    const pri = PRIORIDAD_META[tarea.prioridad]
                    const col = COLUMNAS.find((c) => c.key === tarea.estado) ?? COLUMNAS[0]
                    return (
                      <TableRow key={tarea.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={700} color="primary.main">
                            {tarea.folio}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 220 }}>
                          <Typography variant="body2" noWrap>{tarea.descripcion}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={tarea.ordenFolio} size="small" variant="outlined" sx={{ fontSize: 11 }} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {tarea.asignadoA ?? (
                              <span style={{ color: '#94A3B8', fontSize: 13 }}>Sin asignar</span>
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={tarea.prioridad}
                            size="small"
                            sx={{ fontSize: 11, fontWeight: 600, backgroundColor: pri.bg, color: pri.color, border: 'none' }}
                          />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={tarea.estado} type="tarea" />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={tarea.avance}
                              sx={{
                                flexGrow: 1,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: isLight ? '#F1F5F9' : '#0F172A',
                                '& .MuiLinearProgress-bar': { backgroundColor: col.color, borderRadius: 3 },
                              }}
                            />
                            <Typography variant="caption" fontWeight={700} sx={{ minWidth: 32, color: col.color }}>
                              {tarea.avance}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Ver / Gestionar">
                            <IconButton size="small" color="primary" onClick={() => handleOpenDetail(tarea)}>
                              <VisibilityOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                        No se encontraron tareas
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Drawer lateral */}
      <TareaDrawer
        tarea={drawerTarea}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onUpdate={handleUpdate}
      />

      {/* Dialog detalle completo (desde tabla) */}
      {selectedTarea && (
        <TareaDetailDialog
          open={detailOpen}
          tarea={selectedTarea}
          onClose={() => setDetailOpen(false)}
          onUpdate={handleUpdate}
        />
      )}

      <TareaFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onCreate={handleCreate}
      />
    </Box>
  )
}
