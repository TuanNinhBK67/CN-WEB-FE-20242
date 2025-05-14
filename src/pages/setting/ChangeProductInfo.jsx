import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../assets/scss/setting/ManageProduct.scss";
import axios from "axios";

const ChangeProductInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    stock: 0,
    image_url: "",
    description: "",
    discount: 0,
    branch_id: 0,
    category_id: 0,
    is_deleted: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  // Thêm state cho danh mục
  const [categories, setCategories] = useState([]);
  // Thêm state cho form thêm danh mục
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [catMsg, setCatMsg] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/products/${id}`);
        setFormData({
          name: res.data.name || "",
          price: res.data.price || 0,
          stock: res.data.stock || 0,
          image_url: res.data.image_url || "",
          description: res.data.description || "",
          discount: res.data.discount || 0,
          branch_id: res.data.branch_id || 0,
          category_id: res.data.category_id || 0,
          is_deleted: res.data.is_deleted || false,
        });
      } catch (err) {
        setError("Không thể tải thông tin sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/products/categories"
        );
        // Nếu API trả về { success, data }, lấy data, còn không lấy luôn mảng
        setCategories(res.data.data || res.data);
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.put(
        `http://localhost:8080/api/products/${id}/status`,
        formData
      );
      setSuccess("Cập nhật thông tin sản phẩm thành công.");
    } catch (err) {
      setError("Cập nhật thông tin sản phẩm thất bại.");
    }
  };

  // Lấy tên danh mục theo id
  const getCategoryName = (catId) => {
    const found = categories.find((c) => String(c.id) === String(catId));
    return found ? found.name : "";
  };

  // Thêm danh mục
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setCatMsg("");
    if (!newCategory.name) {
      setCatMsg("Tên danh mục không được để trống");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8080/api/products/categories",
        newCategory
      );
      setCatMsg("Thêm danh mục thành công!");
      setNewCategory({ name: "", description: "" });
      // Reload lại danh mục
      const res = await axios.get(
        "http://localhost:8080/api/products/categories"
      );
      setCategories(res.data.data || res.data);
    } catch {
      setCatMsg("Thêm danh mục thất bại!");
    }
  };

  // Xóa danh mục
  const handleDeleteCategory = async (catId) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa danh mục này?")) return;
    try {
      await axios.delete(
        `http://localhost:8080/api/products/categories/${catId}`
      );
      setCatMsg("Xóa danh mục thành công!");
      // Reload lại danh mục
      const res = await axios.get(
        "http://localhost:8080/api/products/categories"
      );
      setCategories(res.data.data || res.data);
    } catch {
      setCatMsg("Xóa danh mục thất bại!");
    }
  };

  return (
    <>
      <div className="product-management-wrapper">
        <div className="content-container" style={{ display: "flex", gap: 32 }}>
          <div className="main-content" style={{ flex: 2 }}>
            <h2 className="product-management-title">
              Cập nhật thông tin sản phẩm
            </h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            {loading ? (
              <p>Đang tải thông tin sản phẩm...</p>
            ) : (
              <form onSubmit={handleSubmit} className="add-product-form">
                <table className="form-table">
                  <tbody>
                    <tr>
                      <td>
                        <label htmlFor="name">Tên sản phẩm</label>
                      </td>
                      <td>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label htmlFor="price">Giá</label>
                      </td>
                      <td>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label htmlFor="stock">Tồn kho</label>
                      </td>
                      <td>
                        <input
                          type="number"
                          id="stock"
                          name="stock"
                          value={formData.stock}
                          onChange={handleChange}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label htmlFor="image_url">URL hình ảnh</label>
                      </td>
                      <td>
                        <input
                          type="text"
                          id="image_url"
                          name="image_url"
                          value={formData.image_url}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label htmlFor="description">Mô tả</label>
                      </td>
                      <td>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          required
                        ></textarea>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label htmlFor="discount">Giảm giá (%)</label>
                      </td>
                      <td>
                        <input
                          type="number"
                          id="discount"
                          name="discount"
                          value={formData.discount}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label htmlFor="branch_id">ID Nhãn hàng</label>
                      </td>
                      <td>
                        <input
                          type="number"
                          id="branch_id"
                          name="branch_id"
                          value={formData.branch_id}
                          onChange={handleChange}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label htmlFor="category_id">ID danh mục</label>
                      </td>
                      <td
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <select
                          id="category_id"
                          name="category_id"
                          value={formData.category_id}
                          onChange={handleChange}
                          required
                          style={{ minWidth: 120 }}
                        >
                          <option value="">-- Chọn danh mục --</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.id}
                            </option>
                          ))}
                        </select>
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "#007bff",
                          }}
                        >
                          {getCategoryName(formData.category_id)}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label htmlFor="is_deleted">Đánh dấu xóa</label>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          id="is_deleted"
                          name="is_deleted"
                          checked={formData.is_deleted}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button type="submit" className="submit-button">
                  Cập nhật
                </button>
                <button
                  type="button"
                  className="submit-button"
                  style={{
                    marginLeft: "10px",
                    background: "#ccc",
                    color: "#333",
                  }}
                  onClick={() => navigate(-1)}
                >
                  Quay lại
                </button>
              </form>
            )}
          </div>
          {/* Bảng danh mục bên phải */}
          <div
            className="category-list-panel"
            style={{
              flex: 1,
              background: "#f8f9fa",
              borderRadius: 8,
              padding: 16,
              minWidth: 220,
            }}
          >
            <h3 style={{ marginBottom: 12 }}>Danh sách danh mục</h3>
            <table
              style={{
                width: "100%",
                fontSize: 14,
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid #ccc",
                    }}
                  >
                    ID
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid #ccc",
                    }}
                  >
                    Tên danh mục
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td style={{ padding: "4px 8px" }}>{cat.id}</td>
                    <td style={{ padding: "4px 8px" }}>{cat.name}</td>
                    <td>
                      <button
                        style={{
                          background: "#e74c3c",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          padding: "2px 8px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleDeleteCategory(cat.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Thêm danh mục */}
            <div style={{ marginTop: 24 }}>
              <h4>Thêm danh mục mới</h4>
              <form onSubmit={handleAddCategory}>
                <input
                  type="text"
                  placeholder="Tên danh mục"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  style={{ width: "100%", marginBottom: 8, padding: 4 }}
                  required
                />
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  style={{ width: "100%", marginBottom: 8, padding: 4 }}
                />
                <button
                  type="submit"
                  style={{
                    background: "#2575fc",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    padding: "6px 16px",
                    cursor: "pointer",
                  }}
                >
                  Thêm danh mục
                </button>
              </form>
              {catMsg && (
                <div
                  style={{
                    color: catMsg.includes("thành công") ? "green" : "red",
                    marginTop: 8,
                  }}
                >
                  {catMsg}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangeProductInfo;
