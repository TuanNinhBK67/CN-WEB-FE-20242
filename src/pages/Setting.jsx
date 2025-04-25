import React, {useEffect, useState} from "react";
import "../assets/scss/setting.scss"
import Header from "../components/Header";
import Footer from "../components/Footer";
import SidebarMenu from "../components/SettingBoard";
import { Outlet } from "react-router-dom";

const SettingLayout = () => {
    
    return(
        <>
            <Header/>
            <div className="setting-layout">
                <SidebarMenu/>
                <div className="setting-content">
                    <Outlet />
                </div>
            </div>
            <Footer/>
        </>
    )
}
export default SettingLayout;