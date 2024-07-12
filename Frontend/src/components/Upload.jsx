import React, { useEffect, useState } from "react";
import fileIcon from "../assets/FileIcon.svg";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { MainButton, PrimaryButton } from "./index.js";
import fileService from "../services/file.service.js";
import { updateStorageUsed } from "../store/userSlice.js";
import { useDispatch } from "react-redux";

function Upload({ onOperationComplete, folderId }) {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [fileSize, setFileSize] = useState(0); // Store file size

    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            // console.log("File: ", file); // DEBUGGING
            formData.append("folderId", folderId); // Append folderId if required by the API
            // console.log("Folder ID: ", folderId); // DEBUGGING

            const response = await fileService.uploadFile(formData);
            // console.log(response); // DEBUGGING

            if (response.status === 200) {
                const uploadedFileSize = response.data.data.size;
                // console.log("Uploaded File Size: ", uploadedFileSize); // DEBUGGING
                dispatch(updateStorageUsed(uploadedFileSize));
            }

            setIsOpen(false);
            onOperationComplete();
            return response;
        } catch (error) {
            console.log(error);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileSize(selectedFile.size); // Store file size
    };

    return (
        <>
            <MainButton
                action={() => setIsOpen(true)}
                title="Upload File"
                icon={fileIcon}
            />

            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 flex w-screen items-center justify-center mx-auto bg-black bg-opacity-75">
                    <DialogPanel className="w-full max-w-96 bg-glass px-4 py-6 rounded-lg flex flex-col gap-6 border border-borderCol border-opacity-10">
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
                                onChange={handleFileChange}
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
