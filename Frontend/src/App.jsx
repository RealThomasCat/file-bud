import "./App.css";
import React, { useState, useEffect } from "react";
import { Header } from "./components";
import { Outlet } from "react-router-dom";

function App() {
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     TODO: Fetch the current user data from the server
    //         })
    //         .finally(() => setLoading(false));
    // }, []);

    return loading ? ( // TODO: !loading
        <div className="min-h-screen flex flex-wrap content-between bg-gray-200">
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
