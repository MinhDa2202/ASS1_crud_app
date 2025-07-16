import { useState } from "react";
import { CartItem, Product } from "../types";

interface UseCartProps {
  isAuthenticated: boolean;
  setShowAuthModal: (show: boolean) => void;
}

export const useCart = ({ isAuthenticated, setShowAuthModal }: UseCartProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);

  const addToCart = (product: Product) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product._id === product._id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product._id !== productId)
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      if (!item.product || item.product.price == null) return total;
      return total + item.product.price * item.quantity;
    }, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cart,
    setCart,
    showCartModal,
    setShowCartModal,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    getCartTotal,
    getCartItemsCount,
  };
};