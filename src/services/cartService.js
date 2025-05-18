import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL; // hoặc thay bằng process.env.REACT_APP_API_URL nếu có dùng .env

// Lấy userId từ localStorage
const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) throw new Error("Chưa đăng nhập");
    return user.id;
};

// Lấy danh sách sản phẩm trong giỏ hàng
export const getCart = async () => {
    const user_id = getUserId();
    return axios.get(`${API_URL}/api/cart/${user_id}`);
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (product_id, quantity = 1) => {
    const user_id = getUserId();
    return axios.post(`${API_URL}/api/cart/add`, {
        user_id,
        product_id,
        quantity,
    });
};

// Cập nhật số lượng sản phẩm trong giỏ
export const updateCartItem = async (product_id, quantity) => {
    const user_id = getUserId();
    return axios.put(`${API_URL}/api/cart/update`, {
        user_id,
        product_id,
        quantity,
    });
};

// Xóa sản phẩm khỏi giỏ hàng
export const deleteCartItem = async (product_id) => {
    const user_id = getUserId();
    return axios.delete(`${API_URL}/api/cart/remove/${product_id}`, {
        data: { user_id },
    });
};

// Tạo đơn hàng mới từ giỏ hàng
export const createOrder = async (shippingMethod, paymentMethod) => {
    const user_id = getUserId();
    return axios.post(`${API_URL}/api/cart/order`, {
        user_id,
        shippingMethod,
        paymentMethod,
    });
};

// Lấy lịch sử đơn hàng
export const getOrderHistory = async () => {
    const user_id = getUserId();
    return axios.get(`${API_URL}/api/cart/history/${user_id}`);
};
