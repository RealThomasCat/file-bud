import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/v1/files"; // TODO: TEST

export const uploadFile = async (fileData) => {
    const response = await axios.post(`${API_URL}/upload`, fileData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const fetchFile = async (fileId) => {
    const response = await axios.get(`${API_URL}/${fileId}`);
    return response.data;
};

export const deleteFile = async (fileId) => {
    const response = await axios.delete(`${API_URL}/${fileId}`);
    return response.data;
};

export const downloadFile = async (fileId) => {
    const response = await axios.get(`${API_URL}/download/${fileId}`, {
        responseType: "blob",
    });
    return response.data;
};
