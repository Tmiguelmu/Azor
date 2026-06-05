import { useState, useCallback } from 'react'
import {
  Box, Card, CardContent, Grid, Typography, Button, TextField, Divider,
  Chip, IconButton, Tooltip, useTheme, ToggleButtonGroup, ToggleButton,
} from '@mui/material'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined'
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, ResponsiveContainer, Legend,
} from 'recharts'
import { PageHeader } from '../../shared/components/PageHeader'
import { useAppSelector } from '../../store'
import { formatMoneda } from '../../shared/utils/formatters'
import toast from 'react-hot-toast'

// Datos mock para gráficas
const mesesData = [
  { mes: 'Ene', ordenes: 4, completadas: 3, revenue: 320000 },
  { mes: 'Feb', ordenes: 6, completadas: 5, revenue: 480000 },
  { mes: 'Mar', ordenes: 5, completadas: 4, revenue: 410000 },
  { mes: 'Abr', ordenes: 8, completadas: 7, revenue: 650000 },
  { mes: 'May', ordenes: 10, completadas: 8, revenue: 820000 },
  { mes: 'Jun', ordenes: 7, completadas: 5, revenue: 570000 },
]

const comparativoData = [
  { servicio: 'Insp. 100h', mesActual: 12, mesAnterior: 9 },
  { servicio: 'Insp. 300h', mesActual: 5, mesAnterior: 6 },
  { servicio: 'Cambio aceite', mesActual: 18, mesAnterior: 14 },
  { servicio: 'Tren aterr.', mesActual: 7, mesAnterior: 8 },
  { servicio: 'Aviónica', mesActual: 4, mesAnterior: 3 },
]

const mecanicoData = [
  { nombre: 'José López', tareas: 22, completadas: 18 },
  { nombre: 'Pedro Ruiz', tareas: 17, completadas: 14 },
  { nombre: 'Ana Vargas', tareas: 14, completadas: 12 },
  { nombre: 'Luis Mora', tareas: 11, completadas: 9 },
]

const radarData = [
  { tipo: 'Inspección', value: 40 },
  { tipo: 'Mantenimiento', value: 25 },
  { tipo: 'Reparación', value: 15 },
  { tipo: 'Overhaul', value: 10 },
  { tipo: 'Aviónica', value: 10 },
]

const consumoData = [
  { mes: 'Ene', consumo: 45 },
  { mes: 'Feb', consumo: 62 },
  { mes: 'Mar', consumo: 55 },
  { mes: 'Abr', consumo: 78 },
  { mes: 'May', consumo: 91 },
  { mes: 'Jun', consumo: 68 },
]

const KPI_COLORS = ['#2563EB', '#059669', '#D97706', '#7C3AED']

interface ChartCardProps {
  title: string
  badge?: string
  children: React.ReactNode
  onExport?: () => void
  onCopy?: () => void
  onPrint?: () => void
}

