import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Logo,
    PrimaryButton,
    SecondaryButton,
    Account,
    SearchBar,
    Login,
} from "../index.js";
import { useSelector } from "react-redux";

function Header() {
    // Get the user authentication status from the redux store
    const user = useSelector((state) => state.user.user);

    // We will use useNavigate hook to navigate to different routes
    const navigate = useNavigate(); // onClick={() => navigate(item.slug)}

    // Navigation items array
    const navItems = [
        {
            name: "Home",
            slug: "/",
            active: true,
        },
        {
            name: "Somewhere",
            slug: "/",
            active: true,
        },
        {
            name: "Somewhere",
            slug: "/",
            active: true,
        },
        // {
        //     name: "Login",
        //     slug: "/login",
        //     active: !authStatus, // If the user is not logged in, the login link is active
        // },
        // {
        //     name: "Signup",
        //     slug: "/signup",
        //     active: !authStatus, // If the user is not logged in, the signup link is active
        // },
        // {
        //     name: "All Posts",
        //     slug: "/all-posts",
        //     active: authStatus, // If the user is logged in, the all posts link is active
        // },
        // {
        //     name: "Add Post",
        //     slug: "/add-post",
        //     active: authStatus, // If the user is logged in, the add post link is active
        // },
    ];

    return (
        <Container>
            <header className="h-28 py-6">
                <nav className="w-full h-full flex justify-between items-center p-3 rounded-full bg-glass bg-opacity-10 border border-borderCol border-opacity-15">
                    <div className="flex justify-center items-center gap-3">
                        {/* Logo */}
                        <Logo />

                        {/* TODO: <SearchBar /> */}
                    </div>

                    {/*Nav Links*/}
                    {/* <ul className="flex ml-auto gap-4">
                        {navItems.map((item) =>
                            item.active ? (
                                // Keys have to be applied to the html element which is being repeated
                                <li key={item.name}>
                                    <button
                                        onClick={() => navigate(item.slug)}
                                        className="inline-block px-3 py-2 duration-200 hover:bg-blue-100 rounded-full"
                                    >
                                        {item.name}
                                    </button>
                                </li>
                            ) : null
                        )} */}

                    {/*Show logout button if user is authenticated*/}
                    {/* {authStatus && (
                            <li>
                                <LogoutBtn />
                            </li>
                        )} */}
                    {/* </ul> */}

                    <div className="h-full w-fit flex gap-3">
                        {!user && (
                            <>
                                {/* Login */}
                                <Login />

                                {/* Register */}
                                <SecondaryButton title="Register" />
                            </>
                        )}

                        {/* Account Button */}
                        {user && <Account />}
                    </div>
                </nav>
            </header>
        </Container>
    );
}

export default Header;
