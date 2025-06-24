import axios from "../../axios";

const authenticationEndPoint = "/v1/auth";

const tokenKey = import.meta.env.VITE_JWT_KEY;

async function login(email, password) {
  const endpoint = `${authenticationEndPoint}/login`;

  return await axios.post(endpoint, { email, password });
}

async function signup(email, password) {
  const endpoint = `${authenticationEndPoint}/signup`;

  return await axios.post(endpoint, { email, password });
}

async function verifyOtp({ email, otp }) {
  const endpoint = `${authenticationEndPoint}/verify`;

  return await axios.post(endpoint, { email, otp });
}

async function resendOtp({ email, type }) {
  const endpoint = `${authenticationEndPoint}/request-code`;

  return await axios.post(endpoint, { email, type });
}

async function logout() {
  const endpoint = `${authenticationEndPoint}/log-out`;
  localStorage.clear();

  try {
    await axios.post(endpoint);
  } catch (error) {}

  window.location = "/login";
}

async function autoLogin() {
  const endPoint = `${authenticationEndPoint}/auto-login`;

  return axios.get(endPoint);
}

function getJwt() {
  return localStorage.getItem(tokenKey);
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
