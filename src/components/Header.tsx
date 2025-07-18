import React from "react";
import Link from "next/link";
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { User } from "../types";

interface HeaderProps {
  isAuthenticated: boolean;
  user: User | null;
  handleLogout: () => void;
  setShowAuthModal: (show: boolean) => void;
  setShowCartModal: (show: boolean) => void;
  getCartItemsCount: () => number;
  setShowOrderModal: (show: boolean) => void;
  fetchOrderHistory: (email: string) => Promise<void>;
  orderFormEmail: string;
  setShowAddProductModal: (show: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAuthenticated,
  user,
  handleLogout,
  setShowAuthModal,
  setShowCartModal,
  getCartItemsCount,
  setShowOrderModal,
  fetchOrderHistory,
  orderFormEmail,
  setShowAddProductModal,
}) => {
  return (
    <div className="flex justify-between items-center mb-8 pt-4">
      <div className="text-center flex-1">
        <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">
          Quản lý Sản phẩm
        </h1>
        <p className="text-gray-200 text-lg drop-shadow-md">
          Thêm, chỉnh sửa và quản lý danh mục sản phẩm của bạn
        </p>
      </div>

      <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-4 py-2">
        {isAuthenticated ? (
          <>
            <button
              onClick={() => setShowCartModal(true)}
              className="relative p-2 text-white hover:text-purple-300 transition-colors"
              title="Giỏ hàng"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowAddProductModal(true)}
              className="ml-2 text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center"
              title="Thêm sản phẩm mới"
            >
              <span className="mr-1">➕</span> Thêm sản phẩm
            </button>

            <button
              onClick={() => {
                setShowOrderModal(true);
                fetchOrderHistory(orderFormEmail);
              }}
              className="ml-2 text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center"
            >
              <span className="mr-1">🧾</span> Lịch sử
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-white" />
              </div>
              <div className="text-white">
                <div className="text-sm font-semibold">{user?.username}</div>
                <div className="text-xs text-gray-300">{user?.email}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
              title="Đăng xuất"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
          >
            <UserIcon className="h-4 w-4" />
            <span>Đăng nhập</span>
          </button>
        )}
      </div>
    </div>
  );
};