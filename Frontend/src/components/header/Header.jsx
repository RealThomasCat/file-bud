import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Container, Logo } from "../index.js";
import defaultThumbnail from "../../assets/placeholderImage.jpg";
import SecondaryButton from "../SecondaryButton.jsx";
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
                <nav className="w-full h-full flex justify-between items-center p-3 rounded-full bg-gray-500">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex h-full w-fit bg-black rounded-full px-6"
                    >
                        <Logo />
                    </Link>

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
                                <SecondaryButton action="Login" />

                                {/* Register */}
                                <SecondaryButton action="Register" />
                            </>
                        )}

                        {/* Account Button */}
                        <button className="h-full aspect-square rounded-full">
                            <img
                                className="object-cover rounded-full w-full h-full"
                                src={defaultThumbnail}
                                alt="DP"
                            />
                        </button>
                    </div>
                </nav>
            </header>
        </Container>
    );
}

export default Header;
