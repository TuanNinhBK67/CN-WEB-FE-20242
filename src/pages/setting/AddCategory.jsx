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
    <div
      className="add-category-wrapper"
      style={{
        display: "flex",
        gap: 40,
        alignItems: "flex-start",
        justifyContent: "center",
        marginTop: 40,
      }}
    >
      <div
        style={{
          flex: 1,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 4px 24px #e3e6f3",
          padding: 32,
          minWidth: 320,
          maxWidth: 420,
        }}
      >
        <h2
          style={{
            color: "#2575fc",
            fontWeight: 800,
            marginBottom: 24,
          }}
        >
          Thêm danh mục mới
        </h2>
        <form onSubmit={handleAddCategory}>
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                fontWeight: 600,
                color: "#444",
              }}
            >
              Tên danh mục:
            </label>
            <input
              type="text"
              placeholder="Tên danh mục"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory((prev) => ({ ...prev, name: e.target.value }))
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1.5px solid #e0e0e0",
                fontSize: 16,
                marginTop: 6,
                marginBottom: 8,
                outline: "none",
                transition: "border 0.2s",
              }}
              required
            />
          </div>
          <button
            type="submit"
            style={{
              background: "linear-gradient(90deg, #6a11cb, #2575fc)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 17,
              border: "none",
              borderRadius: 8,
              padding: "10px 28px",
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
            Thêm danh mục
          </button>
        </form>
        {catMsg && (
          <div
            style={{
              color: catMsg.includes("thành công") ? "green" : "red",
              marginTop: 16,
              fontWeight: 600,
            }}
          >
            {catMsg}
          </div>
        )}
      </div>
      <div
        style={{
          flex: 2,
          background: "#f8fafc",
          borderRadius: 14,
          boxShadow: "0 4px 24px #e3e6f3",
          padding: 32,
          minWidth: 400,
          maxWidth: 700,
        }}
      >
        <h2
          style={{
            color: "#6a11cb",
            fontWeight: 800,
            marginBottom: 24,
          }}
        >
          Danh sách danh mục
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              fontSize: 15,
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 12px #e0e0e0",
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
                  Tên danh mục
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
              {categories.map((cat, idx) => (
                <tr
                  key={cat.id}
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
                    {cat.id}
                  </td>
                  <td
                    style={{
                      padding: "10px 16px",
                      color: "#2575fc",
                      fontWeight: 700,
                    }}
                  >
                    {cat.name}
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <button
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
                      }}
                      onClick={() => handleDeleteCategory(cat.id)}
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
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    style={{
                      textAlign: "center",
                      color: "#888",
                      padding: 24,
                    }}
                  >
                    Không có danh mục nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
