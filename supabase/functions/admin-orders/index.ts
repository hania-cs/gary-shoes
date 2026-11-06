import { z } from "https://esm.sh/zod@3.23.8";
import { corsHeaders, jsonResponse, getServiceClient, requireAdmin } from "../_shared/adminAuth.ts";

const requestSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("list") }),
  z.object({ action: z.literal("get_items"), order_id: z.string().uuid() }),
  z.object({
    action: z.literal("update_status"),
    order_id: z.string().uuid(),
    status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
  }),
]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ ok: false, error: "Method not allowed" }, 405);

  const supabase = getServiceClient();
  const auth = await requireAdmin(req, supabase);
  if (auth instanceof Response) return auth;

  let body: unknown;
  try { body = await req.json(); } catch { return jsonResponse({ ok: false, error: "Invalid JSON" }, 400); }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonResponse({ ok: false, error: "Invalid input", details: parsed.error.flatten() }, 400);
  }

  try {
    const op = parsed.data;

    if (op.action === "list") {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000);
      if (error) throw error;
      return jsonResponse({ ok: true, orders: data ?? [] });
    }

    if (op.action === "get_items") {
      const { data, error } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", op.order_id);
      if (error) throw error;
      return jsonResponse({ ok: true, items: data ?? [] });
    }

    if (op.action === "update_status") {
      const { error } = await supabase
        .from("orders")
        .update({ status: op.status })
        .eq("id", op.order_id);
      if (error) throw error;
      return jsonResponse({ ok: true });
    }

    return jsonResponse({ ok: false, error: "Unknown action" }, 400);
  } catch (e) {
    return jsonResponse({ ok: false, error: (e as Error).message }, 500);
  }
});
