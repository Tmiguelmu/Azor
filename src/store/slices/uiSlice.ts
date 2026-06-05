import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ThemeMode = 'light' | 'dark'

interface UIState {
  themeMode: ThemeMode
  sidebarOpen: boolean
}

const initialState: UIState = {
  themeMode: 'light',
  sidebarOpen: true,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light'
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
  },
})

export const { toggleTheme, setTheme, toggleSidebar, setSidebarOpen } = uiSlice.actions
export default uiSlice.reducer
