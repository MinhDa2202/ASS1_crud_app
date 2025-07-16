import React from "react";

interface SearchAndSortProps {
  name: string;
  setName: (name: string) => void;
  sort: string;
  setSort: (sort: string) => void;
  order: "asc" | "desc";
  setOrder: (order: "asc" | "desc") => void;
}

export const SearchAndSort: React.FC<SearchAndSortProps> = ({
  name,
  setName,
  sort,
  setSort,
  order,
  setOrder,
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8 shadow-xl">
      <div className="flex items-center mb-4">
        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></div>
        <h2 className="text-xl font-bold text-white">Tìm kiếm & Sắp xếp</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <label className="block text-sm font-semibold text-gray-200 mb-2">
            Tìm kiếm theo tên
          </label>
          <input
            type="text"
            placeholder="Nhập tên sản phẩm..."
            className="w-full bg-white/10 border border-white/30 text-white placeholder-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all duration-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">
            Sắp xếp theo
          </label>
          <select
            className="w-full bg-white/10 border border-white/30 text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all duration-200"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="price" className="bg-gray-800">
              Giá
            </option>
            <option value="name" className="bg-gray-800">
              Tên
            </option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">
            Thứ tự
          </label>
          <select
            className="w-full bg-white/10 border border-white/30 text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all duration-200"
            value={order}
            onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
          >
            <option value="asc" className="bg-gray-800">
              Tăng dần
            </option>
            <option value="desc" className="bg-gray-800">
              Giảm dần
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};