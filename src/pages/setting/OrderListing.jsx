// http://localhost:3001/setting/order-listing
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, message } from "antd";
import { FaSearch, FaFilter, FaCreditCard } from "react-icons/fa";
import "./OrderListing.scss";
import orderService from "../../services/orderService";

const OrderListing = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

useEffect(() => {
  const fetchOrders = async () => {
    setLoading(true);
    console.log("🔄 Bắt đầu fetch đơn hàng...");

    try {
      const rawUser = localStorage.getItem("user");
      console.log("🧑 User trong localStorage:", rawUser);

      const user = JSON.parse(rawUser);
      if (!user) {
        message.error("Vui lòng đăng nhập để xem đơn hàng");
        navigate("/login");
        return;
      }

      const response = await orderService.getAllOrders();
      console.log("📦 Phản hồi từ API getAllOrders:", response);

      // ✅ Kiểm tra nếu response.data là mảng
      if (Array.isArray(response.data)) {
        const formattedOrders = response.data.map((order) => ({
          id: order.id,
          userId: order.user_id,
          totalAmount: parseFloat(order.total_amount),
          status: order.status?.toLowerCase(),
          shippingAddress: order.shipping_address,
          paymentStatus: order.payment_status?.toLowerCase(),
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        }));

        console.log("📝 Đơn hàng đã format:", formattedOrders);
        setOrders(formattedOrders);
      } else {
        console.error("❌ Dữ liệu không đúng định dạng mảng:", response.data);
        message.error("Không thể tải danh sách đơn hàng");
      }
    } catch (error) {
      console.error("🔥 Lỗi trong quá trình gọi API:", error);
      message.error("Đã xảy ra lỗi khi tải danh sách đơn hàng");
    } finally {
      console.log("✅ Hoàn tất fetch đơn hàng.");
      setLoading(false);
    }
  };

  fetchOrders();
}, [navigate]);

  const handlePayment = (orderId) => {
    navigate(`/checkout/${orderId}`);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return <span className="status-badge pending">Chờ xử lý</span>;
      case "processing":
        return <span className="status-badge processing">Đang xử lý</span>;
      case "paid":
        return <span className="status-badge success">Đã thanh toán</span>;
      case "canceled":
        return <span className="status-badge failed">Đã hủy</span>;
      default:
        return <span className="status-badge">Không xác định</span>;
    }
  };

  const getPaymentStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return <span className="status-badge pending">Chờ thanh toán</span>;
      case "paid":
        return <span className="status-badge success">Đã thanh toán</span>;
      case "failed":
        return <span className="status-badge failed">Thất bại</span>;
      default:
        return <span className="status-badge">Không xác định</span>;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const filteredOrders = orders
    .filter((order) => {
      if (filterStatus === "all") return true;
      return order.status === filterStatus;
    })
    .filter((order) => {
      if (!searchTerm) return true;
      return (
        order.id.toString().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    // Log trạng thái lọc
console.log("🔎 Trạng thái lọc:");
console.log("   - Tổng đơn hàng:", orders.length);
console.log("   - Filter status:", filterStatus);
console.log("   - Search term:", searchTerm);
console.log("   - Sau khi lọc:", filteredOrders.length, "đơn hàng");
console.log("   - Danh sách đã lọc:", filteredOrders);
  return (
    <div className="order-listing-container">
      <h2>Danh sách đơn hàng</h2>

      <div className="filter-section">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn hàng hoặc địa chỉ"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-dropdown">
          <FaFilter />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="processing">Đang xử lý</option>
            <option value="paid">Đã thanh toán</option>
            <option value="canceled">Đã hủy</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spin />
          <p>Đang tải danh sách đơn hàng...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="empty-state">
          <p>Không tìm thấy đơn hàng nào.</p>
        </div>
      ) : (
        <div className="order-table-container">
          <table className="order-table">
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái đơn hàng</th>
                <th>Trạng thái thanh toán</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{parseFloat(order.totalAmount).toLocaleString("vi-VN")} ₫</td>
                  <td>{getStatusLabel(order.status)}</td>
                  <td>{getPaymentStatusLabel(order.paymentStatus)}</td>
                  <td>
                    {order.paymentStatus === "pending" && (
                      <button
                        className="action-button payment"
                        onClick={() => handlePayment(order.id)}
                      >
                        <FaCreditCard /> Thanh toán
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderListing;