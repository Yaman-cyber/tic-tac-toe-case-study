import axios from "axios";
import { toast } from "react-toastify";
import { store } from "../store/store";

const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_URL });

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // only handle 401 errors if we're not already on the login page
    if (error?.response?.status === 401 && window.location.pathname !== "/login") {
      //clear auth state
      store.dispatch({ type: "auth/logout" });
      //only redirect if we're not already on the login page
      window.location = "/login";
    }

    const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;

    if (expectedError) {
      toast.error(error.response.data.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
