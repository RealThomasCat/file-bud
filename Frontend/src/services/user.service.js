import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/v1/users"; // TODO: TEST

const register = (username, email, password) => {
    return axios.post(`${API_URL}/register`, {
        username,
        email,
        password,
    });
};

const login = (email, password) => {
    return axios.post(`${API_URL}/login`, {
        email,
        password,
    });
};

const logout = () => {
    return axios.post(`${API_URL}/logout`);
};

const getUser = () => {
    return axios.get(`${API_URL}/getUser`);
};

export default {
    register,
    login,
    logout,
    getUser,
};
