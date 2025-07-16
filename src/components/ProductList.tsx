import React from "react";
import { Product } from "../types";
import { ShoppingCartIcon, EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface ProductListProps {
  products: Product[];
  addToCart: (product: Product) => void;
  handleViewDetail: (product: Product) => void;
  handleEditClick: (product: Product) => void;
  handleDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  addToCart,
  handleViewDetail,
  handleEditClick,
  handleDelete,
  isDeleting,
}) => {
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-blue-500 rounded-full mr-3"></div>
          <h2 className="text-xl font-bold text-white">Danh sách sản phẩm</h2>
        </div>
        <div className="text-sm text-gray-300">
          {products.length} sản phẩm
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-4xl">📦</span>
          </div>
          <p className="text-gray-300 text-lg">Chưa có sản phẩm nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300 group"
            >
              {/* Product Image */}
              {product.image && (
                <div className="mb-4 overflow-hidden rounded-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Product Info */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-2 truncate">
                  {product.name}
                </h3>
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="text-2xl font-bold text-yellow-400 drop-shadow-lg">
                  {new Intl.NumberFormat("vi-VN").format(product.price)} đ
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 mr-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 text-sm font-medium"
                >
                  <ShoppingCartIcon className="h-4 w-4 inline mr-1" />
                  Thêm vào giỏ
                </button>
                <button
                  onClick={() => handleViewDetail(product)}
                  className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-200 border border-green-500/30"
                  title="Xem chi tiết"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleEditClick(product)}
                  className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-200 border border-blue-500/30"
                  title="Chỉnh sửa"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => product._id && handleDelete(product._id)}
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200 border border-red-500/30 disabled:opacity-50"
                  title="Xóa"
                  disabled={isDeleting}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};