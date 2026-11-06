// Public endpoint to create an order from the storefront cart.
// Uses service role to bypass RLS (table grants are managed and not editable).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const stripControl = (s: string) =>
  String(s ?? "").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();

const DELIVERY_FEE = 5;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const form = body?.form ?? {};
  const items = Array.isArray(body?.items) ? body.items : [];

  const customer_name = stripControl(form.customer_name);
  const customer_phone = stripControl(form.customer_phone);
  const customer_location = stripControl(form.customer_location);
  const additional_notes = stripControl(form.additional_notes || "");

  if (customer_name.length < 2 || customer_name.length > 120)
    return json({ ok: false, error: "Invalid name" }, 400);
  if (customer_phone.length < 6 || customer_phone.length > 40 || !/^[+()\d\s-]+$/.test(customer_phone))
    return json({ ok: false, error: "Invalid phone" }, 400);
  if (customer_location.length < 3 || customer_location.length > 500)
    return json({ ok: false, error: "Invalid location" }, 400);
  if (additional_notes.length > 2000)
    return json({ ok: false, error: "Notes too long" }, 400);
  if (items.length === 0 || items.length > 50)
    return json({ ok: false, error: "Invalid cart" }, 400);

  const cleanItems = items.map((it: any) => ({
    product_id: String(it.product_id ?? "").slice(0, 64),
    name: stripControl(it.name).slice(0, 300),
    price: Number(it.price),
    quantity: Math.max(1, Math.min(99, parseInt(String(it.quantity), 10) || 1)),
    size: it.size ? String(it.size).slice(0, 16) : null,
    color: it.color ? String(it.color).slice(0, 80) : null,
  }));

  for (const it of cleanItems) {
    if (!it.product_id || !it.name || !Number.isFinite(it.price) || it.price < 0 || it.price > 1_000_000) {
      return json({ ok: false, error: "Invalid cart item" }, 400);
    }
  }

  const subtotal = cleanItems.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
  const total = subtotal + DELIVERY_FEE;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      customer_name,
      customer_phone,
      customer_location,
      additional_notes: additional_notes || null,
      total,
      status: "pending",
    })
    .select()
    .single();

  if (orderErr) return json({ ok: false, error: orderErr.message }, 500);

  const variantSummary = (i: any) => {
    const parts: string[] = [];
    if (i.color) parts.push(`Color: ${i.color}`);
    if (i.size) parts.push(`EU ${i.size}`);
    return parts.join(" / ");
  };

  const orderItems = cleanItems.map((i: any) => {
    const v = variantSummary(i);
    return {
      order_id: order.id,
      product_id: i.product_id,
      product_name: v ? `${i.name} (${v})` : i.name,
      product_price: i.price,
      quantity: i.quantity,
    };
  });

  const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
  if (itemsErr) return json({ ok: false, error: itemsErr.message }, 500);

  return json({ ok: true, order });
});
