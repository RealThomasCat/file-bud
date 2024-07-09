import axios from "axios";

// Ensure axios sends cookies with requests
axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL + "/api/v1/files"; // TODO: TEST

const fetchThumbnail = (fileId) => {
    console.log("Hello from file.service.js"); // DEBUGGING
    return axios.get(`${API_URL}/thumbnail/${fileId}`);
};

// export const uploadFile = async (fileData) => {
//     const response = await axios.post(`${API_URL}/upload`, fileData, {
//         headers: {
//             "Content-Type": "multipart/form-data",
//         },
//     });
//     return response.data;
// };

// export const fetchFile = async (fileId) => {
//     const response = await axios.get(`${API_URL}/${fileId}`);
//     return response.data;
// };

// export const deleteFile = async (fileId) => {
//     const response = await axios.delete(`${API_URL}/${fileId}`);
//     return response.data;
// };

// export const downloadFile = async (fileId) => {
//     const response = await axios.get(`${API_URL}/download/${fileId}`, {
//         responseType: "blob",
//     });
//     return response.data;
// };

export default {
    fetchThumbnail,
};
