import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Spin, message } from "antd";
import { FaSearch, FaFilter, FaCreditCard } from "react-icons/fa";
import axios from "axios";
import "./OrderListing.scss";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SettingBoard from "../../components/SettingBoard";

const OrderListing = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailsVisible, setOrderDetailsVisible] = useState(false);
  const [orderDetailsLoading, setOrderDetailsLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          message.error("Vui lòng đăng nhập để xem đơn hàng");
          navigate("/login");
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders`);
        if (response.data.success) {
          const formattedOrders = response.data.orders.map((order) => ({
            id: order.id,
            userId: order.user_id,
            totalAmount: order.total_amount,
            status: order.status.toLowerCase(),
            shippingAddress: order.shipping_address,
            paymentStatus: order.payment_status.toLowerCase(),
            createdAt: order.created_at,
            updatedAt: order.updated_at,
          }));
          setOrders(formattedOrders);
        } else {
          message.error("Không thể tải danh sách đơn hàng");
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách đơn hàng:", error);
        message.error("Đã xảy ra lỗi khi tải danh sách đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const viewOrderDetails = async (orderId) => {
    setOrderDetailsLoading(true);
    setOrderDetailsVisible(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/${orderId}`);
      if (response.data.success) {
        setSelectedOrder(response.data.order);
      } else {
        message.error("Không thể tải chi tiết đơn hàng");
      }
    } catch (error) {
      console.error("Lỗi khi tải chi tiết đơn hàng:", error);
      message.error("Đã xảy ra lỗi khi tải chi tiết đơn hàng");
    } finally {
      setOrderDetailsLoading(false);
    }
  };

  const handlePayment = (orderId) => {
    navigate(`/checkout/${orderId}`);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/orders/${orderId}/cancel`);
      if (response.data.success) {
        message.success("Đơn hàng đã được hủy thành công");
        // Cập nhật danh sách đơn hàng
        const updatedOrders = orders.map(order => 
          order.id === orderId ? { ...order, status: "canceled" } : order
        );
        setOrders(updatedOrders);
      } else {
        message.error("Không thể hủy đơn hàng");
      }
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      message.error("Đã xảy ra lỗi khi hủy đơn hàng");
    }
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

  return (
    <>
      <Header />
      <div className="setting-page">
        <div className="setting-container">
          <SettingBoard />
          <div className="setting-content">
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
                            <button
                              className="action-button view-details"
                              onClick={() => viewOrderDetails(order.id)}
                            >
                              Chi tiết
                            </button>
                            {order.status !== "canceled" && order.paymentStatus === "pending" && (
                              <button
                                className="action-button payment"
                                onClick={() => handlePayment(order.id)}
                              >
                                <FaCreditCard /> Thanh toán
                              </button>
                            )}
                            {(order.status === "pending" || order.status === "processing") && (
                              <button
                                className="action-button cancel"
                                onClick={() => handleCancelOrder(order.id)}
                              >
                                Hủy đơn
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
          </div>
        </div>
      </div>
      <Footer />

      <Modal
        title="Chi tiết đơn hàng"
        open={orderDetailsVisible}
        onCancel={() => setOrderDetailsVisible(false)}
        footer={[
          <button
            key="close"
            className="action-button"
            onClick={() => setOrderDetailsVisible(false)}
          >
            Đóng
          </button>,
          selectedOrder && selectedOrder.payment_status === "pending" ? (
            <button
              key="payment"
              className="action-button primary"
              onClick={() => handlePayment(selectedOrder.id)}
            >
              <FaCreditCard /> Thanh toán ngay
            </button>
          ) : null,
        ]}
        width={700}
      >
        {orderDetailsLoading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin />
            <p>Đang tải chi tiết đơn hàng...</p>
          </div>
        ) : selectedOrder ? (
          <div className="order-details">
            <div className="order-header">
              <h3>Đơn hàng #{selectedOrder.id}</h3>
              <p>Ngày đặt: {formatDate(selectedOrder.created_at)}</p>
            </div>
            <div className="order-address">
              <h4>Địa chỉ giao hàng</h4>
              <p>{selectedOrder.shipping_address}</p>
            </div>
            <div className="order-items">
              <h4>Danh sách sản phẩm</h4>
              <table className="order-table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{parseFloat(item.price).toLocaleString("vi-VN")} ₫</td>
                      <td>
                        {(parseFloat(item.price) * item.quantity).toLocaleString("vi-VN")} ₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="order-summary">
              <div className="summary-item">
                <span>Tạm tính:</span>
                <span>{parseFloat(selectedOrder.subtotal || selectedOrder.total_amount).toLocaleString("vi-VN")} ₫</span>
              </div>
              <div className="summary-item">
                <span>Phí vận chuyển:</span>
                <span>{parseFloat(selectedOrder.shipping_fee || 0).toLocaleString("vi-VN")} ₫</span>
              </div>
              <div className="summary-item total">
                <span>Tổng cộng:</span>
                <span>{parseFloat(selectedOrder.total_amount).toLocaleString("vi-VN")} ₫</span>
              </div>
            </div>
            <div className="order-status">
              <div className="status-item">
                <span>Trạng thái đơn hàng:</span>
                <span>{getStatusLabel(selectedOrder.status)}</span>
              </div>
              <div className="status-item">
                <span>Trạng thái thanh toán:</span>
                <span>{getPaymentStatusLabel(selectedOrder.payment_status)}</span>
              </div>
            </div>
          </div>
        ) : (
          <p>Không có dữ liệu đơn hàng</p>
        )}
      </Modal>
    </>
  );
};

export default OrderListing;