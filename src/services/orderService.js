import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/orders`; // Thay bằng URL thực tế của backend

const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) throw new Error("Chưa đăng nhập");
    return user.id;
};

const orderService = {
    getAllOrders_admin: () => {
        return axios.get(`${API_URL}/getAll`);
    },

    // Lấy danh sách tất cả đơn hàng
    getAllOrders: () => {
        const user_id = getUserId()
        return axios.get(`${API_URL}/${user_id}`);
    },

    getAllOrderShipper: () => {
        const user_id = getUserId()
        return axios.get(`${API_URL}/shipper/${user_id}`);
    },

    // Lấy chi tiết đơn hàng theo ID
    getOrderById: (orderId) => {
        return axios.get(`${API_URL}/${orderId}`);
    },

    // Lấy danh sách đơn hàng chờ giao
    getPendingDeliveryOrders: () => {
        return axios.get(`${API_URL}/status/pending-delivery`);
    },

    // Gán shipper cho đơn hàng
    assignShipper: (orderId, shipperId) => {
        return axios.put(`${API_URL}/${orderId}/assign-shipper`, {
            shipper_id: shipperId,
        });
    },

    // Hủy đơn hàng
    cancelOrder: (orderId) => {
        return axios.put(`${API_URL}/${orderId}/cancel`);
    },

    // Cập nhật trạng thái đơn hàng
    updateOrderStatus: (orderId, status) => {
        return axios.put(`${API_URL}/${orderId}/status`, { status });
    },

    // Đánh dấu đơn hàng là thất bại
    markOrderAsFailed: (orderId) => {
        return axios.put(`${API_URL}/${orderId}/fail`);
    },

    // Lấy danh sách đơn hàng của shipper theo shipper_id
    getOrdersByShipper: (shipperId) => {
        return axios.get(`${API_URL}/shipper/orders`, {
            params: { shipper_id: shipperId },
        });
    },

    //Tạo đơn hàng (đặt hàng)
    createOrder: (orderData) => {
        return axios.post(`${API_URL}/create`, orderData);
    },
};

export default orderService;
