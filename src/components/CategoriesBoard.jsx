import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/scss/categoriesboard.scss";
import { getAllCategories } from "../services/productService";

const SidebarCategories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Lỗi khi lấy danh mục:", err));
  }, []);

  const handleCategoryClick = (categoryId) => {
    // Sửa link đoạn này cho tôi với
    navigate(`/?category_id=${categoryId}`);
  };

  return (
    <div className="sidebar-categories">
      <h3>Danh mục sản phẩm</h3>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>
            <button onClick={() => handleCategoryClick(cat.id)}>
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarCategories;
