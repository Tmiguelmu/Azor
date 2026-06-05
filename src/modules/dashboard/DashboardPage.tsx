import {
  Box, Grid, Card, CardContent, Typography, LinearProgress,
  useTheme, Chip, Avatar, Divider,
} from '@mui/material'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend,
} from 'recharts'
import { useAppSelector } from '../../store'
import { useAuth } from '../../core/auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import { StatusBadge } from '../../shared/components/StatusBadge'
import { formatFecha } from '../../shared/utils/formatters'
import { EstadoOrden } from '../../shared/types/common.types'

// Datos mock para gráficas
const areaData = [
  { mes: 'Ene', ordenes: 4, completadas: 3 },
  { mes: 'Feb', ordenes: 6, completadas: 5 },
  { mes: 'Mar', ordenes: 5, completadas: 4 },
  { mes: 'Abr', ordenes: 8, completadas: 7 },
  { mes: 'May', ordenes: 10, completadas: 8 },
  { mes: 'Jun', ordenes: 7, completadas: 5 },
]

interface KpiCardProps {
  title: string
  value: number | string
  subtitle: string
  icon: React.ReactNode
  color: string
  bg: string
  trend?: string
  onClick?: () => void
}

function KpiCard({ title, value, subtitle, icon, color, bg, trend, onClick }: KpiCardProps) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick ? { transform: 'translateY(-3px)' } : {},
        animation: 'fadeIn 0.3s ease both',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color,
            }}
          >
            {icon}
          </Box>
          {trend && (
            <Chip
              icon={<ArrowUpwardIcon sx={{ fontSize: '12px !important' }} />}
              label={trend}
              size="small"
              sx={{
                fontSize: 11,
                height: 22,
                backgroundColor: 'rgba(5,150,105,0.1)',
                color: '#059669',
                fontWeight: 600,
                border: 'none',
              }}
            />
          )}
        </Box>
        <Typography variant="h2" sx={{ mb: 0.25, color }}>
          {value}
        </Typography>
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'
  const { user } = useAuth()
  const navigate = useNavigate()
  const ordenes = useAppSelector((s) => s.ordenes.ordenes)
  const tareas = useAppSelector((s) => s.tareas.tareas)
  const inventario = useAppSelector((s) => s.inventario.items)

  const ordenesActivas = ordenes.filter((o) => o.estado === 'activa' || o.estado === 'en_proceso').length
  const tareasPendientes = tareas.filter((t) => t.estado === 'pendiente' || t.estado === 'asignada').length
  const tareasEnProceso = tareas.filter((t) => t.estado === 'en_proceso').length
  const stockBajo = inventario.filter((i) => i.cantidad <= i.stockMinimo).length
  const preFacturas = ordenes.filter((o) => o.estado === 'pre_factura').length
  const misTareas = tareas.filter((t) => t.asignadoAId === user?.id)
  const tareasAValidar = tareas.filter((t) => t.estado === 'completada')
  const ultimasOrdenes = [...ordenes]
    .sort((a, b) => new Date(b.fechaActualizacion).getTime() - new Date(a.fechaActualizacion).getTime())
    .slice(0, 5)

  const isMecanico = user?.rol === 'mecanico'
  const isCertificado = user?.rol === 'mecanico_certificado'
  const isManager = !isMecanico && !isCertificado

  // Pie chart data
  const estadoOrdenes = [
    { name: 'Activa', value: ordenes.filter((o) => o.estado === 'activa').length, color: '#0EA5E9' },
    { name: 'En Proceso', value: ordenes.filter((o) => o.estado === 'en_proceso').length, color: '#D97706' },
    { name: 'Terminada', value: ordenes.filter((o) => o.estado === 'terminada').length, color: '#059669' },
    { name: 'Pre-Factura', value: ordenes.filter((o) => o.estado === 'pre_factura').length, color: '#7C3AED' },
    { name: 'Cancelada', value: ordenes.filter((o) => o.estado === 'cancelada').length, color: '#DC2626' },
  ].filter((e) => e.value > 0)

  const gridBg = isLight ? '#F1F5F9' : '#0F172A'

  return (
    <Box className="fade-in">
      {/* Bienvenida */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h1" sx={{ mb: 0.5 }}>
          Bienvenido, {user?.nombre?.split(' ')[0]}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date().toLocaleDateString('es-MX', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {isManager && (
          <>
            <Grid item xs={12} sm={6} xl={3}>
              <KpiCard
                title="Órdenes Activas"
                value={ordenesActivas}
                subtitle="En proceso y activas"
                icon={<AssignmentOutlinedIcon />}
                color="#2563EB"
                bg="rgba(37,99,235,0.08)"
                trend="+2 este mes"
                onClick={() => navigate('/ordenes')}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <KpiCard
                title="Tareas Pendientes"
                value={tareasPendientes}
                subtitle={`${tareasEnProceso} en ejecución`}
                icon={<TaskAltIcon />}
                color="#D97706"
                bg="rgba(217,119,6,0.08)"
                onClick={() => navigate('/tareas')}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <KpiCard
                title="Stock Bajo"
                value={stockBajo}
                subtitle="Items bajo mínimo"
                icon={<Inventory2OutlinedIcon />}
                color={stockBajo > 0 ? '#DC2626' : '#059669'}
                bg={stockBajo > 0 ? 'rgba(220,38,38,0.08)' : 'rgba(5,150,105,0.08)'}
                onClick={() => navigate('/inventario')}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <KpiCard
                title="Pre-Facturas"
                value={preFacturas}
                subtitle="Pendientes de cobro"
                icon={<ReceiptLongOutlinedIcon />}
                color="#7C3AED"
                bg="rgba(124,58,237,0.08)"
                onClick={() => navigate('/ordenes')}
              />
            </Grid>
          </>
        )}

        {isMecanico && (
          <>
            <Grid item xs={12} sm={6}>
              <KpiCard
                title="Mis Tareas"
                value={misTareas.length}
                subtitle="Tareas en tu cargo"
                icon={<TaskAltIcon />}
                color="#2563EB"
                bg="rgba(37,99,235,0.08)"
                onClick={() => navigate('/mis-tareas')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <KpiCard
                title="En Ejecución"
                value={misTareas.filter((t) => t.estado === 'en_proceso').length}
                subtitle="Tareas actualmente activas"
                icon={<TrendingUpIcon />}
                color="#D97706"
                bg="rgba(217,119,6,0.08)"
              />
            </Grid>
          </>
        )}

        {isCertificado && (
          <>
            <Grid item xs={12} sm={6}>
              <KpiCard
                title="Por Validar"
                value={tareasAValidar.length}
                subtitle="Esperando tu validación"
                icon={<TaskAltIcon />}
                color="#D97706"
                bg="rgba(217,119,6,0.08)"
                onClick={() => navigate('/tareas-validar')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <KpiCard
                title="Validadas Hoy"
                value={0}
                subtitle="Tareas validadas hoy"
                icon={<TrendingUpIcon />}
                color="#059669"
                bg="rgba(5,150,105,0.08)"
              />
            </Grid>
          </>
        )}
      </Grid>

      {/* Gráficas + Tablas */}
      {isManager && (
        <Grid container spacing={2.5}>
          {/* Area chart */}
          <Grid item xs={12} md={7}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                  <Box>
                    <Typography variant="h3">Órdenes por Mes</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Últimos 6 meses
                    </Typography>
                  </Box>
                  <Chip label="2025" size="small" variant="outlined" />
                </Box>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={areaData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="gradOrdenes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradComp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#F1F5F9' : '#1E293B'} />
                    <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <ReTooltip
                      contentStyle={{
                        borderRadius: 10,
                        border: `1px solid ${isLight ? '#E2E8F0' : '#334155'}`,
                        backgroundColor: isLight ? '#fff' : '#1E293B',
                        fontSize: 13,
                      }}
                    />
                    <Area type="monotone" dataKey="ordenes" stroke="#2563EB" strokeWidth={2} fill="url(#gradOrdenes)" name="Órdenes" />
                    <Area type="monotone" dataKey="completadas" stroke="#059669" strokeWidth={2} fill="url(#gradComp)" name="Completadas" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Pie chart */}
          <Grid item xs={12} md={5}>
            <Card>
              <CardContent>
                <Typography variant="h3" sx={{ mb: 0.5 }}>Estado de Órdenes</Typography>
                <Typography variant="caption" color="text.secondary">Distribución actual</Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={estadoOrdenes}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {estadoOrdenes.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span style={{ fontSize: 12, color: isLight ? '#475569' : '#94A3B8' }}>{value}</span>
                      )}
                    />
                    <ReTooltip
                      contentStyle={{
                        borderRadius: 10,
                        border: `1px solid ${isLight ? '#E2E8F0' : '#334155'}`,
                        backgroundColor: isLight ? '#fff' : '#1E293B',
                        fontSize: 13,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Ultimas ordenes */}
          <Grid item xs={12} md={7}>
            <Card>
              <CardContent>
                <Typography variant="h3" sx={{ mb: 2 }}>Últimas Órdenes</Typography>
                {ultimasOrdenes.map((orden, i) => (
                  <Box key={orden.id}>
                    <Box
                      onClick={() => navigate(`/ordenes/${orden.id}`)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        py: 1.5,
                        gap: 2,
                        cursor: 'pointer',
                        borderRadius: 2,
                        px: 1,
                        mx: -1,
                        '&:hover': { backgroundColor: isLight ? '#F8FAFC' : 'rgba(241,245,249,0.04)' },
                        transition: 'background 0.15s',
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: 'rgba(37,99,235,0.08)',
                          color: '#2563EB',
                          fontSize: 12,
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        {orden.marca.slice(0, 2).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={700} noWrap>
                          {orden.folio} — {orden.matricula}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {orden.clienteNombre} · {orden.marca} {orden.modelo}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                        <StatusBadge status={orden.estado as EstadoOrden} type="orden" />
                        <Typography variant="caption" color="text.secondary" display="block" mt={0.3}>
                          {formatFecha(orden.fechaActualizacion)}
                        </Typography>
                      </Box>
                    </Box>
                    {i < ultimasOrdenes.length - 1 && <Divider />}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Inventario critico */}
          <Grid item xs={12} md={5}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h3">Inventario Crítico</Typography>
                  {stockBajo > 0 && (
                    <Chip
                      label={`${stockBajo} alertas`}
                      size="small"
                      sx={{ backgroundColor: 'rgba(220,38,38,0.1)', color: '#DC2626', fontWeight: 600, fontSize: 11 }}
                    />
                  )}
                </Box>
                {inventario.filter((i) => i.cantidad <= i.stockMinimo).slice(0, 6).map((item) => (
                  <Box key={item.id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75, alignItems: 'center' }}>
                      <Typography variant="caption" fontWeight={600} noWrap sx={{ maxWidth: '65%' }}>
                        {item.descripcion}
                      </Typography>
                      <Chip
                        label={`${item.cantidad}/${item.stockMinimo}`}
                        size="small"
                        sx={{
                          fontSize: 11,
                          height: 20,
                          fontWeight: 700,
                          backgroundColor: item.cantidad === 0 ? 'rgba(220,38,38,0.1)' : 'rgba(217,119,6,0.1)',
                          color: item.cantidad === 0 ? '#DC2626' : '#D97706',
                          border: 'none',
                        }}
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((item.cantidad / item.stockMinimo) * 100, 100)}
                      sx={{
                        height: 5,
                        borderRadius: 3,
                        backgroundColor: isLight ? '#F1F5F9' : '#1E293B',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: item.cantidad === 0 ? '#DC2626' : '#D97706',
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>
                ))}
                {inventario.filter((i) => i.cantidad <= i.stockMinimo).length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Sin alertas de inventario
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Vista mecánico */}
      {isMecanico && (
        <Card>
          <CardContent>
            <Typography variant="h3" sx={{ mb: 2.5 }}>Mis Tareas Asignadas</Typography>
            {misTareas.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No tienes tareas asignadas actualmente.
              </Typography>
            )}
            {misTareas.map((tarea, i) => (
              <Box key={tarea.id}>
                <Box sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box>
                      <Typography variant="body2" fontWeight={700}>
                        {tarea.folio} — {tarea.descripcion}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Orden: {tarea.ordenFolio}
                      </Typography>
                    </Box>
                    <StatusBadge status={tarea.estado} type="tarea" />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <LinearProgress
                      variant="determinate"
                      value={tarea.avance}
                      sx={{
                        flexGrow: 1,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'rgba(37,99,235,0.1)',
                        '& .MuiLinearProgress-bar': { backgroundColor: '#2563EB', borderRadius: 3 },
                      }}
                    />
                    <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ minWidth: 35 }}>
                      {tarea.avance}%
                    </Typography>
                  </Box>
                </Box>
                {i < misTareas.length - 1 && <Divider />}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Vista certificado */}
      {isCertificado && (
        <Card>
          <CardContent>
            <Typography variant="h3" sx={{ mb: 2.5 }}>Tareas Completadas por Validar</Typography>
            {tareasAValidar.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No hay tareas pendientes de validación.
              </Typography>
            )}
            {tareasAValidar.map((tarea, i) => (
              <Box key={tarea.id}>
                <Box sx={{ py: 1.75, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" fontWeight={700}>
                      {tarea.folio} — {tarea.descripcion}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Realizado por: {tarea.asignadoA} · Orden: {tarea.ordenFolio}
                    </Typography>
                  </Box>
                  <StatusBadge status={tarea.estado} type="tarea" />
                </Box>
                {i < tareasAValidar.length - 1 && <Divider />}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
