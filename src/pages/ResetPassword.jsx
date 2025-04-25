import React, {useState} from "react";
import { resetPassword } from "../services/userService";
import { useNavigate } from "react-router-dom";
import "../assets/scss/resetpassword.scss";

const ResetPassword = () => {
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [msg, setMsg] = useState("");
    const token = new URLSearchParams(window.location.search).get("token");

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const res = await resetPassword(token, newPassword);
            setMsg(res.data.errMessage);
            navigate("/")
        }
        catch(err){
            setMsg("Đặt lại mật khẩu thất bại")
        }
    }

    return(
        <div className="reset-password-wrapper">
            <form onSubmit={handleSubmit}>
                <h3>Đặt lại mật khẩu</h3>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mật khẩu mới" />
                <button type="submit">Xác nhận</button>
                <p>{msg}</p>
            </form>
        </div>
    )
}
export default ResetPassword;