import { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, Switch, FormControlLabel, MenuItem
} from '@mui/material'
import { Servicio } from '../types/servicio.types'
import { useAppSelector } from '../../../store'

interface Props {
  open: boolean
  servicio: Servicio | null
  onClose: () => void
  onSave: (data: Omit<Servicio, 'id' | 'fechaCreacion'>) => void
}

type FormData = Omit<Servicio, 'id' | 'fechaCreacion'>

const defaultForm: FormData = {
  clave: '', descripcion: '', agrupacionId: '', agrupacionNombre: '',
  precioVenta: 0, unidad: 'EVENTO', activo: true,
}

export function ServicioFormDialog({ open, servicio, onClose, onSave }: Props) {
  const agrupaciones = useAppSelector((s) => s.catalogos.agrupaciones)
  const [form, setForm] = useState<FormData>(defaultForm)

  useEffect(() => {
    if (servicio) {
      setForm({ clave: servicio.clave, descripcion: servicio.descripcion, agrupacionId: servicio.agrupacionId, agrupacionNombre: servicio.agrupacionNombre, precioVenta: servicio.precioVenta, precioAnterior: servicio.precioAnterior, unidad: servicio.unidad, activo: servicio.activo })
    } else {
      setForm(defaultForm)
    }
  }, [servicio, open])

  const set = (field: keyof FormData, value: string | number | boolean) => setForm((p) => ({ ...p, [field]: value }))

  const handleAgrupacion = (id: string) => {
    const ag = agrupaciones.find((a) => a.id === id)
    setForm((p) => ({ ...p, agrupacionId: id, agrupacionNombre: ag?.nombre ?? '' }))
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={700}>{servicio ? 'Editar Servicio' : 'Nuevo Servicio'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={4}><TextField label="Clave" value={form.clave} onChange={(e) => set('clave', e.target.value)} fullWidth required /></Grid>
          <Grid item xs={8}><TextField label="Descripción" value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} fullWidth required /></Grid>
          <Grid item xs={12}>
            <TextField select label="Agrupación de Facturación" value={form.agrupacionId} onChange={(e) => handleAgrupacion(e.target.value)} fullWidth>
              {agrupaciones.map((a) => <MenuItem key={a.id} value={a.id}>{a.nombre}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={4}><TextField label="Unidad" value={form.unidad} onChange={(e) => set('unidad', e.target.value)} fullWidth /></Grid>
          <Grid item xs={4}><TextField label="Precio Venta" type="number" value={form.precioVenta} onChange={(e) => set('precioVenta', Number(e.target.value))} fullWidth /></Grid>
          <Grid item xs={4}><TextField label="Precio Anterior" type="number" value={form.precioAnterior ?? ''} onChange={(e) => set('precioAnterior', Number(e.target.value))} fullWidth /></Grid>
          <Grid item xs={12}>
            <FormControlLabel control={<Switch checked={form.activo} onChange={(e) => set('activo', e.target.checked)} />} label="Servicio activo" />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={() => onSave(form)} disabled={!form.clave || !form.descripcion}>
          {servicio ? 'Guardar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
