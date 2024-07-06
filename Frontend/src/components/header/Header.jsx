import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
    const dispatch = useDispatch();
    const authStatus = useSelector((state) => state.user.user);

    const handleLogout = () => {
        dispatch(logoutUser());
        console.log("Logged out");
    };

    return (
        <Container>
            <header className="h-28 py-6">
                <nav className="w-full h-full flex justify-between items-center p-3 rounded-full bg-glass bg-opacity-10 border border-borderCol border-opacity-15">
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
