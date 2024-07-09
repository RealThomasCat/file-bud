import React from "react";

function SecondaryButton({ title, action }) {
    return (
        <button
            onClick={action}
            className="h-full w-32 rounded-full text-lg text-primary font-medium border-2 border-primary pb-0.5"
        >
            {title}
        </button>
    );
}

export default SecondaryButton;
