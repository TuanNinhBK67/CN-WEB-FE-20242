import React, {useState} from "react";
import "../../assets/scss/setting/changepassword.scss"
import { changePassword } from "../../services/userService";
import { useNavigate } from "react-router-dom";

const Changepassword = () => {
    const [formData, setFormData] = useState({
        oldPW: "",
        newPW: "",
        confirmPW: ""
    });

    const [err, setErr] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        setErr("");
        
        try{
            const res = await changePassword(formData);
            if(res.data.errCode ===  0){
                setFormData({oldPW: "", newPW: "", confirmPW: ""});
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
            }
            else{
                setErr(res.data.errMessage);
            }
        }catch(e){
            setErr("Có lỗi xảy ra, vui lòng thử lại")
        }
    }

    return(
        <div className="change-password-wrapper">
            <h2>Đổi mật khẩu</h2>
            <form className="change-password-form" onSubmit={handleSubmit}>
                {err && <p className="error-msg">{err}</p>}

                <label>Mật khẩu hiện tại:</label>
                <input
                type="password"
                name="oldPW"
                value={formData.oldPW}
                onChange={handleChange}
                required
                />

                <label>Mật khẩu mới:</label>
                <input
                type="password"
                name="newPW"
                value={formData.newPW}
                onChange={handleChange}
                required
                />

                <label>Xác nhận mật khẩu mới:</label>
                <input
                type="password"
                name="confirmPW"
                value={formData.confirmPW}
                onChange={handleChange}
                required
                />

                <div className="button-group">
                    <button 
                    className="cancel-button"
                    onClick={() => navigate("/")}>
                        Hủy
                    </button>
                    <button type="submit">Xác nhận</button>
                </div>
            </form>
        </div>
    )
}

export default Changepassword