import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentHistory.scss";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SettingBoard from "../../components/SettingBoard";
import { FaFileInvoice, FaSearch, FaFilter } from "react-icons/fa";
import axios from "axios";

const PaymentHistory = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          navigate("/login");
          return;
        }

        // Ở đây sẽ gọi API để lấy lịch sử thanh toán
        // Giả lập dữ liệu cho demo
        setPayments([
          {
            id: 1,
            orderId: "ORD12345",
            transactionId: "TRANS_167834290",
            date: "2025-04-15",
            amount: 980000,
            paymentMethod: "credit_card",
            status: "successful",
            invoiceId: "INV789012"
          },
          {
            id: 2,
            orderId: "ORD12346",
            transactionId: "TRANS_167834291",
            date: "2025-04-10",
            amount: 450000,
            paymentMethod: "momo",
            status: "successful",
            invoiceId: "INV789013"
          },
          {
            id: 3,
            orderId: "ORD12347",
            transactionId: "TRANS_167834292",
            date: "2025-04-05",
            amount: 1250000,
            paymentMethod: "vnpay",
            status: "failed",
            invoiceId: null
          },
          {
            id: 4,
            orderId: "ORD12348",
            transactionId: "TRANS_167834293",
            date: "2025-03-28",
            amount: 780000,
            paymentMethod: "paypal",
            status: "successful",
            invoiceId: "INV789014"
          },
          {
            id: 5,
            orderId: "ORD12349",
            transactionId: "TRANS_167834294",
            date: "2025-03-20",
            amount: 350000,
            paymentMethod: "credit_card",
            status: "pending",
            invoiceId: null
          }
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payment history:", error);
        setLoading(false);
      }
    };

    fetchPayments();
  }, [navigate]);

  const getStatusLabel = (status) => {
    switch (status) {
      case "successful":
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
        return "Không xác định";
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const handleViewInvoice = (invoiceId, status) => {
    if (status === "successful" && invoiceId) {
      navigate(`/payment/invoice/${invoiceId}`);
    }
  };

  const handleRetryPayment = (orderId) => {
    navigate(`/checkout/${orderId}`);
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
                  <div className="loading-spinner"></div>
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
                            {payment.status === "successful" ? (
                              <button
                                className="action-button view-invoice"
                                onClick={() =>
                                  handleViewInvoice(payment.invoiceId, payment.status)
                                }
                                disabled={!payment.invoiceId}
                              >
                                <FaFileInvoice /> Xem hóa đơn
                              </button>
                            ) : payment.status === "failed" ? (
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
    </>
  );
};

export default PaymentHistory;