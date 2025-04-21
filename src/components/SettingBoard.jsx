import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/scss/SettingBoard.scss";

const SidebarMenu = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = ()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }

    return(
        <div className="sidebar-menu">
            <ul>
                <li onClick={() => navigate("/profile")}>Thông tin cá nhân</li>
                <li onClick={() => navigate("/updateProfile")}>Cập nhật thông tin</li>

            {user?.role === "customer" && (
                <li oncClick={() => navigate("#")}>Giỏ hàng</li>
            )}
            {
                user?.role === "admin" && (
                    <>
                        <li onClick={() => navigate("#")}>Quản lý người dùng</li>
                        <li oncClick={() => navigate("#")}>Quản lý sản phẩm</li>
                    </>
                )
            }
            <li onClick={handleLogout}>Đăng xuất</li>
            </ul>
        </div>
    )
}

export default SidebarMenu;