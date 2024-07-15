import axios from "axios";

// Ensure axios sends cookies with requests
axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL + "/api/v1/files"; // TODO: TEST

const fetchThumbnail = (fileId) => {
    console.log("Hello from file.service.js"); // DEBUGGING
    return axios.get(`${API_URL}/thumbnail/${fileId}`);
};

const uploadFile = (formData) => {
    return axios.post(`${API_URL}/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

const downloadFile = (fileId) => {
    console.log("Sending File ID:", fileId); //DEBUGGING
    return axios.get(`${API_URL}/download`, {
        params: { fileId },
        // responseType: "blob",
    });
};

const fetchFile = (fileId) => {
    return axios.get(`${API_URL}/fetch`, { params: { fileId } });
};

const deleteFile = (fileId) => {
    return axios.delete(`${API_URL}/delete`, {
        data: { fileId },
    });
};

const streamVideo = (fileId) => {
    return axios.get(`${API_URL}/stream`, { params: { fileId } });
};

export default {
    fetchThumbnail,
    uploadFile,
    downloadFile,
    fetchFile,
    deleteFile,
    streamVideo,
};
