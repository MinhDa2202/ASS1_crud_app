import React from "react";
import { Product } from "../types";

interface ProductDetailModalProps {
  showDetailModal: boolean;
  setShowDetailModal: (show: boolean) => void;
  selectedProduct: Product | null;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  showDetailModal,
  setShowDetailModal,
  selectedProduct,
}) => {
  if (!showDetailModal || !selectedProduct) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Chi tiết sản phẩm
            </h3>
            <button
              onClick={() => setShowDetailModal(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {selectedProduct.image && (
              <div className="flex justify-center">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="h-56 w-full object-cover rounded-xl border border-gray-200"
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Tên sản phẩm
                </h4>
                <p className="text-xl font-semibold text-gray-900">
                  {selectedProduct.name}
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Mô tả
                </h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedProduct.description}
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Giá bán
                </h4>
                <p className="text-2xl font-bold text-purple-600">
                  {new Intl.NumberFormat("vi-VN").format(
                    selectedProduct.price
                  )}{" "}
                  đ
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};