import React from "react";
import folderIcon from "../assets/FolderIcon.svg";
import { OptionsButton } from "./index.js";
import { useNavigate } from "react-router-dom";
import folderService from "../services/folder.service.js";

// TODO: folder object should be passed as props
function FolderCard({ folder, onOperationComplete }) {
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            const response = await folderService.deleteFolder(folder._id);

            if (response.status === 200) {
                // setIsOpen(false);
                onOperationComplete();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div
            onDoubleClick={() => navigate(`/folders/${folder._id}`)}
            className="h-fit text-textCol flex justify-between items-center gap-3 bg-glass pl-3 pr-1 py-2 rounded-lg overflow-hidden"
        >
            <div className="w-full h-full flex items-center gap-2 overflow-hidden">
                <div className="h-full ">
                    <img
                        src={folderIcon}
                        alt="Khalistani Billa"
                        className="max-h-4 min-h-4 object-contain"
                    />
                </div>
                <h1 className="w-4/5 text-ellipsis line-clamp-1">
                    {folder.title}
                </h1>
            </div>

            <OptionsButton
                type="folder"
                folder={folder}
                handleDelete={handleDelete}
                showDetails
            />
        </div>
    );
}

export default FolderCard;
