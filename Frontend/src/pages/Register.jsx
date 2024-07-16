import React, { useState, useEffect } from "react";
import PrimaryButton from "../components/buttons/PrimaryButton.jsx";
import { useNavigate } from "react-router-dom";
import { Container } from "../components/index.js";
import userService from "../services/user.service.js";

const Register = () => {
    const navigate = useNavigate();

    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [regError, setRegError] = useState("");

    const validate = () => {
        let tempErrors = {};
        if (!fullname) tempErrors.fullname = "Fullname is required.";
        if (!email) tempErrors.email = "Email is required.";
        if (!password) tempErrors.password = "Password is required.";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleRegister = async () => {
        if (validate()) {
            try {
                const response = await userService.register(
                    fullname,
                    email,
                    password
                );

                // console.log(response); // DEBUGGING

                navigate("/login");
            } catch (error) {
                setRegError(error.message);
            }
        }
    };

    return (
        <Container>
            <div className="flex flex-col w-full mt-12 items-center justify-center">
                <div className="w-full max-w-96 bg-glass my-auto px-4 py-6 rounded-lg flex flex-col items-center gap-6">
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
                            id="fullname"
                            name="fullname"
                            type="text"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            placeholder="fullname"
                            required
                            className={`w-full h-10 py-2 px-3 pb-2.5 rounded-lg bg-bgCol text-textCol focus:outline-none ${errors.fullname && "border border-red-500"}`}
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
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email"
                            required
                            className={`w-full h-10 py-2 px-3 pb-2.5 rounded-lg bg-bgCol text-textCol focus:outline-none ${errors.email && "border border-red-500"}`}
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
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="password"
                            required
                            className={`w-full h-10 py-2 px-3 pb-2.5 rounded-lg bg-bgCol text-textCol focus:outline-none ${errors.password && "border border-red-500"}`}
                        />
                    </div>
                    <div className="w-full flex justify-center h-10 mt-4 mb-3">
                        <PrimaryButton
                            action={handleRegister}
                            title="Register"
                        />
                    </div>
                </div>

                {(regError ||
                    errors.fullname ||
                    errors.email ||
                    errors.password) && (
                    <p className="w-full text-center text-red-500 mt-6">
                        User register failed!
                    </p>
                )}
            </div>
        </Container>
    );
};

export default Register;
