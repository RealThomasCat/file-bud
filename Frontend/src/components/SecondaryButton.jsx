import React from "react";

function SecondaryButton({ action }) {
    return (
        <button className="h-full w-32 rounded-full bg-bgCol text-lg text-textCol font-medium border border-borderCol border-opacity-25 pb-0.5">
            {action}
        </button>
    );
}

export default SecondaryButton;
