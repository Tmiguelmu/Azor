import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Tarea } from '../../modules/tareas/types/tarea.types'
import { mockTareas } from '../../modules/tareas/data/tareas.mock'

interface TareasState {
  tareas: Tarea[]
  loading: boolean
}

const initialState: TareasState = {
  tareas: mockTareas,
  loading: false,
}

const tareasSlice = createSlice({
  name: 'tareas',
  initialState,
  reducers: {
    addTarea: (state, action: PayloadAction<Tarea>) => {
      state.tareas.unshift(action.payload)
    },
    updateTarea: (state, action: PayloadAction<Tarea>) => {
      const idx = state.tareas.findIndex((t) => t.id === action.payload.id)
      if (idx !== -1) state.tareas[idx] = action.payload
    },
    deleteTarea: (state, action: PayloadAction<string>) => {
      state.tareas = state.tareas.filter((t) => t.id !== action.payload)
    },
    setTareas: (state, action: PayloadAction<Tarea[]>) => {
      state.tareas = action.payload
    },
  },
})

export const { addTarea, updateTarea, deleteTarea, setTareas } = tareasSlice.actions
export default tareasSlice.reducer
