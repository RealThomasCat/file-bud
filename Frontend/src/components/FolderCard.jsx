import React from "react";
import defaultThumbnail from "../assets/placeholderImage.jpg";

function FileCard({ title = "File Name", thumbnail = defaultThumbnail }) {
    return (
        <div className="max-w-40 max-h-40 aspect-square flex flex-col gap-2 bg-gray-400 p-2 rounded-lg">
            <div className="flex justify-between items-center">
                <h1>{title}</h1>
                <button>...</button>
            </div>
            <div className="w-full aspect-auto rounded-lg">
                <img
                    src={thumbnail}
                    alt="Khalistani Billa"
                    className="w-full h-full object-cover rounded"
                />
            </div>
        </div>
    );
}

export default FileCard;
