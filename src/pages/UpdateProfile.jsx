import React, {useEffect, useState} from "react";
import { updateInfor } from "../services/userService";
import { useNavigate } from "react-router-dom";
import "../assets/scss/updateProfile.scss"
import Header from "../components/Header";
import Footer from "../components/Footer";
import SidebarMenu from "../components/SettingBoard";

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

    const handleSubmit = async(e) =>{
        e.preventDefault();
        setErr("");
        const phoneRegex = /^\\d{10}$/;
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
            <Header/>
            <div className="update-wrapper">
                <div className="update-card">
                    <h2 className="update-title">Cập nhật thông tin cá nhân</h2>
                    <form onSubmit={handleSubmit} className="update-form">
                        {err && <p className="error">{err}</p>}

                        <input
                        type="text"
                        name="username"
                        placeholder="Tên đăng nhập"
                        value={formData.username}
                        onChange={handleChange} 
                        />

                        <input
                        type="text"
                        name="full_name"
                        placeholder="Họ và tên"
                        value={formData.full_name}
                        onChange={handleChange} 
                        />

                        <input
                        type="text"
                        name="address"
                        placeholder="Địa chỉ"
                        value={formData.address}
                        onChange={handleChange} 
                        />
                        <input
                        type="text"
                        name="phone_number"
                        placeholder="Số điện thoại"
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
                    
                        <button type="submit">Xác nhận cập nhật</button>
                    </form>
                </div>
            </div>

            <Footer/>
        </>
    )
}

export default Updateprofile;