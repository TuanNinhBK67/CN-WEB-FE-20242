import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { useNavigate, useLocation } from "react-router-dom";
import CartPopup from "../pages/cart/CartPopup";
import OrderForm from "../pages/order/components/OrderForm";
import {
  getCart,
  updateCartItem,
  deleteCartItem,
  createOrder,
} from "../services/cartService";

const API_URL = process.env.REACT_APP_API_URL;

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isOpenCart, setIsOpenCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const fetchCart = async () => {
    try {
      const response = await getCart();
      setCartItems(response.data);
      console.log(cartItems);
    } catch (err) {
      console.error("Lỗi khi lấy giỏ hàng:", err);
    } finally {
    }
  };
  useEffect(() => {
    fetchCart();
  }, [isOpenCart]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const openCart = () => {
    // navigate("/cart", { state: { background: location } });
    setShowOrderForm(false);
    setIsOpenCart(true);
  };

  const handleRemove = async (product_id) => {
    try {
      await deleteCartItem(product_id);
      fetchCart();
    } catch (err) {
      console.error("Lỗi khi xoá sản phẩm:", err);
    }
  };

  const handleQuantityChange = async (product_id, newQuantity) => {
    try {
      await updateCartItem(product_id, newQuantity);
      fetchCart();
    } catch (err) {
      console.error("Lỗi khi cập nhật số lượng:", err);
    }
  };

  const handleCheckout = () => {
    alert("Chuyển đến trang thanh toán");
    navigate('/order-listing');
  };

  const handleOrder = async () => {
    setShowOrderForm(true);
    setIsOpenCart(false);
    // try {
    //     const res = await createOrder()
    //     alert("Đặt hàng thành công!");
    //     fetchCart();
    // } catch (err) {
    //     console.error("Lỗi khi đặt hàng:", err);
    // }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchValue.trim())}`);
    }
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
        <div
          className="shop-search"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            marginLeft: 32,
            marginRight: 32,
          }}
        >
          <form
            onSubmit={handleSearch}
            style={{ display: "flex", alignItems: "center", width: "100%" }}
          >
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm bạn cần"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{
                flex: 1,
                minWidth: 0,
                fontSize: 16,
                color: "#222",
                background: "#fff",
                border: "1.5px solid #e0e0e0",
                borderRadius: "8px 0 0 8px",
                padding: "10px 16px",
                outline: "none",
                boxShadow: "none",
                height: 44,
                fontWeight: 500,
              }}
            />
            <button
              className="search-button"
              type="submit"
              style={{
                height: 44,
                borderRadius: "0 8px 8px 0",
                border: "none",
                background: "#2575fc",
                color: "#fff",
                fontSize: 20,
                padding: "0 18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                transition: "background 0.2s",
              }}
            >
              <FaSearch />
            </button>
          </form>
        </div>
        <div className="shop-cart" onClick={openCart}>
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

      {isOpenCart && (
        <CartPopup
          items={cartItems}
          onClose={() => setIsOpenCart(false)}
          onRemove={handleRemove}
          onQuantityChange={handleQuantityChange}
          onCheckout={handleCheckout}
          onOrder={handleOrder}
        />
      )}

			{showOrderForm && <OrderForm onClose={() => setShowOrderForm(false)} />}
        </header>
    );
};

export default Header;
