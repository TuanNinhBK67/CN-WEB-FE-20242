import React from "react";
import "../assets/scss/header.scss";
import { FaBell, FaQuestionCircle, FaFacebookF, FaInstagram, FaSearch, FaShoppingCart, FaTiktok } from "react-icons/fa";

const Header = () => {
  return (
    <header className="shop-header">
      <div className="shop-header__topbar">
        <div className="shop-header__left-links">
          <span>Kết nối</span>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebookF className="icon" />
        </a>

        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="icon" />
        </a>

        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
            <FaTiktok className="icon" />
        </a>

          
        </div>
        <div className="shop-header__right-links">
          <a href="#"><FaBell /> Thông Báo</a>
          <a href="#">Đăng Ký</a>
          <span>|</span>
          <a href="#">Đăng Nhập</a>
        </div>
      </div>
      <div className="shop-header__main">
        <div className="shop-logo">
          <img src="/images/logo.png" alt="LogoWeb" />
        </div>
        <div className="shop-search">
          <input type="text" placeholder="Tìm kiếm sản phẩm bạn cần" />
          <button className="search-button">
            <FaSearch />
          </button>
        </div>
        <div className="shop-cart">
          <FaShoppingCart size={20} />
        </div>
      </div>
      <div className="shop-header__keywords">
        <a href="#">Áo Thun Hot Trend 2024</a>
        <a href="#">Bánh Mix Nội Địa Trung</a>
        <a href="#">Giày Quai Hậu Nữ Đế Thấp</a>
        <a href="#">Điện Thoại 8plus Giá Rẻ 1k</a>
        <a href="#">Gấu Bông To Giá Rẻ</a>
        <a href="#">Kẹp Tóc 50 Cái</a>
      </div>
    </header>
  );
};

export default Header;