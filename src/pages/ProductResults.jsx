import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/scss/ProductResults.scss";
import { handleSearch } from "../services/SearchService";
import { addToCart } from "../services/productService";

const ProductResults = () => {
  const { id, categoryId } = useParams(); // id: product id, categoryId: category id
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [addCartMessage, setAddCartMessage] = useState("");

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
          const res = await fetch(
            `http://localhost:8080/api/products/category/${categoryId}`
          );
          if (!res.ok) throw new Error("Không thể tải sản phẩm theo danh mục");
          const data = await res.json();
          setCategoryProducts(Array.isArray(data) ? data : []);
          // Lấy tên danh mục từ 1 sản phẩm bất kỳ (nếu có)
          if (data.length > 0 && data[0].category_id) {
            // Gọi API lấy tên danh mục
            const catRes = await fetch(
              `http://localhost:8080/api/products/${data[0].id}/category`
            );
            if (catRes.ok) {
              const catData = await catRes.json();
              setCategoryName(catData.name || "");
            }
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
          const response = await fetch(
            `http://localhost:8080/api/products/${id}`
          );
          if (!response.ok) {
            throw new Error("Không thể tải thông tin sản phẩm");
          }
          const data = await response.json();
          setProduct(data);

          // Lấy danh mục sản phẩm
          const catRes = await fetch(
            `http://localhost:8080/api/products/${id}/category`
          );
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

  // Xử lý click vào danh mục
  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
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
            <h1>
              Sản phẩm thuộc danh mục:{" "}
              <span style={{ color: "#007bff" }}>{categoryName}</span>
            </h1>
            {categoryProducts.length > 0 ? (
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
                <button
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                >
                  Add to cart
                </button>
                <button className="buy-now-button">Buy now</button>
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
