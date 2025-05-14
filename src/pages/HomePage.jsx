import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/scss/HomePage.scss";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then(setProducts);
    fetch("http://localhost:8080/api/products/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || data));
  }, []);

  const onSearch = (keyword) => {
    setSearchKeyword(keyword);
    if (!keyword) {
      setSearchResults([]);
      return;
    }
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const handleCardClick = (product) => {
    navigate(`/product/${product.id}`, { state: product });
  };

  const handleCategoryClick = (catId) => {
    navigate(`/category/${catId}`);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header onSearch={onSearch} />
      <main
        className="homepage"
        style={{
          display: "flex",
          gap: 24,
          minHeight: 600,
          flex: 1,
        }}
      >
        {/* Sidebar danh mục */}
        <aside
          style={{
            minWidth: 260,
            background: "#fafbfc",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 2px 8px #eee",
            height: "fit-content",
            color: "#222", // Đảm bảo chữ đậm, dễ nhìn
          }}
        >
          <h3
            style={{
              fontWeight: 700,
              marginBottom: 24,
              textAlign: "center",
              color: "#222", // Đảm bảo tiêu đề rõ ràng
            }}
          >
            Danh mục sản phẩm
          </h3>
          {categories.map((cat) => (
            <button
              key={cat.id}
              style={{
                display: "block",
                width: "100%",
                marginBottom: 12,
                padding: "10px 0",
                border: "1px solid #ddd",
                borderRadius: 6,
                background: "#fff",
                fontSize: 16,
                cursor: "pointer",
                transition: "background 0.2s",
                color: "#222", // Đảm bảo chữ trên nút rõ ràng
                fontWeight: 500,
              }}
              onClick={() => handleCategoryClick(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </aside>
        {/* Sản phẩm */}
        <section style={{ flex: 1, minHeight: "100vh", paddingBottom: 40 }}>
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
                        style={{
                          height: 180,
                          objectFit: "cover",
                          borderRadius: 8,
                          width: "100%",
                        }}
                      />
                      <div className="product-info">
                        <h2
                          className="product-title"
                          style={{
                            color: "#6c2eb7",
                            fontWeight: 700,
                            fontSize: 20,
                            margin: "12px 0 4px",
                          }}
                        >
                          {product.name}
                        </h2>
                        {product.discount > 0 ? (
                          <>
                            <span
                              style={{
                                textDecoration: "line-through",
                                color: "#888",
                                fontSize: 14,
                                marginRight: 8,
                              }}
                            >
                              {Number(product.price).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
                            <span
                              style={{
                                color: "#e74c3c",
                                fontWeight: 700,
                                fontSize: 20,
                              }}
                            >
                              {Number(
                                product.price * (1 - product.discount / 100)
                              ).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
                          </>
                        ) : (
                          <span
                            style={{
                              color: "#e74c3c",
                              fontWeight: 700,
                              fontSize: 20,
                            }}
                          >
                            {Number(product.price).toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Không tìm thấy sản phẩm nào phù hợp.</p>
              )}
            </>
          ) : (
            <div>
              <div className="product-grid">
                {products.map((product) => (
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
                      style={{
                        height: 180,
                        objectFit: "cover",
                        borderRadius: 8,
                        width: "100%",
                      }}
                    />
                    <div className="product-info">
                      <h2
                        className="product-title"
                        style={{
                          color: "#6c2eb7",
                          fontWeight: 700,
                          fontSize: 20,
                          margin: "12px 0 4px",
                        }}
                      >
                        {product.name}
                      </h2>
                      {product.discount > 0 ? (
                        <>
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#888",
                              fontSize: 14,
                              marginRight: 8,
                            }}
                          >
                            {Number(product.price).toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </span>
                          <span
                            style={{
                              color: "#e74c3c",
                              fontWeight: 700,
                              fontSize: 20,
                            }}
                          >
                            {Number(
                              product.price * (1 - product.discount / 100)
                            ).toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </span>
                        </>
                      ) : (
                        <span
                          style={{
                            color: "#e74c3c",
                            fontWeight: 700,
                            fontSize: 20,
                          }}
                        >
                          {Number(product.price).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
