import { useEffect } from "react";

import authentication from "../utils/api/v1/auth";

const Logout = () => {
  useEffect(() => {
    authentication.logout();
  });

  return null;
};

export default Logout;
