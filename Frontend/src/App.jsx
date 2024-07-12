import "./App.css";
import React, { useState, useEffect } from "react";
import { Header } from "./components";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUser } from "./store/userSlice";

function App() {
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUser());
    }, [dispatch]);

    return loading ? ( // TODO: !loading
        <div className="min-h-screen flex flex-wrap content-between bg-bgCol">
            <div className="w-full block">
                <Header />
                <main>
                    <Outlet />
                    {/* // Outlet: This is where the child components will be rendered */}
                </main>
            </div>
        </div>
    ) : (
        <h1 className=" text-3xl font-bold"> Loading... </h1> // TODO: Add a spinner
    );
}

export default App;
