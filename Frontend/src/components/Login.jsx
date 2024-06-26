import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/userSlice.js";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const userState = useSelector((state) => state.user);

    const handleLogin = () => {
        dispatch(loginUser({ email, password }));
    };

    return (
        <div className="mx-auto max-w-80 flex flex-col gap-2">
            <h2>Login</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button className=" bg-white" onClick={handleLogin}>
                Login
            </button>
            {userState.status === "loading" && <p>Loading...</p>}
            {userState.error && <p>{userState.error}</p>}
        </div>
    );
};

export default Login;
