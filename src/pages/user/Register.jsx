import React, {useEffect, useState} from "react";
import { register } from "../../services/userService";
import {useNavigate} from "react-router-dom";
// import "../assets/scss/register.scss"
import "../../assets/scss/user/register.scss"
import addressAPI from "../../vietnam-provinces.json"

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

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");

    const [addressDetail, setAddressDetail] = useState("");

    const [err, setErr] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
      const provincesArray = Object.entries(addressAPI).map(([provinceCode, provinceData]) => ({
          name: provinceData.name,
          code: provinceCode,
          districts: Object.entries(provinceData["quan-huyen"]).map(([districtCode, districtData]) => ({
              name: districtData.name,
              code: districtCode,
              wards: Object.entries(districtData["xa-phuong"]).map(([wardCode, wardData]) => ({
                  name: wardData.name,
                  code: wardCode,
              }))
          }))
      }));
      setProvinces(provincesArray);
    }, []);
  

    const handleChange = (e) => {
      const {name, value} = e.target;
      setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleProvinceChange = (e) => {
      const provinceName = e.target.value;
      setSelectedProvince(provinceName);
      setSelectedDistrict("");
      setSelectedWard("");
      setWards([]);

      const province = provinces.find((p) => p.name === provinceName);
      if(province){
        setDistricts(province.districts);
      }
      else{
        setDistricts([]);
      }
    }

    const handleDistrictChange = (e) => {
      const districtName = e.target.value;
      setSelectedDistrict(districtName);
      setSelectedWard("");

      const province = provinces.find((p) => p.name === selectedProvince);

      if(province){
        const district = province.districts.find((d) => d.name === districtName);
        if(district){
          setWards(district.wards);
        }
        else{
          setWards([]);
        }
      }
    }

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

      if(!addressDetail || !selectedWard || !selectedDistrict || !selectedProvince){
        setErr("Vui lòng nhập đầy đủ thông tin địa chỉ");
        return;
      }

      try {
        const fullAddress = `${addressDetail}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`;
        const submitData = { ...formData, address: fullAddress };
    
        const res = await register(submitData);
        const { errCode, errMessage } = res.data;
    
        if (errCode === 0) {
            navigate("/login");
        } else {
            setErr(errMessage);
        }
      } catch (e) {
          setErr("Đăng ký thất bại, vui lòng thử lại ");
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

            <select 
                className="address-select" 
                value={selectedProvince} 
                onChange={handleProvinceChange}
            >
                <option value="">-- Chọn tỉnh/thành phố --</option>
                {provinces.map((province) => (
                    <option key={province.code} value={province.name}>
                        {province.name}
                    </option>
                ))}
            </select>

            <select
                className="address-select"
                value={selectedDistrict}
                onChange={handleDistrictChange}
                disabled={!districts.length}
            >
                <option value="">-- Chọn quận/huyện --</option>
                {districts.map((district) => (
                    <option key={district.code} value={district.name}>
                        {district.name}
                    </option>
                ))}
            </select>
            
            <select
                className="address-select"
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                disabled={!wards.length}
            >
                <option value="">-- Chọn phường/xã --</option>
                {wards.map((ward) => (
                    <option key={ward.code} value={ward.name}>
                        {ward.name}
                    </option>
                ))}
            </select>

            <input
              type="text"
              name="address"
              placeholder="Địa chỉ"
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)} 
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