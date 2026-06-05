import { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, MenuItem
} from '@mui/material'
import { ItemInventario } from '../types/inventario.types'

const CATEGORIAS = ['Lubricantes', 'Filtros', 'Electricidad', 'Neumáticos y Frenos', 'Hidráulicos', 'Iluminación', 'Aviónica', 'Sellos y Juntas', 'Seguridad', 'Limpieza', 'Otros']

interface Props {
  open: boolean
  item: ItemInventario | null
  onClose: () => void
  onSave: (data: Omit<ItemInventario, 'id' | 'fechaActualizacion'>) => void
}

type FormData = Omit<ItemInventario, 'id' | 'fechaActualizacion'>

const defaultForm: FormData = {
  codigo: '', descripcion: '', marca: '', cantidad: 0, stockMinimo: 0,
  unidad: 'PZA', ubicacion: '', proveedor: '', precioUnitario: 0, categoria: 'Otros',
}

export function InventarioFormDialog({ open, item, onClose, onSave }: Props) {
  const [form, setForm] = useState<FormData>(defaultForm)

  useEffect(() => {
    if (item) {
      setForm({ codigo: item.codigo, descripcion: item.descripcion, marca: item.marca, cantidad: item.cantidad, stockMinimo: item.stockMinimo, unidad: item.unidad, ubicacion: item.ubicacion, proveedor: item.proveedor, precioUnitario: item.precioUnitario, categoria: item.categoria })
    } else {
      setForm(defaultForm)
    }
  }, [item, open])

  const set = (field: keyof FormData, value: string | number) => setForm((p) => ({ ...p, [field]: value }))

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={700}>{item ? 'Editar Item' : 'Agregar Item'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={6}><TextField label="Código" value={form.codigo} onChange={(e) => set('codigo', e.target.value)} fullWidth required /></Grid>
          <Grid item xs={6}>
            <TextField select label="Categoría" value={form.categoria} onChange={(e) => set('categoria', e.target.value)} fullWidth>
              {CATEGORIAS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12}><TextField label="Descripción" value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} fullWidth required /></Grid>
          <Grid item xs={6}><TextField label="Marca" value={form.marca ?? ''} onChange={(e) => set('marca', e.target.value)} fullWidth /></Grid>
          <Grid item xs={6}><TextField label="Proveedor" value={form.proveedor} onChange={(e) => set('proveedor', e.target.value)} fullWidth /></Grid>
          <Grid item xs={4}><TextField label="Cantidad" type="number" value={form.cantidad} onChange={(e) => set('cantidad', Number(e.target.value))} fullWidth /></Grid>
          <Grid item xs={4}><TextField label="Stock Mínimo" type="number" value={form.stockMinimo} onChange={(e) => set('stockMinimo', Number(e.target.value))} fullWidth /></Grid>
          <Grid item xs={4}><TextField label="Unidad" value={form.unidad} onChange={(e) => set('unidad', e.target.value)} fullWidth /></Grid>
          <Grid item xs={6}><TextField label="Ubicación" value={form.ubicacion} onChange={(e) => set('ubicacion', e.target.value)} fullWidth /></Grid>
          <Grid item xs={6}><TextField label="Precio Unitario" type="number" value={form.precioUnitario} onChange={(e) => set('precioUnitario', Number(e.target.value))} fullWidth /></Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={() => onSave(form)} disabled={!form.codigo || !form.descripcion}>
          {item ? 'Guardar' : 'Agregar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
