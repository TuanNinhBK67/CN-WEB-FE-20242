import React, { useState } from "react";
import { getCart, updateCartItem, deleteCartItem, createOrder } from "../../../services/cartService";

const OrderForm = () => {
    const [shippingMethod, setShippingMethod] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");

    const validate = () => {
        const newErrors = {};
        if (!shippingMethod) newErrors.shippingMethod = "Vui lòng chọn phương thức giao hàng";
        if (!paymentMethod) newErrors.paymentMethod = "Vui lòng chọn phương thức thanh toán";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess("");
        const newErrors = validate();
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                await createOrder(shippingMethod, paymentMethod);
                setSuccess("✅ Đặt hàng thành công!");
                setShippingMethod("");
                setPaymentMethod("");
            } catch (err) {
                setErrors({ submit: "❌ Lỗi khi đặt hàng. Vui lòng thử lại." });
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Đặt đơn hàng</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-gray-700 mb-1">Phương thức giao hàng</label>
                    <select
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        value={shippingMethod}
                        onChange={(e) => setShippingMethod(e.target.value)}
                    >
                        <option value="">-- Chọn --</option>
                        <option value="standard">Giao hàng tiêu chuẩn</option>
                        <option value="express">Giao hàng nhanh</option>
                    </select>
                    {errors.shippingMethod && (
                        <p className="text-red-500 text-sm mt-1">{errors.shippingMethod}</p>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Phương thức thanh toán</label>
                    <select
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <option value="">-- Chọn --</option>
                        <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                        <option value="banking">Chuyển khoản ngân hàng</option>
                    </select>
                    {errors.paymentMethod && (
                        <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Đặt hàng
                </button>

                {errors.submit && <p className="text-red-500 text-center mt-2">{errors.submit}</p>}
                {success && <p className="text-green-600 text-center mt-2">{success}</p>}
            </form>
        </div>
    );
};

export default OrderForm;
