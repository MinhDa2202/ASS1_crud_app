import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  setPage,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div className="text-gray-300">
          Trang <span className="font-bold text-white">{page}</span> trong tổng
          số <span className="font-bold text-white">{totalPages}</span> trang
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setPage(Math.max(page - 1, 1))}
            disabled={page === 1}
            className="px-6 py-2 bg-white/10 border border-white/30 text-white rounded-xl hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm"
          >
            ← Trước
          </button>
          <button
            onClick={() => setPage(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
            className="px-6 py-2 bg-white/10 border border-white/30 text-white rounded-xl hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm"
          >
            Tiếp →
          </button>
        </div>
      </div>
    </div>
  );
};