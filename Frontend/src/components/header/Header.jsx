import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Container, Logo } from "../index.js";

function Header() {
    // Get the auth status from the store
    // const authStatus = useSelector((state) => state.auth.status);

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
        <header className="py-3 shadow bg-gray-500">
            <Container>
                <nav className="flex">
                    {/* Logo */}
                    <div className="mr-4">
                        <Link to="/">
                            <Logo width="70px" />
                        </Link>
                    </div>

                    {/*Nav Links*/}
                    <ul className="flex ml-auto gap-4">
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
                        )}

                        {/*Show logout button if user is authenticated*/}
                        {/* {authStatus && (
                            <li>
                                <LogoutBtn />
                            </li>
                        )} */}
                    </ul>
                </nav>
            </Container>
        </header>
    );
}

export default Header;
