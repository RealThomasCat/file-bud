import React, { useState } from "react";
import defaultThumbnail from "../assets/placeholderImage.jpg";
import { MainButton, OptionsButton } from "./index.js";
import imageIcon from "../assets/ImageIcon.svg";
import videoIcon from "../assets/VideoIcon.svg";
import fileIcon from "../assets/FileIcon.svg";
import downloadIcon from "../assets/DownloadIcon.svg";
import deleteIcon from "../assets/DeleteIcon.svg";
import { Dialog, DialogPanel } from "@headlessui/react";
import fileService from "../services/file.service.js";

function FileCard({
    title = "File Name",
    type = "image",
    fileId,
    onOperationComplete,
}) {
    const [file, setFile] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleDownload = async () => {
        try {
            console.log(fileId); // DEBUGGING
            const response = await fileService.downloadFile(fileId);
            console.log(response.data.data); // DEBUGGING

            // Open download link in new tab
            // window.open(`${response.data.data.signed_url}`, "_blank");

            // Create a temporary anchor element
            const link = document.createElement("a");
            link.href = response.data.data.signed_url;
            link.download = ""; // Optional: You can set a default filename here
            // Append the anchor to the body
            document.body.appendChild(link);
            // Programmatically click the anchor
            link.click();
            // Remove the anchor from the document
            document.body.removeChild(link);

            // return response;
        } catch (error) {
            console.log(error);
        }
    };

    const showFile = async () => {
        if (type === "image") {
            try {
                setImageLoading(true);
                setIsOpen(true);
                // if file URL is already present then fetch the image from the disk cache
                if (!file) {
                    const response = await fileService.fetchFile(fileId);
                    setFile(response.data.data.signed_url);
                    // console.log(response.data.data.signed_url); // DEBUGGING
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fileService.deleteFile(fileId);

            if (response.status === 200) {
                setIsOpen(false);
                onOperationComplete();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div
                onDoubleClick={showFile}
                className="aspect-square text-textCol flex flex-col gap-3 bg-glass p-2 rounded-lg overflow-hidden"
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
                            fileId && (type === "image" || type === "video")
                                ? `http://localhost:8000/api/v1/files/thumbnail/${fileId}`
                                : defaultThumbnail
                        }
                        loading="lazy"
                        alt="Khalistani Billa"
                        className="w-full h-full object-cover rounded-sm"
                    />
                </div>
            </div>

            <Dialog
                open={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    // setImageLoading(true);
                }}
                className="z-50"
            >
                <div className="fixed inset-0 flex flex-col w-screen items-center justify-center mx-auto bg-black bg-opacity-75">
                    <DialogPanel className="w-fit h-full pt-28 mb-8 flex flex-col justify-center items-center">
                        {/* Header */}
                        <div className="fixed max-h-24 min-h-24 h-24 max-w-7xl w-full p-4 top-0 text-xl">
                            <div className="w-full h-full p-3 flex justify-between items-center bg-glass text-xl rounded-full text-textCol text-center">
                                <div className="px-4">{title}</div>

                                {/* TODO: Height of this width is 38 but it should be 40 */}
                                <div className="h-full flex gap-3">
                                    <MainButton
                                        title="Delete"
                                        icon={deleteIcon}
                                        action={handleDelete}
                                        v2
                                    />

                                    <MainButton
                                        title="Download"
                                        icon={downloadIcon}
                                        action={handleDownload}
                                        v2
                                    />

                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="h-full aspect-square w-fit rounded-full border-2 border-primary "
                                    >
                                        X{/* TODO: Replace with icon */}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Image */}
                        {imageLoading && (
                            <h1 className="text-textCol text-lg">Loading...</h1>
                        )}
                        <div
                            className={`h-full w-full ${imageLoading ? "hidden" : null} bg-white`}
                        >
                            <img
                                // TODO: Fetch file from backend
                                src={file}
                                alt={title}
                                className="h-full object-contain"
                                onLoad={() => setImageLoading(false)}
                            />
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}

export default FileCard;
