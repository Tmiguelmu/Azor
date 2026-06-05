import { UserRole } from '../../shared/types/auth.types'

export interface NavItem {
  label: string
  path: string
  icon: string
  permission?: string
  roles?: UserRole[]
  dividerAfter?: boolean
  badge?: number
  subItems?: NavItem[]
}

export interface NavSection {
  sectionLabel: string
  items: NavItem[]
}

/** Estructura de navegacion por secciones para el sidebar estilo Linear/Notion */
export const navSections: NavSection[] = [
  {
    sectionLabel: 'General',
    items: [
      {
        label: 'Dashboard',
        path: '/dashboard',
        icon: 'Dashboard',
        roles: ['admin', 'gerencia', 'ingenieria', 'inspector', 'mecanico', 'mecanico_certificado', 'almacen'],
      },
    ],
  },
  {
    sectionLabel: 'Operaciones',
    items: [
      {
        label: 'Órdenes de Trabajo',
        path: '/ordenes',
        icon: 'Assignment',
        roles: ['admin', 'gerencia', 'ingenieria', 'inspector'],
      },
      {
        label: 'Tareas',
        path: '/tareas',
        icon: 'Task',
        roles: ['admin', 'gerencia', 'ingenieria', 'inspector'],
        subItems: [
          { label: 'Todas las Tareas', path: '/tareas', icon: 'Task', roles: ['admin', 'gerencia', 'ingenieria', 'inspector'] },
          { label: 'Mis Tareas', path: '/mis-tareas', icon: 'BuildCircle', roles: ['mecanico'] },
          { label: 'Por Validar', path: '/tareas-validar', icon: 'VerifiedUser', roles: ['mecanico_certificado'] },
        ],
      },
      {
        label: 'Mis Tareas',
        path: '/mis-tareas',
        icon: 'BuildCircle',
        roles: ['mecanico'],
      },
      {
        label: 'Tareas por Validar',
        path: '/tareas-validar',
        icon: 'VerifiedUser',
        roles: ['mecanico_certificado'],
      },
    ],
  },
  {
    sectionLabel: 'Inventario',
    items: [
      {
        label: 'Stock',
        path: '/inventario',
        icon: 'Inventory',
        roles: ['admin', 'gerencia', 'ingenieria', 'almacen'],
      },
      {
        label: 'Movimientos',
        path: '/inventario/movimientos',
        icon: 'SwapHoriz',
        roles: ['admin', 'gerencia', 'almacen'],
      },
    ],
  },
  {
    sectionLabel: 'Catálogos',
    items: [
      {
        label: 'Clientes',
        path: '/clientes',
        icon: 'People',
        roles: ['admin', 'gerencia'],
      },
      {
        label: 'Servicios',
        path: '/servicios',
        icon: 'MiscellaneousServices',
        roles: ['admin', 'gerencia', 'ingenieria'],
      },
      {
        label: 'Agrupaciones',
        path: '/catalogos',
        icon: 'Category',
        roles: ['admin', 'gerencia'],
      },
    ],
  },
  {
    sectionLabel: 'Sistema',
    items: [
      {
        label: 'Usuarios',
        path: '/usuarios',
        icon: 'ManageAccounts',
        roles: ['admin', 'gerencia'],
      },
      {
        label: 'Roles',
        path: '/roles',
        icon: 'Shield',
        roles: ['admin', 'gerencia'],
      },
      {
        label: 'Reportes',
        path: '/reportes',
        icon: 'BarChart',
        roles: ['admin', 'gerencia'],
      },
    ],
  },
]

/** Flat list para compatibilidad */
export const navItems = navSections.flatMap((s) => s.items)

export function getNavSectionsForRole(rol: UserRole): NavSection[] {
  return navSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.roles || item.roles.includes(rol)),
    }))
    .filter((section) => section.items.length > 0)
}

export function getNavItemsForRole(rol: UserRole): NavItem[] {
  return navItems.filter((item) => !item.roles || item.roles.includes(rol))
}
