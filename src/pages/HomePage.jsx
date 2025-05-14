import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const homepage = () => {
    return (
        <>
            <Header></Header>
            <h1 className="text-red-700 text-5xl mt-4 mb-4 ml-6 mr-6">
                This is homepage
            </h1>
            <Footer></Footer>
        </>
    );
};
export default homepage;
