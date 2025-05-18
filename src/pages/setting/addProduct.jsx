import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SettingBoard from "../../components/SettingBoard";
import "../../assets/scss/setting/ManageProduct.scss";
const API_URL = process.env.REACT_APP_API_URL;

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    category_id: "",
    branch_id: "",
    discount: "",
    image_url: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/products/categories`)
      .then((res) => {
        const cats = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];
        setCategories(cats);
      })
      .catch(() => setCategories([]));
    // Lấy danh sách nhãn hàng
    axios
      .get(`${API_URL}/api/products/branches`)
      .then((res) => {
        const brs = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];
        setBranches(brs);
      })
      .catch(() => setBranches([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/products`, formData);
      setSuccess("Sản phẩm đã được thêm thành công.");
      setError("");
      setFormData({
        name: "",
        price: "",
        stock: "",
        description: "",
        category_id: "",
        branch_id: "",
        discount: "",
        image_url: "",
      });
    } catch (err) {
      setError("Không thể thêm sản phẩm. Vui lòng thử lại.");
      setSuccess("");
    }
  };

  return (
    <>
      <Header />
      <div
        className="product-management-wrapper"
        style={{
          background: "linear-gradient(135deg, #2196f3 0%, #6a11cb 100%)",
          minHeight: "100vh",
          padding: "40px 0",
          fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
        }}
      >
        <div
          className="content-container"
          style={{
            display: "flex",
            gap: 40,
            alignItems: "flex-start",
            justifyContent: "center",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 260,
              maxWidth: 320,
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 4px 24px #e3e6f3",
              padding: 24,
              marginLeft: 8,
              marginTop: 8,
              height: "fit-content",
            }}
          >
            <SettingBoard />
          </div>
          <div
            style={{
              flex: 2,
              background: "#f8fafc",
              borderRadius: 16,
              boxShadow: "0 4px 24px #e3e6f3",
              padding: 36,
              maxWidth: 600,
              margin: "0 auto",
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
              Thêm sản phẩm mới
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
            {success && (
              <p
                style={{
                  color: "green",
                  fontWeight: 600,
                  textAlign: "center",
                  marginBottom: 16,
                }}
              >
                {success}
              </p>
            )}
            <form
              onSubmit={handleSubmit}
              className="add-product-form"
              style={{
                background: "#f8fafc",
                borderRadius: 14,
                boxShadow: "0 2px 12px #e0e0e0",
                padding: 32,
                margin: "0 auto",
              }}
            >
              <table className="form-table" style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td>
                      <label
                        htmlFor="name"
                        style={{ fontWeight: 600, color: "#444" }}
                      >
                        Tên sản phẩm
                      </label>
                    </td>
                    <td>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: "1.5px solid #e0e0e0",
                          fontSize: 16,
                          outline: "none",
                          transition: "border 0.2s",
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label
                        htmlFor="price"
                        style={{ fontWeight: 600, color: "#444" }}
                      >
                        Giá
                      </label>
                    </td>
                    <td>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: "1.5px solid #e0e0e0",
                          fontSize: 16,
                          outline: "none",
                          transition: "border 0.2s",
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label
                        htmlFor="stock"
                        style={{ fontWeight: 600, color: "#444" }}
                      >
                        Tồn kho
                      </label>
                    </td>
                    <td>
                      <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: "1.5px solid #e0e0e0",
                          fontSize: 16,
                          outline: "none",
                          transition: "border 0.2s",
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label
                        htmlFor="description"
                        style={{ fontWeight: 600, color: "#444" }}
                      >
                        Mô tả
                      </label>
                    </td>
                    <td>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: "1.5px solid #e0e0e0",
                          fontSize: 16,
                          minHeight: 60,
                          outline: "none",
                          transition: "border 0.2s",
                        }}
                      ></textarea>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label
                        htmlFor="category_id"
                        style={{ fontWeight: 600, color: "#444" }}
                      >
                        Danh mục
                      </label>
                    </td>
                    <td>
                      <select
                        id="category_id"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        required
                        style={{
                          minWidth: 250,
                          minHeight: 40,
                          fontSize: 16,
                          borderRadius: 8,
                          border: "1.5px solid #e0e0e0",
                          padding: "8px 12px",
                          outline: "none",
                          background: "#fff",
                        }}
                      >
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.id} - {cat.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label
                        htmlFor="branch_id"
                        style={{ fontWeight: 600, color: "#444" }}
                      >
                        Nhãn hàng
                      </label>
                    </td>
                    <td>
                      <select
                        id="branch_id"
                        name="branch_id"
                        value={formData.branch_id}
                        onChange={handleChange}
                        required
                        style={{
                          minWidth: 250,
                          minHeight: 40,
                          fontSize: 16,
                          borderRadius: 8,
                          border: "1.5px solid #e0e0e0",
                          padding: "8px 12px",
                          outline: "none",
                          background: "#fff",
                        }}
                      >
                        <option value="">-- Chọn nhãn hàng --</option>
                        {branches.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.id} - {b.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label
                        htmlFor="discount"
                        style={{ fontWeight: 600, color: "#444" }}
                      >
                        Giảm giá (%)
                      </label>
                    </td>
                    <td>
                      <input
                        type="number"
                        id="discount"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: "1.5px solid #e0e0e0",
                          fontSize: 16,
                          outline: "none",
                          transition: "border 0.2s",
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label
                        htmlFor="image_url"
                        style={{ fontWeight: 600, color: "#444" }}
                      >
                        URL hình ảnh
                      </label>
                    </td>
                    <td>
                      <input
                        type="text"
                        id="image_url"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: "1.5px solid #e0e0e0",
                          fontSize: 16,
                          outline: "none",
                          transition: "border 0.2s",
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                type="submit"
                className="submit-button"
                style={{
                  background: "linear-gradient(90deg, #6a11cb, #2575fc)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 17,
                  border: "none",
                  borderRadius: 8,
                  padding: "12px 32px",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px #bdbdbd",
                  transition: "background 0.2s, box-shadow 0.2s",
                  marginTop: 20,
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#2575fc")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(90deg, #6a11cb, #2575fc)")
                }
              >
                Thêm sản phẩm
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddProduct;
