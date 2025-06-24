import React from "react";
import { ToastContainer } from "react-toastify";
import AuthInitializer from "./components/AuthInitializer";

import Router from "./routes/sections";

function App() {
  return (
    <AuthInitializer>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Router />
    </AuthInitializer>
  );
}

export default App;
