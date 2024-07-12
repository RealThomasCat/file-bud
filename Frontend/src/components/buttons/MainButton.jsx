import React, { act } from "react";

function MainButton({ title, action, icon }) {
    return (
        <button
            onClick={action}
            className="h-full w-44 aspect-square flex justify-center items-center gap-3 rounded-full bg-glass text-base font-medium text-textCol"
        >
            {icon && <img className="max-h-4" src={icon} alt="Icon" />}
            <h1>{title}</h1>
        </button>
    );
}

export default MainButton;
