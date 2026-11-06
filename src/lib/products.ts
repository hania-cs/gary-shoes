import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { adminAuthHeaders, adminLogout } from "@/lib/adminAuth";

export type Product = Tables<"products">;
export type ProductInsert = TablesInsert<"products">;

export const CATEGORIES = [
  "Heels",
  "Mini Heels",
  "Ballerinas",
  "Heel Sandals",
  "Mules",
  "Low Block Heels",
  "Loafers",
  "Boots",
  "Bridal",
  "Sale",
] as const;

// ── Public reads (RLS allows everyone to SELECT products) ──
export async function fetchProducts(category?: string) {
  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (category && category !== "All") {
    const v = category.replace(/"/g, '\\"');
    query = query.or(`category.eq."${v}",extra_categories.cs.{"${v}"}`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// ── Admin writes (go through edge function with session token) ──
async function callAdminProducts<T = any>(body: object): Promise<T> {
  const { data, error } = await supabase.functions.invoke("admin-products", {
    body,
    headers: adminAuthHeaders(),
  });
  if (error) {
    let message = error.message || "Request failed";
    try {
      const ctx = (error as any).context;
      const payload = ctx && typeof ctx.json === "function" ? await ctx.json() : null;
      if (payload?.error) {
        const fields = payload.details?.fieldErrors ? Object.keys(payload.details.fieldErrors) : [];
        message = fields.length ? `${payload.error}: ${fields.join(", ")}` : payload.error;
        if (/unauthorized|session/i.test(payload.error)) adminLogout();
      }
    } catch {
      /* keep generic message */
    }
    throw new Error(message);
  }
  if (!data?.ok) {
    if (data?.error?.toLowerCase?.().includes("unauthorized") || data?.error?.toLowerCase?.().includes("session")) {
      adminLogout();
    }
    throw new Error(data?.error || "Request failed");
  }
  return data as T;
}

export async function createProduct(product: ProductInsert): Promise<Product> {
  const data = await callAdminProducts<{ ok: true; product: Product }>({
    action: "create",
    data: product,
  });
  return data.product;
}

export async function updateProduct(id: string, updates: Partial<ProductInsert>): Promise<Product> {
  const data = await callAdminProducts<{ ok: true; product: Product }>({
    action: "update",
    id,
    data: updates,
  });
  return data.product;
}

export async function deleteProduct(id: string): Promise<void> {
  await callAdminProducts({ action: "delete", id });
}

// ── Storage uploads ──
// Storage uploads can stay as direct supabase calls since the bucket is
// already public-read and bucket-level INSERT policy controls writes.
export async function uploadProductImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = 1090;
  canvas.height = 1090;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Unable to prepare product photo");
  }
  const scale = Math.min(canvas.width / bitmap.width, canvas.height / bitmap.height);
  const width = bitmap.width * scale;
  const height = bitmap.height * scale;
  context.drawImage(bitmap, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
  bitmap.close();
  const squareImage = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Unable to prepare product photo"));
    }, "image/webp", 0.8);
  });
  const fileName = `${crypto.randomUUID()}.webp`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(fileName, squareImage, { contentType: "image/webp" });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function deleteProductImage(imageUrl: string) {
  const fileName = imageUrl.split("/").pop();
  if (!fileName) return;
  await supabase.storage.from("product-images").remove([fileName]);
}
