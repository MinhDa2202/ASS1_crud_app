import React from "react";
import { ShoppingCartIcon, PlusIcon, MinusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CartItem, Product } from "../types";

interface CartModalProps {
  showCartModal: boolean;
  setShowCartModal: (show: boolean) => void;
  cart: CartItem[];
  getCartItemsCount: () => number;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  getCartTotal: () => number;
  submitOrder: (e: React.FormEvent) => Promise<void>;
  orderForm: {
    name: string;
    phone: string;
    address: string;
    email: string;
  };
  setOrderForm: (form: any) => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  showCartModal,
  setShowCartModal,
  cart,
  getCartItemsCount,
  updateCartQuantity,
  removeFromCart,
  getCartTotal,
  submitOrder,
  orderForm,
  setOrderForm,
}) => {
  if (!showCartModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <ShoppingCartIcon className="h-6 w-6 mr-2" />
              Giỏ hàng ({getCartItemsCount()} sản phẩm)
            </h3>
            <button
              onClick={() => setShowCartModal(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCartIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Giỏ hàng trống</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    {item.product.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-16 w-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.product.name}</h4>
                      <p className="text-gray-600">
                        {new Intl.NumberFormat("vi-VN").format(
                          item.product.price
                        )}{" "}
                        đ
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          updateCartQuantity(item.product._id!, item.quantity - 1)
                        }
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="px-3 py-1 bg-gray-100 rounded">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateCartQuantity(item.product._id!, item.quantity + 1)
                        }
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product._id!)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded ml-2"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-purple-600">
                    {new Intl.NumberFormat("vi-VN").format(getCartTotal())} đ
                  </span>
                </div>
              </div>

              <form onSubmit={submitOrder} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Họ tên"
                    className="p-3 border rounded-lg"
                    value={orderForm.name}
                    onChange={(e) =>
                      setOrderForm({ ...orderForm, name: e.target.value })
                    }
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Số điện thoại"
                    className="p-3 border rounded-lg"
                    value={orderForm.phone}
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,
                        phone: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border rounded-lg"
                  value={orderForm.email}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, email: e.target.value })
                  }
                  required
                />
                <textarea
                  placeholder="Địa chỉ giao hàng"
                  className="w-full p-3 border rounded-lg h-20 resize-none"
                  value={orderForm.address}
                  onChange={(e) =>
                    setOrderForm({
                      ...orderForm,
                      address: e.target.value,
                    })
                  }
                  required
                />
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCartModal(false)}
                    className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
                  >
                    Đặt hàng
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};