// Shared helpers for admin edge functions.
// Verifies the bearer token corresponds to a valid admin session.

import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function getServiceClient(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

/**
 * Reads the admin session token from the request and verifies it.
 * Returns admin_id on success, or sends a 401 response (caller should return).
 */
export async function requireAdmin(
  req: Request,
  supabase: SupabaseClient
): Promise<{ adminId: string } | Response> {
  // Accept either x-admin-token header or Authorization: Bearer <token>
  const headerToken = req.headers.get("x-admin-token");
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : null;
  const token = headerToken || bearerToken;

  if (!token || token.length < 32 || token.length > 128) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
  }

  const { data, error } = await supabase.rpc("verify_admin_session", { _token: token });

  if (error || !data) {
    return jsonResponse({ ok: false, error: "Session expired or invalid" }, 401);
  }

  return { adminId: data as string };
}
