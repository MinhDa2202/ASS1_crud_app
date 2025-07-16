import React from "react";
import { Product } from "../types";

interface ProductEditModalProps {
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => void;
  selectedProduct: Product | null;
  editForm: {
    name: string;
    description: string;
    price: string;
  };
  setEditForm: (form: any) => void;
  handleEdit: (e: React.FormEvent) => Promise<void>;
}

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  showEditModal,
  setShowEditModal,
  selectedProduct,
  editForm,
  setEditForm,
  handleEdit,
}) => {
  if (!showEditModal || !selectedProduct) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Chỉnh sửa sản phẩm
            </h3>
            <button
              onClick={() => setShowEditModal(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleEdit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên sản phẩm
              </label>
              <input
                type="text"
                placeholder="Nhập tên sản phẩm"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mô tả sản phẩm
              </label>
              <textarea
                placeholder="Nhập mô tả chi tiết..."
                className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none focus:ring-blue-500 focus:border-blue-500"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Giá (VNĐ)
              </label>
              <input
                type="number"
                placeholder="Nhập giá"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({ ...editForm, price: e.target.value })
                }
                required
                min="0"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};