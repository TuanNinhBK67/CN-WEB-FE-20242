import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import "../../assets/scss/setting/profile.scss"
import { getProfile } from "../../services/userService";

const GetProfile = () => {
    const [user, setUser] = useState(null);
    const [err, setErr] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) return navigate("/login");
    
            try {
                const res = await getProfile();
                setUser(res.data.userData);
            } catch (error) {
                setErr("Không thể tải thông tin người dùng.");
            }
        };
        fetchUser();
    }, [navigate]);

    if (err) return <div className="profile-error">{err}</div>;
    if (!user) return <div className="profile-loading">Đang tải thông tin...</div>;

    return (
        <div className="profile-wrapper">
            <div className="profile-card">
                <h2 className="profile-title">Thông tin cá nhân</h2>
                <div className="profile-info">
                    <p><strong>Tên đăng nhập:</strong> {user.username}</p>
                    <p><strong>Họ và tên:</strong> {user.full_name}</p>
                    <p><strong>Giới tính:</strong> {user.gender === "male" ? "Nam" : user.gender === "female" ? "Nữ" : "Khác"}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Số điện thoại:</strong> {user.phone_number}</p>
                    <p><strong>Địa chỉ:</strong> {user.address}</p>
                    <p><strong>Vai trò:</strong> {user.role === "admin" ? "Quản trị viên" : user.role === "shipper" ? "Người giao hàng" : "Khách hàng"}</p>
                </div>
            </div>
        </div>
    )
}

export default GetProfile;