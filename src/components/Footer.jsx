import React from "react";
import "../assets/scss/footer.scss";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-column">
          <h4>Về chúng tôi</h4>
          <ul>
            <li><a href="#">Giới thiệu</a></li>
            <li><a href="#">Tuyển dụng</a></li>
            <li><a href="#">Điều khoản dịch vụ</a></li>
            <li><a href="#">Chính sách bảo mật</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Hỗ trợ khách hàng</h4>
          <ul>
            <li><a href="#">Trung tâm trợ giúp</a></li>
            <li><a href="#">Hướng dẫn mua hàng</a></li>
            <li><a href="#">Chính sách đổi trả</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Kết nối với chúng tôi</h4>
          <div className="footer-socials">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
          </div>
        </div>
        <div className="footer-column">
          <h4>Thông tin liên hệ</h4>
          <ul>
            <li>Địa chỉ: số 1, Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội</li>
            <li>Email: ttninh@gmail.com</li>
            <li>Hotline: 0123 456 789</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        © 2025 YourShop. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;