import React, { useEffect, useState } from "react";
import fileIcon from "../assets/FileIcon.svg";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { PrimaryButton } from "./index.js";
import { useParams } from "react-router-dom";
import fileService from "../services/file.service.js";

function Upload() {
    const { folderId } = useParams();

    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState(null);

    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            console.log("File: ", file);
            formData.append("folderId", folderId); // Append folderId if required by the API
            console.log("Folder ID: ", folderId);

            await fileService.uploadFile(formData);
            setIsOpen(false);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="h-full w-40 aspect-square flex justify-center items-center gap-2 rounded-full bg-glass bg-opacity-15 border border-borderCol border-opacity-15 text-base font-medium text-textCol"
            >
                <img className="w-4 h-4" src={fileIcon} alt="Upload Icon" />
                <h1 className="pb-0.5">Upload File</h1>
            </button>

            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 flex w-screen items-center justify-center mx-auto">
                    <DialogPanel className="w-full max-w-96 bg-glass bg-opacity-10 px-4 py-6 rounded-lg flex flex-col gap-6 border border-borderCol border-opacity-10 backdrop-blur-md">
                        <DialogTitle className="w-full text-xl font-light text-textCol text-center">
                            Upload Image or Video File
                        </DialogTitle>
                        <div className="w-full flex flex-col gap-3">
                            <label
                                className="text-textCol w-full text-left px-1"
                                htmlFor="email"
                            >
                                File:
                            </label>
                            <input
                                name="file"
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                className=""
                            />
                        </div>
                        <div className="flex justify-center items-center w-full h-10 mt-4 mb-3">
                            <PrimaryButton
                                action={handleUpload}
                                title="Upload"
                            />
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}

export default Upload;
