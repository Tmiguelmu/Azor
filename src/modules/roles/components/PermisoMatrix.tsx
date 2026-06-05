import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails,
  Checkbox, FormControlLabel, Chip, useTheme,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export interface Permiso {
  key: string
  label: string
}

export interface ModuloPermisos {
  modulo: string
  permisos: Permiso[]
}

export interface PermisosRol {
  [key: string]: boolean
}

interface PermisoMatrixProps {
  permisos: PermisosRol
  onChange: (permisos: PermisosRol) => void
  readOnly?: boolean
}

/** Definición de módulos y sus operaciones CRUD */
export const MODULOS_PERMISOS: ModuloPermisos[] = [
  {
    modulo: 'Órdenes de Trabajo',
    permisos: [
      { key: 'ordenes_read',   label: 'Ver' },
      { key: 'ordenes_write',  label: 'Crear/Editar' },
      { key: 'ordenes_delete', label: 'Eliminar' },
      { key: 'ordenes_export', label: 'Exportar' },
    ],
  },
  {
    modulo: 'Tareas',
    permisos: [
      { key: 'tareas_read',     label: 'Ver' },
      { key: 'tareas_write',    label: 'Crear/Editar' },
      { key: 'tareas_validate', label: 'Validar' },
      { key: 'tareas_assign',   label: 'Asignar' },
    ],
  },
  {
    modulo: 'Inventario',
    permisos: [
      { key: 'inventario_read',   label: 'Ver' },
      { key: 'inventario_write',  label: 'Crear/Editar' },
      { key: 'inventario_delete', label: 'Eliminar' },
      { key: 'movimientos_write', label: 'Movimientos' },
    ],
  },
  {
    modulo: 'Clientes',
    permisos: [
      { key: 'clientes_read',  label: 'Ver' },
      { key: 'clientes_write', label: 'Crear/Editar' },
    ],
  },
  {
    modulo: 'Reportes',
    permisos: [
      { key: 'reportes_read',   label: 'Ver' },
      { key: 'reportes_export', label: 'Exportar' },
    ],
  },
  {
    modulo: 'Usuarios y Roles',
    permisos: [
      { key: 'usuarios_read',  label: 'Ver' },
      { key: 'usuarios_write', label: 'Crear/Editar' },
      { key: 'roles_write',    label: 'Gestionar Roles' },
    ],
  },
]

/**
 * Matriz de permisos por módulo con Accordion.
 * Aplica principio I de SOLID: interfaz segregada para solo lo que necesita.
 */
export function PermisoMatrix({ permisos, onChange, readOnly = false }: PermisoMatrixProps) {
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'

  const toggle = (key: string) => {
    if (readOnly) return
    onChange({ ...permisos, [key]: !permisos[key] })
  }

  const toggleAll = (modulo: ModuloPermisos, value: boolean) => {
    if (readOnly) return
    const updated = { ...permisos }
    modulo.permisos.forEach((p) => { updated[p.key] = value })
    onChange(updated)
  }

  return (
    <Box>
      {MODULOS_PERMISOS.map((mod) => {
        const activos = mod.permisos.filter((p) => permisos[p.key]).length
        const total = mod.permisos.length

        return (
          <Accordion
            key={mod.modulo}
            disableGutters
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '12px !important',
              mb: 1.5,
              '&:before': { display: 'none' },
              '&.Mui-expanded': { borderColor: '#2563EB' },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', mr: 1 }}>
                <Typography variant="body1" fontWeight={600}>{mod.modulo}</Typography>
                <Chip
                  label={`${activos}/${total}`}
                  size="small"
                  sx={{
                    fontSize: 11,
                    height: 22,
                    fontWeight: 700,
                    backgroundColor: activos === total
                      ? 'rgba(5,150,105,0.1)'
                      : activos > 0
                        ? 'rgba(217,119,6,0.1)'
                        : 'rgba(100,116,139,0.1)',
                    color: activos === total ? '#059669' : activos > 0 ? '#D97706' : '#64748B',
                    border: 'none',
                    ml: 'auto',
                    mr: 1,
                  }}
                />
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ px: 2.5, pb: 2 }}>
              {!readOnly && (
                <Box sx={{ mb: 1.5, display: 'flex', gap: 1 }}>
                  <Typography
                    variant="caption"
                    color="primary.main"
                    fontWeight={600}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => toggleAll(mod, true)}
                  >
                    Seleccionar todo
                  </Typography>
                  <Typography variant="caption" color="text.disabled">·</Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => toggleAll(mod, false)}
                  >
                    Deseleccionar
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {mod.permisos.map((p) => (
                  <Box
                    key={p.key}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      px: 1.5,
                      py: 0.75,
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: permisos[p.key] ? '#2563EB' : 'divider',
                      backgroundColor: permisos[p.key] ? 'rgba(37,99,235,0.06)' : 'transparent',
                      cursor: readOnly ? 'default' : 'pointer',
                      transition: 'all 0.15s',
                      '&:hover': readOnly ? {} : { borderColor: '#2563EB' },
                    }}
                    onClick={() => toggle(p.key)}
                  >
                    <Checkbox
                      checked={!!permisos[p.key]}
                      size="small"
                      sx={{ p: 0, color: '#2563EB', '&.Mui-checked': { color: '#2563EB' } }}
                      readOnly={readOnly}
                    />
                    <Typography variant="body2" fontWeight={500}>
                      {p.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        )
      })}
    </Box>
  )
}
