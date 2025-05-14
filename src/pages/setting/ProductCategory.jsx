import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../assets/scss/setting/ManageProduct.scss";
import axios from "axios";

const ProductCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError("Không thể tải thông tin sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post(`http://localhost:8080/api/products/${id}/category`, {
        category_id: categoryId,
      });
      setSuccess("Phân loại sản phẩm thành công.");
      setCategoryId("");
    } catch (err) {
      setError("Phân loại sản phẩm thất bại.");
    }
  };

  return (
    <div className="product-management-wrapper">
      <div className="content-container">
        <div className="main-content">
          <h2 className="product-management-title">Phân loại sản phẩm</h2>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          {loading ? (
            <p>Đang tải thông tin sản phẩm...</p>
          ) : product ? (
            <>
              <table className="stock-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên sản phẩm</th>
                    <th>Tồn kho</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.stock}</td>
                  </tr>
                </tbody>
              </table>
              <form onSubmit={handleSubmit} className="add-product-form">
                <table className="form-table">
                  <tbody>
                    <tr>
                      <td>
                        <label htmlFor="category_id">Tên danh mục</label>
                      </td>
                      <td>
                        <input
                          type="text"
                          id="category_id"
                          name="category_id"
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                          required
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button type="submit" className="submit-button">
                  Phân loại
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
            </>
          ) : (
            <p>Không tìm thấy sản phẩm.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCategory;
