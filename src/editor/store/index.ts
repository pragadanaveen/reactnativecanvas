import { configureStore } from '@reduxjs/toolkit';
import canvasReducer from './canvasSlice';
import editorReducer from './editorSlice';

export const store = configureStore({
  reducer: {
    canvas: canvasReducer,
    editor: editorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 