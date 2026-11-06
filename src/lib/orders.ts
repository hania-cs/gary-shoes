import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { adminAuthHeaders, adminLogout } from "@/lib/adminAuth";

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
  size?: string | null;
  color?: string | null;
}

export interface OrderFormData {
  customer_name: string;
  customer_phone: string;
  customer_location: string;
  additional_notes: string;
}

export const DELIVERY_FEE = 5;

// ── Validation / sanitization ────────────────────────────────────────────────
// Strip control chars + cap lengths. Phone allows digits / spaces / + / - / ()
const stripControl = (s: string) =>
  s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();

export const orderFormSchema = z.object({
  customer_name: z
    .string()
    .transform(stripControl)
    .pipe(z.string().min(2, "Name is too short").max(120, "Name is too long")),
  customer_phone: z
    .string()
    .transform(stripControl)
    .pipe(
      z
        .string()
        .min(6, "Phone is too short")
        .max(40, "Phone is too long")
        .regex(/^[+()\d\s-]+$/, "Phone contains invalid characters")
    ),
  customer_location: z
    .string()
    .transform(stripControl)
    .pipe(z.string().min(3, "Location is too short").max(500, "Location is too long")),
  additional_notes: z
    .string()
    .transform(stripControl)
    .pipe(z.string().max(2000, "Notes are too long"))
    .optional()
    .or(z.literal("")),
});

const cartItemSchema = z.object({
  product_id: z.string().min(1).max(64),
  name: z.string().transform(stripControl).pipe(z.string().min(1).max(300)),
  price: z.number().min(0).max(1_000_000),
  quantity: z.number().int().min(1).max(99),
  image_url: z.string().max(2048).nullable().optional(),
  size: z.string().max(16).nullable().optional(),
  color: z.string().max(80).nullable().optional(),
});

function variantSummary(item: CartItem) {
  const parts: string[] = [];
  if (item.color) parts.push(`Color: ${item.color}`);
  if (item.size) parts.push(`EU ${item.size}`);
  return parts.join(" / ");
}

export async function createOrder(form: OrderFormData, items: CartItem[]) {
  const parsedForm = orderFormSchema.safeParse(form);
  if (!parsedForm.success) {
    const first = parsedForm.error.issues[0];
    throw new Error(first?.message || "Invalid order details");
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart is empty");
  }
  if (items.length > 50) {
    throw new Error("Too many items in cart");
  }
  const parsedItems = z.array(cartItemSchema).max(50).safeParse(items);
  if (!parsedItems.success) {
    throw new Error("Cart contains invalid items");
  }

  const { data, error } = await supabase.functions.invoke("submit-order", {
    body: { form: parsedForm.data, items: parsedItems.data },
  });

  if (error) throw new Error(error.message || "Failed to place order");
  if (!data?.ok) throw new Error(data?.error || "Failed to place order");

  return data.order;
}

export function sendWhatsAppOrder(form: OrderFormData, items: CartItem[]) {
  // Sanitize again before opening the URL (defense in depth)
  const parsedForm = orderFormSchema.safeParse(form);
  if (!parsedForm.success) return;
  const safeForm = parsedForm.data;

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal + DELIVERY_FEE;
  const itemsList = items
    .map((i) => {
      const variant = variantSummary(i);
      const variantText = variant ? ` [${variant}]` : "";
      return `• ${stripControl(i.name)}${variantText} x${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`;
    })
    .join("\n");

  const message = `🛒 *New Order from Gary Shoes*

*Customer:* ${safeForm.customer_name}
*Phone:* ${safeForm.customer_phone}
*Location:* ${safeForm.customer_location}
${safeForm.additional_notes ? `*Notes:* ${safeForm.additional_notes}` : ""}

*Items:*
${itemsList}

*Subtotal:* $${subtotal.toFixed(2)}
*Delivery Fee:* $${DELIVERY_FEE.toFixed(2)}
*Total: $${total.toFixed(2)}*`;

  const url = `https://wa.me/96171009255?text=${encodeURIComponent(message)}`;
  // Must run synchronously inside the tap, otherwise browsers block it.
  const isMobile = /Android|iPhone|iPad|iPod|Mobile|SamsungBrowser/i.test(navigator.userAgent);
  if (isMobile) {
    // Direct navigation hands off to the WhatsApp app reliably (Samsung, iOS).
    window.location.href = url;
    return;
  }
  const win = window.open(url, "_blank");
  if (!win) window.location.href = url;
}

// ── Admin reads & updates (go through admin-orders edge function) ──
async function callAdminOrders<T = any>(body: object): Promise<T> {
  const { data, error } = await supabase.functions.invoke("admin-orders", {
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

export async function fetchOrders() {
  const data = await callAdminOrders<{ ok: true; orders: any[] }>({ action: "list" });
  return data.orders;
}

export async function fetchOrderItems(orderId: string) {
  const data = await callAdminOrders<{ ok: true; items: any[] }>({
    action: "get_items",
    order_id: orderId,
  });
  return data.items;
}

export async function updateOrderStatus(id: string, status: string) {
  await callAdminOrders({
    action: "update_status",
    order_id: id,
    status,
  });
}
