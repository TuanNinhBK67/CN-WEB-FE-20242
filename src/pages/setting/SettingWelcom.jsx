import React from "react";

import {CgProfile} from "react-icons/cg";
import {GrUpdate} from "react-icons/gr";
import { MdManageAccounts,MdOutlineProductionQuantityLimits, MdProductionQuantityLimits } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { IoIosLogOut } from "react-icons/io";
import { BiPackage } from "react-icons/bi";
import "../../assets/scss/setting/settingwelcom.scss"

const SettingWelcome = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return (
        <div>
            <h2>Chào mừng đến với Trung tâm Cài đặt</h2>
            <p>Hãy chọn một mục trong menu bên trái để thực hiện thao tác:</p>
                <ul className="setting-menu">
                    <li>Thông tin cá nhân <CgProfile/> </li>
                    <li>Cập nhật thông tin <GrUpdate/></li>
                    {user?.role === "customer" && (
                        <li>Theo dõi đơn hàng <MdProductionQuantityLimits/></li>
                    )}
                    {
                        user?.role === "admin" && (
                            <>
                                <li>Quản lý người dùng <MdManageAccounts/></li>
                                <li>Quản lý sản phẩm <MdOutlineProductionQuantityLimits/></li>
                                <li>Quản lý đơn hàng <BiPackage/></li>
                            </>
                        )
                    }
                    {
                        user?.role === "shipper" && (
                            <li>Danh sách đơn hàng<BiPackage/></li>
                        )
                    }
                        <li>Đổi mật khẩu <TbLockPassword/></li>
                        <li>Đăng xuất <IoIosLogOut/></li>
                </ul>
        </div>
    )
}

export default SettingWelcome