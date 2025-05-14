import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Spin, message } from "antd";
import { FaFileInvoice, FaSearch, FaFilter } from "react-icons/fa";
import axios from "axios";
import "./PaymentHistory.scss";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SettingBoard from "../../components/SettingBoard";

const PaymentHistory = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          message.error("Vui lòng đăng nhập để xem lịch sử thanh toán");
          navigate("/login");
          return;
        }

        const response = await axios.get("/api/payments");
        if (response.data.success) {
          const formattedPayments = response.data.payments.map((payment) => ({
            id: payment.id,
            orderId: payment.order?.id || "N/A",
            transactionId: payment.transaction_id || "N/A",
            date: payment.created_at,
            amount: payment.amount,
            paymentMethod: payment.payment_method,
            status: payment.status.toLowerCase(),
            invoiceId: payment.invoice_id || null,
          }));
          setPayments(formattedPayments);
        } else {
          message.error("Không thể tải lịch sử thanh toán");
        }
      } catch (error) {
        console.error("Lỗi khi tải lịch sử thanh toán:", error);
        message.error("Đã xảy ra lỗi khi tải lịch sử thanh toán");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [navigate]);

  const viewInvoice = async (invoiceId) => {
    setInvoiceLoading(true);
    setInvoiceModalVisible(true);
    try {
      const response = await axios.get(`/api/invoices/${invoiceId}`);
      if (response.data.success) {
        setSelectedInvoice(response.data.invoice);
      } else {
        message.error("Không thể tải chi tiết hóa đơn");
      }
    } catch (error) {
      console.error("Lỗi khi tải hóa đơn:", error);
      message.error("Đã xảy ra lỗi khi tải chi tiết hóa đơn");
    } finally {
      setInvoiceLoading(false);
    }
  };

  const handleRetryPayment = async (orderId) => {
    try {
      const response = await axios.get(`/api/payments/status/${orderId}`);
      if (response.data.success && response.data.status === "pending") {
        navigate(`/checkout/${orderId}`);
      } else {
        message.info(`Trạng thái thanh toán: ${response.data.status}`);
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error);
      message.error("Đã xảy ra lỗi khi kiểm tra trạng thái thanh toán");
    }
  };

  const handleRequestRefund = async () => {
    try {
      const response = await axios.post("/api/payments/refund", {
        order_id: selectedOrderId,
        reason: refundReason,
      });
      if (response.data.success) {
        message.success("Yêu cầu hoàn tiền đã được gửi");
        setShowRefundModal(false);
        setRefundReason("");
        // Cập nhật danh sách thanh toán
        const fetchPayments = async () => {
          setLoading(true);
          try {
            const response = await axios.get("/api/payments");
            if (response.data.success) {
              const formattedPayments = response.data.payments.map((payment) => ({
                id: payment.id,
                orderId: payment.order?.id || "N/A",
                transactionId: payment.transaction_id || "N/A",
                date: payment.created_at,
                amount: payment.amount,
                paymentMethod: payment.payment_method,
                status: payment.status.toLowerCase(),
                invoiceId: payment.invoice_id || null,
              }));
              setPayments(formattedPayments);
            } else {
              message.error("Không thể tải lịch sử thanh toán");
            }
          } catch (error) {
            console.error("Lỗi khi tải lịch sử thanh toán:", error);
            message.error("Đã xảy ra lỗi khi tải lịch sử thanh toán");
          } finally {
            setLoading(false);
          }
        };
        fetchPayments();
      } else {
        message.error("Không thể gửi yêu cầu hoàn tiền");
      }
    } catch (error) {
      console.error("Lỗi khi yêu cầu hoàn tiền:", error);
      message.error("Đã xảy ra lỗi khi gửi yêu cầu hoàn tiền");
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "successful":
      case "completed":
        return <span className="status-badge success">Thành công</span>;
      case "pending":
        return <span className="status-badge pending">Đang xử lý</span>;
      case "failed":
        return <span className="status-badge failed">Thất bại</span>;
      default:
        return <span className="status-badge">Không xác định</span>;
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case "credit_card":
        return "Thẻ tín dụng/ghi nợ";
      case "momo":
        return "MoMo";
      case "vnpay":
        return "VnPay";
      case "paypal":
        return "PayPal";
      default:
        return method || "Không xác định";
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const filteredPayments = payments
    .filter((payment) => {
      if (filterStatus === "all") return true;
      return payment.status === filterStatus;
    })
    .filter((payment) => {
      if (!searchTerm) return true;
      return (
        payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  return (
    <>
      <Header />
      <div className="setting-page">
        <div className="setting-container">
          <SettingBoard />
          <div className="setting-content">
            <div className="payment-history-container">
              <h2>Lịch sử thanh toán</h2>

              <div className="filter-section">
                <div className="search-bar">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo mã đơn hàng hoặc mã giao dịch"
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
                    <option value="successful">Thành công</option>
                    <option value="pending">Đang xử lý</option>
                    <option value="failed">Thất bại</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="loading-container">
                  <Spin />
                  <p>Đang tải lịch sử thanh toán...</p>
                </div>
              ) : filteredPayments.length === 0 ? (
                <div className="empty-state">
                  <p>Không tìm thấy giao dịch nào.</p>
                </div>
              ) : (
                <div className="payment-table-container">
                  <table className="payment-table">
                    <thead>
                      <tr>
                        <th>Mã đơn hàng</th>
                        <th>Ngày</th>
                        <th>Số tiền</th>
                        <th>Phương thức</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments.map((payment) => (
                        <tr key={payment.id}>
                          <td>{payment.orderId}</td>
                          <td>{formatDate(payment.date)}</td>
                          <td>{payment.amount.toLocaleString("vi-VN")} ₫</td>
                          <td>{getPaymentMethodLabel(payment.paymentMethod)}</td>
                          <td>{getStatusLabel(payment.status)}</td>
                          <td>
                            {(payment.status === "successful" || payment.status === "completed") ? (
                              <>
                                <button
                                  className="action-button view-invoice"
                                  onClick={() => viewInvoice(payment.invoiceId)}
                                  disabled={!payment.invoiceId}
                                >
                                  <FaFileInvoice /> Xem hóa đơn
                                </button>
                                <button
                                  className="action-button refund"
                                  onClick={() => {
                                    setSelectedOrderId(payment.orderId);
                                    setShowRefundModal(true);
                                  }}
                                >
                                  Yêu cầu hoàn tiền
                                </button>
                              </>
                            ) : payment.status === "failed" || payment.status === "pending" ? (
                              <button
                                className="action-button retry-payment"
                                onClick={() => handleRetryPayment(payment.orderId)}
                              >
                                Thử lại
                              </button>
                            ) : (
                              <span className="processing-text">Đang xử lý...</span>
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
        title="Chi tiết hóa đơn"
        open={invoiceModalVisible}
        onCancel={() => setInvoiceModalVisible(false)}
        footer={[
          <button
            key="close"
            className="action-button"
            onClick={() => setInvoiceModalVisible(false)}
          >
            Đóng
          </button>,
        ]}
        width={700}
      >
        {invoiceLoading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin />
            <p>Đang tải chi tiết hóa đơn...</p>
          </div>
        ) : selectedInvoice ? (
          <div className="invoice-details">
            <div className="invoice-header">
              <h3>Hóa đơn #{selectedInvoice.invoice_number}</h3>
              <p>Ngày: {formatDate(selectedInvoice.created_at)}</p>
            </div>
            <div className="invoice-customer">
              <h4>Thông tin khách hàng</h4>
              <p>Tên: {selectedInvoice.customer_name || "N/A"}</p>
              <p>Email: {selectedInvoice.customer_email || "N/A"}</p>
            </div>
            <div className="invoice-items">
              <h4>Danh sách mặt hàng</h4>
              <table className="payment-table">
                <thead>
                  <tr>
                    <th>Mặt hàng</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items?.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price.toLocaleString("vi-VN")} ₫</td>
                      <td>{(item.price * item.quantity).toLocaleString("vi-VN")} ₫</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="invoice-summary">
              <div className="summary-item">
                <span>Tạm tính:</span>
                <span>{selectedInvoice.subtotal?.toLocaleString("vi-VN")} ₫</span>
              </div>
              <div className="summary-item">
                <span>Thuế:</span>
                <span>{selectedInvoice.tax?.toLocaleString("vi-VN")} ₫</span>
              </div>
              <div className="summary-item total">
                <span>Tổng cộng:</span>
                <span>{selectedInvoice.total?.toLocaleString("vi-VN")} ₫</span>
              </div>
            </div>
          </div>
        ) : (
          <p>Không có dữ liệu hóa đơn</p>
        )}
      </Modal>

      <Modal
        title="Yêu cầu hoàn tiền"
        open={showRefundModal}
        onCancel={() => setShowRefundModal(false)}
        footer={[
          <button
            key="cancel"
            className="action-button"
            onClick={() => setShowRefundModal(false)}
          >
            Hủy
          </button>,
          <button
            key="submit"
            className="action-button primary"
            onClick={handleRequestRefund}
            disabled={!refundReason}
          >
            Gửi yêu cầu
          </button>,
        ]}
      >
        <p>Vui lòng nhập lý do yêu cầu hoàn tiền:</p>
        <input
          type="text"
          value={refundReason}
          onChange={(e) => setRefundReason(e.target.value)}
          placeholder="Lý do hoàn tiền"
          style={{ width: "100%", padding: "8px", marginTop: "8px" }}
        />
      </Modal>
    </>
  );
};

export default PaymentHistory;