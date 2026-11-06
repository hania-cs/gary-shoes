import { z } from "https://esm.sh/zod@3.23.8";
import { corsHeaders, jsonResponse, getServiceClient, requireAdmin } from "../_shared/adminAuth.ts";

const stripControl = (s: string) =>
  s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();

const safeText = (max: number, min = 0) =>
  z
    .string()
    .transform(stripControl)
    .pipe(z.string().min(min).max(max));

const requestSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("create"), name: safeText(80, 1) }),
  z.object({ action: z.literal("delete"), id: z.string().uuid() }),
  z.object({
    action: z.literal("reorder"),
    ordered_ids: z.array(z.string().uuid()).min(1).max(200),
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

    if (op.action === "create") {
      const { data: existing } = await supabase
        .from("categories")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();
      const nextOrder = (existing?.sort_order ?? 0) + 1;

      const { data, error } = await supabase
        .from("categories")
        .insert({ name: op.name, sort_order: nextOrder })
        .select()
        .single();
      if (error) throw error;
      return jsonResponse({ ok: true, category: data });
    }

    if (op.action === "delete") {
      const { error } = await supabase.from("categories").delete().eq("id", op.id);
      if (error) throw error;
      return jsonResponse({ ok: true });
    }

    if (op.action === "reorder") {
      // Update each one. Small N (<= ~20 categories), fine to loop.
      for (let i = 0; i < op.ordered_ids.length; i++) {
        const { error } = await supabase
          .from("categories")
          .update({ sort_order: i })
          .eq("id", op.ordered_ids[i]);
        if (error) throw error;
      }
      return jsonResponse({ ok: true });
    }

    return jsonResponse({ ok: false, error: "Unknown action" }, 400);
  } catch (e) {
    return jsonResponse({ ok: false, error: (e as Error).message }, 500);
  }
});
