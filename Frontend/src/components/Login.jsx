import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/userSlice.js";
import PrimaryButton from "./buttons/PrimaryButton.jsx";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

const Login = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const userState = useSelector((state) => state.user);

    const handleLogin = () => {
        dispatch(loginUser({ email, password }));
    };

    return (
        <>
            <PrimaryButton action={() => setIsOpen(true)} title="Login" />

            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 flex w-screen items-center justify-center mx-auto">
                    <DialogPanel className="w-full max-w-96 bg-glass bg-opacity-10 px-4 py-6 rounded-lg flex flex-col gap-6 border border-borderCol border-opacity-10 backdrop-blur-md">
                        <DialogTitle className="w-full text-xl font-light text-textCol text-center">
                            Login into your account
                        </DialogTitle>
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
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
};

export default Login;
