import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { OrdenTrabajo } from '../../modules/ordenes-trabajo/types/orden.types'
import { mockOrdenes } from '../../modules/ordenes-trabajo/data/ordenes.mock'

interface OrdenesState {
  ordenes: OrdenTrabajo[]
  loading: boolean
}

const initialState: OrdenesState = {
  ordenes: mockOrdenes,
  loading: false,
}

const ordenesSlice = createSlice({
  name: 'ordenes',
  initialState,
  reducers: {
    addOrden: (state, action: PayloadAction<OrdenTrabajo>) => {
      state.ordenes.unshift(action.payload)
    },
    updateOrden: (state, action: PayloadAction<OrdenTrabajo>) => {
      const idx = state.ordenes.findIndex((o) => o.id === action.payload.id)
      if (idx !== -1) state.ordenes[idx] = action.payload
    },
    deleteOrden: (state, action: PayloadAction<string>) => {
      state.ordenes = state.ordenes.filter((o) => o.id !== action.payload)
    },
    setOrdenes: (state, action: PayloadAction<OrdenTrabajo[]>) => {
      state.ordenes = action.payload
    },
  },
})

export const { addOrden, updateOrden, deleteOrden, setOrdenes } = ordenesSlice.actions
export default ordenesSlice.reducer
