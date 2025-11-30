import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryState, EvidenceItem } from '../types';

const initialState: InventoryState = {
  items: [],
  selectedItemId: null,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<EvidenceItem>) => {
      // Prevent duplicate items
      if (!state.items.find(item => item.id === action.payload.id)) {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    selectItem: (state, action: PayloadAction<string | null>) => {
      state.selectedItemId = action.payload;
    },
  },
});

export const { addItem, removeItem, selectItem } = inventorySlice.actions;
export default inventorySlice.reducer;