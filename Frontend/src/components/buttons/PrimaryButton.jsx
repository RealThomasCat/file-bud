import React from "react";

function PrimaryButton({ title, action }) {
    return (
        <button
            onClick={action}
            className="h-full w-32 aspect-square rounded-full bg-primary text-lg font-medium text-textCol pb-0.5"
        >
            {title}
        </button>
    );
}

export default PrimaryButton;
