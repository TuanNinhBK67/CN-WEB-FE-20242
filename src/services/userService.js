import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/users`;

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

export const getProfile = async() => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/getProfile`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

export const getProfileById = async(user_id) => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/getProfileById`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

export const getAllUsers = async() => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/getAllUser`,{
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
}

export const deleteUser = async(userId) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API_URL}/userDelete/${userId}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const banUser = async(userId) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API_URL}/punish/${userId}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const unbanUser = async(userId) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API_URL}/unpunish/${userId}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const changePassword = async({oldPW, newPW, confirmPW}) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API_URL}/changePassword`,{
        oldPW,
        newPW,
        confirmPW
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const forgotPassword = async(email) => {
    return axios.post(`${API_URL}/forgot-password`, {email});
}

export const resetPassword = async(token, newPassword) => {
    return axios.post(`${API_URL}/reset-password`, {
        token, 
        newPassword
    })
}