import React from "react";
import UploadIcon from "../../assets/AddIcon.svg";

function PrimaryButton({ action }) {
    return (
        <button className="h-full aspect-square rounded-full bg-primary text-lg font-medium text-textCol">
            <img
                className="w-5 h-5 m-auto"
                src={UploadIcon}
                alt="Upload Icon"
            />
        </button>
    );
}

export default PrimaryButton;
