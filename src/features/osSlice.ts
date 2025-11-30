import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DesktopState, WindowState } from '../types';

const initialState: DesktopState = {
  windows: [],
  activeWindowId: null,
};

const osSlice = createSlice({
  name: 'os',
  initialState,
  reducers: {
    openWindow: (state, action: PayloadAction<WindowState>) => {
      const existingWindow = state.windows.find(w => w.id === action.payload.id);
      if (existingWindow) {
        existingWindow.isOpen = true;
        existingWindow.isMinimized = false;
        state.activeWindowId = existingWindow.id;
        
        // Bring to front logic (simple version)
        state.windows.forEach(w => w.zIndex = 1);
        existingWindow.zIndex = 10;
      } else {
        const newWindow = { ...action.payload, isOpen: true, zIndex: 10 };
        state.windows.push(newWindow);
        state.activeWindowId = newWindow.id;
        
        // Reset others z-index
        state.windows.forEach(w => {
            if (w.id !== newWindow.id) w.zIndex = 1;
        });
      }
    },
    closeWindow: (state, action: PayloadAction<string>) => {
      const window = state.windows.find(w => w.id === action.payload);
      if (window) {
        window.isOpen = false;
        if (state.activeWindowId === action.payload) {
          state.activeWindowId = null;
        }
      }
    },
    minimizeWindow: (state, action: PayloadAction<string>) => {
      const window = state.windows.find(w => w.id === action.payload);
      if (window) {
        window.isMinimized = true;
        if (state.activeWindowId === action.payload) {
          state.activeWindowId = null;
        }
      }
    },
    maximizeWindow: (state, action: PayloadAction<string>) => {
      const window = state.windows.find(w => w.id === action.payload);
      if (window) {
          window.isMaximized = !window.isMaximized;
      }
    },
    focusWindow: (state, action: PayloadAction<string>) => {
      const window = state.windows.find(w => w.id === action.payload);
      if (window) {
        state.activeWindowId = window.id;
        window.isMinimized = false;
        
        // Z-Index Management
        state.windows.forEach(w => w.zIndex = 1);
        window.zIndex = 10;
      }
    },
  },
});

export const { openWindow, closeWindow, minimizeWindow, maximizeWindow, focusWindow } = osSlice.actions;
export default osSlice.reducer;