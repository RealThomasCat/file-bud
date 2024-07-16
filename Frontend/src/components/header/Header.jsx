import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logoutUser } from "../../store/userSlice.js";
import {
    Container,
    Logo,
    PrimaryButton,
    SecondaryButton,
    Account,
} from "../index.js";
import cloudIcon from "../../assets/CloudIcon.svg";

function Header() {
    const [storage, setStorage] = useState(true);
    console.log("Hello from Header.jsx"); // DEBUGGING

    // Get the user authentication status from the redux store
    const location = useLocation();
    const dispatch = useDispatch();
    const authStatus = useSelector((state) => state.user.user);
    const storageUsed = useSelector((state) => state.user.storageUsed);
    const maxStorage = useSelector((state) => state.user.maxStorage);

    const handleLogout = () => {
        dispatch(logoutUser());
        console.log("Logged out");
    };

    return (
        <Container>
            <header className="h-28 py-6">
                <nav className="w-full h-full flex justify-between items-center p-3 rounded-full bg-glass">
                    <div className="flex justify-center items-center gap-4 h-full">
                        {/* Logo */}
                        <Link className="h-full" to="/home">
                            <Logo />
                        </Link>

                        {/* TODO: <SearchBar /> */}
                    </div>

                    <div className="h-full w-fit flex gap-3">
                        {!authStatus && (
                            <>
                                {/* Login */}
                                <Link to="/login">
                                    <PrimaryButton title="Login" />
                                </Link>

                                {/* Register */}
                                <Link to="/register">
                                    <SecondaryButton title="Register" />
                                </Link>
                            </>
                        )}

                        {/* Account Button */}
                        {authStatus && (
                            <>
                                {/* storageUsed */}
                                {location.pathname !== "/" && (
                                    <div
                                        className="h-full flex gap-2 border-2 border-primary rounded-full p-1 cursor-pointer"
                                        onClick={() => setStorage(!storage)}
                                    >
                                        <div
                                            className={`h-full text-base flex justify-center items-center rounded-full text-primary font-medium pl-3 ${storage ? "flex" : "hidden"}`}
                                        >
                                            <h1 className="text-primary">
                                                {(
                                                    storageUsed /
                                                    (1024 * 1024 * 1024)
                                                ).toFixed(2)}
                                                /
                                                {(
                                                    maxStorage /
                                                    (1024 * 1024 * 1024)
                                                ).toFixed(2)}{" "}
                                                GB
                                            </h1>
                                        </div>

                                        <div className="aspect-square flex justify-center items-center h-full pb-0.5">
                                            <img
                                                src={cloudIcon}
                                                alt="storage icon"
                                                className="h-3.5"
                                            />
                                        </div>
                                    </div>
                                )}

                                {location.pathname === "/" && (
                                    <Link to="/home">
                                        <SecondaryButton title="Go to drive" />
                                    </Link>
                                )}

                                <SecondaryButton
                                    title="Logout"
                                    action={handleLogout}
                                />

                                {/* Account */}
                                <Account />
                            </>
                        )}
                    </div>
                </nav>
            </header>
        </Container>
    );
}

export default Header;
