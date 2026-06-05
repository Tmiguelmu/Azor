import { useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Grid, TextField, FormControl, InputLabel, Select, MenuItem
} from '@mui/material'
import { Tarea, CreateTareaDto } from '../types/tarea.types'
import { PrioridadTarea } from '../../../shared/types/common.types'
import { useAppSelector } from '../../../store'
import { useAuth } from '../../../core/auth/AuthContext'

interface TareaFormDialogProps {
  open: boolean
  onClose: () => void
  onCreate: (data: Omit<Tarea, 'id' | 'folio' | 'fechaCreacion' | 'fechaActualizacion'>) => void
}

export function TareaFormDialog({ open, onClose, onCreate }: TareaFormDialogProps) {
  const ordenes = useAppSelector((s) => s.ordenes.ordenes)
  const { user } = useAuth()
  const [form, setForm] = useState<CreateTareaDto>({
    ordenId: '', descripcion: '', prioridad: 'media',
  })

  const setField = (field: keyof CreateTareaDto, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    const orden = ordenes.find((o) => o.id === form.ordenId)
    onCreate({
      ordenId: form.ordenId,
      ordenFolio: orden?.folio ?? '',
      descripcion: form.descripcion,
      detalle: form.detalle,
      estado: 'pendiente',
      prioridad: form.prioridad,
      avance: 0,
      creadoPor: user?.nombre ?? 'Sistema',
      evidencias: [],
      materiales: [],
      fechaLimite: form.fechaLimite,
    })
    setForm({ ordenId: '', descripcion: '', prioridad: 'media' })
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={700}>Nueva Tarea</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Orden de Trabajo</InputLabel>
              <Select value={form.ordenId} onChange={(e) => setField('ordenId', e.target.value)} label="Orden de Trabajo">
                {ordenes.filter((o) => o.estado === 'activa' || o.estado === 'en_proceso').map((o) => (
                  <MenuItem key={o.id} value={o.id}>{o.folio} - {o.matricula} ({o.clienteNombre})</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Descripción de la tarea"
              value={form.descripcion}
              onChange={(e) => setField('descripcion', e.target.value)}
              fullWidth required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Detalle (opcional)"
              value={form.detalle ?? ''}
              onChange={(e) => setField('detalle', e.target.value)}
              fullWidth multiline rows={2}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Prioridad</InputLabel>
              <Select value={form.prioridad} onChange={(e) => setField('prioridad', e.target.value as PrioridadTarea)} label="Prioridad">
                <MenuItem value="baja">Baja</MenuItem>
                <MenuItem value="media">Media</MenuItem>
                <MenuItem value="alta">Alta</MenuItem>
                <MenuItem value="critica">Crítica</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Fecha Límite"
              type="date"
              value={form.fechaLimite ?? ''}
              onChange={(e) => setField('fechaLimite', e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!form.ordenId || !form.descripcion}>
          Crear Tarea
        </Button>
      </DialogActions>
    </Dialog>
  )
}
