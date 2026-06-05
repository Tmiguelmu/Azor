import { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Grid, TextField, MenuItem, FormControl, InputLabel, Select
} from '@mui/material'
import { OrdenTrabajo, CreateOrdenDto } from '../types/orden.types'
import { useAppSelector } from '../../../store'

interface OrdenFormDialogProps {
  open: boolean
  orden: OrdenTrabajo | null
  onClose: () => void
  onCreate: (data: CreateOrdenDto) => void
  onUpdate: (data: OrdenTrabajo) => void
}

const defaultForm: CreateOrdenDto = {
  clienteId: '', matricula: '', serie: '', marca: '', modelo: '',
  planeadorHrs: 0, motor1Hrs: 0, ciclos1: 0, aterrizajes: 0,
  comentarios: '', prioridad: 'normal',
}

export function OrdenFormDialog({ open, orden, onClose, onCreate, onUpdate }: OrdenFormDialogProps) {
  const clientes = useAppSelector((s) => s.clientes.clientes)
  const [form, setForm] = useState<CreateOrdenDto>(defaultForm)

  useEffect(() => {
    if (orden) {
      setForm({
        clienteId: orden.clienteId, matricula: orden.matricula, serie: orden.serie,
        marca: orden.marca, modelo: orden.modelo, planeadorHrs: orden.planeadorHrs,
        motor1Hrs: orden.motor1Hrs, motor2Hrs: orden.motor2Hrs,
        ciclos1: orden.ciclos1, aterrizajes: orden.aterrizajes,
        comentarios: orden.comentarios, prioridad: orden.prioridad,
      })
    } else {
      setForm(defaultForm)
    }
  }, [orden, open])

  const setField = (field: keyof CreateOrdenDto, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    const cliente = clientes.find((c) => c.id === form.clienteId)
    if (orden) {
      onUpdate({ ...orden, ...form, clienteNombre: cliente?.nombre ?? orden.clienteNombre, fechaActualizacion: new Date().toISOString() })
    } else {
      onCreate({ ...form })
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle fontWeight={700}>{orden ? 'Editar Orden' : 'Nueva Orden de Trabajo'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Cliente</InputLabel>
              <Select value={form.clienteId} onChange={(e) => setField('clienteId', e.target.value)} label="Cliente">
                {clientes.filter((c) => c.activo).map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField label="Matrícula" value={form.matricula} onChange={(e) => setField('matricula', e.target.value)} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField label="Serie/Número" value={form.serie} onChange={(e) => setField('serie', e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Marca" value={form.marca} onChange={(e) => setField('marca', e.target.value)} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Modelo" value={form.modelo} onChange={(e) => setField('modelo', e.target.value)} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Prioridad</InputLabel>
              <Select value={form.prioridad} onChange={(e) => setField('prioridad', e.target.value)} label="Prioridad">
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="urgente">Urgente</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField label="Planeador Hrs" type="number" value={form.planeadorHrs} onChange={(e) => setField('planeadorHrs', Number(e.target.value))} fullWidth />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField label="Motor 1 Hrs" type="number" value={form.motor1Hrs} onChange={(e) => setField('motor1Hrs', Number(e.target.value))} fullWidth />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField label="Motor 2 Hrs" type="number" value={form.motor2Hrs ?? ''} onChange={(e) => setField('motor2Hrs', Number(e.target.value))} fullWidth />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField label="Ciclos Motor 1" type="number" value={form.ciclos1} onChange={(e) => setField('ciclos1', Number(e.target.value))} fullWidth />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField label="Aterrizajes" type="number" value={form.aterrizajes} onChange={(e) => setField('aterrizajes', Number(e.target.value))} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Comentarios" value={form.comentarios} onChange={(e) => setField('comentarios', e.target.value)} fullWidth multiline rows={3} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!form.clienteId || !form.matricula || !form.marca || !form.modelo}
        >
          {orden ? 'Guardar' : 'Crear Orden'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
