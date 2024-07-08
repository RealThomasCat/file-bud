import "./index.css";
import App from "./App.jsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { AuthLayout } from "./components/index.js";
import {
    Login,
    LandingPage,
    Home,
    ErrorPage,
    FolderPage,
    Register,
} from "./pages/index.js";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <LandingPage />,
            },
            {
                path: "/login",
                element: (
                    <AuthLayout authentication={false}>
                        <Login />,
                    </AuthLayout>
                ),
            },
            {
                path: "/register",
                element: (
                    <AuthLayout authentication={false}>
                        <Register />,
                    </AuthLayout>
                ),
            },
            {
                path: "/home",
                element: (
                    <AuthLayout authentication={true}>
                        <Home />
                    </AuthLayout>
                ),
            },
            {
                path: "/folders/:folderId",
                element: (
                    <AuthLayout authentication={true}>
                        <FolderPage />
                    </AuthLayout>
                ),
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>
);
