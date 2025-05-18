import React, { useEffect, useState } from "react";
import { getAllProducts, updateProduct } from "../../services/productService";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/scss/setting/ManageProduct.scss";

const ManageProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [stockProducts, setStockProducts] = useState([]);

  const productsPerPage = 10;

  const API_URL = `${process.env.REACT_APP_API_URL}/api/products`;

  useEffect(() => {
    const fetchStockProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/stock/check`);
        setStockProducts(res.data);
      } catch (err) {
        setError("Không thể tải danh sách tồn kho sản phẩm.");
      }
    };
    fetchStockProducts();
  }, []);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const currentProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    });
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (productId) => {
    try {
      await updateProduct(productId, formData);
      alert("Cập nhật sản phẩm thành công.");
      window.location.reload(); // Reload để cập nhật danh sách
    } catch (err) {
      alert("Cập nhật sản phẩm thất bại.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("Xóa sản phẩm thành công.");
      setStockProducts(stockProducts.filter((product) => product.id !== id));
    } catch (err) {
      alert("Xóa sản phẩm thất bại.");
    }
  };

  const handleCategory = (id) => {
    navigate(`/setting/product-category/${id}`);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="product-management-wrapper">
      <h2 className="product-management-title">Quản lý sản phẩm</h2>

      {error && <p className="error">{error}</p>}

      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm theo tên..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <button onClick={() => navigate("/addProduct")}>Thêm sản phẩm</button>
      <button onClick={() => navigate("/setting/add-category")}>
        Thêm danh mục
      </button>
      <button onClick={() => navigate("/setting/add-brand")}>
        Thêm nhãn hàng
      </button>

      <table className="stock-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Tồn kho</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {stockProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.stock}</td>
              <td>
                <button onClick={() => handleDelete(product.id)}>Xóa</button>
                {/* <button onClick={() => handleCategory(product.id)}>
                  Phân loại
                </button> */}
                <button
                  onClick={() =>
                    navigate(`/setting/change-product/${product.id}`)
                  }
                >
                  Chỉnh sửa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ManageProduct;
