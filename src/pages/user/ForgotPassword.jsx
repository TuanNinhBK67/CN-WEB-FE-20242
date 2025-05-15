import React, {useState, useEffect} from "react";
import { forgotPassword } from "../../services/userService";
// import "../assets/scss/forgotpassword.scss"
import "../../assets/scss/user/forgotpassword.scss"

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");
    const [showPopup, setshowPopup] = useState(false);
 
    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const res = await forgotPassword(email);
            setMsg(res.data.errMessage);
            if(res.data.errCode === 0){
                setshowPopup(true);
                setTimeout(() => setshowPopup(false), 2000);
            }
        }
        catch(err){
            setMsg("Đã có lỗi, vui lòng thử lại")
        }
    }

    return(
        <>
        <div className="forgot-password-wrapper"> 
            <form onSubmit={handleSubmit}>
                <h3>Quên mật khẩu</h3>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Nhập email của bạn" />
                <button type="submit">Gửi</button>
                <p>{msg}</p>
            </form>
        </div>
        {showPopup && (
            <div className="popup">
                ✅ Email đặt lại mật khẩu đã được gửi!
            </div>
        )}
        </>
    )
}

export default ForgotPassword;