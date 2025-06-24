export interface User {
  id: string;
  email: string;
  name?: string;
  verifiedAt?: string | null;
  // Add any other user fields you need
}

export interface AuthState {
  user: User | null;
  token?: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
