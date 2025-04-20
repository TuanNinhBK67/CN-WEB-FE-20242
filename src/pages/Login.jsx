import React, { useState } from "react";
import "../assets/scss/login.scss";
import {login} from "../services/userService";
import {FaEnvelope, FaLock} from "react-icons/fa"

const Login = () =>{
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [err, setErr] = useState("")

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(!email || !password){
            setErr("Yêu cầu điền đầy đủ thông tin")
            return;
        }
        
        try{
            const res = await login(email, password);
            const {token, user} = res.data;
            localStorage.setItem("token", token);
            setErr("");
        }
        catch(err){
            setErr(err.response?.data?.message || "Lỗi không xác định");
        }
    }

    return(
        <div className="login-wrapper">
            <div className="login-card">
                <div className="login-left">
                <img
                    src="/images/loginImage.png"
                    alt="Login Illustration"
                    className="login-illustration"
                />
                </div>
                <div className="login-right">
                    <h2 className="login-title">Đăng nhập</h2>
                    <form className="login-form" onSubmit={handleSubmit}>
                        {err && <p className="error">{err}</p>}

                        <div className="input-wrapper">
                        <FaEnvelope className="icon" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        </div>

                        <div className="input-wrapper">
                        <FaLock className="icon" />
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        </div>

                        <button type="submit" className="login-button">
                            Xác nhận
                        </button>

                        <div className="login-links">
                            <a href="/forgot-password">Quên tài khoản/ mật khẩu?</a>
                                <br />
                            <a href="/register">Chưa có tài khoản →</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default Login;