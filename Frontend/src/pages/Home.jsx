import React, { useEffect, useState } from "react";
import {
    Login,
    Container,
    FileCard,
    Upload,
    TypeMenu,
} from "../components/index.js";
import { useDispatch, useSelector } from "react-redux";

function Home() {
    const [folder, setFolder] = useState(null);
    const [files, setFiles] = useState([{ _id: 1 }, { _id: 2 }, { _id: 3 }]);
    const [subFolders, setSubFolders] = useState([]);

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    if (user) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <Login />
                        </div>
                    </div>
                </Container>
            </div>
        );
    }
    return (
        <Container>
            <div className="h-16 mb-6 py-3 flex justify-between items-center">
                <h1 className="text-2xl font-medium text-white">Folder Name</h1>

                <div className="w-fit h-full flex gap-4">
                    <Upload />
                    <TypeMenu />
                </div>
            </div>

            <div className="flex flex-wrap gap-4">
                {subFolders.map((subFolder) => (
                    <div key={subFolder._id}>{/* {Folder Card} */}</div>
                ))}
                {files.map((file) => (
                    <div key={file._id}>
                        <FileCard
                            title="Khalistani Billa"
                            // TODO: thumbnail according to file type
                        />
                    </div>
                ))}
            </div>
        </Container>
    );
}

export default Home;
