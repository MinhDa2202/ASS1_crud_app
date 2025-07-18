import React from "react";
import { Product } from "../types";

interface ProductFormProps {
  form: {
    name: string;
    description: string;
    price: string;
    image: File | null;
  };
  setForm: (form: any) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isAuthenticated: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  form,
  setForm,
  handleFileChange,
  handleSubmit,
  isAuthenticated,
}) => {
  if (!isAuthenticated) return null;

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full mr-4"></div>
        <h2 className="text-2xl font-bold text-gray-800">Thêm sản phẩm mới</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên sản phẩm
            </label>
            <input
              type="text"
              placeholder="Nhập tên sản phẩm"
              className="w-full border border-gray-300 text-gray-900 placeholder-gray-400 p-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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
              className="w-full border border-gray-300 text-gray-900 placeholder-gray-400 p-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mô tả sản phẩm
          </label>
          <textarea
            placeholder="Nhập mô tả chi tiết..."
            className="w-full border border-gray-300 text-gray-900 placeholder-gray-400 p-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 h-24 resize-none"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ảnh sản phẩm
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              className="w-full border border-gray-300 text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 p-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg shadow-lg transition-all duration-200 font-semibold text-lg"
        >
          ✨ Thêm sản phẩm mới
        </button>
      </form>
    </div>
  );
};