"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import { useOrders } from "../hooks/useOrders";
import { AuthModal } from "../components/AuthModal";
import { CartModal } from "../components/CartModal";
import { OrderDetailModal } from "../components/OrderDetailModal";
import { ProductDetailModal } from "../components/ProductDetailModal";
import { ProductForm } from "../components/ProductForm";
import { ProductEditModal } from "../components/ProductEditModal";
import { ProductList } from "../components/ProductList";
import { Pagination } from "../components/Pagination";
import { Header } from "../components/Header";
import { SearchAndSort } from "../components/SearchAndSort";

export default function ProductManagement() {
  const router = useRouter();

  const {
    isAuthenticated,
    user,
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
    authForm,
    setAuthForm,
    authLoading,
    requireAuth,
    handleLogin,
    handleRegister,
    handleLogout,
  } = useAuth();

  const {
    products,
    form,
    setForm,
    editForm,
    setEditForm,
    name,
    setName,
    sort,
    setSort,
    order,
    setOrder,
    page,
    setPage,
    limit,
    totalPages,
    isDeleting,
    selectedProduct,
    showDetailModal,
    setShowDetailModal,
    showEditModal,
    setShowEditModal,
    fetchProducts,
    handleFileChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleEditClick,
    handleViewDetail,
  } = useProducts({ isAuthenticated, requireAuth, user });

  const {
    cart,
    setCart,
    showCartModal,
    setShowCartModal,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    getCartTotal,
    getCartItemsCount,
  } = useCart({ isAuthenticated, setShowAuthModal });

  const {
    showOrderModal,
    setShowOrderModal,
    orderHistory,
    loadingOrders,
    orderForm,
    setOrderForm,
    fetchOrderHistory,
    fetchOrders,
    handleCancelOrder,
    submitOrder,
  } = useOrders({ isAuthenticated, user, cart, setCart, setShowCartModal });

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <Header
          isAuthenticated={isAuthenticated}
          user={user}
          handleLogout={handleLogout}
          setShowAuthModal={setShowAuthModal}
          setShowCartModal={setShowCartModal}
          getCartItemsCount={getCartItemsCount}
          setShowOrderModal={setShowOrderModal}
          fetchOrderHistory={fetchOrderHistory}
          orderFormEmail={orderForm.email}
        />

        <AuthModal
          showAuthModal={showAuthModal}
          setShowAuthModal={setShowAuthModal}
          authMode={authMode}
          setAuthMode={setAuthMode}
          authForm={authForm}
          setAuthForm={setAuthForm}
          authLoading={authLoading}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
        />

        <CartModal
          showCartModal={showCartModal}
          setShowCartModal={setShowCartModal}
          cart={cart}
          getCartItemsCount={getCartItemsCount}
          updateCartQuantity={updateCartQuantity}
          removeFromCart={removeFromCart}
          getCartTotal={getCartTotal}
          submitOrder={submitOrder}
          orderForm={orderForm}
          setOrderForm={setOrderForm}
        />

        <OrderDetailModal
          showOrderModal={showOrderModal}
          setShowOrderModal={setShowOrderModal}
          orderHistory={orderHistory}
          loadingOrders={loadingOrders}
          handleCancelOrder={handleCancelOrder}
          fetchOrderHistory={fetchOrderHistory}
          user={user}
        />

        <ProductDetailModal
          showDetailModal={showDetailModal}
          setShowDetailModal={setShowDetailModal}
          selectedProduct={selectedProduct}
        />

        <ProductForm
          form={form}
          setForm={setForm}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          isAuthenticated={isAuthenticated}
        />

        <SearchAndSort
          name={name}
          setName={setName}
          sort={sort}
          setSort={setSort}
          order={order}
          setOrder={setOrder}
        />

        <ProductList
          products={products}
          addToCart={addToCart}
          handleViewDetail={handleViewDetail}
          handleEditClick={handleEditClick}
          handleDelete={handleDelete}
          isDeleting={isDeleting}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />

        <ProductEditModal
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          selectedProduct={selectedProduct}
          editForm={editForm}
          setEditForm={setEditForm}
          handleEdit={handleEdit}
        />
      </div>
    </div>
  );
}
