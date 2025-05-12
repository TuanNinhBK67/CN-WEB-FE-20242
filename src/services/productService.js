import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/products`;

export const getAllProducts = async () => {
  return axios.get(`${API_URL}/getAll`);
};

export const updateProduct = async (productId, data) => {
  const token = localStorage.getItem("token");
  return axios.put(`${API_URL}/${productId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllCategories = async() => {
    return axios.get(`${API_URL}/categories`);
};

