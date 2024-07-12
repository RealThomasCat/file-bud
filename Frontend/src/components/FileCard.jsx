import React, { useEffect, useState } from "react";
import defaultThumbnail from "../assets/placeholderImage.jpg";
import { MainButton, OptionsButton } from "./index.js";
import imageIcon from "../assets/ImageIcon.svg";
import videoIcon from "../assets/VideoIcon.svg";
import fileIcon from "../assets/FileIcon.svg";
import downloadIcon from "../assets/DownloadIcon.svg";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import fileService from "../services/file.service.js";
import { useNavigate } from "react-router-dom";

function FileCard({ title = "File Name", type = "image", fileId }) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleDownload = async () => {
        try {
            console.log(fileId); // DEBUGGING
            const response = await fileService.downloadFile(fileId);
            console.log(response.data.data); // DEBUGGING
            window.open(`${response.data.data.signed_url}`, "_blank");
            return response;
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div
                onDoubleClick={showFile}
                className="aspect-square text-textCol flex flex-col gap-3 bg-glass border border-borderCol border-opacity-15 p-2 rounded-lg overflow-hidden"
            >
                <div className="w-full flex justify-between items-center pl-1">
                    <div className="w-full h-full flex items-center gap-2 overflow-hidden">
                        <div className="min-h-4 max-h-4 min-w-4 max-w-4">
                            <img
                                className="h-full w-full object-contain"
                                src={
                                    type === "image"
                                        ? imageIcon
                                        : type === "video"
                                          ? videoIcon
                                          : fileIcon
                                }
                                alt="File Type Icon"
                            />
                        </div>

                        <h1 className="w-4/5 line-clamp-1 text-ellipsis overflow-hidden">
                            {title}
                        </h1>
                    </div>

                    <OptionsButton />
                </div>

                {/* Thumbnail */}
                <div className="h-full w-full aspect-auto rounded-sm overflow-hidden">
                    <img
                        // src={thumbnailLink ? thumbnailLink : defaultThumbnail}
                        src={
                            type === "image" || type === "video"
                                ? `http://localhost:8000/api/v1/files/thumbnail/${fileId}`
                                : defaultThumbnail
                        }
                        alt="Khalistani Billa"
                        className="w-full h-full object-cover rounded-sm"
                    />
                </div>
            </div>

            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="z-50"
            >
                <div className="fixed inset-0 flex flex-col w-screen items-center justify-center mx-auto bg-black bg-opacity-75">
                    <DialogPanel className="w-fit h-full pt-28 mb-8 flex flex-col justify-center items-center">
                        {/* Header */}
                        <div className="fixed max-h-24 min-h-24 h-24 max-w-7xl w-full p-4 top-0 text-xl">
                            <div className="w-full h-full p-3 flex justify-between items-center bg-glass text-xl rounded-full text-textCol text-center border border-borderCol border-opacity-15">
                                <div className="px-4">{title}</div>

                                {/* TODO: Height of this width is 38 but it should be 40 */}
                                <div className="h-full flex gap-3">
                                    <MainButton
                                        title="Download"
                                        icon={downloadIcon}
                                        action={handleDownload}
                                    />
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="h-full aspect-square w-fit rounded-full border border-borderCol border-opacity-15"
                                    >
                                        X{/* TODO: Replace with icon */}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Image */}
                        <div className="h-full">
                            <img
                                // TODO: Fetch file from backend
                                src={`http://localhost:8000/api/v1/files/thumbnail/${fileId}`}
                                alt={title}
                                className="h-full object-contain"
                            />
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}

export default FileCard;
