import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/scss/home/HomePage.scss";

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
  const [slideDirection, setSlideDirection] = useState(""); // "left" | "right" | ""
  const [branches, setBranches] = useState([]); // Thêm state branch
  const [selectedBranch, setSelectedBranch] = useState(""); // Thêm state cho branch filter
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
      // Fetch branch
      fetch(`${process.env.REACT_APP_API_URL}/api/products/branches`)
        .then((res) => res.json())
        .then((data) => setBranches(data.data || data));
    } catch (error) {}
  }, []);

  // Fade + slide effect for featured product
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

  // Lọc sản phẩm theo danh mục và nhãn hàng nếu có chọn
  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory
      ? String(p.category_id) === String(selectedCategory)
      : true;
    const matchBranch = selectedBranch
      ? String(p.branch_id) === String(selectedBranch)
      : true;
    return matchCategory && matchBranch;
  });

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
    setSlideDirection("left");
    setFade(false);
    setTimeout(() => {
      setCurrentFeaturedIndex((prev) =>
        prev === 0 ? featuredProducts.length - 1 : prev - 1
      );
      setTimeout(() => setSlideDirection(""), 400);
    }, 10);
  };
  const handleNextFeatured = () => {
    setSlideDirection("right");
    setFade(false);
    setTimeout(() => {
      setCurrentFeaturedIndex((prev) =>
        prev === featuredProducts.length - 1 ? 0 : prev + 1
      );
      setTimeout(() => setSlideDirection(""), 400);
    }, 10);
  };

  const currentFeatured = featuredProducts[currentFeaturedIndex];

  // Hàm lấy tên nhãn hàng từ branch_id
  const getBranchName = (branch_id) => {
    const found = branches.find((b) => String(b.id) === String(branch_id));
    return found ? found.name : "";
  };

  // Handler khi click vào nhãn hàng
  const handleBrandClick = (branch_id) => {
    if (branch_id) {
      navigate(`/products/branch/${branch_id}`);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header onSearch={onSearch} />

      {/* Sản phẩm nổi bật - Carousel + Fade + Slide */}
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                &#8592;
              </span>
            </button>
          )}

          {/* Ảnh sản phẩm featured chiếm full width + fade + slide */}
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
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "100vw",
                height: 420,
                position: "absolute",
                left: 0,
                top: 0,
                transition:
                  "transform 0.5s cubic-bezier(.4,2,.6,1), opacity 0.7s",
                transform: !fade
                  ? slideDirection === "left"
                    ? "translateX(60vw)"
                    : slideDirection === "right"
                    ? "translateX(-60vw)"
                    : "translateX(0)"
                  : "translateX(0)",
                opacity: fade ? 1 : 0,
                zIndex: 1,
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
                  borderRadius: 0,
                  boxShadow: "0 4px 24px #ddd",
                  background: "#fff",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
                draggable={false}
              />
            </div>
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
                transition:
                  "transform 0.5s cubic-bezier(.4,2,.6,1), opacity 0.7s",
                opacity: fade ? 1 : 0,
                // Slide overlay cùng hướng với ảnh
                transform: `translateY(-50%) ${
                  !fade
                    ? slideDirection === "left"
                      ? "translateX(60vw)"
                      : slideDirection === "right"
                      ? "translateX(-60vw)"
                      : ""
                    : ""
                }`,
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
              {/* Hiển thị nhãn hàng, có thể click */}
              <div style={{ fontSize: 16, color: "#666", marginBottom: 8 }}>
                Nhãn hàng:{" "}
                <span
                  style={{
                    color: "#2575fc",
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBrandClick(currentFeatured.branch_id);
                  }}
                >
                  {getBranchName(currentFeatured.branch_id)}
                </span>
              </div>
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                &#8594;
              </span>
            </button>
          )}
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
                    {/* Hiển thị nhãn hàng, có thể click */}
                    <div
                      style={{ fontSize: 15, color: "#666", marginBottom: 6 }}
                    >
                      Nhãn hàng:{" "}
                      <span
                        style={{
                          color: "#2575fc",
                          fontWeight: 600,
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBrandClick(product.branch_id);
                        }}
                      >
                        {getBranchName(product.branch_id)}
                      </span>
                    </div>
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
      <main className="homepage">
        {/* Bảng filter mới */}
        <aside>
          <h3
            style={{
              marginBottom: 18,
              fontSize: 22,
              color: "#2575fc",
              fontWeight: 700,
            }}
          >
            Bộ lọc sản phẩm
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              background: "linear-gradient(90deg, #f8fafc 60%, #e3e6f3 100%)",
              borderRadius: 16,
              padding: "24px 18px 18px 18px",
              boxShadow: "0 2px 12px #e3e6f3",
              marginBottom: 24,
              alignItems: "stretch",
              minWidth: 220,
              maxWidth: 320,
            }}
          >
            <label
              style={{
                fontWeight: 600,
                color: "#6a11cb",
                marginBottom: 4,
              }}
            >
              Danh mục
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                border: "1.5px solid #2575fc",
                fontSize: 16,
                color: "#2575fc",
                background: "#fff",
                fontWeight: 600,
                outline: "none",
                boxShadow: selectedCategory ? "0 2px 8px #bdbdbd" : "none",
                transition: "box-shadow 0.2s, border-color 0.2s",
                cursor: "pointer",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#6a11cb")}
              onBlur={(e) => (e.target.style.borderColor = "#2575fc")}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <label
              style={{
                fontWeight: 600,
                color: "#6a11cb",
                marginBottom: 4,
                marginTop: 10,
              }}
            >
              Nhãn hàng
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                border: "1.5px solid #2575fc",
                fontSize: 16,
                color: "#2575fc",
                background: "#fff",
                fontWeight: 600,
                outline: "none",
                boxShadow: selectedBranch ? "0 2px 8px #bdbdbd" : "none",
                transition: "box-shadow 0.2s, border-color 0.2s",
                cursor: "pointer",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#6a11cb")}
              onBlur={(e) => (e.target.style.borderColor = "#2575fc")}
            >
              <option value="">Tất cả nhãn hàng</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            {(selectedCategory || selectedBranch) && (
              <button
                className="remove-filter"
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedBranch("");
                }}
                style={{
                  marginTop: 12,
                  background: "linear-gradient(90deg, #e53935, #ff7675)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 0",
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px #e57373",
                  transition: "background 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#e53935")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(90deg, #e53935, #ff7675)")
                }
              >
                Xoá lọc
              </button>
            )}
          </div>
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
                        {/* Hiển thị nhãn hàng */}
                        <div
                          style={{
                            fontSize: 15,
                            color: "#666",
                            marginBottom: 6,
                          }}
                        >
                          Nhãn hàng:{" "}
                          <span style={{ color: "#2575fc", fontWeight: 600 }}>
                            {getBranchName(product.branch_id)}
                          </span>
                        </div>
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
                      {/* Hiển thị nhãn hàng, có thể click */}
                      <div
                        style={{ fontSize: 15, color: "#666", marginBottom: 6 }}
                      >
                        Nhãn hàng:{" "}
                        <span
                          style={{
                            color: "#2575fc",
                            fontWeight: 600,
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBrandClick(product.branch_id);
                          }}
                        >
                          {getBranchName(product.branch_id)}
                        </span>
                      </div>
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
