import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
    <AuthProvider>
        <App />
        <ToastContainer
            position="top-right"
            autoClose={2500}
            theme="colored"
        />
    </AuthProvider>
</BrowserRouter>
);