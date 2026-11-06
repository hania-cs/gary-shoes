import { corsHeaders, jsonResponse, getServiceClient } from "../_shared/adminAuth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ ok: false, error: "Method not allowed" }, 405);

  const headerToken = req.headers.get("x-admin-token");
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
  const token = headerToken || bearerToken;

  // Best-effort revoke; never error to client
  if (token && token.length >= 32 && token.length <= 128) {
    try {
      const supabase = getServiceClient();
      await supabase.rpc("revoke_admin_session", { _token: token });
    } catch {
      /* ignore */
    }
  }

  return jsonResponse({ ok: true });
});
