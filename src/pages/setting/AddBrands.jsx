import React, { useState } from "react";
import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/products/branches`;

const AddBrands = () => {
  const [form, setForm] = useState({ name: "", description: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post(API_URL, form);
      setMessage("Thêm nhãn hàng thành công!");
      setForm({ name: "", description: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Thêm nhãn hàng thất bại!");
    }
  };

  return (
    <div className="add-brand-wrapper">
      <h2>Thêm nhãn hàng (Brand)</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên nhãn hàng:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Mô tả:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Thêm nhãn hàng</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddBrands;
