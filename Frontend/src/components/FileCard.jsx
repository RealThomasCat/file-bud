import React from "react";
import defaultThumbnail from "../assets/placeholderImage.jpg";
import { OptionsButton } from "./index.js";
import imageIcon from "../assets/ImageIcon.svg";
import videoIcon from "../assets/VideoIcon.svg";

function FileCard({
    title = "File Name",
    thumbnail = defaultThumbnail,
    type = "image",
}) {
    return (
        <div className="max-w-44 max-h-44 aspect-square text-textCol flex flex-col gap-3 bg-glass bg-opacity-10 border border-borderCol border-opacity-15 p-2 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center px-1 py-0.5">
                <div className="w-full h-full flex items-center gap-2 overflow-hidden">
                    <div className="h-4 min-w-4">
                        <img
                            className="h-full w-full object-contain"
                            src={
                                type === "image"
                                    ? imageIcon
                                    : type === "video"
                                      ? videoIcon
                                      : null
                            }
                            alt="File Type Icon"
                        />
                    </div>

                    <h1 className="line-clamp-1 text-ellipsis">{title}</h1>
                </div>

                <OptionsButton />
            </div>

            {/* Thumbnail */}
            <div className="h-full w-full aspect-auto rounded-sm overflow-hidden">
                <img
                    src={thumbnail}
                    alt="Khalistani Billa"
                    className="w-full h-full object-cover rounded-sm"
                />
            </div>
        </div>
    );
}

export default FileCard;
