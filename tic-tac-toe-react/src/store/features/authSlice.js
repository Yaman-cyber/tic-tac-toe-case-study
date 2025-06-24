import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../../utils/api/v1/auth";

const tokenKey = import.meta.env.VITE_JWT_KEY;

const initialState = {
  user: null,
  token: localStorage.getItem(tokenKey) || null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunk for auto-login
export const autoLogin = createAsyncThunk("auth/autoLogin", async (_, { rejectWithValue }) => {
  try {
    const { data } = await authApi.autoLogin();
    return data; // data.data contains user fields and token
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Auto-login failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = token ? true : false;
      if (token) localStorage.setItem(tokenKey, token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem(tokenKey);
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(autoLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(autoLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...action.payload.data };
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        localStorage.setItem(tokenKey, action.payload.data.token);
      })
      .addCase(autoLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem(tokenKey);
      });
  },
});

export const { setCredentials, logout, updateUser, clearError } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
