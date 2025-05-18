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
  // Thêm state cho nhãn hàng
  const [branches, setBranches] = useState([]);
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

  // Lấy danh sách nhãn hàng
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/products/branches"
        );
        setBranches(res.data.data || res.data);
      } catch {
        setBranches([]);
      }
    };
    fetchBranches();
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
                <table className="form-table styled-table">
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
                        <label htmlFor="branch_id">Nhãn hàng</label>
                      </td>
                      <td>
                        <select
                          id="branch_id"
                          name="branch_id"
                          value={formData.branch_id}
                          onChange={handleChange}
                          required
                          style={{ minWidth: 120 }}
                        >
                          <option value="">-- Chọn nhãn hàng --</option>
                          {branches.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
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
        </div>
      </div>
    </>
  );
};

export default ChangeProductInfo;
