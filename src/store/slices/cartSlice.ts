import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface WasteItem {
  id: string;
  name: string;
  category: string;
  confidence: number;
  image?: string;
  points: number;
  customCategory?: string;
}

export interface CartState {
  items: WasteItem[];
  totalItems: number;
  totalPoints: number;
  isScanning: boolean;
  scanError: string | null;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPoints: 0,
  isScanning: false,
  scanError: null,
};

// Async thunk for scanning waste items
export const scanWasteItem = createAsyncThunk(
  'cart/scanWasteItem',
  async (imageUri: string, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual AI object detection API call
      const mockDetectedItems: WasteItem[] = [
        {
          id: Date.now().toString(),
          name: 'Plastic Bottle',
          category: 'Plastic',
          confidence: 0.95,
          image: imageUri,
          points: 10,
        },
        {
          id: (Date.now() + 1).toString(),
          name: 'Aluminum Can',
          category: 'Metal',
          confidence: 0.88,
          image: imageUri,
          points: 15,
        }
      ];

      return mockDetectedItems;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Scanning failed');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<WasteItem>) => {
      state.items.push(action.payload);
      state.totalItems += 1;
      state.totalPoints += action.payload.points;
    },
    removeItemFromCart: (state, action: PayloadAction<string>) => {
      const itemIndex = state.items.findIndex(item => item.id === action.payload);
      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        state.totalItems -= 1;
        state.totalPoints -= item.points;
        state.items.splice(itemIndex, 1);
      }
    },
    updateItemCategory: (state, action: PayloadAction<{ id: string; category: string }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.customCategory = action.payload.category;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPoints = 0;
    },
    clearScanError: (state) => {
      state.scanError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(scanWasteItem.pending, (state) => {
        state.isScanning = true;
        state.scanError = null;
      })
      .addCase(scanWasteItem.fulfilled, (state, action) => {
        state.isScanning = false;
        // Add all detected items to cart
        action.payload.forEach(item => {
          state.items.push(item);
          state.totalItems += 1;
          state.totalPoints += item.points;
        });
      })
      .addCase(scanWasteItem.rejected, (state, action) => {
        state.isScanning = false;
        state.scanError = action.payload as string;
      });
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateItemCategory,
  clearCart,
  clearScanError,
} = cartSlice.actions;

export default cartSlice.reducer;
