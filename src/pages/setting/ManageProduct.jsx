import React, { useEffect, useState } from "react";
import { getAllProducts, updateProduct } from "../../services/productService";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/scss/setting/ManageProduct.scss";

const ManageProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [stockProducts, setStockProducts] = useState([]);

  const productsPerPage = 10;
  const API_URL = `${process.env.REACT_APP_API_URL}/api/products`;

  useEffect(() => {
    const fetchStockProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/stock/check`);
        setStockProducts(res.data);
      } catch (err) {
        setError("Không thể tải danh sách tồn kho sản phẩm.");
      }
    };
    fetchStockProducts();
  }, []);

  // Tìm kiếm theo tên hoặc ID
  const filteredProducts = stockProducts.filter((product) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      product.name.toLowerCase().includes(term) ||
      String(product.id).includes(term)
    );
  });

  // Phân trang
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    });
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (productId) => {
    try {
      await updateProduct(productId, formData);
      alert("Cập nhật sản phẩm thành công.");
      window.location.reload(); // Reload để cập nhật danh sách
    } catch (err) {
      alert("Cập nhật sản phẩm thất bại.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("Xóa sản phẩm thành công.");
      setStockProducts(stockProducts.filter((product) => product.id !== id));
    } catch (err) {
      alert("Xóa sản phẩm thất bại.");
    }
  };

  const handleCategory = (id) => {
    navigate(`/setting/product-category/${id}`);
  };

  return (
    <div
      className="product-management-wrapper"
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
        padding: "40px 0",
        fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif", // Thêm dòng này để đồng bộ font
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 24px #e3e6f3",
          padding: 36,
          fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif", // Thêm dòng này cho vùng chính
        }}
      >
        <h2
          className="product-management-title"
          style={{
            color: "#2575fc",
            fontWeight: 800,
            marginBottom: 32,
            textAlign: "center",
            fontSize: 28,
            letterSpacing: 0.5,
          }}
        >
          Quản lý sản phẩm
        </h2>

        {error && (
          <p
            style={{
              color: "red",
              fontWeight: 600,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            {error}
          </p>
        )}

        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 28,
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm theo tên hoặc ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
            style={{
              flex: 1,
              padding: "12px 18px",
              borderRadius: 8,
              border: "1.5px solid #e0e0e0",
              fontSize: 17,
              outline: "none",
              boxShadow: "0 2px 8px #f3f6fa",
              transition: "border 0.2s",
              marginRight: 8,
            }}
          />

          <button
            onClick={() => navigate("/addProduct")}
            style={{
              background: "linear-gradient(90deg, #6a11cb, #2575fc)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              cursor: "pointer",
              boxShadow: "0 2px 8px #bdbdbd",
              transition: "background 0.2s, box-shadow 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#2575fc")}
            onMouseOut={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(90deg, #6a11cb, #2575fc)")
            }
          >
            Thêm sản phẩm
          </button>
          <button
            onClick={() => navigate("/setting/add-category")}
            style={{
              background: "linear-gradient(90deg, #43cea2, #185a9d)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              cursor: "pointer",
              boxShadow: "0 2px 8px #bdbdbd",
              transition: "background 0.2s, box-shadow 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#185a9d")}
            onMouseOut={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(90deg, #43cea2, #185a9d)")
            }
          >
            Thêm danh mục
          </button>
          <button
            onClick={() => navigate("/setting/add-brand")}
            style={{
              background: "linear-gradient(90deg, #e53935, #ff7675)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              cursor: "pointer",
              boxShadow: "0 2px 8px #e57373",
              transition: "background 0.2s, box-shadow 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#e53935")}
            onMouseOut={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(90deg, #e53935, #ff7675)")
            }
          >
            Thêm nhãn hàng
          </button>
        </div>

        <div
          style={{
            borderRadius: 14,
            boxShadow: "0 2px 12px #e0e0e0",
            background: "#fff",
            overflow: "hidden",
          }}
        >
          <table
            className="stock-table"
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              fontSize: 15,
              background: "#fff",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ background: "#e3e6f3" }}>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    color: "#2575fc",
                    fontWeight: 700,
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    color: "#2575fc",
                    fontWeight: 700,
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  Tên sản phẩm
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    color: "#2575fc",
                    fontWeight: 700,
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  Tồn kho
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                ></th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product, idx) => (
                <tr
                  key={product.id}
                  style={{
                    background: idx % 2 === 0 ? "#f8faff" : "#fff",
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#e3e6f3")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background =
                      idx % 2 === 0 ? "#f8faff" : "#fff")
                  }
                >
                  <td style={{ padding: "10px 16px", fontWeight: 600 }}>
                    {product.id}
                  </td>
                  <td
                    style={{
                      padding: "10px 16px",
                      color: "#2575fc",
                      fontWeight: 700,
                    }}
                  >
                    {product.name}
                  </td>
                  <td style={{ padding: "10px 16px" }}>{product.stock}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <button
                      onClick={() => handleDelete(product.id)}
                      style={{
                        background: "linear-gradient(90deg, #e53935, #ff7675)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "7px 18px",
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px #e57373",
                        transition: "background 0.2s, box-shadow 0.2s",
                        marginRight: 8,
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "#e53935";
                        e.currentTarget.style.boxShadow = "0 4px 16px #e57373";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background =
                          "linear-gradient(90deg, #e53935, #ff7675)";
                        e.currentTarget.style.boxShadow = "0 2px 8px #e57373";
                      }}
                    >
                      Xóa
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/setting/change-product/${product.id}`)
                      }
                      style={{
                        background: "linear-gradient(90deg, #6a11cb, #2575fc)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "7px 18px",
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px #bdbdbd",
                        transition: "background 0.2s, box-shadow 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#2575fc")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background =
                          "linear-gradient(90deg, #6a11cb, #2575fc)")
                      }
                    >
                      Chỉnh sửa
                    </button>
                  </td>
                </tr>
              ))}
              {currentProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      textAlign: "center",
                      color: "#888",
                      padding: 24,
                    }}
                  >
                    Không có sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div
          className="pagination"
          style={{ marginTop: 24, textAlign: "center" }}
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                margin: "0 4px",
                padding: "8px 16px",
                borderRadius: 6,
                border:
                  currentPage === i + 1
                    ? "2px solid #2575fc"
                    : "1px solid #ddd",
                background: currentPage === i + 1 ? "#e3e6f3" : "#fff",
                color: currentPage === i + 1 ? "#2575fc" : "#222",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.2s, border 0.2s",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageProduct;
