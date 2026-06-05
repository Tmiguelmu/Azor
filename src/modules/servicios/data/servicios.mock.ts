import { Servicio } from '../types/servicio.types'

export const mockServicios: Servicio[] = [
  { id: 's1', clave: 'MTO-001', descripcion: 'Mano de Obra - Inspección Anual', agrupacionId: 'ag1', agrupacionNombre: 'Mantenimiento Mecánico', precioVenta: 18000, precioAnterior: 16500, unidad: 'EVENTO', activo: true, fechaCreacion: '2023-01-01' },
  { id: 's2', clave: 'MTO-002', descripcion: 'Mano de Obra - Inspección 100 Horas', agrupacionId: 'ag1', agrupacionNombre: 'Mantenimiento Mecánico', precioVenta: 12000, precioAnterior: 10000, unidad: 'EVENTO', activo: true, fechaCreacion: '2023-01-01' },
  { id: 's3', clave: 'MTO-003', descripcion: 'Mano de Obra - Cambio de Aceite', agrupacionId: 'ag1', agrupacionNombre: 'Mantenimiento Mecánico', precioVenta: 3500, unidad: 'MOTOR', activo: true, fechaCreacion: '2023-01-01' },
  { id: 's4', clave: 'MTO-004', descripcion: 'Mano de Obra - Cambio de Bujías', agrupacionId: 'ag1', agrupacionNombre: 'Mantenimiento Mecánico', precioVenta: 5500, unidad: 'MOTOR', activo: true, fechaCreacion: '2023-01-01' },
  { id: 's5', clave: 'MTO-005', descripcion: 'Mano de Obra - Revisión Tren de Aterrizaje', agrupacionId: 'ag1', agrupacionNombre: 'Mantenimiento Mecánico', precioVenta: 8500, unidad: 'EVENTO', activo: true, fechaCreacion: '2023-01-01' },
  { id: 's6', clave: 'SLN-001', descripcion: 'Servicio de Línea - Despacho de Combustible JET-A', agrupacionId: 'ag4', agrupacionNombre: 'Servicio Línea', precioVenta: 28.5, unidad: 'GAL', activo: true, fechaCreacion: '2023-01-01' },
  { id: 's7', clave: 'SLN-002', descripcion: 'Servicio de Línea - Despacho AVGAS 100LL', agrupacionId: 'ag4', agrupacionNombre: 'Servicio Línea', precioVenta: 32.0, precioAnterior: 29.5, unidad: 'GAL', activo: true, fechaCreacion: '2023-01-01' },
  { id: 's8', clave: 'SLN-003', descripcion: 'Hangaraje nocturno', agrupacionId: 'ag4', agrupacionNombre: 'Servicio Línea', precioVenta: 1800, unidad: 'NOCHE', activo: true, fechaCreacion: '2023-01-01' },
  { id: 's9', clave: 'SUM-001', descripcion: 'Aceite Aeroshell 100W', agrupacionId: 'ag2', agrupacionNombre: 'Suministros', precioVenta: 980, unidad: 'QT', activo: true, fechaCreacion: '2023-01-01' },
  { id: 's10', clave: 'SUM-002', descripcion: 'Aceite Aeroshell W80 Plus', agrupacionId: 'ag2', agrupacionNombre: 'Suministros', precioVenta: 1050, unidad: 'QT', activo: true, fechaCreacion: '2023-01-01' },
  { id: 's11', clave: 'ALM-001', descripcion: 'Filtro de aceite genérico', agrupacionId: 'ag3', agrupacionNombre: 'Salidas Almacén', precioVenta: 2800, unidad: 'PZA', activo: true, fechaCreacion: '2023-01-01' },
  { id: 's12', clave: 'ALM-002', descripcion: 'Bujías Champion RHB32E', agrupacionId: 'ag3', agrupacionNombre: 'Salidas Almacén', precioVenta: 890, unidad: 'PZA', activo: true, fechaCreacion: '2023-01-01' },
  { id: 's13', clave: 'AVN-001', descripcion: 'Actualización base de datos GPS Garmin', agrupacionId: 'ag5', agrupacionNombre: 'Aviónica y Radiocomunicaciones', precioVenta: 4500, unidad: 'EVENTO', activo: true, fechaCreacion: '2023-06-01' },
  { id: 's14', clave: 'AVN-002', descripcion: 'Calibración altímetro', agrupacionId: 'ag5', agrupacionNombre: 'Aviónica y Radiocomunicaciones', precioVenta: 8500, unidad: 'EVENTO', activo: true, fechaCreacion: '2023-06-01' },
  { id: 's15', clave: 'NDT-001', descripcion: 'Inspección NDT - Ultrasonido', agrupacionId: 'ag6', agrupacionNombre: 'Pruebas No Destructivas', precioVenta: 15000, unidad: 'HR', activo: false, fechaCreacion: '2023-01-01' },
]
