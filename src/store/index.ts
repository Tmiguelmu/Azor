import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import ordenesReducer from './slices/ordenesSlice'
import tareasReducer from './slices/tareasSlice'
import inventarioReducer from './slices/inventarioSlice'
import clientesReducer from './slices/clientesSlice'
import serviciosReducer from './slices/serviciosSlice'
import usuariosReducer from './slices/usuariosSlice'
import catalogosReducer from './slices/catalogosSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  ordenes: ordenesReducer,
  tareas: tareasReducer,
  inventario: inventarioReducer,
  clientes: clientesReducer,
  servicios: serviciosReducer,
  usuarios: usuariosReducer,
  catalogos: catalogosReducer,
})

const persistConfig = {
  key: 'azor-root',
  storage,
  whitelist: ['auth', 'ui'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
