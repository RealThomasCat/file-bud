import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Account() {
    // Retrieve the user's name from the Redux store
    const userName = useSelector((state) => state.user.user.fullname);
    console.log(userName);
    const [firstLetter, setFirstLetter] = useState("");

    useEffect(() => {
        if (userName) {
            setFirstLetter(userName.charAt(0).toUpperCase());
        }
    }, [userName]);

    // Render the button with the first letter of the user's name
    return (
        <button className="h-full aspect-square rounded-full bg-primary text-xl text-textCol uppercase">
            {firstLetter || "?"} {/* Show '?' as a fallback */}
        </button>
    );
}

export default Account;
