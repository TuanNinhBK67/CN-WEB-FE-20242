import React, {useState} from "react";
import { resetPassword } from "../../services/userService";
import { useNavigate } from "react-router-dom";
// import "../assets/scss/resetpassword.scss";
import "../../assets/scss/user/resetpassword.scss";
const ResetPassword = () => {
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [showPopup, setshowPopup] = useState(false);
    const token = new URLSearchParams(window.location.search).get("token");

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const res = await resetPassword(token, newPassword);
            setMsg(res.data.errMessage);
            if(res.data.errCode === 0 ){
                setshowPopup(true);
                setTimeout(() => setshowPopup(false), 3000);
            }
            // navigate("/")
        }
        catch(err){
            setMsg("Đặt lại mật khẩu thất bại")
        }
    }

    return(
        <>
        <div className="reset-password-wrapper">
            <form onSubmit={handleSubmit}>
                <h3>Đặt lại mật khẩu</h3>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mật khẩu mới" />
                <button type="submit">Xác nhận</button>
                <p>{msg}</p>
            </form>
        </div>
        {showPopup && (
            <div className="popup">
                Mật khẩu đã được đặt lại thành công
            </div>
        )}
        </>
    )
}
export default ResetPassword;