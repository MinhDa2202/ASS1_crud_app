import { useState } from "react";
import { Order, CartItem } from "../types";

interface UseOrdersProps {
  isAuthenticated: boolean;
  user: any; // Consider a more specific type if available
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  setShowCartModal: (show: boolean) => void;
}

export const useOrders = ({ isAuthenticated, user, cart, setCart, setShowCartModal }: UseOrdersProps) => {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
  });

  const fetchOrderHistory = async (email: string) => {
    try {
      setLoadingOrders(true);
      const res = await fetch(`/api/orders?email=${email}`);
      const data = await res.json();
      setOrderHistory(data);
    } catch (err) {
      console.error("Lỗi khi tải lịch sử đơn hàng", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();

      if (Array.isArray(data)) {
        setOrderHistory(data);
      } else {
        console.warn("⚠️ API không trả về mảng:", data);
        setOrderHistory([]);
      }
    } catch (err) {
      console.error("Lỗi khi fetch đơn hàng:", err);
      setOrderHistory([]);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOrderHistory((prev: any[]) => prev.filter((o) => o._id !== orderId));
      } else {
        alert("Hủy đơn hàng thất bại.");
      }
    } catch (err) {
      console.error("Lỗi khi hủy đơn hàng:", err);
    }
  };

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault();

    const orderData = {
      name: orderForm.name,
      phone: orderForm.phone,
      email: orderForm.email,
      address: orderForm.address,
      items: cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
    };
    console.log("Sending order data:", orderData);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("API Error:", res.status, errText);
        throw new Error("Failed to place order");
      }

      const data = await res.json();
      alert("Đặt hàng thành công!");
      setCart([]); // clear cart
      setShowCartModal(false); // close modal
    } catch (error) {
      console.error(error);
      alert("Đặt hàng thất bại!");
    }
  }
  const updateOrderStatus = async (
    orderId: string,
    status: Order["status"]
  ) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error("Update order status error:", error);
    }
  };

  return {
    showOrderModal,
    setShowOrderModal,
    orderHistory,
    setOrderHistory,
    loadingOrders,
    orderForm,
    setOrderForm,
    fetchOrderHistory,
    fetchOrders,
    handleCancelOrder,
    submitOrder,
    updateOrderStatus,
  };
};