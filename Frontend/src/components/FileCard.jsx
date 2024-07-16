import React, { useState } from "react";
import defaultThumbnail from "../assets/DefaultThumbnail.png";
import { MainButton, OptionsButton } from "./index.js";
import imageIcon from "../assets/ImageIcon.svg";
import videoIcon from "../assets/VideoIcon.svg";
import fileIcon from "../assets/FileIcon.svg";
import downloadIcon from "../assets/DownloadIcon.svg";
import deleteIcon from "../assets/DeleteIcon.svg";
import closeIcon from "../assets/CloseIcon.svg";
import { Dialog, DialogPanel } from "@headlessui/react";
import fileService from "../services/file.service.js";
import Player from "./Player.jsx";

function FileCard({ file, onOperationComplete }) {
    const [fileUrl, setFileUrl] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isPlayerOpen, setIsPlayerOpen] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleDownload = async () => {
        try {
            // console.log(file._id); // DEBUGGING
            const response = await fileService.downloadFile(file._id);
            console.log(response.data.data); // DEBUGGING

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
        if (file.resourceType === "image") {
            try {
                setImageLoading(true);
                setIsOpen(true);
                // if file URL is already present then fetch the image from the disk cache
                if (!fileUrl) {
                    const response = await fileService.fetchFile(file._id);
                    setFileUrl(response.data.data.signed_url);
                    // console.log(response.data.data.signed_url); // DEBUGGING
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const playVideo = async () => {
        if (file.resourceType === "video") {
            try {
                const response = await fileService.streamVideo(file._id);
                console.log(response.data.data.signed_url); // DEBUGGING
                setVideoUrl(response.data.data.signed_url);
                setIsPlayerOpen(true);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fileService.deleteFile(file._id);

            if (response.status === 200) {
                setIsOpen(false);
                onOperationComplete();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const showDetails = async () => {
        console.log("Details");
    };

    return (
        <>
            <div
                onDoubleClick={
                    file.resourceType === "image" && file.format !== "pdf"
                        ? showFile
                        : file.resourceType === "video"
                          ? playVideo
                          : null
                }
                className="aspect-square text-textCol flex flex-col gap-3 bg-glass p-2 rounded-lg overflow-hidden"
            >
                <div className="w-full flex justify-between items-center pl-1">
                    <div className="w-full h-full flex items-center gap-2 overflow-hidden">
                        <div className="min-h-4 max-h-4 min-w-4 max-w-4">
                            <img
                                className="h-full w-full object-contain"
                                src={
                                    file.resourceType === "image"
                                        ? imageIcon
                                        : file.resourceType === "video"
                                          ? videoIcon
                                          : fileIcon
                                }
                                alt="File Type Icon"
                            />
                        </div>

                        <h1 className="w-4/5 line-clamp-1 text-ellipsis overflow-hidden">
                            {file.title}
                        </h1>
                    </div>

                    <OptionsButton
                        type="file"
                        file={file}
                        handleDownload={handleDownload}
                        handleDelete={handleDelete}
                        showDetails={showDetails}
                    />
                </div>

                {/* Thumbnail */}
                <div className="h-full w-full aspect-auto rounded-sm overflow-hidden">
                    <img
                        // src={thumbnailLink ? thumbnailLink : defaultThumbnail}
                        src={
                            file._id &&
                            (file.resourceType === "image" ||
                                file.resourceType === "video")
                                ? `http://localhost:8000/api/v1/files/thumbnail/${file._id}`
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
                                <div className="px-4 pb-0.5">{file.title}</div>

                                {/* TODO: Height of this width is 38 but it should be 40 */}
                                <div className="h-full flex gap-3">
                                    <MainButton
                                        // title="Download"
                                        icon={downloadIcon}
                                        action={handleDownload}
                                        v2
                                    />

                                    <MainButton
                                        // title="Delete"
                                        icon={deleteIcon}
                                        action={handleDelete}
                                        v2
                                    />

                                    <MainButton
                                        // title="Close"
                                        icon={closeIcon}
                                        action={() => setIsOpen(false)}
                                        v2
                                    />
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
                                src={fileUrl}
                                alt={file.title}
                                className="h-full object-contain"
                                onLoad={() => setImageLoading(false)}
                            />
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            <Dialog
                open={isPlayerOpen}
                onClose={() => {
                    setIsPlayerOpen(false);
                }}
                className="z-50"
            >
                <div className="fixed inset-0 flex flex-col w-screen items-center justify-center mx-auto bg-black bg-opacity-75">
                    <DialogPanel className="w-[64rem] max-w-5xl">
                        <Player file={file} videoUrl={videoUrl} />
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}

export default FileCard;
