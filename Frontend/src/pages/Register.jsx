import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/userSlice.js";
import PrimaryButton from "../components/buttons/PrimaryButton.jsx";
import { useNavigate } from "react-router-dom";
import { Container } from "../components/index.js";

const Register = () => {
    const navigate = useNavigate();

    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const authStatus = useSelector((state) => state.user.user);
    const error = useSelector((state) => state.user.error);

    const handleRegister = () => {
        dispatch(registerUser({ fullname, email, password }));
    };

    // useEffect(() => {
    //     if (authStatus) {
    //         navigate("/home");
    //     }
    // }, [authStatus, navigate]);

    return (
        <Container>
            <div className="flex flex-col w-full mt-12 gap-6 items-center justify-center">
                <div className="w-full max-w-96 bg-glass bg-opacity-10 my-auto px-4 py-6 rounded-lg flex flex-col items-center gap-6 border border-borderCol border-opacity-10 backdrop-blur-md">
                    <h1 className="w-full text-xl font-light text-textCol text-center">
                        Create a new account
                    </h1>
                    <div className="w-full flex flex-col gap-3">
                        <label
                            className="text-textCol w-full text-left px-1"
                            htmlFor="fullname"
                        >
                            Fullname:
                        </label>
                        <input
                            name="fullname"
                            type="text"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            placeholder="fullname"
                            className="w-full h-10 py-2 px-3 pb-2.5 rounded-lg bg-bgCol text-textCol focus:outline-none"
                        />
                    </div>

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
                            placeholder="password"
                            className="w-full h-10 py-2 px-3 pb-2.5 rounded-lg bg-bgCol text-textCol focus:outline-none"
                        />
                    </div>
                    <div className="w-full flex justify-center h-10 mt-4 mb-3">
                        <PrimaryButton
                            action={handleRegister}
                            title="Register"
                        />
                    </div>
                </div>

                {error && (
                    <p className="max-w-96 text-white overflow-hidden">
                        {error}
                        {console.log(error)}
                    </p>
                )}
            </div>
        </Container>
    );
};

export default Register;
