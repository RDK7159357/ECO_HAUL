import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface DisposalCenter {
  id: string;
  name: string;
  address: string;
  distance: number;
  hours: string;
  acceptedMaterials: string[];
  phone?: string;
  website?: string;
  rating?: number;
}

export interface DisposalGuide {
  title: string;
  steps: string[];
  safetyWarnings: string[];
  tips: string[];
  estimatedTime: string;
}

export interface DisposalSession {
  id: string;
  date: string;
  items: any[];
  totalPoints: number;
  disposalMethod: string;
  location?: string;
}

export interface DisposalState {
  nearbyDisposalCenters: DisposalCenter[];
  disposalGuide: DisposalGuide | null;
  disposalHistory: DisposalSession[];
  isLoadingCenters: boolean;
  isLoadingGuide: boolean;
  centersError: string | null;
  guideError: string | null;
}

const initialState: DisposalState = {
  nearbyDisposalCenters: [],
  disposalGuide: null,
  disposalHistory: [],
  isLoadingCenters: false,
  isLoadingGuide: false,
  centersError: null,
  guideError: null,
};

// Async thunk for finding nearby disposal centers
export const findNearbyDisposalCenters = createAsyncThunk(
  'disposal/findNearbyDisposalCenters',
  async (params: { latitude: number; longitude: number; wasteTypes: string[] }, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual AI-powered disposal agent API call
      const mockDisposalCenters: DisposalCenter[] = [
        {
          id: '1',
          name: 'EcoCenter Recycling Facility',
          address: '123 Green Street, Your City',
          distance: 0.8,
          hours: 'Mon-Fri: 8AM-5PM, Sat: 9AM-3PM',
          acceptedMaterials: ['Plastic', 'Metal', 'Glass', 'Paper'],
          phone: '(555) 123-4567',
          website: 'www.ecocenter.com',
          rating: 4.5,
        },
        {
          id: '2',
          name: 'City Waste Management',
          address: '456 Recycling Ave, Your City',
          distance: 1.2,
          hours: 'Mon-Sat: 7AM-6PM',
          acceptedMaterials: ['Electronics', 'Hazardous', 'Organic'],
          phone: '(555) 987-6543',
          rating: 4.2,
        },
        {
          id: '3',
          name: 'Green Earth Disposal',
          address: '789 Sustainability Blvd, Your City',
          distance: 2.1,
          hours: '24/7 Drop-off Available',
          acceptedMaterials: ['Textile', 'Furniture', 'Construction'],
          phone: '(555) 456-7890',
          website: 'www.greenearth.org',
          rating: 4.7,
        },
      ];

      return mockDisposalCenters;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to find disposal centers');
    }
  }
);

// Async thunk for generating disposal guide
export const generateDisposalGuide = createAsyncThunk(
  'disposal/generateDisposalGuide',
  async (wasteItems: any[], { rejectWithValue }) => {
    try {
      // TODO: Replace with actual LLM API call
      const mockGuide: DisposalGuide = {
        title: 'Safe Disposal Guide for Your Items',
        steps: [
          '1. Separate items by material type (plastic, metal, glass, etc.)',
          '2. Clean containers to remove food residue and labels when possible',
          '3. Check local recycling guidelines for specific requirements',
          '4. Transport items in secure containers to prevent spillage',
          '5. Present items to facility staff for proper sorting',
        ],
        safetyWarnings: [
          '⚠️ Do not mix hazardous materials with regular recyclables',
          '⚠️ Wear gloves when handling glass or metal items with sharp edges',
          '⚠️ Ensure proper ventilation when dealing with chemical containers',
        ],
        tips: [
          '💡 Call ahead to confirm facility hours and accepted materials',
          '💡 Bring identification - some facilities require it for certain items',
          '💡 Consider carpooling with neighbors to reduce environmental impact',
        ],
        estimatedTime: '30-45 minutes',
      };

      return mockGuide;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to generate disposal guide');
    }
  }
);

// Async thunk for completing disposal session
export const completeDisposalSession = createAsyncThunk(
  'disposal/completeDisposalSession',
  async (sessionData: { items: any[]; totalPoints: number; disposalMethod: string; location?: string }, { rejectWithValue }) => {
    try {
      const session: DisposalSession = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        items: sessionData.items,
        totalPoints: sessionData.totalPoints,
        disposalMethod: sessionData.disposalMethod,
        location: sessionData.location,
      };

      // TODO: Save to backend API
      return session;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to complete disposal session');
    }
  }
);

const disposalSlice = createSlice({
  name: 'disposal',
  initialState,
  reducers: {
    clearDisposalCenters: (state) => {
      state.nearbyDisposalCenters = [];
    },
    clearDisposalGuide: (state) => {
      state.disposalGuide = null;
    },
    clearDisposalErrors: (state) => {
      state.centersError = null;
      state.guideError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Find nearby disposal centers
      .addCase(findNearbyDisposalCenters.pending, (state) => {
        state.isLoadingCenters = true;
        state.centersError = null;
      })
      .addCase(findNearbyDisposalCenters.fulfilled, (state, action) => {
        state.isLoadingCenters = false;
        state.nearbyDisposalCenters = action.payload;
      })
      .addCase(findNearbyDisposalCenters.rejected, (state, action) => {
        state.isLoadingCenters = false;
        state.centersError = action.payload as string;
      })
      // Generate disposal guide
      .addCase(generateDisposalGuide.pending, (state) => {
        state.isLoadingGuide = true;
        state.guideError = null;
      })
      .addCase(generateDisposalGuide.fulfilled, (state, action) => {
        state.isLoadingGuide = false;
        state.disposalGuide = action.payload;
      })
      .addCase(generateDisposalGuide.rejected, (state, action) => {
        state.isLoadingGuide = false;
        state.guideError = action.payload as string;
      })
      // Complete disposal session
      .addCase(completeDisposalSession.fulfilled, (state, action) => {
        state.disposalHistory.unshift(action.payload);
      });
  },
});

export const {
  clearDisposalCenters,
  clearDisposalGuide,
  clearDisposalErrors,
} = disposalSlice.actions;

export default disposalSlice.reducer;
