import React from "react";

function PrimaryButton({ action }) {
    return (
        <button className="h-full w-32 aspect-square rounded-full bg-primary text-lg font-medium text-textCol pb-0.5">
            {action}
        </button>
    );
}

export default PrimaryButton;
