import React, { useEffect, useState } from "react";
import {
    Container,
    FileCard,
    Upload,
    TypeMenu,
    FolderCard,
} from "../components/index.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchFolder } from "../store/folderSlice.js";

function Home() {
    const dispatch = useDispatch();
    const [files, setFiles] = useState([]);
    const [subFolders, setSubFolders] = useState([]);

    const authStatus = useSelector((state) => state.user.user);
    const rootFolderId = useSelector((state) => state.user.rootFolderId);
    const folder = useSelector((state) => state.folder.folder);

    useEffect(() => {
        console.log(rootFolderId);

        if (rootFolderId) {
            dispatch(fetchFolder(rootFolderId))
                .unwrap() // Returns the actual payload from the promise
                .then((response) => {
                    setFiles(response.data.files);
                    setSubFolders(response.data.subFolders);
                });
        }
    }, [dispatch, rootFolderId]);

    // TODO: !(authStatus && folder)
    if (!folder) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <h1 className="text-white">Loading...</h1>
                </Container>
            </div>
        );
    }
    return (
        <Container>
            <div className="h-16 py-3 flex justify-between items-center">
                <h1 className="text-2xl font-medium text-white">
                    Folder Name:{" "}
                    {folder.title === "Root" ? "My Drive" : folder.title}
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
                                    <FolderCard
                                        title={subFolder.title} // TODO: show file details after populating the file object
                                    />
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

export default Home;
