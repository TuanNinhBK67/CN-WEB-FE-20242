import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import { FaTimesCircle, FaHome, FaRedo, FaInfoCircle } from "react-icons/fa";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./PaymentResult.scss";

const PaymentFailed = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [canRetry, setCanRetry] = useState(true);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      if (!orderId) {
        setError("Không tìm thấy mã đơn hàng");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          message.error("Vui lòng đăng nhập để xem thông tin thanh toán");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/payments/status/${orderId}`
        );

        if (response.data.success) {
          setPaymentInfo(response.data);
          const paymentStatus = response.data.payment_status?.toLowerCase();
          const orderStatus = response.data.order_status?.toLowerCase();

          if (
            orderStatus === "completed" ||
            paymentStatus === "completed" ||
            paymentStatus === "paid"
          ) {
            setCanRetry(false);
          }
        } else {
          throw new Error("Không thể kiểm tra trạng thái thanh toán");
        }
      } catch (err) {
        console.error("Lỗi khi kiểm tra trạng thái thanh toán:", err);
        setError(err.message || "Đã xảy ra lỗi khi kiểm tra trạng thái thanh toán");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [orderId, navigate]);

  const handleTryAgain = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/payments/status/${orderId}`
      );

      if (response.data.success) {
        const paymentStatus = response.data.payment_status?.toLowerCase();
        const orderStatus = response.data.order_status?.toLowerCase();

        if (paymentStatus === "completed" || paymentStatus === "paid") {
          message.success("Thanh toán đã thành công, chuyển hướng đến trang xác nhận");
          navigate(`/payment/success/${orderId}`);
          return;
        } else if (orderStatus === "cancelled" || orderStatus === "completed") {
          message.error("Đơn hàng này không thể thanh toán lại. Vui lòng liên hệ hỗ trợ.");
          return;
        }

        navigate(`/checkout/${orderId}`);
      } else {
        throw new Error("Không thể kiểm tra trạng thái thanh toán");
      }
    } catch (err) {
      console.error("Lỗi trước khi thử lại:", err);
      message.error("Không thể thử lại thanh toán. Vui lòng thử lại sau.");
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="payment-result-container">
          <div className="loading-spinner"></div>
          <p>Đang kiểm tra thông tin thanh toán...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="payment-result-container failed">
          <div className="result-header">
            <FaTimesCircle className="failed-icon" />
            <h1>Thanh toán thất bại</h1>
            <p>{error}</p>
          </div>
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
      <div className="payment-result-container failed">
        <div className="result-header">
          <FaTimesCircle className="failed-icon" />
          <h1>Thanh toán thất bại</h1>
          <p>
            Rất tiếc, giao dịch của bạn không thành công. Vui lòng kiểm tra lại
            thông tin thanh toán và thử lại.
          </p>
          {paymentInfo?.payment_details?.error_message && (
            <div className="payment-error-message">
              <FaInfoCircle /> <span>{paymentInfo.payment_details.error_message}</span>
            </div>
          )}
        </div>

        <div className="error-container">
          <h3>Có thể do một trong các nguyên nhân sau:</h3>
          <ul>
            <li>Thông tin thẻ không chính xác</li>
            <li>Tài khoản không đủ số dư</li>
            <li>Giao dịch vượt quá hạn mức thanh toán</li>
            <li>Lỗi kết nối với cổng thanh toán</li>
            <li>Ngân hàng từ chối giao dịch</li>
          </ul>
        </div>

        <div className="action-buttons">
          {canRetry ? (
            <button className="primary-button" onClick={handleTryAgain}>
              <FaRedo /> Thử lại
            </button>
          ) : (
            <button className="disabled-button" disabled>
              <FaRedo /> Không thể thử lại
            </button>
          )}
          <button className="secondary-button" onClick={() => navigate("/")}>
            <FaHome /> Về trang chủ
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentFailed;
