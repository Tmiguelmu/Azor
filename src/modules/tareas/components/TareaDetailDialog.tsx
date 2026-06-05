import { useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography,
  Grid, Slider, TextField, Divider, Chip, FormControl, InputLabel, Select, MenuItem
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { Tarea } from '../types/tarea.types'
import { StatusBadge } from '../../../shared/components/StatusBadge'
import { FileUploader, UploadedFile } from '../../../shared/components/FileUploader'
import { usePermissions } from '../../../shared/hooks/usePermissions'
import { useAppSelector } from '../../../store'
import { getRolLabel } from '../../../shared/utils/rolLabels'
import { UserRole } from '../../../shared/types/auth.types'

interface TareaDetailDialogProps {
  open: boolean
  tarea: Tarea
  onClose: () => void
  onUpdate: (tarea: Tarea) => void
}

export function TareaDetailDialog({ open, tarea, onClose, onUpdate }: TareaDetailDialogProps) {
  const { can, rol } = usePermissions()
  const usuarios = useAppSelector((s) => s.usuarios.usuarios)

  const [avance, setAvance] = useState(tarea.avance)
  const [notas, setNotas] = useState(tarea.notas ?? '')
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [asignadoAId, setAsignadoAId] = useState(tarea.asignadoAId ?? '')
  const [rechazarNota, setRechazarNota] = useState('')

  const mecanicos = usuarios.filter((u) => u.rol === 'mecanico' && u.activo)

  const handleGuardarAvance = () => {
    const asignado = usuarios.find((u) => u.id === asignadoAId)
    onUpdate({
      ...tarea,
      avance,
      notas,
      asignadoAId: asignadoAId || tarea.asignadoAId,
      asignadoA: asignado?.nombre ?? tarea.asignadoA,
      estado: avance >= 100 ? 'completada' : tarea.estado === 'pendiente' ? 'pendiente' : tarea.estado,
      fechaActualizacion: new Date().toISOString(),
    })
  }

  const handleAsignar = () => {
    const asignado = usuarios.find((u) => u.id === asignadoAId)
    onUpdate({
      ...tarea,
      asignadoAId,
      asignadoA: asignado?.nombre ?? '',
      estado: 'asignada',
      fechaActualizacion: new Date().toISOString(),
    })
  }

  const handleAutorizar = () => {
    onUpdate({ ...tarea, estado: 'autorizada', autorizadoPor: 'Luis Hernández', fechaActualizacion: new Date().toISOString() })
  }

  const handleValidar = () => {
    onUpdate({ ...tarea, estado: 'validada', fechaActualizacion: new Date().toISOString() })
  }

  const handleRechazar = () => {
    onUpdate({ ...tarea, estado: 'rechazada', notas: rechazarNota || tarea.notas, fechaActualizacion: new Date().toISOString() })
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography fontWeight={700}>{tarea.folio} - {tarea.descripcion}</Typography>
            <Typography variant="caption" color="text.secondary">Orden: {tarea.ordenFolio}</Typography>
          </Box>
          <StatusBadge status={tarea.estado} type="tarea" size="medium" />
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          {/* Info general */}
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">Prioridad</Typography>
            <Box>
              <Chip label={tarea.prioridad.toUpperCase()} size="small" color={tarea.prioridad === 'critica' ? 'error' : tarea.prioridad === 'alta' ? 'warning' : 'default'} />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">Asignado a</Typography>
            <Typography variant="body2" fontWeight={600}>{tarea.asignadoA ?? 'Sin asignar'}</Typography>
          </Grid>
          {tarea.detalle && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">Detalle</Typography>
              <Typography variant="body2">{tarea.detalle}</Typography>
            </Grid>
          )}

          <Grid item xs={12}><Divider /></Grid>

          {/* Asignar - Inspector */}
          {can('tareas_assign') && (tarea.estado === 'pendiente' || tarea.estado === 'asignada') && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} mb={1}>Asignar Tarea</Typography>
              <FormControl size="small" fullWidth>
                <InputLabel>Mecánico</InputLabel>
                <Select value={asignadoAId} onChange={(e) => setAsignadoAId(e.target.value)} label="Mecánico">
                  {mecanicos.map((m) => (
                    <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="contained" size="small" sx={{ mt: 1 }} onClick={handleAsignar} disabled={!asignadoAId}>
                Asignar
              </Button>
            </Grid>
          )}

          {/* Autorizar - Ingeniería */}
          {can('tareas_authorize') && tarea.estado === 'asignada' && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} mb={1}>Autorizar Tarea</Typography>
              <Button variant="contained" color="success" size="small" onClick={handleAutorizar}>
                Autorizar para Ejecución
              </Button>
            </Grid>
          )}

          {/* Avance - Mecánico */}
          {(rol === 'mecanico' || rol === 'admin' || rol === 'gerencia') && (tarea.estado === 'autorizada' || tarea.estado === 'en_proceso') && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} mb={1}>Avance de Tarea</Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>Avance: {avance}%</Typography>
              <Slider value={avance} onChange={(_, v) => setAvance(v as number)} min={0} max={100} step={5} marks valueLabelDisplay="auto" />
              <TextField
                label="Notas / Observaciones"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                multiline rows={2} fullWidth sx={{ mt: 1.5 }}
              />
              <Typography variant="subtitle2" fontWeight={700} mt={2} mb={1}>Evidencias / Fotos</Typography>
              <FileUploader files={files} onFilesChange={setFiles} />
              <Button variant="contained" size="small" sx={{ mt: 1.5 }} onClick={handleGuardarAvance}>
                Guardar Avance
              </Button>
            </Grid>
          )}

          {/* Validar - Mecánico Certificado */}
          {can('tareas_validate') && tarea.estado === 'completada' && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} mb={1}>Validación de Tarea</Typography>
              <Typography variant="body2" color="text.secondary" mb={1.5}>
                La tarea fue completada por {tarea.asignadoA}. Revisa el trabajo y decide.
              </Typography>
              <TextField
                label="Nota de rechazo (opcional)"
                value={rechazarNota}
                onChange={(e) => setRechazarNota(e.target.value)}
                multiline rows={2} fullWidth sx={{ mb: 1.5 }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" color="success" startIcon={<CheckCircleIcon />} onClick={handleValidar}>
                  Validar
                </Button>
                <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={handleRechazar}>
                  Rechazar
                </Button>
              </Box>
            </Grid>
          )}

          {/* Materiales */}
          {tarea.materiales.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} mb={1}>Materiales Requeridos</Typography>
              {tarea.materiales.map((mat) => (
                <Box key={mat.id} sx={{ display: 'flex', gap: 2, py: 0.7, alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" sx={{ flex: 1 }}>{mat.descripcion}</Typography>
                  <Typography variant="caption" color="text.secondary">{mat.cantidad} {mat.unidad}</Typography>
                  <Chip label={mat.entregado ? 'Entregado' : 'Pendiente'} size="small" color={mat.entregado ? 'success' : 'warning'} sx={{ fontSize: 10 }} />
                </Box>
              ))}
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  )
}
