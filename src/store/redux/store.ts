import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from './authSlice';
import cartReducer from './cartSlice';

export const reduxStore = configureStore({
  reducer: { auth: authReducer, cartRedux: cartReducer },
});

export type ReduxRootState = ReturnType<typeof reduxStore.getState>;
export type ReduxDispatch = typeof reduxStore.dispatch;