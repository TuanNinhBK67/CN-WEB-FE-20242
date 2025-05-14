import React, { useState } from "react";

const ordersData = [
    {
        id: "DH001",
        customer: "Nguyễn Văn A",
        total: 750000,
        status: "Chờ giao",
        date: "2025-05-10",
        shipper: "",
    },
    {
        id: "DH002",
        customer: "Trần Thị B",
        total: 450000,
        status: "Đã giao",
        date: "2025-05-11",
        shipper: "Ngô Văn Giao",
    },
    {
        id: "DH003",
        customer: "Lê Văn C",
        total: 980000,
        status: "Đang giao",
        date: "2025-05-12",
        shipper: "Nguyễn Shipper",
    },
];

const OrderManagement = () => {
    const [orders, setOrders] = useState(ordersData);
    const [searchTerm, setSearchTerm] = useState("");

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
        order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-300 min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-6">Quản lý đơn hàng</h1>

            <div className="mb-4 flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên khách hàng..."
                    className="border border-gray-300 rounded px-4 py-2 w-1/3 text-black"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white text-black shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-purple-600 text-white">
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
                            <tr key={order.id} className="border-b">
                                <td className="py-3 px-4">{order.id}</td>
                                <td className="py-3 px-4">{order.customer}</td>
                                <td className="py-3 px-4">{order.date}</td>
                                <td className="py-3 px-4">
                                    {order.total.toLocaleString()}đ
                                </td>
                                <td className="py-3 px-4">
                                    <span
                                        className={`px-2 py-1 rounded text-sm font-medium ${
                                            order.status === "Đã giao"
                                                ? "bg-green-100 text-green-800"
                                                : order.status === "Chờ giao"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : order.status === "Đã huỷ"
                                                ? "bg-red-100 text-red-800"
                                                : order.status === "Thất bại"
                                                ? "bg-gray-200 text-gray-800"
                                                : "bg-blue-100 text-blue-800"
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    {order.shipper || "---"}
                                </td>
                                <td className="py-3 px-4 space-y-1">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-2 py-1 rounded mr-1"
                                        onClick={() =>
                                            handleAssignShipper(order.id)
                                        }
                                    >
                                        Gán shipper
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white text-sm px-2 py-1 rounded mr-1"
                                        onClick={() =>
                                            handleCancelOrder(order.id)
                                        }
                                    >
                                        Huỷ đơn
                                    </button>
                                    <button
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-2 py-1 rounded mr-1"
                                        onClick={() =>
                                            handleFailOrder(order.id)
                                        }
                                    >
                                        Thất bại
                                    </button>
                                    <select
                                        className="border px-2 py-1 rounded text-sm"
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
