import React from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import { User } from "../types";

interface AuthModalProps {
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authMode: "login" | "register";
  setAuthMode: (mode: "login" | "register") => void;
  authForm: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  setAuthForm: (form: any) => void;
  authLoading: boolean;
  handleLogin: (e: React.FormEvent) => Promise<void>;
  handleRegister: (e: React.FormEvent) => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  showAuthModal,
  setShowAuthModal,
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  authLoading,
  handleLogin,
  handleRegister,
}) => {
  if (!showAuthModal) return null;

  return (
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
            <>
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
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
                  title="Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số"
                />
                {authMode === "register" && authForm.password && (
                  <div className="mt-2 text-xs text-gray-300">
                    <p
                      className={
                        authForm.password.length >= 6
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      ✓ Ít nhất 6 ký tự
                    </p>
                    <p
                      className={
                        /[A-Z]/.test(authForm.password)
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      ✓ Chứa ít nhất 1 chữ hoa
                    </p>
                    <p
                      className={
                        /[a-z]/.test(authForm.password)
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      ✓ Chứa ít nhất 1 chữ thường
                    </p>
                    <p
                      className={
                        /\d/.test(authForm.password)
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      ✓ Chứa ít nhất 1 số
                    </p>
                  </div>
                )}
              </div>

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
                {authForm.confirmPassword &&
                  authForm.password !== authForm.confirmPassword && (
                    <p className="mt-1 text-xs text-red-400">
                      Mật khẩu xác nhận không khớp
                    </p>
                  )}
              </div>
            </>
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

          {authMode === "login" && (
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
              disabled={
                authLoading ||
                (authMode === "register" &&
                  (authForm.password !== authForm.confirmPassword ||
                    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(
                      authForm.password
                    )))
              }
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
  );
};