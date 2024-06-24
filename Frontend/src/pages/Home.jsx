import React, { useEffect, useState } from "react";
import { Container, FileCard } from "../components/index.js";
import Login from "../components/Login.jsx";
import { useDispatch, useSelector } from "react-redux";

function Home() {
    const [folder, setFolder] = useState(null);
    const [files, setFiles] = useState([{ _id: 1 }, { _id: 2 }, { _id: 3 }]);
    const [subFolders, setSubFolders] = useState([]);

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    if (!user) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Login to view your files
                            </h1>

                            <Login />
                        </div>
                    </div>
                </Container>
            </div>
        );
    }
    return (
        <div className="w-full py-8">
            <Container>
                <div className="mb-8 flex justify-between">
                    <h1 className="text-2xl font-medium">Folder Name</h1>
                    <div className="flex gap-4">
                        <button className=" bg-gray-400 p-2 rounded-lg">
                            Folder Option 1
                        </button>
                        <button className=" bg-gray-400 p-2 rounded-lg">
                            Folder Option 2
                        </button>
                        <button className=" bg-gray-400 p-2 rounded-lg">
                            Folder Option 3
                        </button>
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
        </div>
    );
}

export default Home;
