import React, { useState, useEffect } from "react";
import orderService from "../../services/orderService";
import { getUserById } from "../../services/userService";

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [customer, setCustomer] = useState();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchOrdersWithUserProfile() {
            try {
                const response = await orderService.getAllOrders();
                const ordersData = response.data;
                const ordersWithProfile = await Promise.all(
                    ordersData.map(async (order) => {
                        if (!order.user_id) return order;

                        const userProfile = await getUserById(order.user_id);
                        return {
                            ...order,
                            user_profile: userProfile.data.user,
                        };
                    })
                );

                setOrders(ordersWithProfile);
                console.log(ordersWithProfile);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách đơn hàng:", error);
            }
        }
        fetchOrdersWithUserProfile();
    }, []);

    const handleStatusChange = (id, newStatus) => {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === id ? { ...order, status: newStatus } : order
            )
        );
    };

    const handleAssignShipper = (id) => {
        const name = prompt("Nhập tên shipper:");
        if (name) {
            setOrders((prev) =>
                prev.map((order) =>
                    order.id === id ? { ...order, shipper: name } : order
                )
            );
        }
    };

    const handleCancelOrder = (id) => {
        if (window.confirm("Bạn có chắc muốn huỷ đơn hàng này?")) {
            handleStatusChange(id, "Đã huỷ");
        }
    };

    const handleFailOrder = (id) => {
        if (window.confirm("Đánh dấu đơn hàng là thất bại?")) {
            handleStatusChange(id, "Thất bại");
        }
    };

    const filteredOrders = orders.filter((order) =>
        order.user_profile?.full_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto bg-gradient-to-b from-[#dfe9f3] to-[#ffffff] to-gray-50 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Quản lý đơn hàng
            </h1>

            <div className="flex justify-center mb-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên khách hàng..."
                    className="border border-gray-300 rounded px-4 py-2 w-1/2 shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-800 bg-white border rounded-md">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="py-3 px-4 text-left">Mã Đơn</th>
                            <th className="py-3 px-4 text-left">Khách hàng</th>
                            <th className="py-3 px-4 text-left">Ngày đặt</th>
                            <th className="py-3 px-4 text-left">Tổng tiền</th>
                            <th className="py-3 px-4 text-left">Trạng thái</th>
                            <th className="py-3 px-4 text-left">Shipper</th>
                            <th className="py-3 px-4 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="border-t">
                                <td className="py-3 px-4">{order.id}</td>
                                {/* Hiển thị tên khách hàng từ user_profile */}
                                <td className="py-3 px-4">
                                    {order.user_profile?.full_name || "N/A"}
                                </td>
                                {/* Hiển thị ngày đặt từ createdAt */}
                                <td className="py-3 px-4">
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString()}
                                </td>
                                {/* Hiển thị tổng tiền từ total_amount */}
                                <td className="py-3 px-4">
                                    {Number(
                                        order.total_amount
                                    ).toLocaleString()}
                                    đ
                                </td>
                                <td className="py-3 px-4">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${
                                            order.status === "Đã giao"
                                                ? "bg-green-100 text-green-700"
                                                : order.status === "Chờ giao"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : order.status === "Đã huỷ"
                                                ? "bg-red-100 text-red-700"
                                                : order.status === "Thất bại"
                                                ? "bg-gray-200 text-gray-700"
                                                : "bg-blue-100 text-blue-700"
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    {order.shipper || "---"}
                                </td>
                                <td className="py-3 px-4 space-y-1">
                                    {/* các button và select như cũ */}
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
                                            onClick={() =>
                                                handleAssignShipper(order.id)
                                            }
                                        >
                                            Gán shipper
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
                                            onClick={() =>
                                                handleCancelOrder(order.id)
                                            }
                                        >
                                            Huỷ
                                        </button>
                                        <button
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-2 py-1 rounded"
                                            onClick={() =>
                                                handleFailOrder(order.id)
                                            }
                                        >
                                            Thất bại
                                        </button>
                                        <select
                                            className="border px-2 py-1 rounded text-xs"
                                            value={order.status}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    order.id,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option>Chờ giao</option>
                                            <option>Đang giao</option>
                                            <option>Đã giao</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredOrders.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="text-center py-6 text-gray-500"
                                >
                                    Không tìm thấy đơn hàng nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManagement;
