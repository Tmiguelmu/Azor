import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Cliente } from '../../modules/clientes/types/cliente.types'
import { mockClientes } from '../../modules/clientes/data/clientes.mock'

interface ClientesState {
  clientes: Cliente[]
  loading: boolean
}

const initialState: ClientesState = {
  clientes: mockClientes,
  loading: false,
}

const clientesSlice = createSlice({
  name: 'clientes',
  initialState,
  reducers: {
    addCliente: (state, action: PayloadAction<Cliente>) => {
      state.clientes.unshift(action.payload)
    },
    updateCliente: (state, action: PayloadAction<Cliente>) => {
      const idx = state.clientes.findIndex((c) => c.id === action.payload.id)
      if (idx !== -1) state.clientes[idx] = action.payload
    },
    deleteCliente: (state, action: PayloadAction<string>) => {
      state.clientes = state.clientes.filter((c) => c.id !== action.payload)
    },
    toggleClienteActivo: (state, action: PayloadAction<string>) => {
      const c = state.clientes.find((c) => c.id === action.payload)
      if (c) c.activo = !c.activo
    },
  },
})

export const { addCliente, updateCliente, deleteCliente, toggleClienteActivo } = clientesSlice.actions
export default clientesSlice.reducer
