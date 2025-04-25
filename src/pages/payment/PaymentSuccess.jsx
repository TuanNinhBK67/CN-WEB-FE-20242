import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./PaymentResult.scss";
import { FaCheckCircle, FaFileInvoice, FaHome, FaShoppingBag } from "react-icons/fa";
import axios from "axios";

const PaymentSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        // Trong thực tế, sẽ gọi API backend để lấy thông tin
        // const response = await axios.get(`/api/invoices/${orderId}`);
        // setInvoice(response.data);
        
        // Dữ liệu mẫu cho demo
        setInvoice({
          id: "INV" + Date.now().toString().slice(-6),
          orderNumber: orderId || "12345",
          transactionId: "TRANS_" + Date.now(),
          date: new Date().toLocaleDateString("vi-VN"),
          paymentMethod: "Thẻ tín dụng",
          items: [
            { name: "Áo thun nam", price: 250000, quantity: 2 },
            { name: "Quần jean nữ", price: 450000, quantity: 1 },
          ],
          subtotal: 950000,
          shippingFee: 30000,
          total: 980000,
          customerName: "Nguyễn Văn A",
          shippingAddress: "123 Đường ABC, Quận XYZ, Hà Nội",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, [orderId]);

  const handleDownloadInvoice = () => {
    // Giả lập tải hóa đơn
    alert("Tính năng tải hóa đơn đang được phát triển");
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="payment-result-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin hóa đơn...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="payment-result-container success">
        <div className="result-header">
          <FaCheckCircle className="success-icon" />
          <h1>Thanh toán thành công!</h1>
          <p>
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận và đang
            được xử lý.
          </p>
        </div>

        <div className="invoice-container">
          <div className="invoice-header">
            <div className="invoice-title">
              <h2>Hóa đơn điện tử</h2>
              <span className="invoice-id">#{invoice.id}</span>
            </div>
            <div className="invoice-date">Ngày: {invoice.date}</div>
          </div>

          <div className="invoice-details">
            <div className="invoice-section">
              <h3>Thông tin đơn hàng</h3>
              <p><strong>Mã đơn hàng:</strong> #{invoice.orderNumber}</p>
              <p><strong>Mã giao dịch:</strong> {invoice.transactionId}</p>
              <p><strong>Phương thức thanh toán:</strong> {invoice.paymentMethod}</p>
            </div>

            <div className="invoice-section">
              <h3>Thông tin khách hàng</h3>
              <p><strong>Họ tên:</strong> {invoice.customerName}</p>
              <p><strong>Địa chỉ giao hàng:</strong> {invoice.shippingAddress}</p>
            </div>
          </div>

          <div className="invoice-items">
            <h3>Chi tiết sản phẩm</h3>
            <table>
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index}>
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
            <div className="summary-row">
              <span>Tạm tính:</span>
              <span>{invoice.subtotal.toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="summary-row">
              <span>Phí vận chuyển:</span>
              <span>{invoice.shippingFee.toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="summary-total">
              <span>Tổng cộng:</span>
              <span>{invoice.total.toLocaleString("vi-VN")} ₫</span>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="primary-button" onClick={handleDownloadInvoice}>
            <FaFileInvoice /> Tải hóa đơn
          </button>
          <button className="secondary-button" onClick={() => navigate("/")}>
            <FaHome /> Về trang chủ
          </button>
          <button
            className="secondary-button"
            onClick={() => navigate("/setting/orders")}
          >
            <FaShoppingBag /> Xem đơn hàng
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentSuccess;