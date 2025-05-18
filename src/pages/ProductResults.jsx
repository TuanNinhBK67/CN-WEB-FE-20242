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
      }}
    >
      <Header onSearch={onSearch} />
      <main className="product-details" style={{ flex: 1 }}>
        {categoryId ? (
          <>
            {categoryProducts.length > 0 ? (
              <>
                <h1>
                  Sản phẩm thuộc danh mục:{" "}
                  <span style={{ color: "#007bff" }}>{categoryName}</span>
                </h1>
                <div className="product-grid">
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {Number(product.discount) > 0 ? (
                  <>
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "#888",
                        fontSize: "0.9rem",
                      }}
                    >
                      {Number(product.price).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                    <span
                      style={{
                        color: "red",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
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
                  <>
                    <span
                      style={{
                        color: "red",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      {Number(product.price).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </>
                )}
              </div>
              {/* Hiển thị danh mục sản phẩm có thể click */}
              <p className="product-category">
                <strong>Danh mục:</strong>{" "}
                {category ? (
                  <span
                    style={{
                      color: "#007bff",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    {category.name}
                  </span>
                ) : (
                  "Không có danh mục"
                )}
              </p>
              <p className="product-description">{product.description}</p>
              <div className="product-actions">
                {!storedUser && (
                  <button
                    style={{
                      padding: "12px 20px",
                      backgroundColor: "#6c63ff",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                      transition: "background 0.3s",
                    }}
                    onClick={() => navigate("/login")}
                  >
                    Đăng nhập để mua sắm
                  </button>
                )}
                {storedUser?.role === "customer" && (
                  <>
                    <button
                      className="add-to-cart-button"
                      onClick={handleAddToCart}
                    >
                      Thêm vào giỏ hàng
                    </button>
                    <button className="buy-now-button">Mua</button>
                  </>
                )}
                {storedUser?.role === "admin" && (
                  <>
                    <button
                      className="manage-button"
                      onClick={() =>
                        navigate(`/setting/change-product/${product.id}`)
                      }
                    >
                      Quản lý sản phẩm
                    </button>
                    <button className="delete-button">Xóa sản phẩm</button>
                  </>
                )}
              </div>
              {addCartMessage && (
                <div style={{ color: "green", marginTop: 10 }}>
                  {addCartMessage}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>Đang tải thông tin sản phẩm...</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductResults;
