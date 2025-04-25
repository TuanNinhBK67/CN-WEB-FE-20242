import React, { useEffect, useState } from "react";
import "../assets/scss/header.scss";
import {
  FaBell,
  FaUserCircle,
  FaFacebookF,
  FaInstagram,
  FaSearch,
  FaShoppingCart,
  FaTiktok,
} from "react-icons/fa";
import { IoSettings, IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Header = ({ onSearch }) => {
  const [user, setUser] = useState(null);

  const [keyword, setKeyword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSearchClick = () => {
    if (keyword.trim()) {
      onSearch(keyword); // Gọi callback props để truyền từ khóa tìm kiếm
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && keyword.trim()) {
      onSearch(keyword); // Gọi callback khi nhấn Enter
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="shop-header">
      <div className="shop-header__topbar">
        <div className="shop-header__left-links">
          <span>Kết nối</span>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF className="icon" />
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="icon" />
          </a>

          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTiktok className="icon" />
          </a>
        </div>
        <div className="shop-header__right-links">
          {user ? (
            <>
              <span>
                <FaUserCircle /> Xin chào {user.username}
              </span>

              {user.role === "customer" && (
                <a href="/cart">
                  <FaShoppingCart /> Giỏ hàng
                </a>
              )}
              <a href="/setting">
                <IoSettings />
                Cài đặt
              </a>
              <a href="" onClick={handleLogout}>
                <IoLogOutOutline /> Đăng xuất
              </a>
            </>
          ) : (
            <>
              <a href="/notification">
                <FaBell /> Thông Báo
              </a>
              <a href="/register">Đăng Ký</a>
              <span>|</span>
              <a href="/login">Đăng Nhập</a>
            </>
          )}
          {/* <a href="#"><FaBell /> Thông Báo</a>
          <a href="/register">Đăng Ký</a>
          <span>|</span>
          <a href="/login">Đăng Nhập</a> */}
        </div>
      </div>
      <div className="shop-header__main">
        <div className="shop-logo">
          <a href="/">
            <img src="/images/logo.png" alt="LogoWeb" />
          </a>
        </div>
        <div className="shop-search">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm bạn cần"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="search-button" onClick={handleSearchClick}>
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
