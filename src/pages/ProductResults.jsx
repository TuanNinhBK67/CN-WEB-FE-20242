import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/scss/ProductResults.scss";
import { handleSearch } from "../services/SearchService";
import { addToCart } from "../services/productService";

const API_URL = `${process.env.REACT_APP_API_URL}/api/products`;

const ProductResults = () => {
  const { id, categoryId, branchId } = useParams();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [branchProducts, setBranchProducts] = useState([]);
  const [branchName, setBranchName] = useState("");
  const [addCartMessage, setAddCartMessage] = useState("");
  const [branches, setBranches] = useState([]); // Danh sách nhãn hàng
  const [categoryNames, setCategoryNames] = useState({}); // Map productId -> categoryName
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Danh sách tất cả danh mục

  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // Lấy danh sách nhãn hàng khi load trang
  useEffect(() => {
    fetch(`${API_URL}/branches`)
      .then((res) => res.json())
      .then((data) => setBranches(data.data || data))
      .catch(() => setBranches([]));
    // Lấy danh sách danh mục sản phẩm
    fetch("http://localhost:8080/api/products/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || data))
      .catch(() => setCategories([]));
  }, []);

  const onSearch = (keyword) => {
    handleSearch(keyword, setSearchKeyword, setSearchResults);
  };

  const handleCardClick = (product) => {
    navigate(`/product/${product.id}`, { state: product });
  };

  // Nếu có categoryId trên URL thì fetch sản phẩm theo danh mục
  useEffect(() => {
    if (categoryId) {
      const fetchCategoryProducts = async () => {
        try {
          const res = await fetch(`${API_URL}/category/${categoryId}`);
          if (!res.ok) throw new Error("Không thể tải sản phẩm theo danh mục");
          const data = await res.json();
          setCategoryProducts(Array.isArray(data) ? data : []);
          // Lấy tên danh mục từ 1 sản phẩm bất kỳ (nếu có)
          if (data.length > 0 && data[0].category_id) {
            // // Gọi API lấy tên danh mục
            // const catRes = await fetch(
            //     `${API_URL}/${data[0].id}/category`
            // );
            // if (catRes.ok) {
            //     const catData = await catRes.json();
            //     setCategoryName(catData.name || "");
            // }
          } else {
            setCategoryName("");
          }
        } catch (err) {
          setCategoryProducts([]);
          setCategoryName("");
        }
      };
      fetchCategoryProducts();
    }
  }, [categoryId]);

  // Nếu có id sản phẩm thì fetch sản phẩm và danh mục
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`${API_URL}/${id}`);
          if (!response.ok) {
            throw new Error("Không thể tải thông tin sản phẩm");
          }
          const data = await response.json();
          setProduct(data);

          // Lấy danh mục sản phẩm
          const catRes = await fetch(`${API_URL}/${id}/category`);
          if (catRes.ok) {
            const catData = await catRes.json();
            setCategory(catData);
          } else {
            setCategory(null);
          }
        } catch (error) {
          setProduct(null);
          setCategory(null);
        }
      };
      fetchProduct();
    }
  }, [id]);

  // Nếu có branchId trên URL thì fetch sản phẩm theo nhãn hàng
  useEffect(() => {
    if (branchId) {
      const fetchBranchProducts = async () => {
        try {
          const res = await fetch(
            `${process.env.REACT_APP_API_URL}/api/products/branch/${branchId}`
          );
          if (!res.ok) throw new Error("Không thể tải sản phẩm theo nhãn hàng");
          const data = await res.json();
          setBranchProducts(Array.isArray(data) ? data : []);
          // Lấy tên nhãn hàng từ 1 sản phẩm bất kỳ (nếu có)
          if (data.length > 0 && data[0].branch_name) {
            setBranchName(data[0].branch_name);
          } else {
            setBranchName("");
          }
        } catch (err) {
          setBranchProducts([]);
          setBranchName("");
        }
      };
      fetchBranchProducts();
    }
  }, [branchId]);

  // Hàm lấy tên nhãn hàng từ branch_id
  const getBranchName = (branch_id) => {
    const found = branches.find((b) => String(b.id) === String(branch_id));
    return found ? found.name : "";
  };

  // Hàm lấy tên danh mục từ category_id
  const getCategoryNameById = (category_id) => {
    const found = categories.find((c) => String(c.id) === String(category_id));
    return found ? found.name : "Đang tải...";
  };

  // Hàm lấy tên danh mục từ cache hoặc fetch nếu chưa có
  const getCategoryName = (product) => {
    if (!product || !product.category_id) return "";
    if (product.category_name) return product.category_name;
    if (categoryNames[product.id]) return categoryNames[product.id];
    // Nếu chưa có, fetch và lưu vào state
    fetch(`${API_URL}/${product.id}/category`)
      .then((res) => res.json())
      .then((data) => {
        setCategoryNames((prev) => ({
          ...prev,
          [product.id]: data.name || "",
        }));
      })
      .catch(() => {});
    return "";
  };

  // Xử lý click vào danh mục
  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  // Thêm hàm xử lý click vào nhãn hàng
  const handleBrandClick = (branchId) => {
    if (branchId) {
      navigate(`/products/branch/${branchId}`);
    }
  };
  const handleBuyNow = async () => {
    if (!product) return;
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      setAddCartMessage("Bạn cần đăng nhập để mua ngay!");
      setTimeout(() => setAddCartMessage(""), 2000);
      return;
    }
    try {
      await addToCart(product.id, 1, user.id);
      // TODO: Điều hướng đến trang thanh toán
      navigate("/checkout");
    } catch (err) {
      setAddCartMessage("Mua ngay thất bại!");
      setTimeout(() => setAddCartMessage(""), 2000);
    }
  };
  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    if (!product) return;
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      setAddCartMessage("Bạn cần đăng nhập để thêm vào giỏ hàng!");
      setTimeout(() => setAddCartMessage(""), 2000);
      return;
    }
    try {
      await addToCart(product.id, 1, user.id);
      setAddCartMessage("Đã thêm vào giỏ hàng!");
    } catch (err) {
      setAddCartMessage("Thêm vào giỏ hàng thất bại!");
    }
    setTimeout(() => setAddCartMessage(""), 2000);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keyword = params.get("keyword") || "";
    if (keyword) {
      setSearchKeyword(keyword);
      handleSearch(keyword, setSearchKeyword, setSearchResults);
    }
  }, [location.search]);

  // Khi vào trang chi tiết sản phẩm, lấy các sản phẩm cùng danh mục (trừ sản phẩm hiện tại)
  useEffect(() => {
    if (product && product.category_id) {
      fetch(`${API_URL}/category/${product.category_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setRelatedProducts(data.filter((p) => p.id !== product.id));
          } else {
            setRelatedProducts([]);
          }
        })
        .catch(() => setRelatedProducts([]));
    }
  }, [product]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#f5f7fa",
      }}
    >
      <Header onSearch={onSearch} />
      <main
        className="product-details"
        style={{
          flex: 1,
          width: "100vw",
          maxWidth: "100vw",
          minWidth: 0,
          padding: 0,
          margin: 0,
        }}
      >
        {branchId ? (
          <>
            {branchProducts.length > 0 ? (
              <>
                <h1>
                  Sản phẩm thuộc nhãn hàng:{" "}
                  <span style={{ color: "#007bff" }}>{branchName}</span>
                </h1>
                <div className="product-grid-results" style={{ width: "100%" }}>
                  {branchProducts.map((product) => (
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
                        {/* Thông tin danh mục và nhãn hàng */}
                        <div
                          style={{
                            fontSize: 15,
                            color: "#666",
                            marginBottom: 6,
                          }}
                        >
                          Danh mục:{" "}
                          {product.category_id ? (
                            <span
                              style={{
                                color: "#2575fc",
                                fontWeight: 600,
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCategoryClick(product.category_id);
                              }}
                            >
                              {getCategoryNameById(product.category_id)}
                            </span>
                          ) : (
                            <span style={{ color: "#aaa" }}>Không có</span>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: 15,
                            color: "#666",
                            marginBottom: 6,
                          }}
                        >
                          Nhãn hàng:{" "}
                          {product.branch_id ? (
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
                              {getBranchName(product.branch_id) ||
                                "Đang tải..."}
                            </span>
                          ) : (
                            <span style={{ color: "#aaa" }}>Không có</span>
                          )}
                        </div>
                        <p className="product-description">
                          {product.description}
                        </p>
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
              </>
            ) : (
              <p>Không có sản phẩm nào trong nhãn hàng này.</p>
            )}
          </>
        ) : categoryId ? (
          <>
            {categoryProducts.length > 0 ? (
              <>
                <h1>
                  Sản phẩm thuộc danh mục:{" "}
                  <span style={{ color: "#007bff" }}>{categoryName}</span>
                </h1>
                <div className="product-grid-results" style={{ width: "100%" }}>
                  {categoryProducts.map((product) => (
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
                        {/* Thông tin danh mục và nhãn hàng */}
                        <div
                          style={{
                            fontSize: 15,
                            color: "#666",
                            marginBottom: 6,
                          }}
                        >
                          Danh mục:{" "}
                          {product.category_id ? (
                            <span
                              style={{
                                color: "#2575fc",
                                fontWeight: 600,
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCategoryClick(product.category_id);
                              }}
                            >
                              {getCategoryNameById(product.category_id)}
                            </span>
                          ) : (
                            <span style={{ color: "#aaa" }}>Không có</span>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: 15,
                            color: "#666",
                            marginBottom: 6,
                          }}
                        >
                          Nhãn hàng:{" "}
                          {product.branch_id ? (
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
                              {getBranchName(product.branch_id) ||
                                "Đang tải..."}
                            </span>
                          ) : (
                            <span style={{ color: "#aaa" }}>Không có</span>
                          )}
                        </div>
                        <p className="product-description">
                          {product.description}
                        </p>
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
              </>
            ) : (
              <p>Không có sản phẩm nào trong danh mục này.</p>
            )}
          </>
        ) : searchKeyword ? (
          <>
            <h1>Kết quả tìm kiếm cho "{searchKeyword}"</h1>
            {searchResults.length > 0 ? (
              <div className="product-grid-results" style={{ width: "100%" }}>
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
                      {/* Thông tin danh mục và nhãn hàng */}
                      <div
                        style={{ fontSize: 15, color: "#666", marginBottom: 6 }}
                      >
                        Danh mục:{" "}
                        {product.category_id ? (
                          <span
                            style={{
                              color: "#2575fc",
                              fontWeight: 600,
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCategoryClick(product.category_id);
                            }}
                          >
                            {getCategoryNameById(product.category_id)}
                          </span>
                        ) : (
                          <span style={{ color: "#aaa" }}>Không có</span>
                        )}
                      </div>
                      <div
                        style={{ fontSize: 15, color: "#666", marginBottom: 6 }}
                      >
                        Nhãn hàng:{" "}
                        {product.branch_id ? (
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
                            {getBranchName(product.branch_id) || "Đang tải..."}
                          </span>
                        ) : (
                          <span style={{ color: "#aaa" }}>Không có</span>
                        )}
                      </div>
                      <p className="product-description">
                        {product.description}
                      </p>
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
        ) : product ? (
          <div
            className="product-details-container"
            style={{
              gap: 48,
              alignItems: "flex-start",
              maxWidth: 1100,
              margin: "36px auto 0 auto",
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 4px 32px #e3e6f3",
              padding: "40px 44px 36px 44px",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <div
              className="product-image-section"
              style={{
                flex: "0 0 400px",
                maxWidth: 400,
                minWidth: 320,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <div
                style={{
                  width: 360,
                  height: 360,
                  background: "#f8fafc",
                  borderRadius: 18,
                  boxShadow: "0 2px 16px #e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  marginBottom: 18,
                  border: "1.5px solid #e3e6f3",
                }}
              >
                <img
                  src={product.image_url || "https://via.placeholder.com/340"}
                  alt={product.name}
                  className="product-image"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    borderRadius: 14,
                    background: "#fff",
                  }}
                />
              </div>
            </div>
            <div
              className="product-info-section"
              style={{
                flex: 2,
                minWidth: 320,
                maxWidth: 600,
                paddingLeft: 12,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              <h1
                className="product-title"
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: "#2575fc",
                  marginBottom: 18,
                  lineHeight: 1.1,
                  letterSpacing: 0.5,
                }}
              >
                {product.name}
              </h1>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginBottom: 18,
                }}
              >
                {Number(product.discount) > 0 ? (
                  <>
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "#888",
                        fontSize: "1.1rem",
                        marginBottom: 2,
                      }}
                    >
                      {Number(product.price).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                    <span
                      style={{
                        color: "#e53935",
                        fontWeight: "bold",
                        fontSize: "2rem",
                        letterSpacing: 1,
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
                      color: "#e53935",
                      fontWeight: "bold",
                      fontSize: "2rem",
                      letterSpacing: 1,
                    }}
                  >
                    {Number(product.price).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                )}
              </div>
              <div style={{ margin: "10px 0 18px 0", fontSize: 17 }}>
                <span>
                  <strong>Danh mục:</strong>{" "}
                  {product.category_id ? (
                    <span
                      style={{
                        color: "#2575fc",
                        cursor: "pointer",
                        textDecoration: "underline",
                        fontWeight: 600,
                        transition: "color 0.2s",
                      }}
                      onClick={() => handleCategoryClick(product.category_id)}
                      onMouseOver={(e) => (e.target.style.color = "#6a11cb")}
                      onMouseOut={(e) => (e.target.style.color = "#2575fc")}
                    >
                      {getCategoryNameById(product.category_id)}
                    </span>
                  ) : (
                    <span style={{ color: "#aaa" }}>Không có</span>
                  )}
                </span>
                <span style={{ marginLeft: 32 }}>
                  <strong>Nhãn hàng:</strong>{" "}
                  {product.branch_id ? (
                    <span
                      style={{
                        color: "#2575fc",
                        cursor: "pointer",
                        textDecoration: "underline",
                        fontWeight: 600,
                        transition: "color 0.2s",
                      }}
                      onClick={() => handleBrandClick(product.branch_id)}
                      onMouseOver={(e) => (e.target.style.color = "#6a11cb")}
                      onMouseOut={(e) => (e.target.style.color = "#2575fc")}
                    >
                      {getBranchName(product.branch_id) || "Đang tải..."}
                    </span>
                  ) : (
                    <span style={{ color: "#aaa" }}>Không có</span>
                  )}
                </span>
              </div>
              <p
                className="product-description"
                style={{
                  fontSize: 17,
                  color: "#444",
                  marginBottom: 22,
                  lineHeight: 1.6,
                  background: "#f8fafc",
                  borderRadius: 8,
                  padding: "16px 18px",
                  boxShadow: "0 1px 4px #e3e6f3",
                  minHeight: 60,
                }}
              >
                {product.description}
              </p>
              <div
                className="product-actions"
                style={{ marginTop: 18, gap: 18 }}
              >
                {!storedUser && (
                  <button
                    style={{
                      padding: "14px 28px",
                      background: "linear-gradient(90deg, #6a11cb, #2575fc)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "18px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px #bdbdbd",
                      transition: "background 0.2s, transform 0.18s",
                    }}
                    onClick={() => navigate("/login")}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#2575fc")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background =
                        "linear-gradient(90deg, #6a11cb, #2575fc)")
                    }
                  >
                    Đăng nhập để mua sắm
                  </button>
                )}
                {storedUser?.role === "customer" && (
                  <>
                    <button
                      className="add-to-cart-button"
                      style={{
                        padding: "14px 28px",
                        background: "linear-gradient(90deg, #43cea2, #185a9d)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "18px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px #bdbdbd",
                        transition: "background 0.2s, transform 0.18s",
                      }}
                      onClick={handleAddToCart}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#185a9d")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background =
                          "linear-gradient(90deg, #43cea2, #185a9d)")
                      }
                    >
                      Thêm vào giỏ hàng
                    </button>
                    <button
                      className="buy-now-button"
                      style={{
                        padding: "14px 28px",
                        background: "linear-gradient(90deg, #e53935, #ff7675)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "18px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px #e57373",
                        transition: "background 0.2s, transform 0.18s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#e53935")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background =
                          "linear-gradient(90deg, #e53935, #ff7675)")
                      }
                    >
                      Mua ngay
                    </button>
                  </>
                )}
                {storedUser?.role === "admin" && (
                  <>
                    <button
                      className="manage-button"
                      style={{
                        padding: "14px 28px",
                        background: "linear-gradient(90deg, #6a11cb, #2575fc)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "18px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px #bdbdbd",
                        transition: "background 0.2s, transform 0.18s",
                      }}
                      onClick={() =>
                        navigate(`/setting/change-product/${product.id}`)
                      }
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#2575fc")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background =
                          "linear-gradient(90deg, #6a11cb, #2575fc)")
                      }
                    >
                      Quản lý sản phẩm
                    </button>
                    <button
                      className="delete-button"
                      style={{
                        padding: "14px 28px",
                        background: "linear-gradient(90deg, #e53935, #ff7675)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "18px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px #e57373",
                        transition: "background 0.2s, transform 0.18s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#e53935")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background =
                          "linear-gradient(90deg, #e53935, #ff7675)")
                      }
                    >
                      Xóa sản phẩm
                    </button>
                  </>
                )}
              </div>
              {addCartMessage && (
                <div
                  style={{
                    color: "green",
                    marginTop: 18,
                    fontWeight: 600,
                    fontSize: 16,
                  }}
                >
                  {addCartMessage}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>Đang tải thông tin sản phẩm...</p>
        )}

        {/* Gợi ý sản phẩm cùng danh mục */}
        {product && relatedProducts.length > 0 && (
          <div
            style={{
              margin: "48px 0 0 0",
              background: "linear-gradient(90deg, #f8fafc 60%, #e3e6f3 100%)",
              borderRadius: 18,
              boxShadow: "0 2px 16px #e3e6f3",
              padding: "36px 0 36px 0",
              maxWidth: 1200,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#2575fc",
                marginBottom: 24,
                marginLeft: 44,
                letterSpacing: 0.5,
              }}
            >
              Bạn cũng có thể thích
            </h2>
            <div
              className="product-grid-results"
              style={{ width: "100%", padding: "0 44px" }}
            >
              {relatedProducts.map((item) => (
                <div
                  key={item.id}
                  className="product-card"
                  onClick={() => navigate(`/product/${item.id}`)}
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.18s, box-shadow 0.18s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "scale(1.04)";
                    e.currentTarget.style.boxShadow = "0 8px 32px #bdbdbd";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 2px 12px #e0e0e0";
                  }}
                >
                  <img
                    src={item.image_url || "https://via.placeholder.com/150"}
                    alt={item.name}
                    className="product-image"
                  />
                  <div className="product-info">
                    <h2 className="product-title">{item.name}</h2>
                    <div
                      style={{ fontSize: 15, color: "#666", marginBottom: 6 }}
                    >
                      Danh mục:{" "}
                      {item.category_id ? (
                        <span
                          style={{
                            color: "#2575fc",
                            fontWeight: 600,
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryClick(item.category_id);
                          }}
                        >
                          {getCategoryNameById(item.category_id)}
                        </span>
                      ) : (
                        <span style={{ color: "#aaa" }}>Không có</span>
                      )}
                    </div>
                    <div
                      style={{ fontSize: 15, color: "#666", marginBottom: 6 }}
                    >
                      Nhãn hàng:{" "}
                      {item.branch_id ? (
                        <span
                          style={{
                            color: "#2575fc",
                            fontWeight: 600,
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBrandClick(item.branch_id);
                          }}
                        >
                          {getBranchName(item.branch_id) || "Đang tải..."}
                        </span>
                      ) : (
                        <span style={{ color: "#aaa" }}>Không có</span>
                      )}
                    </div>
                    <p className="product-description">{item.description}</p>
                    <div className="product-price">
                      {Number(item.discount) > 0 ? (
                        <>
                          <span className="price-original">
                            {Number(item.price).toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </span>
                          <span className="price-discounted">
                            {Number(
                              item.price * (1 - item.discount / 100)
                            ).toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </span>
                        </>
                      ) : (
                        <span className="price-discounted">
                          {Number(item.price).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductResults;
