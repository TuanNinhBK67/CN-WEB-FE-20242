import React, { useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SettingBoard from "../../components/SettingBoard";
import "../../assets/scss/setting/ManageProduct.scss";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/products", formData);
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
      <div className="product-management-wrapper">
        <div className="content-container">
          <SettingBoard />
          <div className="main-content">
            <h2 className="product-management-title">Thêm sản phẩm mới</h2>

            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

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
                      <label htmlFor="category_id">ID danh mục</label>
                    </td>
                    <td>
                      <input
                        type="number"
                        id="category_id"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="branch_id">ID chi nhánh</label>
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
                </tbody>
              </table>
              <button type="submit" className="submit-button">
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
