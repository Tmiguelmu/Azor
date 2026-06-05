import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AgrupacionFacturacion } from '../../modules/catalogos/types/catalogo.types'
import { mockAgrupaciones } from '../../modules/catalogos/data/catalogos.mock'

interface CatalogosState {
  agrupaciones: AgrupacionFacturacion[]
  loading: boolean
}

const initialState: CatalogosState = {
  agrupaciones: mockAgrupaciones,
  loading: false,
}

const catalogosSlice = createSlice({
  name: 'catalogos',
  initialState,
  reducers: {
    addAgrupacion: (state, action: PayloadAction<AgrupacionFacturacion>) => {
      state.agrupaciones.unshift(action.payload)
    },
    updateAgrupacion: (state, action: PayloadAction<AgrupacionFacturacion>) => {
      const idx = state.agrupaciones.findIndex((a) => a.id === action.payload.id)
      if (idx !== -1) state.agrupaciones[idx] = action.payload
    },
    deleteAgrupacion: (state, action: PayloadAction<string>) => {
      state.agrupaciones = state.agrupaciones.filter((a) => a.id !== action.payload)
    },
  },
})

export const { addAgrupacion, updateAgrupacion, deleteAgrupacion } = catalogosSlice.actions
export default catalogosSlice.reducer
