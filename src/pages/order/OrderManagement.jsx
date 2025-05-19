import React, { useState, useEffect } from "react";
import orderService from "../../services/orderService";
import { getUserById, getShipper } from "../../services/userService";

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const [searchTerm, setSearchTerm] = useState("");
    const statusOptions = [
        { label: "Chờ giao", value: "pending" },
        { label: "Đang giao", value: "processing" },
        { label: "Đã giao", value: "completed" },
        { label: "Huỷ", value: "canceled" },
        { label: "Đã thanh toán", value: "paid" }, // nếu có
    ];
    const [shippers, setShippers] = useState([]);

    useEffect(() => {
        async function fetchShippers() {
            try {
                const res = await getShipper();
                setShippers(res.data);
                console.log(shippers);
            } catch (error) {
                console.error("Lỗi lấy danh sách shipper:", error);
            }
        }
        fetchShippers();
    }, []);

    useEffect(() => {
        async function fetchOrdersWithUserProfile() {
            try {
                let response;
                if (user.role == "customer") {
                    response = await orderService.getAllOrders();
                } else if(user.role == "admin") { 
                    response = await orderService.getAllOrders_admin();
                } else {
                    response = await orderService.getAllOrderShipper();
                }
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
                console.log(ordersData);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách đơn hàng:", error);
            }
        }
        fetchOrdersWithUserProfile();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await orderService.updateOrderStatus(id, newStatus); // Gọi API
            setOrders((prev) =>
                prev.map((order) =>
                    order.id === id ? { ...order, status: newStatus } : order
                )
            );
            alert("Cập nhật trạng thái thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            alert("Không thể cập nhật trạng thái.");
        }
    };

    const handleAssignShipper = async (orderId, shipperId) => {
        try {
            await orderService.assignShipper(orderId, shipperId);
            alert("gán shipper thành công");
        } catch (error) {
            console.error("Lỗi khi gán shipper:", error);
            alert("Không thể gán shipper.");
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
                                    {order.shipper?.full_name || "---"}
                                </td>
                                <td className="py-3 px-4 space-y-1">
                                    {user.role === "admin" && (
                                        <div className="flex flex-wrap gap-2">
                                            <select
                                                className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
                                                value={order.shipper || ""} // set giá trị hiện tại của shipper cho từng đơn
                                                onChange={async (e) => {
                                                    const shipperId =
                                                        e.target.value;
                                                    try {
                                                        await handleAssignShipper(
                                                            order.id,
                                                            shipperId
                                                        );
                                                    } catch (error) {
                                                        // lỗi đã xử lý trong handleAssignShipper
                                                    }
                                                }}
                                            >
                                                <option value="" disabled>
                                                    Gán shipper
                                                </option>
                                                {(shippers || []).map(
                                                    (shipper) => (
                                                        <option
                                                            key={shipper.id}
                                                            value={shipper.id}
                                                        >
                                                            {shipper.username} -{" "}
                                                            {
                                                                shipper.phone_number
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>
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
                                                {statusOptions.map((opt) => (
                                                    <option
                                                        key={opt.value}
                                                        value={opt.value}
                                                    >
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
                                                onClick={() =>
                                                    handleCancelOrder(order.id)
                                                }
                                            >
                                                Huỷ
                                            </button>
                                        </div>
                                    )}
                                    {user.role === "shipper" && (
                                        <div className="flex flex-wrap gap-2">
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
                                                {statusOptions.map((opt) => (
                                                    <option
                                                        key={opt.value}
                                                        value={opt.value}
                                                    >
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
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
