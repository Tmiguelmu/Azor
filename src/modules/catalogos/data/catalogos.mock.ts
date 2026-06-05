import { AgrupacionFacturacion } from '../types/catalogo.types'

export const mockAgrupaciones: AgrupacionFacturacion[] = [
  { id: 'ag1', clave: 'MTO', nombre: 'Mantenimiento Mecánico', descripcion: 'Mano de obra y servicios de mantenimiento', fechaCreacion: '2022-01-01' },
  { id: 'ag2', clave: 'SUM', nombre: 'Suministros', descripcion: 'Lubricantes, fluidos y consumibles', fechaCreacion: '2022-01-01' },
  { id: 'ag3', clave: 'ALM', nombre: 'Salidas Almacén', descripcion: 'Partes y refacciones del inventario', fechaCreacion: '2022-01-01' },
  { id: 'ag4', clave: 'SLN', nombre: 'Servicio Línea', descripcion: 'Combustible, hangaraje, rampa', fechaCreacion: '2022-01-01' },
  { id: 'ag5', clave: 'AVN', nombre: 'Aviónica y Radiocomunicaciones', descripcion: 'Equipos y sistemas electrónicos', fechaCreacion: '2022-06-01' },
  { id: 'ag6', clave: 'NDT', nombre: 'Pruebas No Destructivas', descripcion: 'Ultrasonido, rayos X, magnaflux', fechaCreacion: '2022-06-01' },
  { id: 'ag7', clave: 'LAC', nombre: 'Laqueado y Acabados', descripcion: 'Pintura y tratamientos de superficie', fechaCreacion: '2023-03-01' },
]
