import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/v1/users"; // TODO: TEST

export const login = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    console.log(response.data);
    return response.data;
};

export const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

export const logout = async () => {
    const response = await axios.post(`${API_URL}/logout`);
    return response.data;
};
