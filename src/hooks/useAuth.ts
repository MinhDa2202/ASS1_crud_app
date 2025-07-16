"use client";

import { useState, useEffect } from "react";
import { User } from "../types";

export const useAuth = () => {
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

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData && userData !== "undefined") {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser && typeof parsedUser === "object") {
          setIsAuthenticated(true);
          setUser(parsedUser);
          return;
        }
      } catch (e) {
        console.error("❌ Lỗi khi parse userData:", e);
      }
    }

    setIsAuthenticated(false);
    setUser(null);
  };

  const requireAuth = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return false;
    }
    return true;
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
    }
  };

  return {
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
  };
};