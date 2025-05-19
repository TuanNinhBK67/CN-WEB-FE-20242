import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import { FaCheckCircle, FaFileInvoice, FaHome, FaShoppingBag } from "react-icons/fa";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./PaymentResult.scss";

const PaymentSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        console.log("Start fetching invoice data for orderId:", orderId);
        setLoading(true);

        const user = JSON.parse(localStorage.getItem("user"));
        console.log("User from localStorage:", user);
        if (!user) {
          message.error("Vui lòng đăng nhập để xem thông tin hóa đơn");
          navigate("/login");
          return;
        }

        const paymentResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/payments/filter?order_id=${orderId}&payment_status=paid`);
        console.log("Payment response:", paymentResponse.data);

        if (!paymentResponse.data.success || !paymentResponse.data.payment) {
          throw new Error("Không thể tìm thấy thanh toán cho đơn hàng");
        }
        const payment = paymentResponse.data.payment;

        const confirmResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/payments/confirm?order_id=${orderId}&transaction_id=${payment.transaction_id}`);
        console.log("Confirm response:", confirmResponse.data);

        if (!confirmResponse.data.success) {
          message.error("Thanh toán chưa hoàn tất");
          navigate(`/payment/failed/${orderId}`);
          return;
        }

        const order = payment.order;
        console.log("Order from payment:", order);

        const invoiceResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/payments/invoices?order_id=${order.id}`);
        console.log("Invoice response:", invoiceResponse.data);

        if (!invoiceResponse.data.success || !invoiceResponse.data.invoice) {
          throw new Error("Không tìm thấy hóa đơn cho đơn hàng này");
        }

        const invoiceData = invoiceResponse.data.invoice;

        const mappedInvoice = {
          id: invoiceData.id,
          orderNumber: order.id || "N/A",
          transactionId: order.transaction_id || "N/A",
          date: new Date(invoiceData.created_at || invoiceData.createdAt).toLocaleDateString("vi-VN"),
          paymentMethod: getPaymentMethodLabel(order.payment_method || "N/A"),
          subtotal: parseFloat(invoiceData.total_amount) - (order.shipping_fee || 0),
          shippingFee: order.shipping_fee || 0,
          total: parseFloat(invoiceData.total_amount || 0),
          customerName: invoiceData.user?.full_name || "N/A",
          shippingAddress: order.shipping_address || "N/A",
        };
        console.log("Mapped invoice data:", mappedInvoice);

        setInvoice(mappedInvoice);
        setLoading(false);
        console.log("Finished fetching invoice data successfully");
      } catch (error) {
        console.error("Lỗi khi tải hóa đơn:", error);
        setError(error.message || "Đã xảy ra lỗi khi tải thông tin hóa đơn");
        setLoading(false);
      }
    };

    if (orderId) {
      fetchInvoiceData();
    }
  }, [orderId, navigate]);

  const getPaymentMethodLabel = (method) => {
    switch (method.toLowerCase()) {
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

  const handleDownloadInvoice = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/invoices/${invoice.id}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `hoa-don-${invoice.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      message.success("Tải hóa đơn thành công");
    } catch (error) {
      console.error("Lỗi khi tải hóa đơn:", error);
      message.error("Không thể tải hóa đơn. Vui lòng thử lại sau.");
    }
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

  if (error || !invoice) {
    return (
      <>
        <Header />
        <div className="payment-result-container error">
          <h1>Có lỗi xảy ra</h1>
          <p>{error || "Không thể tải thông tin hóa đơn. Vui lòng thử lại sau."}</p>
          <div className="action-buttons">
            <button className="secondary-button" onClick={() => navigate("/")}>
              <FaHome /> Về trang chủ
            </button>
          </div>
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
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
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

          <div className="invoice-summary">
            <div className="summary-row">
              <span>Tạm tính:</span>
              <span>{Number(invoice.subtotal).toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="summary-row">
              <span>Phí vận chuyển:</span>
              <span>{Number(invoice.shippingFee).toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="summary-total">
              <span>Tổng cộng:</span>
              <span>{Number(invoice.total).toLocaleString("vi-VN")} ₫</span>
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
            onClick={() => navigate("/setting/order-listing")}
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