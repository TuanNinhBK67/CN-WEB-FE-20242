import React, { useState } from "react";
import CartItem from "./components/CartItem"; // Component con hiển thị từng sản phẩm
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([
        { id: 1, name: "Áo thun", price: 150000, quantity: 2 },
        { id: 2, name: "Quần jeans", price: 300000, quantity: 1 },
    ]);

    const handleClose = () => {
        navigate(-1); // Quay lại trang trước
    };

    const handleRemove = (id) => {
        setCartItems(cartItems.filter((item) => item.id !== id));
    };

    const handleQuantityChange = (id, quantity) => {
        setCartItems(
            cartItems.map((item) =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const handleCheckout = () => {
        alert("Chuyển sang giao diện thanh toán");
    };

    const handleOrder = () => {
        alert("Đặt hàng thành công!");
    };

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="relative p-6 bg-white shadow-lg rounded-md w-full max-w-2xl mx-auto">
            {/* Nút đóng */}
            <button
                onClick={handleClose}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-2xl font-bold"
                aria-label="Đóng"
            >
                ×
            </button>

            <h2 className="text-2xl font-semibold mb-4">🛒 Giỏ hàng của bạn</h2>

            {/* Danh sách sản phẩm */}
            <div className="mb-6 max-h-64 overflow-y-auto space-y-4">
                {cartItems.length === 0 ? (
                    <p>Chưa có sản phẩm nào trong giỏ.</p>
                ) : (
                    cartItems.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onRemove={handleRemove}
                            onQuantityChange={handleQuantityChange}
                        />
                    ))
                )}
            </div>

            {/* Tổng tiền */}
            <div className="text-right font-semibold text-lg mb-4">
                Tổng: {total.toLocaleString("vi-VN")}₫
            </div>

            {/* Nút chức năng */}
            <div className="flex justify-end space-x-3">
                <button
                    onClick={handleOrder}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Đặt hàng
                </button>
                <button
                    onClick={handleCheckout}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Thanh toán
                </button>
            </div>
        </div>
    );
};

export default Cart;
