import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Servicio } from '../../modules/servicios/types/servicio.types'
import { mockServicios } from '../../modules/servicios/data/servicios.mock'

interface ServiciosState {
  servicios: Servicio[]
  loading: boolean
}

const initialState: ServiciosState = {
  servicios: mockServicios,
  loading: false,
}

const serviciosSlice = createSlice({
  name: 'servicios',
  initialState,
  reducers: {
    addServicio: (state, action: PayloadAction<Servicio>) => {
      state.servicios.unshift(action.payload)
    },
    updateServicio: (state, action: PayloadAction<Servicio>) => {
      const idx = state.servicios.findIndex((s) => s.id === action.payload.id)
      if (idx !== -1) state.servicios[idx] = action.payload
    },
    deleteServicio: (state, action: PayloadAction<string>) => {
      state.servicios = state.servicios.filter((s) => s.id !== action.payload)
    },
    toggleServicioActivo: (state, action: PayloadAction<string>) => {
      const s = state.servicios.find((s) => s.id === action.payload)
      if (s) s.activo = !s.activo
    },
  },
})

export const { addServicio, updateServicio, deleteServicio, toggleServicioActivo } = serviciosSlice.actions
export default serviciosSlice.reducer
