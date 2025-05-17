import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/products`;

export const getAllProducts = async () => {
  return axios.get(`${API_URL}`);
};

export const updateProduct = async (productId, data) => {
  const token = localStorage.getItem("token");
  return axios.put(`${API_URL}/${productId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addToCart = async (productId, quantity = 1) => {
  // Lấy user id từ localStorage phiên đăng nhập hiện thời
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.id)
    throw new Error("Bạn cần đăng nhập để thêm vào giỏ hàng");
  return axios.post(`${API_URL}/${productId}/add-to-cart/${user.id}`, {
    quantity,
  });
};
