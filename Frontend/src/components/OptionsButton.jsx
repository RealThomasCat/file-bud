import React from "react";
import OptionsIcon from "../assets/OptionsIcon.svg";

function OptionsButton() {
    return (
        <div className="h-3.5 w-fit">
            <img
                className="w-full h-full"
                src={OptionsIcon}
                alt="Options Icon"
            />
        </div>
    );
}

export default OptionsButton;
