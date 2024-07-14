import React, { useEffect, useState } from "react";
import {
    Container,
    FileCard,
    Upload,
    TypeMenu,
    FolderCard,
} from "../components/index.js";
import folderService from "../services/folder.service.js";
import { Link, useParams } from "react-router-dom";
import CreateFolder from "../components/CreateFolder.jsx";

function FolderPage() {
    const { folderId } = useParams();

    const [folder, setFolder] = useState(null);
    const [error, setError] = useState(null);
    const [files, setFiles] = useState([]);
    const [subfolders, setSubfolders] = useState([]);

    const fetchFolder = async () => {
        try {
            const response = await folderService.fetchFolder(folderId);
            // console.log(response.data); // DEBUGGING
            setFolder(response.data.data);
            setFiles(response.data.data.files);
            setSubfolders(response.data.data.subfolders);
        } catch (error) {
            // console.error(error); // DEBUGGING
            setError(error);
        }
    };

    useEffect(() => {
        fetchFolder();
    }, [folderId]);

    if (!folder) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    {error ? (
                        <h1 className="text-white">{error}</h1>
                    ) : (
                        <h1 className="text-white">Loading...</h1>
                    )}
                </Container>
            </div>
        );
    }
    return (
        <Container>
            <div className="h-16 py-3 flex justify-between items-center">
                <h1 className="text-2xl font-medium text-white">
                    Folder Name: {folder.title ? folder.title : "Untitled"}
                </h1>

                <div className="w-fit h-full flex gap-4">
                    <Upload
                        onOperationComplete={fetchFolder}
                        folderId={folderId}
                    />
                    <CreateFolder
                        onOperationComplete={fetchFolder}
                        folderId={folderId}
                    />
                    {/* <TypeMenu /> */}
                </div>
            </div>

            {(files && files.length > 0) ||
            (subfolders && subfolders.length > 0) ? (
                <div className="flex flex-col gap-2">
                    {/* Folders */}
                    {subfolders && subfolders.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-4">
                            {subfolders.map((subfolder) => (
                                <div key={subfolder._id}>
                                    <FolderCard
                                        folder={subfolder}
                                        onOperationComplete={fetchFolder}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Files */}
                    {files && files.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-4">
                            {files.slice(0, 20).map((file) => (
                                <div key={file._id}>
                                    <FileCard
                                        file={file}
                                        onOperationComplete={fetchFolder}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="w-full text-center text-white">
                    This folder is empty.
                </div>
            )}
        </Container>
    );
}

export default FolderPage;
