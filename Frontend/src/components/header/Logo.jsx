import React from "react";
import { Link } from "react-router-dom";

function Logo() {
    return (
        <Link
            to="/"
            className="h-full w-32 flex justify-center items-center rounded-full text-2xl text-textCol font-bold pb-0.5"
        >
            <h1>
                File<span className="text-primary">Bud</span>
            </h1>
        </Link>
    );
}

export default Logo;
