import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, LoginCredentials, User } from "../../types/auth";
import authApi from "../../utils/api/v1/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunk for login
export const login = createAsyncThunk("auth/login", async (credentials: LoginCredentials, { rejectWithValue }) => {
  try {
    const response = await authApi.login(credentials.email, credentials.password);
    const { data } = response.data;

    if (data?.token) await AsyncStorage.setItem("token", data.token);
    const user: User = {
      id: data._id,
      email: data.email,
      verifiedAt: data?.verifiedAt,
    };
    return { user, token: data?.token };
  } catch (error: any) {
    let message = "Login failed. Please check your credentials.";
    if (error?.response?.data?.message) message = error.response.data.message;
    return rejectWithValue(message);
  }
});

// Async thunk for logout
export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await authApi.logout();
  } catch (e) {
    await AsyncStorage.clear();
  }
  return;
});

// Async thunk for auto login
export const autoLogin = createAsyncThunk("auth/autoLogin", async (_, { rejectWithValue }) => {
  try {
    const token = await authApi.getJwt();
    if (!token) {
      return rejectWithValue("No token found");
    }

    const response = await authApi.autoLogin();
    const { data } = response.data;

    if (!data || !data.token) {
      return rejectWithValue("Invalid auto-login response");
    }
    await AsyncStorage.setItem("token", data.token);
    const user: User = {
      id: data._id,
      email: data.email,
    };
    return { user, token: data.token };
  } catch (error: any) {
    return rejectWithValue("Auto-login failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token?: string | null }>) => {
      state.user = action.payload.user;
      state.token = action?.payload?.token;
      state.isAuthenticated = action?.payload?.token ? true : false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // AutoLogin
      .addCase(autoLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(autoLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(autoLogin.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
