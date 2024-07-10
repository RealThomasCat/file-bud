import React from "react";
import OptionsIcon from "../../assets/OptionsIcon.svg";

function OptionsButton() {
    return (
        <button
            className="h-6 min-w-6 p-1 flex justify-center items-center rounded-full hover:bg-glass hover:bg-opacity-20"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick(e);
            }}
            onDoubleClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick(e);
            }}
        >
            <img className="h-full" src={OptionsIcon} alt="Options Icon" />
        </button>
    );
}

export default OptionsButton;
