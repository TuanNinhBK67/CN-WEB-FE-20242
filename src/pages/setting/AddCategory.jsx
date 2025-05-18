import React, { useState, useEffect } from "react";
import axios from "axios";

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [catMsg, setCatMsg] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/products/categories`
        );
        setCategories(res.data.data || res.data);
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Thêm danh mục, không cho trùng tên
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setCatMsg("");
    if (!newCategory.name) {
      setCatMsg("Tên danh mục không được để trống");
      return;
    }
    if (
      categories.some(
        (cat) =>
          cat.name.trim().toLowerCase() ===
          newCategory.name.trim().toLowerCase()
      )
    ) {
      setCatMsg("Tên danh mục đã tồn tại!");
      return;
    }
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/products/categories`,
        { name: newCategory.name }
      );
      setCatMsg("Thêm danh mục thành công!");
      setNewCategory({ name: "" });
      // Reload lại danh mục
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/products/categories`
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
        `${process.env.REACT_APP_API_URL}/api/products/categories/${catId}`
      );
      setCatMsg("Xóa danh mục thành công!");
      // Reload lại danh mục
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/products/categories`
      );
      setCategories(res.data.data || res.data);
    } catch {
      setCatMsg("Xóa danh mục thất bại!");
    }
  };

  return (
    <div className="add-category-wrapper">
      <h2>Quản lý danh mục sản phẩm</h2>
      <div
        className="category-list-panel"
        style={{
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
                setNewCategory((prev) => ({ ...prev, name: e.target.value }))
              }
              style={{ width: "100%", marginBottom: 8, padding: 4 }}
              required
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
  );
};

export default AddCategory;
