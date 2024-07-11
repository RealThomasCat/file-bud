import React, { useEffect, useState } from "react";
import defaultThumbnail from "../assets/placeholderImage.jpg";
import { OptionsButton } from "./index.js";
import imageIcon from "../assets/ImageIcon.svg";
import videoIcon from "../assets/VideoIcon.svg";
import fileIcon from "../assets/FileIcon.svg";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

function FileCard({ title = "File Name", type = "image", fileId }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div
                onDoubleClick={() => {
                    if (type === "image") {
                        setIsOpen(true);
                    }
                }}
                className="aspect-square text-textCol flex flex-col gap-3 bg-glass border border-borderCol border-opacity-15 p-2 rounded-lg overflow-hidden"
            >
                <div className="w-full flex justify-between items-center pl-1">
                    <div className="w-fit h-full flex items-center gap-2 overflow-hidden">
                        <div className="h-4 w-4">
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

                        <h1 className="line-clamp-1 text-ellipsis">{title}</h1>
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
                <div className="fixed inset-0 flex flex-col w-screen items-center justify-center mx-auto bg-black bg-opacity-80">
                    <DialogPanel className="w-fit h-full pt-16 mb-12 flex flex-col justify-center items-center">
                        <div className="fixed max-h-16 min-h-16 h-16 max-w-7xl w-full p-2 top-0 text-xl">
                            <div className="w-full h-full py-2 px-6 flex justify-between bg-glass bg-opacity-40 text-xl rounded-full text-textCol text-center border border-borderCol border-opacity-15">
                                {/* TODO: OPTIONS */}
                                <div>{title}</div>
                                <div>Download</div>
                            </div>
                        </div>
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