function ChartCard({ title, badge, children, onExport, onCopy, onPrint }: ChartCardProps) {
  const [fullscreen, setFullscreen] = useState(false)

  return (
    <Card sx={fullscreen ? {
      position: 'fixed', inset: 16, zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      overflow: 'auto',
    } : {}}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h4">{title}</Typography>
            {badge && (
              <Chip label={badge} size="small" variant="outlined" sx={{ fontSize: 11 }} />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {onExport && (
              <Tooltip title="Exportar Excel">
                <IconButton size="small" onClick={onExport}>
                  <DownloadOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onCopy && (
              <Tooltip title="Copiar datos">
                <IconButton size="small" onClick={onCopy}>
                  <ContentCopyOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onPrint && (
              <Tooltip title="Imprimir">
                <IconButton size="small" onClick={onPrint}>
                  <PrintOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={fullscreen ? 'Minimizar' : 'Pantalla completa'}>
              <IconButton size="small" onClick={() => setFullscreen((p) => !p)}>
                {fullscreen
                  ? <FullscreenExitOutlinedIcon fontSize="small" />
                  : <FullscreenOutlinedIcon fontSize="small" />
                }
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {children}
      </CardContent>
    </Card>
  )
}

interface KpiCardProps {
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
  color: string
  bg: string
}

function KpiCard({ title, value, subtitle, icon, color, bg }: KpiCardProps) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ width: 52, height: 52, borderRadius: '14px', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="h2" sx={{ color, mb: 0.25 }}>{value}</Typography>
            <Typography variant="body2" fontWeight={600}>{title}</Typography>
            <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

type Seccion = 'ordenes' | 'tareas' | 'inventario'

export function ReportesPage() {
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'
  const [seccion, setSeccion] = useState<Seccion>('ordenes')
  const [fechaInicio, setFechaInicio] = useState('2025-01-01')
  const [fechaFin, setFechaFin] = useState('2025-12-31')

  const ordenes = useAppSelector((s) => s.ordenes.ordenes)
  const tareas = useAppSelector((s) => s.tareas.tareas)
  const inventario = useAppSelector((s) => s.inventario.items)

  const ordenesTotal = ordenes.length
  const tareasCompletadas = tareas.filter((t) => t.estado === 'validada' || t.estado === 'completada').length
  const preFacturas = ordenes.filter((o) => o.estado === 'pre_factura')
  const revenueTotal = preFacturas.reduce((acc, o) => acc + (o.prefactura?.total ?? 0), 0)
  const eficiencia = tareasCompletadas > 0
    ? Math.round((tareasCompletadas / tareas.length) * 100)
    : 0

  // Pie data tareas
  const tareasPie = [
    { name: 'Pendiente',  value: tareas.filter((t) => t.estado === 'pendiente').length,  color: '#64748B' },
    { name: 'En Proceso', value: tareas.filter((t) => t.estado === 'en_proceso').length, color: '#D97706' },
    { name: 'Completada', value: tareas.filter((t) => t.estado === 'completada').length, color: '#059669' },
    { name: 'Validada',   value: tareas.filter((t) => t.estado === 'validada').length,   color: '#7C3AED' },
    { name: 'Rechazada',  value: tareas.filter((t) => t.estado === 'rechazada').length,  color: '#DC2626' },
  ].filter((e) => e.value > 0)

  const stockCritico = inventario
    .filter((i) => i.cantidad <= i.stockMinimo)
    .slice(0, 8)
    .map((i) => ({
      nombre: i.descripcion.slice(0, 18),
      cantidad: i.cantidad,
      minimo: i.stockMinimo,
      critico: i.cantidad === 0,
    }))

  const tooltipStyle = {
    borderRadius: 10,
    border: `1px solid ${isLight ? '#E2E8F0' : '#334155'}`,
    backgroundColor: isLight ? '#fff' : '#1E293B',
    fontSize: 13,
  }

  const handleExport = useCallback((titulo: string, data: Record<string, unknown>[]) => {
    try {
      const headers = Object.keys(data[0] ?? {}).join(',')
      const rows = data.map((row) => Object.values(row).join(',')).join('\n')
      const csv = `${headers}\n${rows}`
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${titulo}-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Archivo exportado')
    } catch {
      toast.error('Error al exportar')
    }
  }, [])

  const handleCopy = useCallback((data: Record<string, unknown>[]) => {
    const text = JSON.stringify(data, null, 2)
    navigator.clipboard.writeText(text).then(() => toast.success('Datos copiados al portapapeles'))
  }, [])

  const handlePrint = () => window.print()

  return (
    <Box className="fade-in">
      <PageHeader
        title="Reportes y Analytics"
        subtitle="Visualización y exportación de datos del sistema"
      />

      {/* Filtro de fechas */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: '16px !important' }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              label="Fecha Inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ minWidth: 160 }}
            />
            <TextField
              label="Fecha Fin"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ minWidth: 160 }}
            />
            <ToggleButtonGroup
              value={seccion}
              exclusive
              onChange={(_, v) => { if (v) setSeccion(v) }}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  border: '1px solid', borderColor: 'divider',
                  borderRadius: '8px !important', px: 2, py: 0.75, fontSize: 13, fontWeight: 600,
                  '&.Mui-selected': { backgroundColor: 'rgba(37,99,235,0.08)', color: '#2563EB' },
                },
              }}
            >
              <ToggleButton value="ordenes">Órdenes</ToggleButton>
              <ToggleButton value="tareas">Tareas</ToggleButton>
              <ToggleButton value="inventario">Inventario</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard
            title="Órdenes Totales"
            value={String(ordenesTotal)}
            subtitle={`${fechaInicio.slice(0, 7)} → ${fechaFin.slice(0, 7)}`}
            icon={<AssignmentOutlinedIcon />}
            color="#2563EB"
            bg="rgba(37,99,235,0.08)"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard
            title="Tareas Completadas"
            value={String(tareasCompletadas)}
            subtitle={`de ${tareas.length} tareas totales`}
            icon={<TaskAltIcon />}
            color="#059669"
            bg="rgba(5,150,105,0.08)"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard
            title="Revenue (Mock)"
            value={formatMoneda(revenueTotal)}
            subtitle="Pre-facturas generadas"
            icon={<ReceiptLongOutlinedIcon />}
            color="#7C3AED"
            bg="rgba(124,58,237,0.08)"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KpiCard
            title="Eficiencia"
            value={`${eficiencia}%`}
            subtitle="Tareas completadas / total"
            icon={<TrendingUpIcon />}
            color="#D97706"
            bg="rgba(217,119,6,0.08)"
          />
        </Grid>
      </Grid>

      {/* SECCIÓN ÓRDENES */}
      {seccion === 'ordenes' && (
        <Grid container spacing={2.5}>
          <Grid item xs={12} lg={8}>
            <ChartCard
              title="Órdenes por Mes"
              badge="2025"
              onExport={() => handleExport('ordenes-mes', mesesData)}
              onCopy={() => handleCopy(mesesData as unknown as Record<string, unknown>[])}
              onPrint={handlePrint}
            >
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={mesesData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                  <defs>
                    <linearGradient id="gOrd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gComp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#F1F5F9' : '#1E293B'} />
                  <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <ReTooltip contentStyle={tooltipStyle} />
                  <Legend formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>} />
                  <Area type="monotone" dataKey="ordenes" stroke="#2563EB" strokeWidth={2.5} fill="url(#gOrd)" name="Órdenes" />
                  <Area type="monotone" dataKey="completadas" stroke="#059669" strokeWidth={2.5} fill="url(#gComp)" name="Completadas" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          <Grid item xs={12} lg={4}>
            <ChartCard title="Por Estado" badge="Actual">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={[
                    { name: 'Activa', value: ordenes.filter((o) => o.estado === 'activa').length },
                    { name: 'En Proceso', value: ordenes.filter((o) => o.estado === 'en_proceso').length },
                    { name: 'Terminada', value: ordenes.filter((o) => o.estado === 'terminada').length },
                    { name: 'Pre-Factura', value: ordenes.filter((o) => o.estado === 'pre_factura').length },
                    { name: 'Cancelada', value: ordenes.filter((o) => o.estado === 'cancelada').length },
                  ]} cx="50%" cy="45%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                    {['#0EA5E9', '#D97706', '#059669', '#7C3AED', '#DC2626'].map((color, i) => (
                      <Cell key={i} fill={color} />
                    ))}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>} />
                  <ReTooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          <Grid item xs={12}>
            <ChartCard
              title="Comparativo Mensual por Servicio"
              badge="Mayo vs Abril"
              onExport={() => handleExport('comparativo', comparativoData)}
            >
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={comparativoData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#F1F5F9' : '#1E293B'} />
                  <XAxis dataKey="servicio" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <ReTooltip contentStyle={tooltipStyle} />
                  <Legend formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>} />
                  <Bar dataKey="mesActual" fill="#2563EB" name="Este mes" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="mesAnterior" fill="#93C5FD" name="Mes anterior" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>
      )}

      {/* SECCIÓN TAREAS */}
      {seccion === 'tareas' && (
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={5}>
            <ChartCard title="Estado de Tareas" badge="Actual">
              <Box sx={{ position: 'relative', height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={tareasPie} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={3} dataKey="value">
                      {tareasPie.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>} />
                    <ReTooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                {/* % en centro */}
                <Box sx={{ position: 'absolute', textAlign: 'center', pointerEvents: 'none' }}>
                  <Typography variant="h2" color="primary.main">{eficiencia}%</Typography>
                  <Typography variant="caption" color="text.secondary">completadas</Typography>
                </Box>
              </Box>
            </ChartCard>
          </Grid>

          <Grid item xs={12} md={7}>
            <ChartCard
              title="Productividad por Mecánico"
              badge="Mayo 2025"
              onExport={() => handleExport('productividad', mecanicoData)}
            >
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={mecanicoData} layout="vertical" margin={{ top: 5, right: 30, bottom: 0, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#F1F5F9' : '#1E293B'} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="nombre" type="category" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={90} />
                  <ReTooltip contentStyle={tooltipStyle} />
                  <Legend formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>} />
                  <Bar dataKey="tareas" fill="#2563EB" name="Asignadas" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="completadas" fill="#059669" name="Completadas" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <ChartCard title="Distribución por Tipo de Servicio">
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={isLight ? '#E2E8F0' : '#1E293B'} />
                  <PolarAngleAxis dataKey="tipo" tick={{ fontSize: 12, fill: '#94A3B8' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 50]} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <Radar name="Distribución" dataKey="value" stroke="#2563EB" fill="#2563EB" fillOpacity={0.15} strokeWidth={2} />
                  <ReTooltip contentStyle={tooltipStyle} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>
      )}

      {/* SECCIÓN INVENTARIO */}
      {seccion === 'inventario' && (
        <Grid container spacing={2.5}>
          <Grid item xs={12} lg={7}>
            <ChartCard
              title="Items con Stock Crítico"
              badge="Alertas"
              onExport={() => handleExport('stock-critico', stockCritico)}
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stockCritico} margin={{ top: 5, right: 5, bottom: 30, left: -15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#F1F5F9' : '#1E293B'} />
                  <XAxis dataKey="nombre" tick={{ fontSize: 11, fill: '#94A3B8', angle: -30, textAnchor: 'end' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <ReTooltip contentStyle={tooltipStyle} />
                  <Legend formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>} />
                  <Bar
                    dataKey="cantidad"
                    name="Cantidad actual"
                    radius={[4, 4, 0, 0]}
                    label={false}
                  >
                    {stockCritico.map((entry, i) => (
                      <Cell key={i} fill={entry.critico ? '#DC2626' : '#D97706'} />
                    ))}
                  </Bar>
                  <Bar dataKey="minimo" fill="rgba(148,163,184,0.3)" name="Mínimo requerido" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          <Grid item xs={12} lg={5}>
            <ChartCard
              title="Tendencia de Consumo"
              badge="Últimos 6 meses"
              onExport={() => handleExport('consumo', consumoData)}
            >
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={consumoData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                  <defs>
                    <linearGradient id="gConsumo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#F1F5F9' : '#1E293B'} />
                  <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <ReTooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="consumo" stroke="#7C3AED" strokeWidth={2.5} dot={{ fill: '#7C3AED', r: 4 }} name="Items consumidos" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h3">Resumen de Inventario</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label={`${inventario.filter((i) => i.cantidad > i.stockMinimo).length} En Stock`} sx={{ backgroundColor: 'rgba(5,150,105,0.1)', color: '#059669', fontWeight: 600, border: 'none' }} />
                    <Chip label={`${inventario.filter((i) => i.cantidad <= i.stockMinimo && i.cantidad > 0).length} Stock Bajo`} sx={{ backgroundColor: 'rgba(217,119,6,0.1)', color: '#D97706', fontWeight: 600, border: 'none' }} />
                    <Chip label={`${inventario.filter((i) => i.cantidad === 0).length} Sin Stock`} sx={{ backgroundColor: 'rgba(220,38,38,0.1)', color: '#DC2626', fontWeight: 600, border: 'none' }} />
                  </Box>
                </Box>
                <Divider />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Total de items en catálogo: <strong>{inventario.length}</strong> &nbsp;|&nbsp;
                  Alertas de stock: <strong style={{ color: '#DC2626' }}>{inventario.filter((i) => i.cantidad <= i.stockMinimo).length}</strong>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}
