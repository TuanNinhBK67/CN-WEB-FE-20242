import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import "./Checkout.scss";
import { FaCreditCard, FaPaypal } from "react-icons/fa";
// import { SiMomo, SiVnpay } from "react-icons/si";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const { orderId } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`/api/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardInfo({
      ...cardInfo,
      [name]: value,
    });
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      
      const response = await axios.post("/api/payments/process", {
        order_id: order.id,
        user_id: user.id,
        payment_method: paymentMethod,
        amount: order.total,
      });

      if (response.data.success) {
        navigate(`/payment/success/${order.id}`);
      } else {
        navigate(`/payment/failed/${order.id}`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      navigate(`/payment/failed/${order.id}`);
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="checkout-container">
        <div className="checkout-steps">
          <div className="step completed">Giỏ hàng</div>
          <div className="step-divider"></div>
          <div className="step active">Thanh toán</div>
          <div className="step-divider"></div>
          <div className="step">Hoàn tất</div>
        </div>

        <div className="checkout-wrapper">
          <div className="checkout-details">
            <h2>Thông tin đơn hàng</h2>
            <div className="order-items">
              {order.items.map((item, index) => (
                <div className="order-item" key={index}>
                  <div className="item-name">{item.name}</div>
                  <div className="item-quantity">x{item.quantity}</div>
                  <div className="item-price">
                    {item.price.toLocaleString("vi-VN")} ₫
                  </div>
                </div>
              ))}
            </div>
            <div className="order-summary">
              <div className="summary-row">
                <span>Tạm tính:</span>
                <span>
                  {(order.total - order.shippingFee).toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <div className="summary-row">
                <span>Phí vận chuyển:</span>
                <span>{order.shippingFee.toLocaleString("vi-VN")} ₫</span>
              </div>
              <div className="summary-total">
                <span>Tổng cộng:</span>
                <span>{order.total.toLocaleString("vi-VN")} ₫</span>
              </div>
            </div>

            <div className="shipping-address">
              <h3>Địa chỉ giao hàng</h3>
              <p>{order.address}</p>
              <button className="change-address-btn">Thay đổi</button>
            </div>
          </div>

          <div className="payment-section">
            <h2>Phương thức thanh toán</h2>
            <div className="payment-methods">
              <div
                className={`payment-method ${
                  paymentMethod === "credit_card" ? "selected" : ""
                }`}
                onClick={() => handlePaymentMethodChange("credit_card")}
              >
                <FaCreditCard />
                <span>Thẻ tín dụng/Ghi nợ</span>
              </div>
              <div
                className={`payment-method ${
                  paymentMethod === "momo" ? "selected" : ""
                }`}
                onClick={() => handlePaymentMethodChange("momo")}
              >
               
                <span>MoMo</span>
              </div>
              <div
                className={`payment-method ${
                  paymentMethod === "vnpay" ? "selected" : ""
                }`}
                onClick={() => handlePaymentMethodChange("vnpay")}
              >
                
                <span>VnPay</span>
              </div>
              <div
                className={`payment-method ${
                  paymentMethod === "paypal" ? "selected" : ""
                }`}
                onClick={() => handlePaymentMethodChange("paypal")}
              >
                <FaPaypal />
                <span>PayPal</span>
              </div>
            </div>

            {paymentMethod === "credit_card" && (
              <form className="card-payment-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="cardNumber">Số thẻ</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardInfo.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cardHolder">Tên chủ thẻ</label>
                  <input
                    type="text"
                    id="cardHolder"
                    name="cardHolder"
                    placeholder="NGUYEN VAN A"
                    value={cardInfo.cardHolder}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="expiryDate">Ngày hết hạn</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={cardInfo.expiryDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group half">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      value={cardInfo.cvv}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="payment-button"
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Thanh toán ngay"}
                </button>
              </form>
            )}

            {paymentMethod !== "credit_card" && (
              <div className="other-payment-form">
                <div className="payment-qr">
                  <img src="/api/placeholder/200/200" alt="QR Code" />
                  <p>Quét mã QR để thanh toán</p>
                </div>
                <button 
                  onClick={handleSubmit} 
                  className="payment-button"
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Xác nhận đã thanh toán"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;