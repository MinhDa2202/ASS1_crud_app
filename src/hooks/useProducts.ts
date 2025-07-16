import { useState, useEffect } from "react";
import { Product } from "../types";

interface UseProductsProps {
  isAuthenticated: boolean;
  requireAuth: () => boolean;
  user: any; // Consider a more specific type if available
}

export const useProducts = ({ isAuthenticated, requireAuth, user }: UseProductsProps) => {
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

  useEffect(() => {
    fetchProducts();
  }, [page, name, sort, order]);

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

  return {
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
  };
};