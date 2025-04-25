import React, {useEffect, useState} from "react";
import { updateInfor } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import "../../assets/scss/setting/updateProfile.scss"

const Updateprofile = () => {
    const [formData, setFormData] = useState({
        username:"",
        full_name:"",
        gender:"",
        address:"",
        phone_number:"",
    });

    const navigate = useNavigate()
    const [err, setErr] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if(storedUser){
            const user = JSON.parse(storedUser);
            setFormData({
                username: user.username || "",
                full_name: user.full_name || "",
                gender: user.gender || "",
                address: user.address || "",
                phone_number: user.phone_number || "",
            });
        }
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };
    const handleCancel = () => {
        navigate("/");
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();
        setErr("");
        const phoneRegex = /^\d{10}$/;
        if(!phoneRegex.test(formData.phone_number)){
            setErr("Số điện thoại không chính xác");
            return;
        }
        try{
            const res = await updateInfor(formData);
            const {errCode, errMessage} = res.data;
            if(errCode === 0){
                const stored = localStorage.getItem("user");
                if(stored){
                    const updated = {...JSON.parse(stored), ...formData};
                    localStorage.setItem("user", JSON.stringify(updated));
                }
                navigate("/");
            }
            else{
                setErr(errMessage);
            }
        }catch(e){
            setErr("Cập nhật không thành công, vui lòng thử lại");
        }
    }

    return(
        <>
            <div className="update-wrapper">
                <div className="update-card">
                    <h2 className="update-title">Cập nhật thông tin cá nhân</h2>
                    <form onSubmit={handleSubmit} className="update-form">
                        {err && <p className="error">{err}</p>}

                        <label htmlFor="username">Tên đăng nhập:</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange} 
                        />

                        <label htmlFor="full_name">Họ và tên:</label>
                        <input
                            id="full_name"
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange} 
                        />

                        <label htmlFor="address">Địa chỉ:</label>
                        <input
                            id="address"
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange} 
                        />

                        <label htmlFor="phone_number">Số điện thoại:</label>
                        <input
                            id="phone_number"
                            type="text"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange} 
                        />

                        <div className="gender-radio">
                            <label className="gender-title">Giới tính:</label>
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={formData.gender === "male"}
                                    onChange={handleChange}
                                />
                                Nam
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={formData.gender === "female"}
                                    onChange={handleChange}
                                />
                                Nữ
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="other"
                                    checked={formData.gender === "other"}
                                    onChange={handleChange}
                                />
                                Khác
                            </label>
                        </div>
                        <div className="form-buttons">
                            <button type="button" onClick={handleCancel} className="cancel-button">Hủy</button>
                            <button type="submit">Xác nhận cập nhật</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Updateprofile;