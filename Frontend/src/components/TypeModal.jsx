import React from "react";
import ImageIcon from "../assets/ImageIcon.svg";
import VideoIcon from "../assets/VideoIcon.svg";

function TypeModal() {
    return (
        <div className="w-28 h-fit text-textCol rounded-lg flex flex-col bg-glass bg-opacity-10 border border-borderCol border-opacity-15 backdrop-blur-sm py-2">
            <button className="flex gap-2 items-center hover:bg-glass hover:bg-opacity-20 py-1 px-3 text-left">
                <img
                    className="w-4 h-4 rounded-sm"
                    src={ImageIcon}
                    alt="Image Icon"
                />

                <h1>Images</h1>
            </button>

            <button className="flex gap-2 items-center hover:bg-glass hover:bg-opacity-20 py-1 px-3 text-left">
                <img
                    className="w-4 h-4 rounded-sm"
                    src={VideoIcon}
                    alt="Image Icon"
                />

                <h1>Videos</h1>
            </button>
        </div>
    );
}

export default TypeModal;
