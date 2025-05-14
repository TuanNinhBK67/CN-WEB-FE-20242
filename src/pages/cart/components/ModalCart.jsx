import React from "react";

const Modal = ({ children }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                {children}
            </div>
        </div>
    );
};

export default Modal;
