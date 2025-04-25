import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./PaymentResult.scss";
import { FaTimesCircle, FaHome, FaRedo } from "react-icons/fa";

const PaymentFailed = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate(`/checkout/${orderId}`);
  };

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
          <button className="primary-button" onClick={handleTryAgain}>
            <FaRedo /> Thử lại
          </button>
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