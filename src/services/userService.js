import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const login = async (email, password) => {
    return axios.post(`${API_URL}/login`, {
        email, 
        password,
    });
};

export const register = async(data) => {
    return axios.post(`${API_URL}/createUser`, data);
};

export const updateInfor = async(data) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API_URL}/userUpdate`, data,{
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
};