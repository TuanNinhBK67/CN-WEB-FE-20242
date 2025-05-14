import React from "react";

const CartItem = ({ item, onRemove, onQuantityChange }) => {
    return (
        <div className="flex justify-between items-center p-4 border-b">
            <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-500">{item.price} VND</p>
            </div>
            <div className="flex items-center">
                <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                        onQuantityChange(item.id, parseInt(e.target.value))
                    }
                    className="w-16 p-1 border rounded mr-4 text-center"
                />
                <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => onRemove(item.id)}
                >
                    Xoá
                </button>
            </div>
        </div>
    );
};

export default CartItem;
