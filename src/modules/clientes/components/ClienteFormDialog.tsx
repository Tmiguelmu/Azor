import { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, Switch, FormControlLabel, Typography
} from '@mui/material'
import { Cliente } from '../types/cliente.types'

interface Props {
  open: boolean
  cliente: Cliente | null
  onClose: () => void
  onSave: (data: Omit<Cliente, 'id' | 'fechaCreacion'>) => void
}

type FormData = Omit<Cliente, 'id' | 'fechaCreacion'>

const defaultForm: FormData = {
  clave: '', nombre: '', razonSocial: '', rfc: '', direccion: '', ciudad: '',
  estado: '', cp: '', telefono: '', contacto: '', email: '', direccionFiscal: '', activo: true,
}

export function ClienteFormDialog({ open, cliente, onClose, onSave }: Props) {
  const [form, setForm] = useState<FormData>(defaultForm)

  useEffect(() => {
    if (cliente) {
      setForm({ clave: cliente.clave, nombre: cliente.nombre, razonSocial: cliente.razonSocial, rfc: cliente.rfc, direccion: cliente.direccion, ciudad: cliente.ciudad, estado: cliente.estado, cp: cliente.cp, telefono: cliente.telefono, contacto: cliente.contacto, email: cliente.email, direccionFiscal: cliente.direccionFiscal, activo: cliente.activo })
    } else {
      setForm(defaultForm)
    }
  }, [cliente, open])

  const set = (field: keyof FormData, value: string | boolean) => setForm((p) => ({ ...p, [field]: value }))

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle fontWeight={700}>{cliente ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle2" color="primary" mt={1} mb={1.5} fontWeight={700}>Datos Generales</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}><TextField label="Clave" value={form.clave} onChange={(e) => set('clave', e.target.value)} fullWidth required /></Grid>
          <Grid item xs={8}><TextField label="Nombre Comercial" value={form.nombre} onChange={(e) => set('nombre', e.target.value)} fullWidth required /></Grid>
          <Grid item xs={8}><TextField label="Razón Social" value={form.razonSocial} onChange={(e) => set('razonSocial', e.target.value)} fullWidth /></Grid>
          <Grid item xs={4}><TextField label="RFC" value={form.rfc} onChange={(e) => set('rfc', e.target.value)} fullWidth /></Grid>
          <Grid item xs={12}><TextField label="Dirección" value={form.direccion} onChange={(e) => set('direccion', e.target.value)} fullWidth /></Grid>
          <Grid item xs={4}><TextField label="Ciudad" value={form.ciudad} onChange={(e) => set('ciudad', e.target.value)} fullWidth /></Grid>
          <Grid item xs={4}><TextField label="Estado" value={form.estado} onChange={(e) => set('estado', e.target.value)} fullWidth /></Grid>
          <Grid item xs={4}><TextField label="C.P." value={form.cp} onChange={(e) => set('cp', e.target.value)} fullWidth /></Grid>
          <Grid item xs={6}><TextField label="Teléfono" value={form.telefono} onChange={(e) => set('telefono', e.target.value)} fullWidth /></Grid>
          <Grid item xs={6}><TextField label="Email" type="email" value={form.email ?? ''} onChange={(e) => set('email', e.target.value)} fullWidth /></Grid>
          <Grid item xs={12}><TextField label="Contacto Principal" value={form.contacto} onChange={(e) => set('contacto', e.target.value)} fullWidth /></Grid>
          <Grid item xs={12}><TextField label="Dirección Fiscal" value={form.direccionFiscal ?? ''} onChange={(e) => set('direccionFiscal', e.target.value)} fullWidth multiline rows={2} /></Grid>
          <Grid item xs={12}>
            <FormControlLabel control={<Switch checked={form.activo} onChange={(e) => set('activo', e.target.checked)} />} label="Cliente activo" />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={() => onSave(form)} disabled={!form.clave || !form.nombre}>
          {cliente ? 'Guardar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
