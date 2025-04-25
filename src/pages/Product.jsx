import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Product() {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (keyword) => {
    if (!keyword) return;

    setLoading(true);
    try {
      console.log("Đang gọi API với từ khóa:", keyword);
      const response = await axios.get(
        `http://localhost:8080/api/products/search?keyword=${keyword}`
      );

      console.log("Response từ API:", response.data);

      // Kiểm tra nếu response.data là một mảng
      if (Array.isArray(response.data)) {
        setSearchResults(response.data);
      } else if (typeof response.data === "object") {
        // Nếu response.data là một object (một sản phẩm), chuyển thành mảng
        setSearchResults([response.data]);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Lắng nghe thay đổi của URL params
  useEffect(() => {
    const keyword = searchParams.get("keyword");
    if (keyword) {
      setSearchKeyword(keyword);
      handleSearch(keyword);
    }
  }, [searchParams]);

  return (
    <div className="product-page">
      <Header onSearch={handleSearch} />
      <main className="product-content">
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <>
            <h2>
              Kết quả tìm kiếm cho "{searchKeyword}" ({searchResults.length} sản
              phẩm)
            </h2>
            <div className="product-grid">
              {searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <div key={product.id} className="product-card">
                    {product.image_url && (
                      <img src={product.image_url} alt={product.name} />
                    )}
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p className="price">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.price)}
                    </p>
                  </div>
                ))
              ) : (
                <p>Không tìm thấy sản phẩm nào phù hợp</p>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Product;
