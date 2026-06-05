import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthUser } from '../../shared/types/auth.types'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  rememberMe: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  rememberMe: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: AuthUser; rememberMe: boolean }>) => {
      state.user = action.payload.user
      state.isAuthenticated = true
      state.rememberMe = action.payload.rememberMe
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.rememberMe = false
    },
    updateUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload
    },
  },
})

export const { loginSuccess, logout, updateUser } = authSlice.actions
export default authSlice.reducer
