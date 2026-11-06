import { supabase } from "@/integrations/supabase/client";
import { adminAuthHeaders, adminLogout } from "@/lib/adminAuth";

export type Category = {
  id: string;
  name: string;
  sort_order: number;
};

// Public read (RLS allows everyone)
export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return (data as Category[]) ?? [];
}

async function callAdminCategories<T = any>(body: object): Promise<T> {
  const { data, error } = await supabase.functions.invoke("admin-categories", {
    body,
    headers: adminAuthHeaders(),
  });
  if (error) throw new Error(error.message || "Request failed");
  if (!data?.ok) {
    if (data?.error?.toLowerCase?.().includes("unauthorized") || data?.error?.toLowerCase?.().includes("session")) {
      adminLogout();
    }
    throw new Error(data?.error || "Request failed");
  }
  return data as T;
}

export async function createCategory(name: string): Promise<Category> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Category name is required");
  const data = await callAdminCategories<{ ok: true; category: Category }>({
    action: "create",
    name: trimmed,
  });
  return data.category;
}

export async function deleteCategory(id: string): Promise<void> {
  await callAdminCategories({ action: "delete", id });
}

export async function reorderCategories(orderedIds: string[]): Promise<void> {
  await callAdminCategories({ action: "reorder", ordered_ids: orderedIds });
}

// Canonical slug for a catalog category name, shared by the shop filter and
// every homepage link, so "Ballets & Loafers" and "ballets-loafers" are the
// same destination.
export const categorySlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
