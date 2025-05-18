import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/scss/home.scss";

const API_URL = `${process.env.REACT_APP_API_URL}/api/products`;

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [fade, setFade] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      fetch(`${API_URL}/`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          setFeaturedProducts(data.slice(0, 3));
        });
      fetch(`${API_URL}/categories`)
        .then((res) => res.json())
        .then((data) => {
          setCategories(data.data || data);
        });
    } catch (error) {}
  }, []);

  // Fade effect for featured product
  useEffect(() => {
    setFade(false);
    const timeout = setTimeout(() => setFade(true), 50);
    return () => clearTimeout(timeout);
  }, [currentFeaturedIndex]);

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
    setSelectedCategory(catId);
  };

  // Lọc sản phẩm theo danh mục nếu có chọn
  const filteredProducts = selectedCategory
    ? products.filter((p) => String(p.category_id) === String(selectedCategory))
    : products;

  // Loại bỏ các sản phẩm featured khỏi danh sách bên dưới
  const featuredIds = featuredProducts.map((p) => p.id);
  const nonFeaturedProducts = filteredProducts.filter(
    (p) => !featuredIds.includes(p.id)
  );

  // Sản phẩm đang khuyến mại (discount > 0, loại bỏ featured)
  const saleProducts = products
    .filter((p) => Number(p.discount) > 0 && !featuredIds.includes(p.id))
    .slice(0, 8);

  // Xử lý chuyển featured
  const handlePrevFeatured = () => {
    setCurrentFeaturedIndex((prev) =>
      prev === 0 ? featuredProducts.length - 1 : prev - 1
    );
  };
  const handleNextFeatured = () => {
    setCurrentFeaturedIndex((prev) =>
      prev === featuredProducts.length - 1 ? 0 : prev + 1
    );
  };

  const currentFeatured = featuredProducts[currentFeaturedIndex];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header onSearch={onSearch} />

      {/* Sản phẩm nổi bật - Carousel + Fade */}
      {currentFeatured && (
        <section
          style={{
            width: "100vw",
            minHeight: 420,
            position: "relative",
            background: "linear-gradient(90deg, #f8fafc 60%, #e3e6f3 100%)",
            marginBottom: 0,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "none",
          }}
        >
          {/* Nút trái */}
          {featuredProducts.length > 1 && (
            <button
              onClick={handlePrevFeatured}
              style={{
                position: "absolute",
                left: 24,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(0,0,0,0.15)",
                border: "none",
                borderRadius: "50%",
                width: 48,
                height: 48,
                color: "#fff",
                fontSize: 32,
                cursor: "pointer",
                opacity: 0.5,
                zIndex: 2,
                transition: "opacity 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = 1)}
              onMouseOut={(e) => (e.currentTarget.style.opacity = 0.5)}
              aria-label="Trước"
            >
              &#8592;
            </button>
          )}

          {/* Ảnh sản phẩm featured chiếm full width + fade */}
          <div
            style={{
              width: "100vw",
              maxWidth: "100vw",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              minHeight: 420,
              gap: 0,
            }}
          >
            <img
              src={
                currentFeatured.image_url ||
                "https://via.placeholder.com/900x420"
              }
              alt={currentFeatured.name}
              style={{
                width: "100vw",
                maxWidth: "100vw",
                height: 420,
                objectFit: "cover",
                objectPosition: "center",
                filter: "brightness(0.93)",
                transition: "opacity 0.7s",
                opacity: fade ? 1 : 0,
                borderRadius: 0,
                boxShadow: "0 4px 24px #ddd",
                background: "#fff",
              }}
            />
            {/* Overlay info */}
            <div
              style={{
                position: "absolute",
                right: 60,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.92)",
                borderRadius: 18,
                padding: "32px 40px",
                minWidth: 340,
                maxWidth: 480,
                boxShadow: "0 2px 16px #bbb",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                zIndex: 2,
                transition: "opacity 0.7s",
                opacity: fade ? 1 : 0,
              }}
            >
              <h1
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  marginBottom: 16,
                  color: "#2d2d2d",
                  lineHeight: 1.1,
                }}
              >
                {currentFeatured.name}
              </h1>
              <p
                style={{
                  fontSize: 18,
                  color: "#444",
                  marginBottom: 20,
                  lineHeight: 1.5,
                  maxHeight: 120,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {currentFeatured.description}
              </p>
              <div
                style={{
                  fontSize: 28,
                  color: "#e53935",
                  fontWeight: 700,
                  marginBottom: 24,
                }}
              >
                {Number(currentFeatured.discount) > 0 ? (
                  <>
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "#888",
                        fontSize: 22,
                        marginRight: 16,
                      }}
                    >
                      {Number(currentFeatured.price).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                    <span>
                      {Number(
                        currentFeatured.price *
                          (1 - currentFeatured.discount / 100)
                      ).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </>
                ) : (
                  <span>
                    {Number(currentFeatured.price).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                )}
              </div>
              <button
                style={{
                  padding: "16px 40px",
                  background: "linear-gradient(90deg, #6a11cb, #2575fc)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 20,
                  border: "none",
                  borderRadius: 12,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px #bdbdbd",
                  transition: "background 0.2s",
                }}
                onClick={() => handleCardClick(currentFeatured)}
              >
                Mua ngay
              </button>
            </div>
          </div>

          {/* Nút phải */}
          {featuredProducts.length > 1 && (
            <button
              onClick={handleNextFeatured}
              style={{
                position: "absolute",
                right: 24,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(0,0,0,0.15)",
                border: "none",
                borderRadius: "50%",
                width: 48,
                height: 48,
                color: "#fff",
                fontSize: 32,
                cursor: "pointer",
                opacity: 0.5,
                zIndex: 2,
                transition: "opacity 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = 1)}
              onMouseOut={(e) => (e.currentTarget.style.opacity = 0.5)}
              aria-label="Tiếp"
            >
              &#8594;
            </button>
          )}
          {/* Xoá gradient chuyển tiếp thừa, không render nữa */}
        </section>
      )}

      {/* Các sản phẩm đang khuyến mại */}
      {saleProducts.length > 0 && (
        <section
          style={{
            width: "100vw",
            background: "#f3f4f6",
            padding: "32px 0 24px 0",
            marginBottom: 0,
            boxShadow: "0 2px 12px #eee",
            transition: "background 0.5s",
            position: "relative",
          }}
        >
          <div
            style={{
              maxWidth: 1440,
              margin: "0 auto",
              padding: "0 32px",
            }}
          >
            <h2
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#e53935",
                marginBottom: 24,
                letterSpacing: 0.5,
                textAlign: "center",
              }}
            >
              Các sản phẩm đang khuyến mại
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 32,
                justifyItems: "center",
                alignItems: "stretch",
                minHeight: 260,
                width: "100%",
              }}
            >
              {saleProducts.map((product) => (
                <div
                  key={product.id}
                  className="sale-product-card"
                  style={{
                    background: "#fff",
                    borderRadius: 18,
                    boxShadow: "0 2px 16px #e0e0e0",
                    width: "100%",
                    maxWidth: 370,
                    minHeight: 220,
                    marginBottom: 24,
                    padding: 0,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition:
                      "transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.2s",
                    border: "none",
                  }}
                  onClick={() => handleCardClick(product)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "scale(1.07)";
                    e.currentTarget.style.boxShadow = "0 8px 32px #bdbdbd";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 2px 16px #e0e0e0";
                  }}
                >
                  <img
                    src={
                      product.image_url || "https://via.placeholder.com/340x180"
                    }
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: 180,
                      objectFit: "cover",
                      borderRadius: "18px 18px 0 0",
                      transition: "transform 0.2s",
                    }}
                  />
                  <div style={{ padding: "18px 20px 16px 20px" }}>
                    <h3
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#6c2eb7",
                        marginBottom: 8,
                        lineHeight: 1.2,
                        minHeight: 48,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {product.name}
                    </h3>
                    <div
                      style={{
                        fontSize: 18,
                        color: "#e53935",
                        fontWeight: 700,
                      }}
                    >
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "#888",
                          fontSize: 15,
                          marginRight: 10,
                        }}
                      >
                        {Number(product.price).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                      <span>
                        {Number(
                          product.price * (1 - product.discount / 100)
                        ).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Xoá gradient chuyển tiếp thừa, không render nữa */}
        </section>
      )}

      {/* Dưới featured + sale: sidebar danh mục + danh sách sản phẩm */}
      <main
        className="homepage"
        style={{
          display: "flex",
          gap: 24,
          minHeight: 600,
          flex: 1,
          background: "#fff",
          paddingTop: 32,
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
            color: "#222",
          }}
        >
          <h3
            style={{
              fontWeight: 700,
              marginBottom: 24,
              textAlign: "center",
              color: "#222",
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
                border:
                  selectedCategory === cat.id
                    ? "2px solid #2575fc"
                    : "1px solid #ddd",
                borderRadius: 6,
                background: selectedCategory === cat.id ? "#e3e6f3" : "#fff",
                fontSize: 16,
                cursor: "pointer",
                transition: "background 0.2s",
                color: "#222",
                fontWeight: 500,
              }}
              onClick={() => handleCategoryClick(cat.id)}
            >
              {cat.name}
            </button>
          ))}
          {selectedCategory && (
            <button
              style={{
                marginTop: 8,
                width: "100%",
                background: "#fff",
                border: "1px solid #aaa",
                borderRadius: 6,
                color: "#2575fc",
                fontWeight: 600,
                padding: "8px 0",
                cursor: "pointer",
              }}
              onClick={() => setSelectedCategory("")}
            >
              Xoá lọc
            </button>
          )}
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
                        <div className="product-price">
                          {Number(product.discount) > 0 ? (
                            <>
                              <span className="price-original">
                                {Number(product.price).toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                })}
                              </span>
                              <span className="price-discounted">
                                {Number(
                                  product.price * (1 - product.discount / 100)
                                ).toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                })}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="price-discounted">
                                {Number(product.price).toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                })}
                              </span>
                            </>
                          )}
                        </div>
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
                {nonFeaturedProducts.map((product) => (
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
                      <div className="product-price">
                        {Number(product.discount) > 0 ? (
                          <>
                            <span className="price-original">
                              {Number(product.price).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
                            <span className="price-discounted">
                              {Number(
                                product.price * (1 - product.discount / 100)
                              ).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="price-discounted">
                              {Number(product.price).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
                          </>
                        )}
                      </div>
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
