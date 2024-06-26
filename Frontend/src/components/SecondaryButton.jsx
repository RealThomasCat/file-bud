import React from "react";

function SecondaryButton({ action }) {
    return (
        <button className="h-full w-32 aspect-square rounded-full bg-white text-lg font-bold">
            {action}
        </button>
    );
}

export default SecondaryButton;
