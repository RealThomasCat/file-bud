import axios from "axios";

// Ensure axios sends cookies with requests
axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL + "/api/v1/folders";

const fetchFolder = (folderId) => {
    return axios.get(`${API_URL}/fetch/${folderId}`);
};

const createFolder = (currFolderId, title) => {
    return axios.post(`${API_URL}/create`, { currFolderId, title });
};

const deleteFolder = (folderId) => {
    return axios.delete(`${API_URL}/delete`, {
        data: { folderId },
    });
};

export default {
    fetchFolder,
    createFolder,
    deleteFolder,
};
