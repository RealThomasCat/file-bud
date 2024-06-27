import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/userSlice.js";
import PrimaryButton from "./buttons/PrimaryButton.jsx";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const userState = useSelector((state) => state.user);

    const handleLogin = () => {
        dispatch(loginUser({ email, password }));
    };

    return (
        <div className="mx-auto max-w-96 flex flex-col gap-8">
            <div className="bg-glass bg-opacity-10 px-4 py-6 rounded-lg flex flex-col gap-6 border border-borderCol border-opacity-10">
                <h1 className="text-xl font-light text-white mb-4">
                    Login to view your files
                </h1>
                <div className="flex flex-col gap-3">
                    <label
                        className="text-textCol w-full text-left px-1"
                        htmlFor="email"
                    >
                        Email:
                    </label>
                    <input
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="w-full h-10 py-2 px-3 pb-2.5 rounded-lg bg-bgCol text-textCol focus:outline-none"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label
                        className="text-textCol w-full text-left px-1"
                        htmlFor="password"
                    >
                        Password:
                    </label>
                    <input
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="examplePassword"
                        className="w-full h-10 py-2 px-3 pb-2.5 rounded-lg bg-bgCol text-textCol focus:outline-none"
                    />
                </div>
                <div className="w-full h-10 mt-4 mb-3">
                    <PrimaryButton action={handleLogin} title="Login" />
                </div>
            </div>
            <div className="text-textCol">
                {userState.status === "loading" && <p>Loading...</p>}
                {userState.error && <p>Error: {userState.error}</p>}
            </div>
        </div>
    );
};

export default Login;
