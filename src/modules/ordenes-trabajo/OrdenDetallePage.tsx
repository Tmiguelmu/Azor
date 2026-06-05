import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Card, CardContent, Typography, Chip, Grid, Button,
  Tabs, Tab, Divider, Avatar, LinearProgress, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  useTheme,
} from '@mui/material'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import FlightIcon from '@mui/icons-material/Flight'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { useAppSelector } from '../../store'
import { StatusBadge } from '../../shared/components/StatusBadge'
import { FileUploader, UploadedFile } from '../../shared/components/FileUploader'
import { formatFecha, formatMoneda } from '../../shared/utils/formatters'
import { EstadoOrden } from '../../shared/types/common.types'

const ESTADO_META: Record<string, { color: string; step: number }> = {
  activa:      { color: '#0EA5E9', step: 0 },
  en_proceso:  { color: '#D97706', step: 1 },
  terminada:   { color: '#059669', step: 3 },
  pre_factura: { color: '#7C3AED', step: 2 },
  cancelada:   { color: '#DC2626', step: -1 },
}

const STEPPER_PASOS = [
  { label: 'Orden Abierta',  sub: 'OT creada en sistema' },
  { label: 'En Ejecución',   sub: 'Tareas en progreso' },
  { label: 'Pre-Factura',    sub: 'Pendiente de cobro' },
  { label: 'Completada',     sub: 'OT finalizada' },
]

interface TabPanelProps {
  children: React.ReactNode
  value: number
  index: number
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null
}

function DatoCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card
      variant="outlined"
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '12px', boxShadow: 'none' }}
    >
      <CardContent sx={{ py: '14px !important', px: '16px !important' }}>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={700}
          sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}
        >
          {label}
        </Typography>
        <Typography variant="h4" sx={{ mt: 0.5 }}>{value}</Typography>
      </CardContent>
    </Card>
  )
}

