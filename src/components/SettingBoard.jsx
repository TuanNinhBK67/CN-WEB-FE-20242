import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/scss/user/SettingBoard.scss";

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
                <li onClick={() => navigate("/setting/profile")}>Thông tin cá nhân</li>
                <li onClick={() => navigate("/setting/updateProfile")}>Cập nhật thông tin</li>

            {user?.role === "customer" && (
                <li onClick={() => navigate("/setting/shoppingCart")}>Giỏ hàng</li>
            )}
            {
                user?.role === "admin" && (
                    <>
                        <li onClick={() => navigate("/setting/dashboard/user")}>Quản lý người dùng</li>
                        <li onClick={() => navigate("/setting/dashboard/product")}>Quản lý sản phẩm</li>
                    </>
                )
            }
            <li onClick={() => navigate("/setting/password")} >Đổi mật khẩu</li>
            <li onClick={handleLogout}>Đăng xuất</li>
            </ul>
        </div>
    )
}

export default SidebarMenu;