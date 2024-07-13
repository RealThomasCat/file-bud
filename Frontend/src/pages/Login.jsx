import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/userSlice.js";
import PrimaryButton from "../components/buttons/PrimaryButton.jsx";
import { useNavigate } from "react-router-dom";
import { Container } from "../components/index.js";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();

    const handleLogin = () => {
        dispatch(loginUser({ email, password }));
    };

    return (
        <Container>
            <div className="flex w-full mt-24 items-center justify-center">
                <div className="w-full max-w-96 bg-glass bg-opacity-10 my-auto px-4 py-6 rounded-lg flex flex-col items-center gap-6 border border-borderCol border-opacity-10 backdrop-blur-md">
                    <h1 className="w-full text-xl font-light text-textCol text-center">
                        Login into your account
                    </h1>
                    <div className="w-full flex flex-col gap-3">
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

                    <div className="w-full flex flex-col gap-3">
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
                    <div className="w-full flex justify-center h-10 mt-4 mb-3">
                        <PrimaryButton action={handleLogin} title="Login" />
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default Login;
