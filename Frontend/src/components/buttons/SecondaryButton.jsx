import React from "react";

function SecondaryButton({ title, action }) {
    return (
        <button
            onClick={action}
            className="h-full w-40 rounded-full text-base text-primary font-medium border-2 border-primary uppercase"
        >
            {title}
        </button>
    );
}

export default SecondaryButton;
