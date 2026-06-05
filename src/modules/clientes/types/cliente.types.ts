export interface Cliente {
  id: string
  clave: string
  nombre: string
  razonSocial: string
  rfc: string
  direccion: string
  ciudad: string
  estado: string
  cp: string
  telefono: string
  contacto: string
  email?: string
  direccionFiscal?: string
  activo: boolean
  fechaCreacion: string
}
