import React, {useState, useEffect} from "react";
import Header from "../components/Header";
import Footer from "../components/Footer"
import { getAllProducts } from "../services/productService";
import "../assets/scss/homepage.scss"
import SidebarCategories from "../components/CategoriesBoard";
import { Link } from "react-router-dom";

const HomePage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getAllProducts()
        .then((res) => setProducts(res.data))
        .catch((err) => console.error("Lỗi khi lấy sản phẩm:", err));
    }, []);

    return (
        <>
        <Header></Header>
        <div className="home-layout">

        <aside className="sidebar">
            <SidebarCategories></SidebarCategories>
        </aside>

        <div className="home-container">
        {/* <h2 className="home-title">Danh sách sản phẩm</h2> */}
        <div className="product-grid">
            {products.map((p) => (
                // sửa cái link thành chuyển sang sản phẩm cho tôi nhé 
            <Link to={'/'} className="product-card" key={p.id}>
                <img src={p.image_url} alt={p.name} className="product-img" />
                <h3 className="product-name">{p.name}</h3>
                <div className="product-price">
                    {Number(p.discount) > 0 ? (
                        <>
                             <span className="price-original">
                                {p.price.toLocaleString()}đ
                            </span>
                            <span className="price-discounted">
                                {(p.price - p.discount).toLocaleString()}đ
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="price-discounted">
                                {p.price.toLocaleString()}đ
                            </span>
                        </>
                    )}
                </div>
            </Link>
            ))}
        </div>
        </div>
        </div>
        <Footer></Footer>
        </>
    );

}
export default HomePage;