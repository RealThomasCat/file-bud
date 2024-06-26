import React from "react";

function MainButton({ action }) {
    return (
        <button className="h-full w-28 aspect-square rounded-full bg-glass bg-opacity-10 border border-borderCol border-opacity-25 text-textCol pb-1 ">
            {action}
        </button>
    );
}

export default MainButton;
