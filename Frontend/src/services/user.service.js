import axios from "axios";

// Ensure axios sends cookies with requests
axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_API_URL + "/api/v1/users"; // TODO: TEST

const register = (fullname, email, password) => {
    return axios.post(`${API_URL}/register`, {
        fullname,
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
