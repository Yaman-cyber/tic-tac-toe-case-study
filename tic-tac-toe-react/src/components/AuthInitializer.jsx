import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { autoLogin, selectIsAuthenticated, selectAuthLoading, selectCurrentToken } from "../store/features/authSlice";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectCurrentToken);
  const loading = useSelector(selectAuthLoading);
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (token && !isAuthenticated && !hasAttempted.current) {
      dispatch(autoLogin());
      hasAttempted.current = true;
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return null;
  }

  return children;
}
