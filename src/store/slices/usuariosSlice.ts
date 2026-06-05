import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Usuario } from '../../modules/usuarios/types/usuario.types'
import { mockUsuarios } from '../../modules/usuarios/data/usuarios.mock'

interface UsuariosState {
  usuarios: Usuario[]
  loading: boolean
}

const initialState: UsuariosState = {
  usuarios: mockUsuarios,
  loading: false,
}

const usuariosSlice = createSlice({
  name: 'usuarios',
  initialState,
  reducers: {
    addUsuario: (state, action: PayloadAction<Usuario>) => {
      state.usuarios.unshift(action.payload)
    },
    updateUsuario: (state, action: PayloadAction<Usuario>) => {
      const idx = state.usuarios.findIndex((u) => u.id === action.payload.id)
      if (idx !== -1) state.usuarios[idx] = action.payload
    },
    deleteUsuario: (state, action: PayloadAction<string>) => {
      state.usuarios = state.usuarios.filter((u) => u.id !== action.payload)
    },
    toggleUsuarioActivo: (state, action: PayloadAction<string>) => {
      const u = state.usuarios.find((u) => u.id === action.payload)
      if (u) u.activo = !u.activo
    },
  },
})

export const { addUsuario, updateUsuario, deleteUsuario, toggleUsuarioActivo } = usuariosSlice.actions
export default usuariosSlice.reducer
