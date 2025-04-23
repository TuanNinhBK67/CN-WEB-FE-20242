import React, {useState} from "react";
import { register } from "../services/userService";
import {useNavigate} from "react-router-dom";
import "../assets/scss/register.scss"

const RegisterAccount = () => {

    const [formData, setFormData] = useState({
      username:"",
      email:"",
      full_name:"",
      gender:"",
      address:"",
      phone_number:"",
      password:"",
      confirmPassword:"",
    });

    const [err, setErr] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
      const {name, value} = e.target;
      setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async(e)=>{
      e.preventDefault();
      const {username, email, password, confirmPassword} = formData;
      if(!username || !email || !password || !confirmPassword){
        setErr("Vui lòng nhập đầy đủ thông tin");
        return;
      }

      if(password !== confirmPassword){
        setErr("Mật khẩu xác nhận không khớp");
        return;
      }

      try{
        const res = await register(formData);
        const {errCode, errMessage} = res.data;

        if(errCode === 0){
          navigate("/login");
        }
        else{
          setErr(errMessage);
        }
      }catch(e){
        setErr("Đăng ký thất bại, vui lòng thử lại ")
      }
    }

    return(
      <div className="register-wrapper">
        <div className="register-card">
          <h2 className="register-title">Đăng ký tài khoản</h2>
          <form onSubmit={handleSubmit} className="register-form">
            {err && <p className="error">{err}</p>}

            <input
              type="text"
              name="username"
              placeholder="Tên đăng nhập"
              value={formData.username}
              onChange={handleChange} 
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
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
          
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange} 
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange} 
            />

            <button type="submit">Đăng ký</button>
            <p style={{ textAlign: "center", marginTop: "1rem" }}>
            Đã có tài khoản? <a href="/login">Đăng nhập</a>
          </p>
          </form>
        </div>
      </div>
    )
}

export default RegisterAccount;