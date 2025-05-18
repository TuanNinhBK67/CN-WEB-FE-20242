import React, { useState, useEffect } from "react";
import { getCart } from "../../../services/cartService";
import axios from "axios";
import { X } from "react-feather";
import orderService from "../../../services/orderService";

const OrderForm = ({ onClose }) => {
    const [cartItems, setCartItems] = useState([]);
    const [shippingMethod, setShippingMethod] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [shippingAddress, setShippingAddress] = useState("");
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await getCart();
                setCartItems(res.data || []);
            } catch (err) {
                console.error("Lỗi khi lấy giỏ hàng:", err);
            }
        };
        fetchCart();
    }, []);

    const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
    );

    const validate = () => {
        const newErrors = {};
        if (!shippingMethod)
            newErrors.shippingMethod = "Vui lòng chọn phương thức giao hàng";
        if (!paymentMethod)
            newErrors.paymentMethod = "Vui lòng chọn phương thức thanh toán";
        if (!shippingAddress)
            newErrors.shippingAddress = "Vui lòng nhập địa chỉ giao hàng";
        if (cartItems.length === 0) newErrors.cart = "Giỏ hàng trống!";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess("");
        const newErrors = validate();
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                // const total = items.reduce((sum, item) => {
                //     const price = parseFloat(item.product?.price || 0); // lấy giá của sản phẩm, nếu không có thì 0
                //     return sum + price * item.quantity;
                // }, 0);

                const orderData = {
                    user_id: cartItems[0].user_id,
                    shipping_method: shippingMethod,
                    payment_method: paymentMethod,
                    shipping_address: shippingAddress,
                    cartItems: cartItems.map((item) => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price: parseFloat(item.product?.price || 0),
                    })),
                };

                console.log(orderData);
                await orderService.createOrder(orderData);

                setSuccess("✅ Đặt hàng thành công!");
                setShippingMethod("");
                setPaymentMethod("");
                setShippingAddress("");
                setCartItems([]);
            } catch (err) {
                console.error(err);
                setErrors({ submit: "❌ Lỗi khi đặt hàng. Vui lòng thử lại." });
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md relative p-6">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-red-500 form-bold hover:text-black bg-white"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl text-black font-bold mb-4 text-center">
                    Đặt hàng
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium text-black">
                            Địa chỉ giao hàng
                        </label>
                        <input
                            type="text"
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 text-black"
                            placeholder="Nhập địa chỉ giao hàng"
                        />
                        {errors.shippingAddress && (
                            <p className="text-red-500 text-sm">
                                {errors.shippingAddress}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block font-medium text-black">
                            Phương thức giao hàng
                        </label>
                        <select
                            value={shippingMethod}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 text-black"
                        >
                            <option value="">-- Chọn --</option>
                            <option value="standard">
                                Giao hàng tiêu chuẩn
                            </option>
                            <option value="express">Giao hàng nhanh</option>
                        </select>
                        {errors.shippingMethod && (
                            <p className="text-red-500 text-sm text-black">
                                {errors.shippingMethod}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block font-medium text-black">
                            Phương thức thanh toán
                        </label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 text-black"
                        >
                            <option value="">-- Chọn --</option>
                            <option value="cod">
                                Thanh toán khi nhận hàng (COD)
                            </option>
                            <option value="banking">
                                Chuyển khoản ngân hàng
                            </option>
                        </select>
                        {errors.paymentMethod && (
                            <p className="text-red-500 text-sm text-black">
                                {errors.paymentMethod}
                            </p>
                        )}
                    </div>

                    <div>
                        <h3 className="font-semibold">Tóm tắt đơn hàng:</h3>
                        {cartItems.length === 0 ? (
                            <p className="text-gray-500">
                                Không có sản phẩm trong giỏ hàng.
                            </p>
                        ) : (
                            <ul className="text-sm space-y-1">
                                {cartItems.map((item, index) => (
                                    <li key={index}>
                                        • {item.product_name} × {item.quantity}{" "}
                                        ={" "}
                                        {(
                                            item.price * item.quantity
                                        ).toLocaleString()}
                                        đ
                                    </li>
                                ))}
                            </ul>
                        )}
                        <p className="font-bold mt-2">
                            Tổng cộng: {totalAmount.toLocaleString()}đ
                        </p>
                        {errors.cart && (
                            <p className="text-red-500 text-sm">
                                {errors.cart}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white form-bold py-2 rounded-md hover:bg-blue-700"
                    >
                        Đặt hàng
                    </button>

                    {errors.submit && (
                        <p className="text-red-500 text-center">
                            {errors.submit}
                        </p>
                    )}
                    {success && (
                        <p className="text-green-600 text-center">{success}</p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default OrderForm;
