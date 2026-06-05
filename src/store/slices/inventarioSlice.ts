import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ItemInventario, MovimientoInventario } from '../../modules/inventario/types/inventario.types'
import { mockInventario, mockMovimientos } from '../../modules/inventario/data/inventario.mock'

interface InventarioState {
  items: ItemInventario[]
  movimientos: MovimientoInventario[]
  loading: boolean
}

const initialState: InventarioState = {
  items: mockInventario,
  movimientos: mockMovimientos,
  loading: false,
}

const inventarioSlice = createSlice({
  name: 'inventario',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<ItemInventario>) => {
      state.items.unshift(action.payload)
    },
    updateItem: (state, action: PayloadAction<ItemInventario>) => {
      const idx = state.items.findIndex((i) => i.id === action.payload.id)
      if (idx !== -1) state.items[idx] = action.payload
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload)
    },
    addMovimiento: (state, action: PayloadAction<MovimientoInventario>) => {
      state.movimientos.unshift(action.payload)
    },
    setItems: (state, action: PayloadAction<ItemInventario[]>) => {
      state.items = action.payload
    },
  },
})

export const { addItem, updateItem, deleteItem, addMovimiento, setItems } = inventarioSlice.actions
export default inventarioSlice.reducer
