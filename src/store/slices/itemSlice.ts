import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Item {
  id: number;
  title: string;
  description: string;
  category: string;
  condition: string;
  price?: number;
  status: number;
  images: string[];
  userId: number;
  userNickname?: string;
  createdAt: string;
  updatedAt: string;
}

interface ItemState {
  items: Item[];
  currentItem: Item | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
}

const initialState: ItemState = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
  pagination: {
    page: 0,
    size: 20,
    total: 0,
    totalPages: 0
  }
};

const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setItems: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentItem: (state, action: PayloadAction<Item | null>) => {
      state.currentItem = action.payload;
      state.loading = false;
      state.error = null;
    },
    addItem: (state, action: PayloadAction<Item>) => {
      state.items.unshift(action.payload);
    },
    updateItem: (state, action: PayloadAction<Item>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.currentItem?.id === action.payload.id) {
        state.currentItem = action.payload;
      }
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      if (state.currentItem?.id === action.payload) {
        state.currentItem = null;
      }
    },
    setPagination: (state, action: PayloadAction<typeof initialState.pagination>) => {
      state.pagination = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  setLoading,
  setItems,
  setCurrentItem,
  addItem,
  updateItem,
  removeItem,
  setPagination,
  setError,
  clearError
} = itemSlice.actions;

export default itemSlice.reducer;