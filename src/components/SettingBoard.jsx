import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/scss/user/SettingBoard.scss";

const SidebarMenu = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const location = useLocation();

    const handleLogout = ()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }

    return(
        <div className="sidebar-menu">
            <ul>
                <li 
                className={location.pathname === "/setting/profile" ? "active" : ""}
                onClick={() => navigate("/setting/profile")}>Thông tin cá nhân</li>
                <li 
                className={location.pathname === "/setting/updateProfile" ? "active" : ""}
                onClick={() => navigate("/setting/updateProfile")}>Cập nhật thông tin</li>

            {user?.role === "customer" && (
                <li
                className={location.pathname === "/setting/dashboard/user" ? "active" : ""}
                onClick={() => navigate("/setting/dashboard/orders")}>Theo dõi đơn hàng</li>
            )}
            {
                user?.role === "admin" && (
                    <>
                        <li
                        className={location.pathname === "/setting/dashboard/user" ? "active" : ""} 
                        onClick={() => navigate("/setting/dashboard/user")}>Quản lý người dùng</li>
                        <li 
                        className={location.pathname === "/setting/dashboard/product" ? "active" : ""}
                        onClick={() => navigate("/setting/dashboard/product")}>Quản lý sản phẩm</li>
                        <li 
                        className={location.pathname === "/setting/dashboard/orders" ? "active" : ""}
                        onClick={() => navigate("/setting/dashboard/orders")}>Quản lý đơn hàng</li>
                    </>
                )
            }
            {user?.role === "shipper" && (
                <li
                className={location.pathname === "/setting/order" ? "active" : ""} 
                onClick={() => navigate("/setting/order")}>Danh sách đơn hàng</li>
            )}
            <li
            className={location.pathname === "/setting/password" ? "active" : ""}  
            onClick={() => navigate("/setting/password")} >Đổi mật khẩu</li>
            <li onClick={handleLogout}>Đăng xuất</li>
            </ul>
        </div>
    )
}

export default SidebarMenu;