import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const username = typeof body?.username === "string" ? body.username.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!username || !password || username.length > 64 || password.length > 200) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing credentials" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: user } = await supabase
      .from("admin_users")
      .select("id, username")
      .eq("username", username)
      .maybeSingle();

    if (!user) {
      // constant-time-ish delay
      await new Promise((r) => setTimeout(r, 200));
      return new Response(
        JSON.stringify({ ok: false, error: "Invalid credentials" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: verifyData, error: verifyError } = await supabase.rpc("verify_admin_password", {
      _username: username,
      _password: password,
    });

    if (verifyError || !verifyData) {
      return new Response(
        JSON.stringify({ ok: false, error: "Invalid credentials" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate a high-entropy session token (256 bits)
    const tokenBytes = new Uint8Array(32);
    crypto.getRandomValues(tokenBytes);
    const token = Array.from(tokenBytes, (b) => b.toString(16).padStart(2, "0")).join("");

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("cf-connecting-ip") ||
      null;
    const ua = req.headers.get("user-agent")?.slice(0, 256) || null;

    const { error: sessionError } = await supabase.rpc("create_admin_session", {
      _admin_id: user.id,
      _token: token,
      _ip: ip,
      _user_agent: ua,
    });

    if (sessionError) {
      return new Response(
        JSON.stringify({ ok: false, error: "Failed to create session" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, token, username: user.username }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
