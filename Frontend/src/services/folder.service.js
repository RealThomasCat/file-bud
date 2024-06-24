import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/v1/folders"; // TODO: TEST

export const createFolder = async (folderData) => {
    const response = await axios.post(`${API_URL}/create`, folderData);
    return response.data;
};

export const fetchFolder = async (folderId) => {
    const response = await axios.get(`${API_URL}/${folderId}`);
    return response.data;
};

export const deleteFolder = async (folderId) => {
    const response = await axios.delete(`${API_URL}/${folderId}`);
    return response.data;
};
