import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './features/gameSlice';
import inventoryReducer from './features/inventorySlice';
import pmisReducer from './features/pmisSlice';
import osReducer from './features/osSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    inventory: inventoryReducer,
    pmis: pmisReducer,
    os: osReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;