import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminOrders from "@/components/AdminOrders";
import BulkImport from "@/components/BulkImport";
import AdminLogin from "@/components/AdminLogin";
import CategoryManager from "@/components/CategoryManager";
import AdditionalCategories from "@/components/AdditionalCategories";
import SecuritySettings from "@/components/SecuritySettings";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  type Product,
  type ProductInsert,
} from "@/lib/products";
import { fetchCategories } from "@/lib/categories";
import { hasSalePrice } from "@/lib/pricing";
import { EU_SIZES } from "@/lib/sizes";
import { isAdminLoggedIn, adminLogout, getAdminUsername } from "@/lib/adminAuth";
import { useAdminSessionTimeout } from "@/hooks/useAdminSessionTimeout";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Upload, X, Package, ChevronDown, Settings, LogOut } from "lucide-react";

import type { ProductColor } from "@/lib/colors";
import { PRESET_COLORS, parseProductColors } from "@/lib/colors";

type FormState = Omit<ProductInsert, "id" | "colors" | "additional_images" | "sizes"> & {
  additional_images: string[];
  sizes: string[];
  colors: ProductColor[];
  extra_categories: string[];
};

const emptyForm: FormState = {
  name: "",
  price: 0,
  category: "",
  image_url: "",
  description: "",
  is_featured: false,
  is_on_sale: false,
  sale_price: null,
  additional_images: [],
  sizes: [],
  colors: [],
  extra_categories: [],
};

