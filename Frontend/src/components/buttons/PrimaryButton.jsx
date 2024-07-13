import React from "react";

function PrimaryButton({ title, action }) {
    return (
        <button
            onClick={action}
            className="h-full w-44 aspect-square rounded-full bg-primary text-lg font-medium text-textCol pb-0.5 uppercase"
        >
            {title}
        </button>
    );
}

export default PrimaryButton;
