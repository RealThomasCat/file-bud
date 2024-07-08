import React, { useEffect, useState } from "react";
import {
    Container,
    FileCard,
    Upload,
    TypeMenu,
    FolderCard,
} from "../components/index.js";
import { useDispatch, useSelector } from "react-redux";
import folderService from "../services/folder.service.js";
import { Link, useParams } from "react-router-dom";

function FolderPage() {
    const [folder, setFolder] = useState(null);
    const [error, setError] = useState(null);
    const [files, setFiles] = useState([]);
    const [subFolders, setSubFolders] = useState([]);

    const folderId = useParams();

    // TODO: FETCH THUMBNAILS

    useEffect(() => {
        const fetchFolder = async () => {
            try {
                const response = await folderService.fetchFolder(folderId);
                setFolder(response.data);
                setFiles(response.data.data.files);
                setSubFolders(response.data.data.subFolders);
            } catch (error) {
                console.error(error);
                setError(error);
            }
        };

        fetchFolder();
    }, []);

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
                    <Upload />
                    {/* <TypeMenu /> */}
                </div>
            </div>

            {(files && files.length > 0) ||
            (subFolders && subFolders.length > 0) ? (
                <div className="flex flex-col">
                    {/* Folders */}
                    {subFolders && subFolders.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 py-4">
                            {subFolders.map((subFolder) => (
                                <div key={subFolder._id}>
                                    <Link to={`/folders/${subFolder._id}`}>
                                        <FolderCard
                                            title={subFolder.title} // TODO: show file details after populating the file object
                                        />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Files */}
                    {files && files.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 py-4">
                            {files.map((file) => (
                                <div key={file._id}>
                                    <FileCard
                                        title={file.title} // TODO: show file details after populating the file object
                                        // thumbnail={file.thumbnail}
                                        // TODO: thumbnail according to file type
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="w-full text-center text-white">
                    Your drive is empty.
                </div>
            )}
        </Container>
    );
}

export default FolderPage;
