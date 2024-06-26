import React from "react";

function MainButton({ action }) {
    return (
        <button className="h-full w-28 aspect-square rounded-full bg-white ">
            {action}
        </button>
    );
}

export default MainButton;
