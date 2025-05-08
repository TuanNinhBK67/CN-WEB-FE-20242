import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/scss/ProductResults.scss";
import { handleSearch } from "../services/SearchService";

const ProductResults = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null); // Lưu thông tin sản phẩm hiện tại
  const [searchResults, setSearchResults] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  const onSearch = (keyword) => {
    handleSearch(keyword, setSearchKeyword, setSearchResults);
  };

  const handleCardClick = (product) => {
    navigate(`/product/${product.id}`, { state: product });
  };

  // Lấy thông tin sản phẩm khi id thay đổi
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/products/${id}`
        );
        if (!response.ok) {
          throw new Error("Không thể tải thông tin sản phẩm");
        }
        const data = await response.json();
        setProduct(data); // Cập nhật thông tin sản phẩm
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    };

    fetchProduct();
  }, [id]); // Chạy lại khi id trong URL thay đổi

  return (
    <>
      <Header onSearch={onSearch} />
      <main className="product-details">
        {searchKeyword ? (
          <>
            <h1>Kết quả tìm kiếm cho "{searchKeyword}"</h1>
            {searchResults.length > 0 ? (
              <div className="product-grid">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    className="product-card"
                    onClick={() => handleCardClick(product)}
                  >
                    <img
                      src={
                        product.image_url || "https://via.placeholder.com/150"
                      }
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="product-info">
                      <h2 className="product-title">{product.name}</h2>
                      <p className="product-description">
                        {product.description}
                      </p>
                      <p className="product-price">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Không tìm thấy sản phẩm nào phù hợp.</p>
            )}
          </>
        ) : product ? (
          <div className="product-details-container">
            <div className="product-image-section">
              <img
                src={product.image_url || "https://via.placeholder.com/150"}
                alt={product.name}
                className="product-image"
              />
            </div>
            <div className="product-info-section">
              <h1 className="product-title">{product.name}</h1>
              <p className="product-price">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.price)}
              </p>
              <p className="product-description">{product.description}</p>
              <div className="product-actions">
                <button className="add-to-cart-button">Add to cart</button>
                <button className="buy-now-button">Buy now</button>
              </div>
            </div>
          </div>
        ) : (
          <p>Đang tải thông tin sản phẩm...</p>
        )}
      </main>
      <Footer />
    </>
  );
};

export default ProductResults;
