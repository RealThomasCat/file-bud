import React from "react";

function SecondaryButton({ title }) {
    return (
        <button className="h-full w-32 rounded-full bg- text-lg text-primary font-medium border-2 border-primary pb-0.5">
            {title}
        </button>
    );
}

export default SecondaryButton;
