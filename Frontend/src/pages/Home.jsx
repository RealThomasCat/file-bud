import React, { useEffect, useState } from "react";
import { Container, FileCard, Upload, TypeMenu } from "../components/index.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchFolder } from "../store/folderSlice.js";

function Home() {
    const dispatch = useDispatch();
    const [files, setFiles] = useState([{ _id: 1 }, { _id: 2 }, { _id: 3 }]);
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

    if (!rootFolderId) {
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
            <div className="h-16 mb-6 py-3 flex justify-between items-center">
                <h1 className="text-2xl font-medium text-white">
                    Folder Name: {folder?.title}
                </h1>

                <div className="w-fit h-full flex gap-4">
                    <Upload />
                    <TypeMenu />
                </div>
            </div>

            <div className="flex flex-wrap gap-4">
                {subFolders?.map((subFolder) => (
                    <div key={subFolder._id}>{/* {Folder Card} */}</div>
                ))}
                {files?.map((file) => (
                    <div key={file}>
                        <FileCard
                            title={file} // TODO: show file details after populating the file object
                            // TODO: thumbnail according to file type
                        />
                    </div>
                ))}
            </div>
        </Container>
    );
}

export default Home;
