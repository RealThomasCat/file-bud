import React from "react";
import defaultThumbnail from "../../assets/placeholderImage.jpg";

function Account({ picture = defaultThumbnail }) {
    return (
        <button className="h-full aspect-square rounded-full">
            <img
                className="object-cover rounded-full w-full h-full"
                src={picture}
                alt="DP"
            />
        </button>
    );
}

export default Account;
