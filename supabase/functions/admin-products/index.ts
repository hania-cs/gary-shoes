import { z } from "https://esm.sh/zod@3.23.8";
import { corsHeaders, jsonResponse, getServiceClient, requireAdmin } from "../_shared/adminAuth.ts";

const stripControl = (s: string) =>
  s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();

const safeText = (max: number, min = 0) =>
  z
    .string()
    .transform(stripControl)
    .pipe(z.string().min(min).max(max));

const colorSchema = z.object({
  name: safeText(60),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  images: z.array(z.string().url().max(2048)).max(20),
  sizes: z.array(safeText(8)).max(40),
});

const productPayload = z.object({
  name: safeText(200, 1),
  price: z.number().min(0).max(1_000_000),
  category: safeText(80, 1),
  image_url: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? null : v),
    z.string().url().max(2048).nullable().optional()
  ),
  description: safeText(5000).nullable().optional(),
  is_featured: z.boolean().optional(),
  is_on_sale: z.boolean().optional(),
  sale_price: z.number().min(0).max(1_000_000).nullable().optional(),
  additional_images: z.array(z.string().url().max(2048)).max(20).optional(),
  sizes: z.array(safeText(8)).max(40).optional(),
  colors: z.array(colorSchema).max(20).optional(),
  extra_categories: z.array(safeText(80, 1)).max(10).optional(),
});

const requestSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("create"), data: productPayload }),
  z.object({ action: z.literal("update"), id: z.string().uuid(), data: productPayload.partial() }),
  z.object({ action: z.literal("delete"), id: z.string().uuid() }),
  z.object({
    action: z.literal("bulk_create"),
    data: z.array(productPayload).min(1).max(500),
  }),
]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ ok: false, error: "Method not allowed" }, 405);

  const supabase = getServiceClient();
  const auth = await requireAdmin(req, supabase);
  if (auth instanceof Response) return auth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ ok: false, error: "Invalid JSON" }, 400);
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonResponse(
      { ok: false, error: "Invalid input", details: parsed.error.flatten() },
      400
    );
  }

  try {
    const op = parsed.data;

    if (op.action === "create") {
      const { data, error } = await supabase
        .from("products")
        .insert(op.data)
        .select()
        .single();
      if (error) throw error;
      return jsonResponse({ ok: true, product: data });
    }

    if (op.action === "update") {
      const { data, error } = await supabase
        .from("products")
        .update(op.data)
        .eq("id", op.id)
        .select()
        .single();
      if (error) throw error;
      return jsonResponse({ ok: true, product: data });
    }

    if (op.action === "delete") {
      const { error } = await supabase.from("products").delete().eq("id", op.id);
      if (error) throw error;
      return jsonResponse({ ok: true });
    }

    if (op.action === "bulk_create") {
      const { data, error } = await supabase
        .from("products")
        .insert(op.data)
        .select("id");
      if (error) throw error;
      return jsonResponse({ ok: true, count: data?.length ?? 0 });
    }

    return jsonResponse({ ok: false, error: "Unknown action" }, 400);
  } catch (e) {
    return jsonResponse({ ok: false, error: (e as Error).message }, 500);
  }
});
