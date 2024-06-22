import React, { useEffect, useState } from "react";
import { Container } from "../components";

function Home() {
    const [folder, setFolder] = useState(null);
    const [files, setFiles] = useState([]);
    const [subFolders, setSubFolders] = useState([]);

    useEffect(() => {
        // Fetch and set user root folder
        // Set user files
        // Set user subFolders
    }, []);

    if (!folder) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Login to view your files
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }
    return (
        <div className="w-full py-8">
            <Container>
                <div className="flex flex-wrap">
                    {subFolders.map((subFolder) => (
                        <div key={subFolder._id}>{/* {Folder Card} */}</div>
                    ))}
                    {files.map((file) => (
                        <div key={file._id}>{/* {Folder Card} */}</div>
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default Home;
