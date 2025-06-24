import axios from "../../axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const authenticationEndPoint = "/v1/auth";

const tokenKey = "token";

export interface AuthResponse {
  data: { _id: string; email: string; verifiedAt?: string | null; token?: string | null };
  message: string;
  success: boolean;
  metadata?: object;
}

export async function login(email: string, password: string) {
  const endpoint = `${authenticationEndPoint}/login`;
  return await axios.post<AuthResponse>(endpoint, { email, password });
}

export async function signup(email: string, password: string) {
  const endpoint = `${authenticationEndPoint}/signup`;
  return await axios.post<AuthResponse>(endpoint, { email, password });
}

export async function verifyOtp({ email, otp }: { email: string; otp: string }) {
  const endpoint = `${authenticationEndPoint}/verify`;
  return await axios.post<AuthResponse>(endpoint, { email, otp });
}

export async function resendOtp({ email, type }: { email: string; type: "password" | "verify" }) {
  const endpoint = `${authenticationEndPoint}/request-code`;
  return await axios.post(endpoint, { email, type });
}

export async function logout() {
  const endpoint = `${authenticationEndPoint}/log-out`;
  await AsyncStorage.clear();
  try {
    await axios.post(endpoint);
  } catch (error) {}
}

export async function autoLogin() {
  const endPoint = `${authenticationEndPoint}/auto-login`;
  return axios.get<AuthResponse>(endPoint);
}

export async function getJwt() {
  return AsyncStorage.getItem(tokenKey);
}

export default {
  login,
  signup,
  verifyOtp,
  resendOtp,
  logout,
  autoLogin,
  getJwt,
};
