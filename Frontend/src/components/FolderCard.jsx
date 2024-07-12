import React from "react";
import folderIcon from "../assets/FolderIcon.svg";
import { OptionsButton } from "./index.js";

function FolderCard({ title = "File Name" }) {
    return (
        <div className="h-fit text-textCol flex justify-between items-center gap-3 bg-glass border border-borderCol border-opacity-15 pl-3 pr-1 py-2 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center gap-2 overflow-hidden">
                <div className="h-full ">
                    <img
                        src={folderIcon}
                        alt="Khalistani Billa"
                        className="max-h-4 min-h-4 object-contain"
                    />
                </div>
                <h1 className="w-4/5 text-ellipsis line-clamp-1">{title}</h1>
            </div>

            <OptionsButton />
        </div>
    );
}

export default FolderCard;