export function OrdenDetallePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'

  const [tabValue, setTabValue] = useState(0)
  const [evidencias, setEvidencias] = useState<UploadedFile[]>([])

  const orden = useAppSelector((s) => s.ordenes.ordenes.find((o) => o.id === id))
  const tareas = useAppSelector((s) => s.tareas.tareas.filter((t) => t.ordenId === id))

  if (!orden) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h3" color="text.secondary">Orden no encontrada</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/ordenes')}>Volver</Button>
      </Box>
    )
  }

  const meta = ESTADO_META[orden.estado] ?? ESTADO_META.activa
  const stepActual = meta.step
  const tareasCompletadas = tareas.filter((t) => t.estado === 'validada' || t.estado === 'completada').length
  const progresoTotal = tareas.length > 0
    ? Math.round(tareas.reduce((acc, t) => acc + t.avance, 0) / tareas.length)
    : 0

  return (
    <Box className="fade-in">
      <Button
        startIcon={<ArrowBackOutlinedIcon />}
        onClick={() => navigate('/ordenes')}
        sx={{ mb: 2.5, color: 'text.secondary', fontWeight: 500 }}
      >
        Volver a Órdenes
      </Button>

      {/* Hero banner */}
      <Box
        sx={{
          borderRadius: '20px',
          background: isLight
            ? `linear-gradient(135deg, ${meta.color}15 0%, ${meta.color}04 100%)`
            : `linear-gradient(135deg, ${meta.color}22 0%, rgba(30,41,59,0.8) 100%)`,
          border: `2px solid ${meta.color}28`,
          p: { xs: 2.5, md: 4 },
          mb: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorativo */}
        <Box sx={{ position: 'absolute', right: -50, top: -50, width: 220, height: 220, borderRadius: '50%', backgroundColor: `${meta.color}06` }} />

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'flex-start', position: 'relative' }}>
          <Avatar sx={{ width: 72, height: 72, bgcolor: `${meta.color}18`, color: meta.color, border: `2px solid ${meta.color}40` }}>
            <FlightIcon sx={{ fontSize: 36 }} />
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 0.75, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary">{orden.folio}</Typography>
              <StatusBadge status={orden.estado as EstadoOrden} type="orden" />
              {orden.prioridad === 'urgente' && (
                <Chip label="URGENTE" size="small" sx={{ fontSize: 11, fontWeight: 800, backgroundColor: 'rgba(220,38,38,0.12)', color: '#DC2626', border: 'none' }} />
              )}
            </Box>
            <Typography variant="h1" sx={{ mb: 0.5 }}>{orden.matricula}</Typography>
            <Typography variant="body1" color="text.secondary" fontWeight={500}>
              {orden.marca} {orden.modelo}&nbsp;·&nbsp;{orden.clienteNombre}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', flexShrink: 0 }}>
            <Typography variant="h1" sx={{ color: meta.color, lineHeight: 1 }}>{progresoTotal}%</Typography>
            <Typography variant="caption" color="text.secondary">Avance total</Typography>
            <LinearProgress
              variant="determinate"
              value={progresoTotal}
              sx={{ mt: 0.5, height: 6, width: 80, borderRadius: 3, backgroundColor: isLight ? '#E2E8F0' : '#1E293B', '& .MuiLinearProgress-bar': { backgroundColor: meta.color, borderRadius: 3 } }}
            />
          </Box>
        </Box>

        {/* Stepper */}
        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', overflowX: 'auto' }}>
          {STEPPER_PASOS.map((paso, i) => {
            const isDone = stepActual > i
            const isActive = stepActual === i
            const isCanceled = orden.estado === 'cancelada'
            return (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{
                    width: 32, height: 32, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: isCanceled ? 'rgba(220,38,38,0.1)' : (isDone || isActive) ? `${meta.color}20` : (isLight ? '#F1F5F9' : '#1E293B'),
                    border: `2px solid ${isCanceled ? '#DC2626' : (isDone || isActive) ? meta.color : (isLight ? '#E2E8F0' : '#334155')}`,
                    transition: 'all 0.2s',
                  }}>
                    {isDone
                      ? <CheckCircleOutlineIcon sx={{ fontSize: 16, color: meta.color }} />
                      : <RadioButtonUncheckedIcon sx={{ fontSize: 16, color: isActive ? meta.color : 'text.disabled' }} />
                    }
                  </Box>
                  <Typography variant="caption" fontWeight={isActive ? 700 : 500} sx={{ color: isActive ? meta.color : 'text.secondary', whiteSpace: 'nowrap' }}>
                    {paso.label}
                  </Typography>
                </Box>
                {i < STEPPER_PASOS.length - 1 && (
                  <Box sx={{ height: 2, width: { xs: 40, md: 80 }, backgroundColor: isDone ? meta.color : (isLight ? '#E2E8F0' : '#1E293B'), mx: 1, flexShrink: 0, transition: 'background-color 0.2s' }} />
                )}
              </Box>
            )
          })}
        </Box>
      </Box>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            sx={{
              px: 2,
              '& .MuiTab-root': { fontSize: 14, fontWeight: 600, minHeight: 52, textTransform: 'none' },
              '& .Mui-selected': { color: '#2563EB' },
              '& .MuiTabs-indicator': { backgroundColor: '#2563EB', height: 3, borderRadius: '2px 2px 0 0' },
            }}
          >
            <Tab icon={<InfoOutlinedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Info" />
            <Tab icon={<TaskAltIcon sx={{ fontSize: 18 }} />} iconPosition="start" label={`Tareas (${tareas.length})`} />
            <Tab icon={<Inventory2OutlinedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Materiales" />
            <Tab icon={<PhotoLibraryOutlinedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Evidencias" />
            {orden.prefactura && (
              <Tab icon={<ReceiptLongOutlinedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Pre-Factura" />
            )}
          </Tabs>
        </Box>

        <CardContent>
          {/* Tab Info */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1.5, display: 'block' }}>
                  Datos de la Aeronave
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={6} sm={3}><DatoCard label="Matrícula" value={orden.matricula} /></Grid>
                  <Grid item xs={6} sm={3}><DatoCard label="Serie" value={orden.serie || '—'} /></Grid>
                  <Grid item xs={6} sm={3}><DatoCard label="Marca" value={orden.marca} /></Grid>
                  <Grid item xs={6} sm={3}><DatoCard label="Modelo" value={orden.modelo} /></Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}><Divider /></Grid>

              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1.5, display: 'block' }}>
                  Horas y Ciclos
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={6} sm={4} md={2}><DatoCard label="Planeador Hrs" value={`${orden.planeadorHrs.toLocaleString()} h`} /></Grid>
                  <Grid item xs={6} sm={4} md={2}><DatoCard label="Motor 1 Hrs" value={`${orden.motor1Hrs.toLocaleString()} h`} /></Grid>
                  {orden.motor2Hrs && <Grid item xs={6} sm={4} md={2}><DatoCard label="Motor 2 Hrs" value={`${orden.motor2Hrs.toLocaleString()} h`} /></Grid>}
                  <Grid item xs={6} sm={4} md={2}><DatoCard label="Ciclos Motor 1" value={orden.ciclos1.toLocaleString()} /></Grid>
                  {orden.ciclos2 && <Grid item xs={6} sm={4} md={2}><DatoCard label="Ciclos Motor 2" value={orden.ciclos2.toLocaleString()} /></Grid>}
                  <Grid item xs={6} sm={4} md={2}><DatoCard label="Aterrizajes" value={orden.aterrizajes.toLocaleString()} /></Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}><Divider /></Grid>

              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1.5, display: 'block' }}>
                  Datos de la Orden
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={6} sm={4}><DatoCard label="Folio" value={orden.folio} /></Grid>
                  <Grid item xs={6} sm={4}><DatoCard label="Cliente" value={orden.clienteNombre} /></Grid>
                  <Grid item xs={6} sm={4}><DatoCard label="Creado por" value={orden.creadoPor} /></Grid>
                  <Grid item xs={6} sm={4}><DatoCard label="Fecha creación" value={formatFecha(orden.fechaCreacion)} /></Grid>
                  <Grid item xs={6} sm={4}><DatoCard label="Última actualización" value={formatFecha(orden.fechaActualizacion)} /></Grid>
                  <Grid item xs={6} sm={4}><DatoCard label="Prioridad" value={orden.prioridad.toUpperCase()} /></Grid>
                </Grid>
              </Grid>

              {orden.comentarios && (
                <Grid item xs={12}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Comentarios
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.75 }}>{orden.comentarios}</Typography>
                </Grid>
              )}
            </Grid>
          </TabPanel>

          {/* Tab Tareas */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
              <Box>
                <Typography variant="h3">Tareas de la Orden</Typography>
                <Typography variant="body2" color="text.secondary">
                  {tareasCompletadas} de {tareas.length} tareas completadas
                </Typography>
              </Box>
            </Box>

            {tareas.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography color="text.secondary">No hay tareas asociadas a esta orden</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {tareas.map((tarea) => {
                  const prioColor: Record<string, string> = { baja: '#64748B', media: '#0EA5E9', alta: '#D97706', critica: '#DC2626' }
                  const col = prioColor[tarea.prioridad] ?? '#64748B'
                  return (
                    <Box
                      key={tarea.id}
                      sx={{
                        display: 'flex', gap: 2, p: 2, borderRadius: '12px',
                        border: '1px solid', borderColor: 'divider', alignItems: 'flex-start',
                        '&:hover': { backgroundColor: isLight ? '#FAFBFD' : 'rgba(241,245,249,0.02)' },
                        transition: 'background 0.15s',
                      }}
                    >
                      <Avatar sx={{ width: 36, height: 36, bgcolor: `${col}18`, color: col, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                        {tarea.asignadoA?.slice(0, 1) ?? '?'}
                      </Avatar>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, flexWrap: 'wrap', gap: 1 }}>
                          <Box>
                            <Typography variant="caption" fontWeight={700} color="primary.main">{tarea.folio}</Typography>
                            <Typography variant="body2" fontWeight={600}>{tarea.descripcion}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip label={tarea.prioridad} size="small" sx={{ fontSize: 11, height: 20, fontWeight: 700, backgroundColor: `${col}15`, color: col, border: 'none' }} />
                            <StatusBadge status={tarea.estado} type="tarea" />
                          </Box>
                        </Box>
                        {tarea.asignadoA && (
                          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.75, display: 'block' }}>
                            Asignado: {tarea.asignadoA}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <LinearProgress
                            variant="determinate"
                            value={tarea.avance}
                            sx={{ flexGrow: 1, height: 5, borderRadius: 3, backgroundColor: isLight ? '#F1F5F9' : '#0F172A', '& .MuiLinearProgress-bar': { backgroundColor: col, borderRadius: 3 } }}
                          />
                          <Typography variant="caption" fontWeight={700} sx={{ color: col, minWidth: 32 }}>{tarea.avance}%</Typography>
                        </Box>
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            )}
          </TabPanel>

          {/* Tab Materiales */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h3" sx={{ mb: 2.5 }}>Materiales Utilizados</Typography>
            {(() => {
              const allMat = tareas.flatMap((t) => t.materiales.map((m) => ({ ...m, tareaFolio: t.folio })))
              if (allMat.length === 0) {
                return <Box sx={{ textAlign: 'center', py: 5 }}><Typography color="text.secondary">Sin materiales registrados</Typography></Box>
              }
              return (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Código</TableCell>
                        <TableCell>Descripción</TableCell>
                        <TableCell align="center">Cantidad</TableCell>
                        <TableCell>Unidad</TableCell>
                        <TableCell>Tarea</TableCell>
                        <TableCell align="center">Estado</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allMat.map((m) => (
                        <TableRow key={m.id} hover>
                          <TableCell><Typography variant="body2" fontWeight={700} color="primary.main">{m.codigo}</Typography></TableCell>
                          <TableCell><Typography variant="body2">{m.descripcion}</Typography></TableCell>
                          <TableCell align="center"><Typography variant="body2" fontWeight={600}>{m.cantidad}</Typography></TableCell>
                          <TableCell><Typography variant="body2">{m.unidad}</Typography></TableCell>
                          <TableCell><Chip label={m.tareaFolio} size="small" variant="outlined" sx={{ fontSize: 11 }} /></TableCell>
                          <TableCell align="center">
                            <Chip
                              label={m.entregado ? 'Entregado' : 'Pendiente'}
                              size="small"
                              sx={{ fontSize: 11, fontWeight: 600, backgroundColor: m.entregado ? 'rgba(5,150,105,0.1)' : 'rgba(217,119,6,0.1)', color: m.entregado ? '#059669' : '#D97706', border: 'none' }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )
            })()}
          </TabPanel>

          {/* Tab Evidencias */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h3" sx={{ mb: 0.5 }}>Galería de Evidencias</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Sube imágenes o documentos como evidencia del trabajo realizado
            </Typography>
            <FileUploader
              files={evidencias}
              onFilesChange={setEvidencias}
              label="Arrastra evidencias aquí o haz clic para seleccionar"
              maxFiles={20}
            />
          </TabPanel>

          {/* Tab Pre-Factura */}
          {orden.prefactura && (
            <TabPanel value={tabValue} index={4}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h3">Pre-Factura</Typography>
                <Chip label={formatFecha(orden.prefactura.fechaCreacion)} size="small" variant="outlined" />
              </Box>

              <TableContainer sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Agrupación</TableCell>
                      <TableCell align="center">Cant.</TableCell>
                      <TableCell align="right">Precio Unit.</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orden.prefactura.conceptos.map((c) => (
                      <TableRow key={c.id} hover>
                        <TableCell><Typography variant="body2">{c.descripcion}</Typography></TableCell>
                        <TableCell><Chip label={c.agrupacion} size="small" variant="outlined" sx={{ fontSize: 11 }} /></TableCell>
                        <TableCell align="center">{c.cantidad}</TableCell>
                        <TableCell align="right">{formatMoneda(c.precioUnitario)}</TableCell>
                        <TableCell align="right"><Typography variant="body2" fontWeight={700}>{formatMoneda(c.total)}</Typography></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider />
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                  <Typography variant="body2" fontWeight={600}>{formatMoneda(orden.prefactura.subtotal)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Typography variant="body2" color="text.secondary">IVA (16%)</Typography>
                  <Typography variant="body2" fontWeight={600}>{formatMoneda(orden.prefactura.iva)}</Typography>
                </Box>
                <Divider sx={{ width: '100%', my: 0.5 }} />
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Typography variant="h4">Total</Typography>
                  <Typography variant="h3" color="primary.main">{formatMoneda(orden.prefactura.total)}</Typography>
                </Box>
              </Box>
            </TabPanel>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
