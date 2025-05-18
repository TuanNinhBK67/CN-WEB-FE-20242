import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/products/branches`;

const AddBrands = () => {
  const [form, setForm] = useState({ name: "", description: "" });
  const [message, setMessage] = useState("");
  const [brands, setBrands] = useState([]);

  // Lấy danh sách nhãn hàng
  const fetchBrands = async () => {
    try {
      const res = await axios.get(API_URL);
      setBrands(res.data.data || res.data);
    } catch {
      setBrands([]);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await axios.post(API_URL, form);
      setMessage("Thêm nhãn hàng thành công!");
      setForm({ name: "", description: "" });
      fetchBrands();
    } catch (err) {
      setMessage(err.response?.data?.message || "Thêm nhãn hàng thất bại!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa nhãn hàng này?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMessage("Xóa nhãn hàng thành công!");
      fetchBrands();
    } catch {
      setMessage("Xóa nhãn hàng thất bại!");
    }
  };

  return (
    <div
      className="add-brand-wrapper"
      style={{
        display: "flex",
        gap: 40,
        alignItems: "flex-start",
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
          Thêm nhãn hàng (Brand)
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                fontWeight: 600,
                color: "#444",
              }}
            >
              Tên nhãn hàng:
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
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
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                fontWeight: 600,
                color: "#444",
              }}
            >
              Mô tả:
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1.5px solid #e0e0e0",
                fontSize: 15,
                minHeight: 60,
                marginTop: 6,
                outline: "none",
                transition: "border 0.2s",
              }}
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
            Thêm nhãn hàng
          </button>
        </form>
        {message && (
          <p
            style={{
              color: message.includes("thành công") ? "green" : "red",
              marginTop: 16,
              fontWeight: 600,
            }}
          >
            {message}
          </p>
        )}
      </div>
      {/* Bảng danh sách nhãn hàng */}
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
          Danh sách nhãn hàng
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
                  Tên nhãn hàng
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
                  Mô tả
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
              {brands.map((brand, idx) => (
                <tr
                  key={brand.id}
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
                  <td
                    style={{
                      padding: "10px 16px",
                      fontWeight: 600,
                    }}
                  >
                    {brand.id}
                  </td>
                  <td
                    style={{
                      padding: "10px 16px",
                      color: "#2575fc",
                      fontWeight: 700,
                    }}
                  >
                    {brand.name}
                  </td>
                  <td
                    style={{
                      padding: "10px 16px",
                      color: "#444",
                    }}
                  >
                    {brand.description}
                  </td>
                  <td
                    style={{
                      padding: "10px 16px",
                    }}
                  >
                    <button
                      onClick={() => handleDelete(brand.id)}
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
              {brands.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      textAlign: "center",
                      color: "#888",
                      padding: 24,
                    }}
                  >
                    Không có nhãn hàng nào.
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

export default AddBrands;
