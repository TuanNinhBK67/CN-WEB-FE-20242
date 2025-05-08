import React, {useEffect, useState} from "react";
import { updateInfor } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import "../../assets/scss/setting/updateProfile.scss";
import addressAPI from "../../vietnam-provinces.json";

const parseAddressSmart = (addressString) => {
    const parts = addressString.split(",").map(p => p.trim());

    const total = parts.length;

    const province = parts[total - 1];
    const district = parts[total - 2];
    const ward = parts[total - 3];

    const detail = parts.slice(0, total - 3).join(",");
    return[
        detail, 
        ward, 
        district,
        province
    ];
}

const Updateprofile = () => {
    const [formData, setFormData] = useState({
        username:"",
        full_name:"",
        gender:"",
        address:"",
        phone_number:"",
    });

    // let addressInfo = "";

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    
    const [addressDetail, setAddressDetail] = useState("");

    const navigate = useNavigate()
    const [err, setErr] = useState("");

    useEffect(()=> {
        const provinceArray = Object.entries(addressAPI).map(([provinceCode, provinceData]) =>({
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
        }))
        setProvinces(provinceArray);
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if(storedUser){
            const user = JSON.parse(storedUser);
            //addressInfo = parseAddressSmart(user.address);
            const [detail, ward, district, province] = parseAddressSmart(user.address);

            setSelectedProvince(province || "");
            setSelectedDistrict(district || "");
            setSelectedWard(ward || "");
            if (province) {
                setSelectedProvince(province);
                const foundProvince = provinces.find((p) => p.name === province);
                if (foundProvince) {
                    setDistricts(foundProvince.districts);
    
                    if (district) {
                        setSelectedDistrict(district);
                        const foundDistrict = foundProvince.districts.find((d) => d.name === district);
                        if (foundDistrict) {
                            setWards(foundDistrict.wards);
                            setSelectedWard(ward || "");
                        }
                    }
                }
            }
            setAddressDetail(detail || "");

            setFormData({
                username: user.username || "",
                full_name: user.full_name || "",
                gender: user.gender || "",
                phone_number: user.phone_number || "",
            });
        }
    }, [provinces]);

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

        if(!addressDetail || !selectedWard || !selectedDistrict || !selectedProvince){
            setErr("Yêu cầu nhập đầy đủ địa chỉ");
            return;
        }
        
        try{
            const fullAddress = `${addressDetail}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`
            const submitData = {...formData, address: fullAddress};

            const res = await updateInfor(submitData);
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

                        <label htmlFor="province">Tỉnh/Thành Phố:</label>
                        <select 
                            className="address" 
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

                        <label htmlFor="district">Quận/Huyện:</label>
                        <select
                            className="address"
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

                        <label htmlFor="ward">Phường/Xã:</label>
                        <select
                            className="address"
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

                        <label htmlFor="address">Địa chỉ:</label>
                        <input
                            id="address"
                            type="text"
                            name="address"
                            value={addressDetail}
                            onChange={(e) => setAddressDetail(e.target.value)} 
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