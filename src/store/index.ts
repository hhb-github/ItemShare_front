import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// 导入reducers
import userReducer from './slices/userSlice';
import itemReducer from './slices/itemSlice';
import messageReducer from './slices/messageSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'] // 只持久化user状态
};

const rootReducer = combineReducers({
  user: userReducer,
  item: itemReducer,
  message: messageReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;