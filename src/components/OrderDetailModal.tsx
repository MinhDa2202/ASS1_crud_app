import React from "react";
import { Order } from "../types";
import { CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/24/outline";

interface OrderDetailModalProps {
  showOrderModal: boolean;
  setShowOrderModal: (show: boolean) => void;
  orderHistory: Order[];
  loadingOrders: boolean;
  handleCancelOrder: (orderId: string) => Promise<void>;
  fetchOrderHistory: (email: string) => Promise<void>;
  user: any; // Consider a more specific type if available
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  showOrderModal,
  setShowOrderModal,
  orderHistory,
  loadingOrders,
  handleCancelOrder,
  fetchOrderHistory,
  user,
}) => {
  if (!showOrderModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Lịch sử đơn hàng
            </h3>
            <button
              onClick={() => setShowOrderModal(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {loadingOrders ? (
            <p className="text-center text-gray-500">Đang tải...</p>
          ) : orderHistory.length === 0 ? (
            <p className="text-center text-gray-500">
              Không tìm thấy đơn hàng nào.
            </p>
          ) : (
            <div className="space-y-4">
              {orderHistory.map((order: any) => (
                <div key={order._id} className="border p-4 rounded-lg">
                  <p className="text-gray-800 font-semibold">
                    Ngày đặt: {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Họ tên: {order.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    SĐT: {order.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    Địa chỉ: {order.address}
                  </p>
                  <div className="mt-2 space-y-1">
                    {order.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex justify-between text-sm text-gray-700"
                      >
                        <span>Product: {item.product?.name}</span>
                        <span>
                          {item.quantity} ×{" "}
                          {new Intl.NumberFormat("vi-VN").format(
                            item.product?.price
                          )}{" "}
                          đ
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3">
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="mt-2 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-md"
                    >
                      Hủy đơn
                    </button>
                  </div>

                  <p className="text-right text-purple-600 font-bold mt-2">
                    Tổng:{" "}
                    {new Intl.NumberFormat("vi-VN").format(
                      order.items.reduce(
                        (sum: number, i: any) =>
                          sum +
                          (i?.product?.price != null
                            ? i.quantity * i.product.price
                            : 0),
                        0
                      )
                    )}{" "}
                    đ
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};