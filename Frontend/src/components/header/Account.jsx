import React from "react";
import defaultThumbnail from "../../assets/placeholderImage.jpg";
import { useSelector } from "react-redux";

function Account({ picture = defaultThumbnail }) {
    const user = useSelector((state) => state.user.user);
    console.log(user.data.fullname[0]);

    return (
        <button className="h-full aspect-square rounded-full bg-primary text-2xl text-textCol uppercase">
            {user.data.fullname[0]}
            {/* <img
                className="object-cover rounded-full w-full h-full"
                src={picture}
                alt="DP"
            /> */}
        </button>
    );
}

export default Account;
