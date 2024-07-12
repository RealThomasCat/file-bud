import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../../store/userSlice.js";
import {
    Container,
    Logo,
    PrimaryButton,
    SecondaryButton,
    Account,
} from "../index.js";

function Header() {
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
                    <div className="flex justify-center items-center gap-3">
                        {/* Logo */}
                        <Link to="/home">
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
                                {location.pathname !== "/" && (
                                    <div className="h-full w-40 text-lg flex justify-center items-center rounded-full text-primary font-medium border-2 border-primary">
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
