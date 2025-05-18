import { FaTimes } from "react-icons/fa";

const CartPopup = ({
    items,
    onClose,
    onRemove,
    onQuantityChange,
    onCheckout,
    onOrder,
}) => {
    const total = items.reduce((sum, item) => {
        const price = parseFloat(item.product?.price || 0);
        return sum + price * item.quantity;
    }, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
            <div className="bg-gradient-to-r from-purple-600 via-blue-500 to-blue-400 rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-red-600 text-2xl hover:text-red-800"
                >
                    <FaTimes />
                </button>

                <h2 className="text-xl font-bold mb-4">🛒 Giỏ hàng của bạn</h2>

                <div className="max-h-64 overflow-y-auto mb-4 space-y-3">
                    {items.length === 0 ? (
                        <p>Chưa có sản phẩm nào.</p>
                    ) : (
                        items.map((item) => {
                            const product = item.product || {};
                            const price = parseFloat(product.price || 0);

                            return (
                                <div
                                    key={item.product_id}
                                    className="flex justify-between items-center border-b pb-2"
                                >
                                    <div>
                                        <p className="font-semibold">
                                            {product.name}
                                        </p>
                                        <p>Giá: {price.toLocaleString()}₫</p>
                                        <div className="flex items-center">
                                            <span className="mr-2">
                                                Số lượng:
                                            </span>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    onQuantityChange(
                                                        item.product_id,
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="w-16 px-2 py-1 border rounded text-black"
                                            />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p>
                                            {(
                                                price * item.quantity
                                            ).toLocaleString()}
                                            ₫
                                        </p>
                                        <button
                                            onClick={() =>
                                                onRemove(item.product_id)
                                            }
                                            className="text-red-500 hover:underline text-sm font-bold"
                                        >
                                            Xoá
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="text-right font-medium text-lg mb-4">
                    Tổng cộng: {total.toLocaleString()}₫
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onOrder}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Đặt hàng
                    </button>
                    <button
                        onClick={onCheckout}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Thanh toán
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPopup;