const Admin = () => {
  const queryClient = useQueryClient();
  const [authed, setAuthed] = useState<boolean>(() => isAdminLoggedIn());
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [uploadingExtra, setUploadingExtra] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const extraFileInputRef = useRef<HTMLInputElement>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    enabled: authed,
  });
  const categoryNames = categories.map((c) => c.name);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products", filterCategory],
    queryFn: () => fetchProducts(filterCategory),
    enabled: authed,
  });

  // Default form category to first available category
  useEffect(() => {
    if (!form.category && categoryNames.length > 0) {
      setForm((f) => ({ ...f, category: categoryNames[0] }));
    }
  }, [categoryNames, form.category]);

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product created!");
      resetForm();
    },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductInsert> }) =>
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product updated!");
      resetForm();
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product deleted!");
    },
    onError: (e) => toast.error(e.message),
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setShowCustomCategory(false);
    setCustomCategory("");
  };

  const handleEdit = (product: Product) => {
    const isCustom = categoryNames.length > 0 && !categoryNames.includes(product.category);
    setForm({
      name: product.name,
      price: product.price,
      category: isCustom ? "__custom__" : product.category,
      image_url: product.image_url || "",
      description: product.description || "",
      is_featured: product.is_featured || false,
      is_on_sale: (product as any).is_on_sale || false,
      sale_price: product.sale_price ?? null,
      additional_images: (product as any).additional_images || [],
      sizes: ((product as any).sizes as string[] | null) || [],
      colors: parseProductColors((product as any).colors),
      extra_categories: ((product as any).extra_categories as string[] | null) || [],
    });
    if (isCustom) {
      setShowCustomCategory(true);
      setCustomCategory(product.category);
    }
    setEditingId(product.id);
    setShowForm(true);
  };

  const toggleSize = (size: string) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter((s) => s !== size)
        : [...f.sizes, size].sort((a, b) => Number(a) - Number(b)),
    }));
  };

  const handleLogout = () => {
    adminLogout();
    setAuthed(false);
  };

  // Auto-logout after 30 min of inactivity (mirrors server-side session policy)
  useAdminSessionTimeout(handleLogout);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { additional_images, sizes, colors, extra_categories, ...rest } = form;
    const finalCategory = rest.category === "__custom__" ? customCategory.trim() : rest.category;
    if (rest.is_on_sale && rest.sale_price != null && rest.sale_price >= rest.price) {
      toast.error("Sale price must be lower than the regular price");
      return;
    }
    if (!rest.name?.trim()) {
      toast.error("Please enter a product name");
      return;
    }
    if (!finalCategory) {
      toast.error("Please choose a category");
      return;
    }
    // Fall back to the first color photo when no main photo was uploaded.
    const firstColorImage = colors.find((c) => c.images?.length)?.images[0] ?? null;
    const submitData: any = {
      ...rest,
      image_url: rest.image_url?.trim() ? rest.image_url : firstColorImage,
      description: rest.description ?? "",
      sale_price: rest.is_on_sale ? rest.sale_price ?? null : null,
      category: finalCategory,
      additional_images: additional_images.filter(Boolean),
      sizes,
      extra_categories: extra_categories.filter((c) => c && c !== finalCategory),
      colors: colors.map((c) => ({ ...c, name: c.name?.trim() || "Color", images: (c.images || []).filter(Boolean) })) as any,
    };

    // Persist new inline category to the categories table so it shows up next time
    if (rest.category === "__custom__" && finalCategory && !categoryNames.includes(finalCategory)) {
      try {
        const { createCategory } = await import("@/lib/categories");
        await createCategory(finalCategory);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      } catch {
        /* ignore — duplicate or other; product still saves */
      }
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: submitData });
    } else {
      createMutation.mutate(submitData as any);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      setForm({ ...form, image_url: url });
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleExtraImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingExtra(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadProductImage(file);
        urls.push(url);
      }
      setForm({ ...form, additional_images: [...form.additional_images, ...urls] });
      toast.success(`${urls.length} image${urls.length > 1 ? "s" : ""} uploaded!`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploadingExtra(false);
      if (extraFileInputRef.current) extraFileInputRef.current.value = "";
    }
  };

  const removeExtraImage = (index: number) => {
    setForm({
      ...form,
      additional_images: form.additional_images.filter((_, i) => i !== index),
    });
  };

  // ── Color variant helpers ──
  const addColor = (preset?: { name: string; hex: string }) => {
    setForm((f) => ({
      ...f,
      colors: [...f.colors, { name: preset?.name || "", hex: preset?.hex || "#C9A96E", images: [], sizes: [] }],
    }));
  };
  const removeColor = (idx: number) => {
    setForm((f) => ({ ...f, colors: f.colors.filter((_, i) => i !== idx) }));
  };
  const updateColor = (idx: number, patch: Partial<ProductColor>) => {
    setForm((f) => ({
      ...f,
      colors: f.colors.map((c, i) => (i === idx ? { ...c, ...patch } : c)),
    }));
  };
  const toggleColorSize = (idx: number, size: string) => {
    setForm((f) => ({
      ...f,
      colors: f.colors.map((c, i) =>
        i === idx
          ? {
              ...c,
              sizes: c.sizes.includes(size)
                ? c.sizes.filter((s) => s !== size)
                : [...c.sizes, size].sort((a, b) => Number(a) - Number(b)),
            }
          : c
      ),
    }));
  };
  const uploadColorImages = async (idx: number, files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await uploadProductImage(file));
      }
      setForm((f) => ({
        ...f,
        colors: f.colors.map((c, i) =>
          i === idx ? { ...c, images: [...c.images, ...urls] } : c
        ),
      }));
      toast.success(`${urls.length} image${urls.length > 1 ? "s" : ""} added`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };
  const removeColorImage = (idx: number, imgIdx: number) => {
    setForm((f) => ({
      ...f,
      colors: f.colors.map((c, i) =>
        i === idx ? { ...c, images: c.images.filter((_, j) => j !== imgIdx) } : c
      ),
    }));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

        /* ── Base ── */
        .ad-root {
          min-height: 100vh;
          background: #FAF7F2;
          font-family: 'Jost', sans-serif;
        }

        /* ── Noise overlay helper ── */
        .ad-noise::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
        }

        .ad-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: #FAF7F2;
          border-bottom: 1px solid rgba(201,169,110,0.2);
          position: relative;
          overflow: hidden;
        }
        .ad-header-inner {
          position: relative;
          z-index: 1;
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 3rem;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        @media (max-width: 767px) {
          .ad-header-inner {
            padding: 0.9rem 1rem;
            height: auto;
            min-height: 64px;
            flex-wrap: wrap;
            gap: 0.6rem 1rem;
          }
          .ad-header-title { font-size: 1.15rem; }
          .ad-header-actions { gap: 0.9rem !important; flex-wrap: wrap; justify-content: flex-end; }
          .ad-hide-mobile { display: none !important; }
        }

        .ad-header-brand {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .ad-header-diamond {
          width: 7px; height: 7px;
          background: #C9A96E;
          transform: rotate(45deg);
          opacity: 0.8;
        }
        .ad-header-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 300;
          color: #0D0D0D;
        }
        .ad-header-title em {
          font-style: italic;
          color: #C9A96E;
        }

        .ad-back-link {
          font-family: 'Jost', sans-serif;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #8B8075;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          transition: color 0.3s ease;
        }
        .ad-back-link:hover { color: #3A3530; }
        .ad-back-link::before {
          content: '';
          display: block;
          width: 16px; height: 1px;
          background: currentColor;
        }

        .ad-body {
          max-width: 1300px;
          margin: 0 auto;
          padding: 4rem 3rem 8rem;
        }
        @media (max-width: 767px) { .ad-body { padding: 3rem 1.5rem 6rem; } }

        .ad-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.9rem;
          margin-bottom: 1rem;
        }
        .ad-eyebrow-dash { width: 28px; height: 1px; background: #C9A96E; }
        .ad-eyebrow-text {
          font-family: 'Jost', sans-serif;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #8B8075;
        }

        .ad-topbar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }
        .ad-topbar h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 4vw, 3.8rem);
          font-weight: 300;
          line-height: 0.95;
          color: #0D0D0D;
        }
        .ad-topbar h2 em { font-style: italic; color: #C9A96E; }
        .ad-count {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          color: #8B8075;
          margin-top: 0.5rem;
        }

        .ad-add-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.9rem 2rem;
          border: 1px solid rgba(201,169,110,0.5);
          background: transparent;
          color: #3A3530;
          font-family: 'Jost', sans-serif;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          cursor: pointer;
          overflow: hidden;
          transition: color 0.35s ease, border-color 0.35s ease;
          white-space: nowrap;
        }
        .ad-add-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #C9A96E;
          transform: translateX(-100%);
          transition: transform 0.35s ease;
        }
        .ad-add-btn:hover::before { transform: translateX(0); }
        .ad-add-btn:hover { color: #0D0D0D; border-color: #C9A96E; }
        .ad-add-btn span, .ad-add-btn svg { position: relative; z-index: 1; }

        .ad-filters {
          display: flex;
          align-items: center;
          gap: 2rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
          margin-bottom: 3rem;
          border-bottom: 1px solid rgba(201,169,110,0.15);
        }
        .ad-filter-btn {
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem;
          font-weight: 400;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #8B8075;
          background: none;
          border: none;
          border-bottom: 1px solid transparent;
          padding-bottom: 2px;
          cursor: pointer;
          white-space: nowrap;
          transition: color 0.3s ease, border-color 0.3s ease;
          margin-bottom: -1px;
        }
        .ad-filter-btn:hover { color: #3A3530; }
        .ad-filter-btn.active { color: #3A3530; border-bottom-color: #C9A96E; font-weight: 500; }
        .ad-filter-sep {
          width: 3px; height: 3px;
          background: rgba(201,169,110,0.35);
          transform: rotate(45deg);
          flex-shrink: 0;
        }

        .ad-table-wrap { overflow-x: auto; }
        .ad-table {
          width: 100%;
          border-collapse: collapse;
        }
        .ad-table thead tr {
          border-bottom: 1px solid rgba(201,169,110,0.2);
        }
        .ad-table th {
          font-family: 'Jost', sans-serif;
          font-size: 0.55rem;
          font-weight: 300;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #8B8075;
          text-align: left;
          padding: 1rem 1.2rem;
        }
        .ad-table th:last-child { text-align: right; }

        .ad-table tbody tr {
          border-bottom: 1px solid rgba(201,169,110,0.1);
          transition: background 0.25s ease;
        }
        .ad-table tbody tr:hover { background: rgba(201,169,110,0.04); }

        .ad-table td {
          padding: 1.2rem;
          vertical-align: middle;
        }

        .ad-table-img {
          width: 52px; height: 52px;
          object-fit: cover;
          display: block;
        }
        .ad-table-img-placeholder {
          width: 52px; height: 52px;
          background: #F0EBE3;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(201,169,110,0.4);
        }

        .ad-table-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 300;
          color: #0D0D0D;
        }

        .ad-table-badge {
          font-family: 'Jost', sans-serif;
          font-size: 0.55rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8B8075;
          border: 1px solid rgba(201,169,110,0.3);
          padding: 0.25rem 0.6rem;
          white-space: nowrap;
        }

        .ad-sale-badge {
          font-family: 'Jost', sans-serif;
          font-size: 0.5rem;
          font-weight: 400;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #FAF7F2;
          background: #9B3A3A;
          padding: 0.2rem 0.5rem;
          margin-left: 0.5rem;
        }

        .ad-table-price {
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          font-weight: 300;
          letter-spacing: 0.1em;
          color: #C9A96E;
        }

        .ad-action-btns {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
        }
        .ad-action-btn {
          width: 32px; height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid transparent;
          background: none;
          cursor: pointer;
          color: #8B8075;
          transition: color 0.25s ease, border-color 0.25s ease;
        }
        .ad-action-btn:hover { color: #3A3530; border-color: rgba(201,169,110,0.3); }
        .ad-action-btn.danger:hover { color: #9B3A3A; border-color: rgba(155,58,58,0.3); }

        .ad-empty {
          text-align: center;
          padding: 6rem 0;
          border: 1px dashed rgba(201,169,110,0.25);
        }
        .ad-empty svg { color: rgba(201,169,110,0.3); margin: 0 auto 1.5rem; display: block; }
        .ad-empty h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 300;
          font-style: italic;
          color: #8B8075;
          margin-bottom: 0.5rem;
        }
        .ad-empty p {
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          font-weight: 200;
          letter-spacing: 0.1em;
          color: #8B8075;
        }
        .ad-loading {
          text-align: center;
          padding: 6rem 0;
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #8B8075;
        }

        .ad-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(10, 8, 6, 0.55);
          backdrop-filter: blur(4px);
          padding: 1rem;
        }
        .ad-modal {
          background: #FAF7F2;
          width: 100%;
          max-width: 520px;
          max-height: 90vh;
          overflow-y: auto;
          border: 1px solid rgba(201,169,110,0.25);
          padding: 3rem;
          position: relative;
        }
        @media (max-width: 600px) { .ad-modal { padding: 2rem 1.5rem; } }

        .ad-modal-corner {
          position: absolute;
          width: 24px; height: 24px;
        }
        .ad-modal-corner-tl { top: -1px; left: -1px; border-top: 1px solid #C9A96E; border-left: 1px solid #C9A96E; }
        .ad-modal-corner-br { bottom: -1px; right: -1px; border-bottom: 1px solid #C9A96E; border-right: 1px solid #C9A96E; }

        .ad-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 2.5rem;
        }
        .ad-modal-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 300;
          color: #0D0D0D;
          line-height: 0.95;
        }
        .ad-modal-title em { font-style: italic; color: #C9A96E; }

        .ad-modal-close {
          background: none;
          border: none;
          color: #8B8075;
          cursor: pointer;
          padding: 0.25rem;
          transition: color 0.25s ease;
          flex-shrink: 0;
          margin-top: 0.2rem;
        }
        .ad-modal-close:hover { color: #0D0D0D; }

        .ad-field { margin-bottom: 1.6rem; }
        .ad-label {
          display: block;
          font-family: 'Jost', sans-serif;
          font-size: 0.55rem;
          font-weight: 300;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #8B8075;
          margin-bottom: 0.6rem;
        }
        .ad-input,
        .ad-textarea,
        .ad-select {
          width: 100%;
          padding: 0.8rem 1rem;
          background: transparent;
          border: 1px solid rgba(201,169,110,0.25);
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          font-weight: 300;
          color: #0D0D0D;
          outline: none;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }
        .ad-input:focus,
        .ad-textarea:focus,
        .ad-select:focus {
          border-color: #C9A96E;
        }
        .ad-textarea { resize: none; }

        /* Pretty category dropdown */
        .ad-select {
          appearance: none;
          cursor: pointer;
          background-image: none;
          position: relative;
        }
        .ad-select-wrap {
          position: relative;
        }
        .ad-select-wrap .ad-select-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #C9A96E;
        }

        .ad-field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .ad-img-preview {
          position: relative;
          width: 80px; height: 80px;
          border: 1px solid rgba(201,169,110,0.25);
        }
        .ad-img-preview img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }
        .ad-img-remove {
          position: absolute;
          top: -8px; right: -8px;
          width: 20px; height: 20px;
          background: #9B3A3A;
          color: #FAF7F2;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .ad-upload-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 0.9rem;
          border: 1px dashed rgba(201,169,110,0.3);
          background: none;
          color: #8B8075;
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 300;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.3s ease, border-color 0.3s ease;
        }
        .ad-upload-btn:hover { color: #3A3530; border-color: rgba(201,169,110,0.6); }
        .ad-upload-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .ad-checkbox-row {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          cursor: pointer;
          margin-bottom: 1rem;
        }
        .ad-checkbox-row input[type="checkbox"] {
          width: 14px; height: 14px;
          accent-color: #C9A96E;
          cursor: pointer;
        }
        .ad-checkbox-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          font-weight: 300;
          letter-spacing: 0.1em;
          color: #5A5248;
        }

        .ad-form-btns {
          display: flex;
          gap: 0.8rem;
          margin-top: 2rem;
        }

        .ad-submit-btn {
          flex: 1;
          position: relative;
          padding: 0.9rem 1.5rem;
          border: 1px solid rgba(201,169,110,0.5);
          background: transparent;
          color: #3A3530;
          font-family: 'Jost', sans-serif;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          cursor: pointer;
          overflow: hidden;
          transition: color 0.35s ease, border-color 0.35s ease;
        }
        .ad-submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #C9A96E;
          transform: translateX(-100%);
          transition: transform 0.35s ease;
        }
        .ad-submit-btn:hover::before { transform: translateX(0); }
        .ad-submit-btn:hover { color: #0D0D0D; border-color: #C9A96E; }
        .ad-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .ad-submit-btn span { position: relative; z-index: 1; }

        .ad-cancel-btn {
          padding: 0.9rem 1.5rem;
          border: 1px solid rgba(201,169,110,0.2);
          background: transparent;
          color: #8B8075;
          font-family: 'Jost', sans-serif;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.3s ease, border-color 0.3s ease;
        }
        .ad-cancel-btn:hover { color: #3A3530; border-color: rgba(201,169,110,0.4); }

        .ad-tabs {
          display: flex; gap: 2rem; margin-bottom: 3rem;
          border-bottom: 1px solid rgba(201,169,110,0.15);
        }
        .ad-tab {
          font-family: 'Jost', sans-serif; font-size: 0.6rem; font-weight: 300;
          letter-spacing: 0.3em; text-transform: uppercase; color: #8B8075;
          background: none; border: none; cursor: pointer;
          padding: 0.8rem 0; border-bottom: 2px solid transparent;
          margin-bottom: -1px; transition: color 0.3s, border-color 0.3s;
        }
        .ad-tab:hover { color: #3A3530; }
        .ad-tab.active { color: #3A3530; border-bottom-color: #C9A96E; }

        /* Size selector chips */
        .ad-size-grid {
          display: grid;
          grid-template-columns: repeat(8, minmax(0, 1fr));
          gap: 0.45rem;
        }
        @media (max-width: 480px) {
          .ad-size-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }
        .ad-size-chip {
          padding: 0.7rem 0.4rem;
          background: transparent;
          border: 1px solid rgba(201,169,110,0.3);
          color: #5A5248;
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 400;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
        }
        .ad-size-chip:hover { border-color: #C9A96E; color: #3A3530; }
        .ad-size-chip.active {
          background: #C9A96E;
          border-color: #C9A96E;
          color: #FAF7F2;
        }

        /* Custom color swatch wrapping native <input type="color"> */
        .ad-color-swatch {
          position: relative;
          display: inline-block;
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(201,169,110,0.4);
          box-shadow: inset 0 0 0 2px #FAF7F2, 0 1px 3px rgba(0,0,0,0.08);
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .ad-color-swatch:hover {
          transform: scale(1.06);
          border-color: #C9A96E;
          box-shadow: inset 0 0 0 2px #FAF7F2, 0 0 0 2px rgba(201,169,110,0.25);
        }
        .ad-color-swatch input[type="color"] {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
          opacity: 0;
          border: none;
          padding: 0;
          background: transparent;
          cursor: pointer;
        }
      `}</style>

      {!authed ? (
        <AdminLogin onSuccess={() => setAuthed(true)} />
      ) : (
      <div className="ad-root">
        <header className="ad-header ad-noise">
          <div className="ad-header-inner">
            <div className="ad-header-brand">
              <div className="ad-header-diamond" />
              <h1 className="ad-header-title">Gary Shoes <em>Admin</em></h1>
            </div>
            <div className="ad-header-actions" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              {getAdminUsername() && (
                <span className="ad-hide-mobile" style={{
                  fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase",
                  color: "#8B8075", fontWeight: 300,
                }}>
                  {getAdminUsername()}
                </span>
              )}
              <button
                onClick={() => setShowSecurity(true)}
                className="ad-back-link"
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <Settings size={12} />
                Security
              </button>
              <button
                onClick={handleLogout}
                className="ad-back-link"
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <LogOut size={12} />
                Logout
              </button>
              <a href="/" className="ad-back-link ad-hide-mobile">Back to Site</a>
              {showSecurity && <SecuritySettings onClose={() => setShowSecurity(false)} />}
            </div>
          </div>
        </header>

        <div className="ad-body">
          <div className="ad-tabs">
            <button className={`ad-tab${activeTab === "products" ? " active" : ""}`} onClick={() => setActiveTab("products")}>Products</button>
            <button className={`ad-tab${activeTab === "orders" ? " active" : ""}`} onClick={() => setActiveTab("orders")}>Orders</button>
          </div>

          {activeTab === "orders" ? (
            <AdminOrders />
          ) : (
          <>
          <div className="ad-topbar">
            <div>
              <div className="ad-eyebrow">
                <div className="ad-eyebrow-dash" />
                <span className="ad-eyebrow-text">Inventory</span>
              </div>
              <h2>Manage <em>Products</em></h2>
              <p className="ad-count">
                {products.length} product{products.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
              <button
                className="ad-add-btn"
                onClick={() => { resetForm(); setShowForm(true); }}
              >
                <Plus size={14} />
                <span>Add Product</span>
              </button>
              <button
                className="ad-add-btn"
                onClick={() => setShowCategoryManager(true)}
              >
                <Settings size={14} />
                <span>Categories</span>
              </button>
              <button
                className="ad-add-btn"
                onClick={() => setShowBulkImport(true)}
              >
                <Upload size={14} />
                <span>Bulk Import</span>
              </button>
            </div>
          </div>

          <div className="ad-filters">
            {["All", ...categoryNames].map((cat, i, arr) => (
              <span key={cat} style={{ display: "contents" }}>
                <button
                  className={`ad-filter-btn${filterCategory === cat ? " active" : ""}`}
                  onClick={() => setFilterCategory(cat)}
                >
                  {cat}
                </button>
                {i < arr.length - 1 && <div className="ad-filter-sep" />}
              </span>
            ))}
          </div>

          {isLoading ? (
            <div className="ad-loading">Loading collection…</div>
          ) : products.length === 0 ? (
            <div className="ad-empty">
              <Package size={44} />
              <h3>No products yet</h3>
              <p>Click "Add Product" to begin your collection</p>
            </div>
          ) : (
            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Sale</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        {product.image_url ? (
                          <img loading="lazy" className="ad-table-img" src={product.image_url} alt={product.name} />
                        ) : (
                          <div className="ad-table-img-placeholder">
                            <Package size={18} />
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="ad-table-name">{product.name}</div>
                      </td>
                      <td>
                        <span className="ad-table-badge">{product.category}</span>
                      </td>
                      <td>
                        {hasSalePrice(product) ? (
                          <span className="ad-table-price">
                            <s style={{ color: "#9A938A", marginRight: "0.4rem" }}>${product.price.toFixed(2)}</s>
                            <span style={{ color: "#9B3A3A" }}>${(product.sale_price as number).toFixed(2)}</span>
                          </span>
                        ) : (
                          <span className="ad-table-price">${product.price.toFixed(2)}</span>
                        )}
                      </td>
                      <td>
                        {(product as any).is_on_sale && <span className="ad-sale-badge">Sale</span>}
                      </td>
                      <td>
                        <div className="ad-action-btns">
                          <button
                            className="ad-action-btn"
                            onClick={() => handleEdit(product)}
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            className="ad-action-btn danger"
                            title="Delete"
                            onClick={() => {
                              if (confirm("Delete this product?")) {
                                deleteMutation.mutate(product.id);
                              }
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </>
          )}
        </div>

        {showForm && (
          <div className="ad-modal-backdrop">
            <div className="ad-modal">
              <div className="ad-modal-corner ad-modal-corner-tl" />
              <div className="ad-modal-corner ad-modal-corner-br" />

              <div className="ad-modal-header">
                <h3 className="ad-modal-title">
                  {editingId ? <>Edit <em>Product</em></> : <>New <em>Product</em></>}
                </h3>
                <button className="ad-modal-close" onClick={resetForm}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="ad-field">
                  <label className="ad-label">Name *</label>
                  <input
                    type="text"
                    required
                    className="ad-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="ad-field">
                  <label className="ad-label">Description</label>
                  <textarea
                    className="ad-textarea"
                    rows={4}
                    placeholder="A short description shown to customers on the product page (materials, fit, story…)"
                    value={form.description || ""}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="ad-field-row ad-field">
                  <div>
                    <label className="ad-label">Price ($) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      className="ad-input"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div>
                    <label className="ad-label">Category *</label>
                    <div className="ad-select-wrap">
                      <select
                        className="ad-select"
                        value={form.category}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "__custom__") {
                            setShowCustomCategory(true);
                            setForm({ ...form, category: "__custom__" });
                          } else {
                            setShowCustomCategory(false);
                            setCustomCategory("");
                            setForm({ ...form, category: val });
                          }
                        }}
                      >
                        {form.category && !categoryNames.includes(form.category) && form.category !== "__custom__" && (
                          <option value={form.category}>{form.category}</option>
                        )}
                        {categoryNames.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                        <option value="__custom__">+ Custom Category</option>
                      </select>
                      <ChevronDown size={14} className="ad-select-icon" />
                    </div>
                  </div>
                </div>

                {showCustomCategory && (
                  <div className="ad-field">
                    <label className="ad-label">Custom Category Name *</label>
                    <input
                      type="text"
                      required
                      className="ad-input"
                      placeholder="Enter category name"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                    />
                  </div>
                )}

                <div className="ad-field">
                  <label className="ad-label">Product Image</label>
                  {form.image_url ? (
                    <div className="ad-img-preview">
                      <img loading="lazy" src={form.image_url} alt="Preview" />
                      <button
                        type="button"
                        className="ad-img-remove"
                        onClick={() => setForm({ ...form, image_url: "" })}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="ad-upload-btn"
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={14} />
                      {uploading ? "Uploading…" : "Upload Image"}
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>

                {/* Additional Images */}
                <div className="ad-field">
                  <label className="ad-label">Additional Images</label>
                  {form.additional_images.length > 0 && (
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "0.8rem" }}>
                      {form.additional_images.map((url, i) => (
                        <div key={i} className="ad-img-preview">
                          <img loading="lazy" src={url} alt={`Extra ${i + 1}`} />
                          <button
                            type="button"
                            className="ad-img-remove"
                            onClick={() => removeExtraImage(i)}
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    className="ad-upload-btn"
                    disabled={uploadingExtra}
                    onClick={() => extraFileInputRef.current?.click()}
                  >
                    <Upload size={14} />
                    {uploadingExtra ? "Uploading…" : "Add More Images"}
                  </button>
                  <input
                    ref={extraFileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleExtraImageUpload}
                  />
                </div>

                {/* Color Variants */}
                <div className="ad-field">
                  <label className="ad-label">Colors & Variant Images</label>
                  {form.colors.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "0.8rem" }}>
                      {form.colors.map((c, idx) => (
                        <div key={idx} style={{
                          border: "1px solid rgba(201,169,110,0.25)",
                          padding: "0.9rem", background: "rgba(201,169,110,0.04)",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.7rem" }}>
                            <label
                              className="ad-color-swatch"
                              style={{ background: c.hex }}
                              title="Pick color"
                              aria-label="Pick color"
                            >
                              <input
                                type="color"
                                value={c.hex}
                                onChange={(e) => updateColor(idx, { hex: e.target.value })}
                                aria-label="Pick color"
                              />
                            </label>
                            <input
                              type="text"
                              placeholder="Color name (e.g. Burgundy)"
                              value={c.name}
                              onChange={(e) => updateColor(idx, { name: e.target.value })}
                              className="ad-input"
                              style={{ flex: 1 }}
                            />
                            <button
                              type="button"
                              onClick={() => removeColor(idx)}
                              className="ad-action-btn danger"
                              title="Remove color"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "0.6rem" }}>
                            {c.images.map((url, i) => (
                              <div key={i} className="ad-img-preview">
                                <img loading="lazy" src={url} alt={`${c.name} ${i + 1}`} />
                                <button
                                  type="button"
                                  className="ad-img-remove"
                                  onClick={() => removeColorImage(idx, i)}
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            ))}
                          </div>
                          <label className="ad-upload-btn" style={{ cursor: "pointer" }}>
                            <Upload size={14} />
                            Add image{c.images.length > 0 ? "s" : ""} for {c.name || "this color"}
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e) => {
                                uploadColorImages(idx, e.target.files);
                                e.target.value = "";
                              }}
                            />
                          </label>

                          <div style={{ marginTop: "0.9rem" }}>
                            <div style={{
                              fontFamily: "'Jost', sans-serif", fontSize: "0.55rem",
                              letterSpacing: "0.3em", textTransform: "uppercase",
                              color: "#8B8075", marginBottom: "0.5rem",
                            }}>
                              Available EU sizes for {c.name || "this color"}
                            </div>
                            <div className="ad-size-grid">
                              {EU_SIZES.map((size) => {
                                const active = c.sizes.includes(size);
                                return (
                                  <button
                                    type="button"
                                    key={size}
                                    className={`ad-size-chip${active ? " active" : ""}`}
                                    onClick={() => toggleColorSize(idx, size)}
                                    aria-pressed={active}
                                  >
                                    {size}
                                  </button>
                                );
                              })}
                            </div>
                            <p style={{
                              marginTop: "0.4rem", fontSize: "0.58rem", letterSpacing: "0.08em",
                              color: "#8B8075", fontWeight: 300,
                            }}>
                              {c.sizes.length === 0
                                ? "Tap sizes available in this color"
                                : `Available: EU ${c.sizes.join(", ")}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "0.6rem" }}>
                    {PRESET_COLORS.map((p) => (
                      <button
                        type="button"
                        key={p.name}
                        onClick={() => addColor(p)}
                        title={`Add ${p.name}`}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: "0.4rem",
                          padding: "0.4rem 0.7rem", background: "transparent",
                          border: "1px solid rgba(201,169,110,0.3)", cursor: "pointer",
                          fontFamily: "'Jost', sans-serif", fontSize: "0.6rem",
                          letterSpacing: "0.1em", color: "#5A5248",
                        }}
                      >
                        <span style={{
                          width: "12px", height: "12px", borderRadius: "50%",
                          background: p.hex, border: "1px solid rgba(201,169,110,0.3)",
                        }} />
                        {p.name}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="ad-upload-btn"
                    onClick={() => addColor()}
                  >
                    <Plus size={14} />
                    Add Custom Color
                  </button>
                  <p style={{
                    marginTop: "0.6rem", fontSize: "0.6rem", letterSpacing: "0.1em",
                    color: "#8B8075", fontWeight: 300,
                  }}>
                    Each color can have its own set of images. Customers will see swatches and tap to view.
                  </p>
                </div>

                {/* Fallback sizes — only used when product has NO color variants */}
                {form.colors.length === 0 && (
                  <div className="ad-field">
                    <label className="ad-label">European Sizes</label>
                    <div className="ad-size-grid">
                      {EU_SIZES.map((size) => {
                        const active = form.sizes.includes(size);
                        return (
                          <button
                            type="button"
                            key={size}
                            className={`ad-size-chip${active ? " active" : ""}`}
                            onClick={() => toggleSize(size)}
                            aria-pressed={active}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                    <p style={{
                      marginTop: "0.6rem", fontSize: "0.6rem", letterSpacing: "0.1em",
                      color: "#8B8075", fontWeight: 300,
                    }}>
                      {form.sizes.length === 0
                        ? "Tap a size to mark it available"
                        : `Available: EU ${form.sizes.join(", ")}`}
                    </p>
                  </div>
                )}

                <label className="ad-checkbox-row">
                  <input
                    type="checkbox"
                    checked={form.is_featured || false}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  />
                  <span className="ad-checkbox-label">Featured product</span>
                </label>

                <label className="ad-checkbox-row" style={{ marginBottom: form.is_on_sale ? "0.8rem" : "1.6rem" }}>
                  <input
                    type="checkbox"
                    checked={form.is_on_sale || false}
                    onChange={(e) => setForm({ ...form, is_on_sale: e.target.checked })}
                  />
                  <span className="ad-checkbox-label">On Sale</span>
                </label>

                <AdditionalCategories
                  categories={categoryNames}
                  primaryCategory={form.category === "__custom__" ? customCategory.trim() : form.category}
                  value={form.extra_categories}
                  onChange={(extra_categories) => setForm((current) => ({ ...current, extra_categories }))}
                />

                {form.is_on_sale && (
                  <div className="ad-field" style={{ marginBottom: "1.6rem" }}>
                    <label className="ad-label">Sale Price ($) — new price shown to customers</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="ad-input"
                      placeholder="e.g. 49.99"
                      value={form.sale_price ?? ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          sale_price: e.target.value === "" ? null : parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                    <p style={{ fontSize: "0.65rem", color: "#8A8378", marginTop: "0.4rem" }}>
                      The regular price above (${form.price.toFixed(2)}) will appear crossed out next to this sale price.
                    </p>
                  </div>
                )}

                <div className="ad-form-btns">
                  <button
                    type="submit"
                    className="ad-submit-btn"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    <span>{editingId ? "Update Product" : "Create Product"}</span>
                  </button>
                  <button type="button" className="ad-cancel-btn" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showBulkImport && (
          <BulkImport onClose={() => setShowBulkImport(false)} />
        )}
        {showCategoryManager && (
          <CategoryManager onClose={() => setShowCategoryManager(false)} />
        )}
      </div>
      )}
    </>
  );
};

export default Admin;
