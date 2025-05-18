import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/products`;
const API_URL_CART = `${process.env.REACT_APP_API_URL}`;

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
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id)
        throw new Error("Bạn cần đăng nhập để thêm vào giỏ hàng");

    return axios.post(`${API_URL_CART}/api/cart/add`, {
        user_id: user.id,
        product_id: productId,
        quantity,
    });
};
