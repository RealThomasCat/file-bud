import React from "react";

function MainButton({ title }) {
    return (
        <button className="h-full w-28 rounded-full bg-glass bg-opacity-10 border border-borderCol border-opacity-15 text-textCol pb-1 ">
            {title}
        </button>
    );
}

export default MainButton;
