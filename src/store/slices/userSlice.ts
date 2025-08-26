import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  rank: number;
  avatar?: string;
}

export interface MonthlyGoal {
  target: number;
  current: number;
  percentage: number;
}

export interface UserStats {
  totalDisposalSessions: number;
  totalItemsRecycled: number;
  totalPointsEarned: number;
  monthlyGoal: MonthlyGoal;
  streakDays: number;
  favoriteCategory: string;
  co2Saved: number; // kg of CO2 saved
  treesEquivalent: number;
  currentStreak: number; // Current streak in days
  monthlyItems: number; // Items disposed this month
}

export interface UserState {
  stats: UserStats;
  leaderboard: LeaderboardUser[];
  isLoadingStats: boolean;
  isLoadingLeaderboard: boolean;
  statsError: string | null;
  leaderboardError: string | null;
}

const initialState: UserState = {
  stats: {
    totalDisposalSessions: 0,
    totalItemsRecycled: 0,
    totalPointsEarned: 0,
    monthlyGoal: {
      target: 500,
      current: 0,
      percentage: 0,
    },
    streakDays: 0,
    favoriteCategory: 'Plastic',
    co2Saved: 0,
    treesEquivalent: 0,
    currentStreak: 0,
    monthlyItems: 0,
  },
  leaderboard: [],
  isLoadingStats: false,
  isLoadingLeaderboard: false,
  statsError: null,
  leaderboardError: null,
};

// Async thunk for fetching user statistics
export const fetchUserStats = createAsyncThunk(
  'user/fetchUserStats',
  async (userId: string, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      const mockStats: UserStats = {
        totalDisposalSessions: 47,
        totalItemsRecycled: 234,
        totalPointsEarned: 1250,
        monthlyGoal: {
          target: 500,
          current: 320,
          percentage: 64,
        },
        streakDays: 12,
        favoriteCategory: 'Plastic',
        co2Saved: 45.3,
        treesEquivalent: 2.1,
        currentStreak: 5,
        monthlyItems: 34,
      };

      return mockStats;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user stats');
    }
  }
);

// Async thunk for fetching leaderboard
export const fetchLeaderboard = createAsyncThunk(
  'user/fetchLeaderboard',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      const mockLeaderboard: LeaderboardUser[] = [
        { id: '1', name: 'EcoChampion', points: 2845, rank: 1 },
        { id: '2', name: 'GreenWarrior', points: 2634, rank: 2 },
        { id: '3', name: 'RecycleHero', points: 2456, rank: 3 },
        { id: '4', name: 'EarthGuardian', points: 2234, rank: 4 },
        { id: '5', name: 'SustainabilityPro', points: 2089, rank: 5 },
        { id: '6', name: 'WasteNinja', points: 1987, rank: 6 },
        { id: '7', name: 'ClimateActivist', points: 1876, rank: 7 },
        { id: '8', name: 'PlanetSaver', points: 1765, rank: 8 },
        { id: '9', name: 'GreenGuru', points: 1654, rank: 9 },
        { id: '10', name: 'EcoExpert', points: 1543, rank: 10 },
        { id: '11', name: 'RecyclingMaster', points: 1432, rank: 11 },
        { id: '12', name: 'NatureDefender', points: 1321, rank: 12 },
        { id: '13', name: 'ZeroWasteZealot', points: 1298, rank: 13 },
        { id: '14', name: 'EnvironmentalEagle', points: 1276, rank: 14 },
        { id: '15', name: 'John Doe', points: 1250, rank: 15 }, // Current user
      ];

      return mockLeaderboard;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch leaderboard');
    }
  }
);

// Async thunk for updating monthly goal
export const updateMonthlyGoal = createAsyncThunk(
  'user/updateMonthlyGoal',
  async (newTarget: number, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      return newTarget;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update monthly goal');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateStatsAfterDisposal: (state, action: PayloadAction<{ points: number; itemCount: number }>) => {
      state.stats.totalDisposalSessions += 1;
      state.stats.totalItemsRecycled += action.payload.itemCount;
      state.stats.totalPointsEarned += action.payload.points;
      state.stats.monthlyGoal.current += action.payload.points;
      state.stats.monthlyGoal.percentage = (state.stats.monthlyGoal.current / state.stats.monthlyGoal.target) * 100;
      
      // Calculate environmental impact (rough estimates)
      state.stats.co2Saved += action.payload.itemCount * 0.2; // 0.2 kg CO2 per item (average)
      state.stats.treesEquivalent = state.stats.co2Saved / 21.77; // 1 tree absorbs ~21.77 kg CO2/year
    },
    incrementStreak: (state) => {
      state.stats.streakDays += 1;
    },
    resetStreak: (state) => {
      state.stats.streakDays = 0;
    },
    clearUserErrors: (state) => {
      state.statsError = null;
      state.leaderboardError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user stats
      .addCase(fetchUserStats.pending, (state) => {
        state.isLoadingStats = true;
        state.statsError = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.isLoadingStats = false;
        state.stats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.isLoadingStats = false;
        state.statsError = action.payload as string;
      })
      // Fetch leaderboard
      .addCase(fetchLeaderboard.pending, (state) => {
        state.isLoadingLeaderboard = true;
        state.leaderboardError = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.isLoadingLeaderboard = false;
        state.leaderboard = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.isLoadingLeaderboard = false;
        state.leaderboardError = action.payload as string;
      })
      // Update monthly goal
      .addCase(updateMonthlyGoal.fulfilled, (state, action) => {
        state.stats.monthlyGoal.target = action.payload;
        state.stats.monthlyGoal.percentage = (state.stats.monthlyGoal.current / action.payload) * 100;
      });
  },
});

export const {
  updateStatsAfterDisposal,
  incrementStreak,
  resetStreak,
  clearUserErrors,
} = userSlice.actions;

export default userSlice.reducer;
