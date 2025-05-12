import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/scss/HomePage.scss";
import { handleSearch } from "../services/SearchService";

const HomePage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  const onSearch = (keyword) => {
    handleSearch(keyword, setSearchKeyword, setSearchResults);
  };

  const handleCardClick = (product) => {
    navigate(`/product/${product.id}`, { state: product });
  };

  return (
    <>
      <Header onSearch={onSearch} />
      <main className="homepage">
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
        ) : (
          <h1>This is homepage</h1>
        )}
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
