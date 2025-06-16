"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  TrashIcon,
  PencilIcon,
  EyeIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

interface User {
  id: string;
  username: string;
  email: string;
}

export default function ProductManagement() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: null as File | null,
  });
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [name, setName] = useState("");
  const [sort, setSort] = useState("price");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, name, sort, order]);

  const requireAuth = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return false;
    }
    return true;
  };

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser && typeof parsedUser === "object") {
          setIsAuthenticated(true);
          setUser(parsedUser);
          return;
        }
      } catch (e) {
        console.error("Lỗi khi parse userData:", e);
      }
    }
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: authForm.username,
          password: authForm.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Đăng nhập thất bại!");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      setAuthForm({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      alert(error.message || "Đăng nhập thất bại!");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authForm.password !== authForm.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (!authForm.email.includes("@")) {
      alert("Vui lòng nhập email hợp lệ!");
      return;
    }

    setAuthLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: authForm.username,
          email: authForm.email,
          password: authForm.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Đăng ký thất bại!");
      }

      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      setAuthMode("login");
      setAuthForm({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      alert(error.message || "Đăng ký thất bại!");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setUser(null);
      setProducts([]);
    }
  };

  const fetchProducts = async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      name,
      sort,
      order,
    });

    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();

      if (res.ok) {
        setProducts(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Fetch products error:", error);
      setProducts([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm({ ...form, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth()) return;

    let imageUrl = "";

    if (form.image) {
      const cloudForm = new FormData();
      cloudForm.append("file", form.image);
      cloudForm.append("upload_preset", "Upload-image");
      const cloudRes = await fetch(
        "https://api.cloudinary.com/v1_1/dopjrba7o/image/upload",
        {
          method: "POST",
          body: cloudForm,
        }
      );

      const cloudData = await cloudRes.json();

      if (cloudRes.ok) {
        imageUrl = cloudData.secure_url;
      } else {
        console.error("Upload error", cloudData);
        alert("Upload ảnh thất bại!");
        return;
      }
    }

    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: form.price,
        image: imageUrl,
      }),
    });

    if (res.ok) {
      setForm({ name: "", description: "", price: "", image: null });
      fetchProducts();
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth()) return;
    if (!selectedProduct?._id) return;

    const res = await fetch(`/api/products/${selectedProduct._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editForm.name,
        description: editForm.description,
        price: Number(editForm.price),
      }),
    });

    if (res.ok) {
      setShowEditModal(false);
      setEditForm({ name: "", description: "", price: "" });
      setSelectedProduct(null);
      fetchProducts();
    }
  };

  const handleDelete = async (id: string) => {
    if (!requireAuth()) return;

    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      setIsDeleting(true);
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          fetchProducts();
        }
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEditClick = (product: Product) => {
    if (!requireAuth()) return;

    setSelectedProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
    });
    setShowEditModal(true);
  };

  function handleViewDetail(product: Product): void {
    setSelectedProduct(product);
    setShowDetailModal(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {/* Header với thông tin user và logout */}
        <div className="flex justify-between items-center mb-8 pt-4">
          <div className="text-center flex-1">
            <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">
              Quản lý Sản phẩm
            </h1>
            <p className="text-gray-200 text-lg drop-shadow-md">
              Thêm, chỉnh sửa và quản lý danh mục sản phẩm của bạn
            </p>
          </div>

          {/* User info và logout button hoặc login button */}
          <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-4 py-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-white">
                    <div className="text-sm font-semibold">
                      {user?.username}
                    </div>
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

        {/* Modal đăng nhập/đăng ký */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {authMode === "login" ? "Đăng Nhập" : "Đăng Ký"}
                </h1>
                <p className="text-gray-300">
                  {authMode === "login"
                    ? "Đăng nhập để tiếp tục"
                    : "Tạo tài khoản mới"}
                </p>
              </div>

              <form
                onSubmit={authMode === "login" ? handleLogin : handleRegister}
                className="space-y-4"
              >
                {authMode === "register" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Nhập email"
                      className="w-full bg-white/10 border border-white/30 text-white placeholder-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 backdrop-blur-sm transition-all duration-200"
                      value={authForm.email}
                      onChange={(e) =>
                        setAuthForm({ ...authForm, email: e.target.value })
                      }
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    className="w-full bg-white/10 border border-white/30 text-white placeholder-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 backdrop-blur-sm transition-all duration-200"
                    value={authForm.username}
                    onChange={(e) =>
                      setAuthForm({ ...authForm, username: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    className="w-full bg-white/10 border border-white/30 text-white placeholder-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 backdrop-blur-sm transition-all duration-200"
                    value={authForm.password}
                    onChange={(e) =>
                      setAuthForm({ ...authForm, password: e.target.value })
                    }
                    required
                  />
                </div>

                {authMode === "register" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      Xác nhận mật khẩu
                    </label>
                    <input
                      type="password"
                      placeholder="Nhập lại mật khẩu"
                      className="w-full bg-white/10 border border-white/30 text-white placeholder-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 backdrop-blur-sm transition-all duration-200"
                      value={authForm.confirmPassword}
                      onChange={(e) =>
                        setAuthForm({
                          ...authForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl transition-all duration-200 font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl transition-all duration-200 font-semibold disabled:opacity-50"
                  >
                    {authLoading
                      ? "Đang xử lý..."
                      : authMode === "login"
                      ? "Đăng Nhập"
                      : "Đăng Ký"}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setAuthMode(authMode === "login" ? "register" : "login");
                    setAuthForm({
                      username: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                    });
                  }}
                  className="text-purple-300 hover:text-purple-200 transition-colors"
                >
                  {authMode === "login"
                    ? "Chưa có tài khoản? Đăng ký ngay"
                    : "Đã có tài khoản? Đăng nhập"}
                </button>
              </div>
            </div>
          </div>
        )}

        {isAuthenticated && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8 shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full mr-4"></div>
              <h2 className="text-2xl font-bold text-white">
                Thêm sản phẩm mới
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập tên sản phẩm"
                    className="w-full bg-white/10 border border-white/30 text-white placeholder-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 backdrop-blur-sm transition-all duration-200"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Giá (VNĐ)
                  </label>
                  <input
                    type="number"
                    placeholder="Nhập giá"
                    className="w-full bg-white/10 border border-white/30 text-white placeholder-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 backdrop-blur-sm transition-all duration-200"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    required
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Mô tả sản phẩm
                </label>
                <textarea
                  placeholder="Nhập mô tả chi tiết..."
                  className="w-full bg-white/10 border border-white/30 text-white placeholder-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 backdrop-blur-sm transition-all duration-200 h-24 resize-none"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Ảnh sản phẩm
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full bg-white/10 border border-white/30 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 backdrop-blur-sm transition-all duration-200"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl shadow-lg transition-all duration-200 font-semibold text-lg"
              >
                ✨ Thêm sản phẩm mới
              </button>
            </form>
          </div>
        )}

        {/* Modal xem chi tiết sản phẩm */}
        {showDetailModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Chi tiết sản phẩm
                  </h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {selectedProduct.image && (
                    <div className="flex justify-center">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="h-56 w-full object-cover rounded-xl border border-gray-200"
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Tên sản phẩm
                      </h4>
                      <p className="text-xl font-semibold text-gray-900">
                        {selectedProduct.name}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl">
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Mô tả
                      </h4>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {selectedProduct.description}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Giá bán
                      </h4>
                      <p className="text-2xl font-bold text-purple-600">
                        {new Intl.NumberFormat("vi-VN").format(
                          selectedProduct.price
                        )}{" "}
                        đ
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bộ lọc và sắp xếp */}
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

        {/* Danh sách sản phẩm - Card Layout */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-blue-500 rounded-full mr-3"></div>
              <h2 className="text-xl font-bold text-white">
                Danh sách sản phẩm
              </h2>
            </div>
            <div className="text-sm text-gray-300">
              {products.length} sản phẩm
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-4xl">📦</span>
              </div>
              <p className="text-gray-300 text-lg">Chưa có sản phẩm nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300 group"
                >
                  {/* Product Image */}
                  {product.image && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white mb-2 truncate">
                      {product.name}
                    </h3>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="text-2xl font-bold text-yellow-400 drop-shadow-lg">
                      {new Intl.NumberFormat("vi-VN").format(product.price)} đ
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleViewDetail(product)}
                      className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-200 border border-green-500/30"
                      title="Xem chi tiết"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEditClick(product)}
                      className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-200 border border-blue-500/30"
                      title="Chỉnh sửa"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => product._id && handleDelete(product._id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200 border border-red-500/30 disabled:opacity-50"
                      title="Xóa"
                      disabled={isDeleting}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="mt-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="text-gray-300">
                Trang <span className="font-bold text-white">{page}</span> trong
                tổng số{" "}
                <span className="font-bold text-white">{totalPages}</span> trang
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-6 py-2 bg-white/10 border border-white/30 text-white rounded-xl hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm"
                >
                  ← Trước
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-6 py-2 bg-white/10 border border-white/30 text-white rounded-xl hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm"
                >
                  Tiếp →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}