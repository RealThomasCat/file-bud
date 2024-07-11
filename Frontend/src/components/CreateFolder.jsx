import React, { useEffect, useState } from "react";
import fileIcon from "../assets/FileIcon.svg";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { PrimaryButton } from "./index.js";
import folderService from "../services/folder.service.js";

function CreateFolder({ onUploadComplete, folderId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState(null);

    const handleCreate = async () => {
        try {
            // console.log(folderId); // DEBUGGING
            const response = await folderService.createFolder(folderId, title);
            setIsOpen(false);
            onUploadComplete();
            return response;
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="h-full w-40 aspect-square flex justify-center items-center gap-2 rounded-full bg-glass border border-borderCol border-opacity-15 text-base font-medium text-textCol"
            >
                <img className="w-4 h-4" src={fileIcon} alt="Upload Icon" />
                <h1 className="pb-0.5">Create Folder</h1>
            </button>

            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 flex w-screen items-center justify-center mx-auto bg-black bg-opacity-75">
                    <DialogPanel className="w-full max-w-96 bg-glass px-4 py-6 rounded-lg flex flex-col gap-6 border border-borderCol border-opacity-10">
                        <DialogTitle className="w-full text-xl font-light text-textCol text-center">
                            Name your folder
                        </DialogTitle>
                        <div className="w-full flex flex-col gap-3">
                            <label
                                className="text-textCol w-full text-left px-1"
                                htmlFor="email"
                            >
                                Title:
                            </label>
                            <input
                                name="title"
                                type="type"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className=""
                            />
                        </div>
                        <div className="flex justify-center items-center w-full h-10 mt-4 mb-3">
                            <PrimaryButton
                                action={handleCreate}
                                title="Create"
                            />
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}

export default CreateFolder;
