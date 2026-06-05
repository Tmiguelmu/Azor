import { Cliente } from '../types/cliente.types'

export const mockClientes: Cliente[] = [
  {
    id: 'c1', clave: 'AG-001', nombre: 'AERO GALAXY', razonSocial: 'AERO GALAXY S.A. DE C.V.',
    rfc: 'AGA951028ABC', direccion: 'Av. Aeropuerto No. 120', ciudad: 'Monterrey', estado: 'Nuevo León',
    cp: '64590', telefono: '81 8340 1200', contacto: 'Ing. Fernando Castillo',
    email: 'ops@aerogalaxy.mx', activo: true, fechaCreacion: '2022-03-15',
    direccionFiscal: 'Av. Aeropuerto No. 120, Col. Industrial, Monterrey, N.L. CP 64590',
  },
  {
    id: 'c2', clave: 'AS-002', nombre: 'AERO SAMI', razonSocial: 'AERO SAMI S.A. DE C.V.',
    rfc: 'ASA010502XYZ', direccion: 'Blvd. Aeropuerto Sur 580', ciudad: 'Guadalajara', estado: 'Jalisco',
    cp: '45019', telefono: '33 3678 9900', contacto: 'Lic. Samuel Iturbe',
    email: 'sami@aerosami.com', activo: true, fechaCreacion: '2022-07-20',
  },
  {
    id: 'c3', clave: 'AA-003', nombre: 'ADAMS AVIATION', razonSocial: 'ADAMS AVIATION S. DE R.L. DE C.V.',
    rfc: 'AAS030812MNO', direccion: 'Hangar 12, Aeropuerto Int. MMMY', ciudad: 'Mérida', estado: 'Yucatán',
    cp: '97302', telefono: '999 987 4560', contacto: 'Mr. Robert Adams',
    email: 'robert@adamsaviation.com', activo: true, fechaCreacion: '2023-01-10',
  },
  {
    id: 'c4', clave: 'AC-004', nombre: 'AEROCENTER', razonSocial: 'AEROCENTER S.A.',
    rfc: 'ACE980211PQR', direccion: 'Terminal de Aviación General, Local 5', ciudad: 'Ciudad de México', estado: 'CDMX',
    cp: '15600', telefono: '55 5786 3300', contacto: 'Ing. María Elena Soto',
    email: 'msoto@aerocenter.com.mx', activo: true, fechaCreacion: '2021-06-05',
  },
  {
    id: 'c5', clave: 'ADN-005', nombre: 'AERODINAMICA DEL NORTE', razonSocial: 'AERODINAMICA DEL NORTE S.A. DE C.V.',
    rfc: 'ADN150320STU', direccion: 'Calle Aviación No. 45, Col. Industrial', ciudad: 'Chihuahua', estado: 'Chihuahua',
    cp: '31020', telefono: '614 432 8800', contacto: 'C.P. Javier Moreno',
    email: 'jmoreno@aerodinamica.mx', activo: true, fechaCreacion: '2023-09-18',
  },
  {
    id: 'c6', clave: 'VA-006', nombre: 'VUELOS AZTECA', razonSocial: 'VUELOS AZTECA S.A. DE C.V.',
    rfc: 'VAZ061115VWX', direccion: 'Aeropuerto Int. de Tijuana, Hangar 8', ciudad: 'Tijuana', estado: 'Baja California',
    cp: '22435', telefono: '664 683 2200', contacto: 'Lic. Patricia Luna',
    email: 'pluna@vueloazteca.mx', activo: false, fechaCreacion: '2020-11-25',
  },
]
