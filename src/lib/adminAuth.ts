import { supabase } from "@/integrations/supabase/client";

const TOKEN_KEY = "gary_admin_token";
const USER_KEY = "gary_admin_user";
const LAST_ACTIVITY_KEY = "gary_admin_last_active";
// Mirror server-side inactivity window (verify_admin_session uses 30 min)
export const INACTIVITY_LIMIT_MS = 30 * 60 * 1000;

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAdminLoggedIn(): boolean {
  const token = getAdminToken();
  if (!token) return false;
  // Client-side inactivity check (server enforces too)
  const last = Number(localStorage.getItem(LAST_ACTIVITY_KEY) || 0);
  if (last && Date.now() - last > INACTIVITY_LIMIT_MS) {
    adminLogout();
    return false;
  }
  return true;
}

export function getAdminUsername(): string | null {
  return localStorage.getItem(USER_KEY);
}

export function touchAdminActivity() {
  if (localStorage.getItem(TOKEN_KEY)) {
    localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
  }
}

export function adminLogout() {
  const token = localStorage.getItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(LAST_ACTIVITY_KEY);
  // Best-effort server-side revoke
  if (token) {
    supabase.functions
      .invoke("admin-logout", { headers: { "x-admin-token": token } })
      .catch(() => {});
  }
}

/** Common header for authenticated admin function calls. */
export function adminAuthHeaders(): Record<string, string> {
  const token = getAdminToken();
  return token ? { "x-admin-token": token } : {};
}

export async function adminLogin(username: string, password: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke("admin-login", {
    body: { username, password },
  });

  if (error) {
    const status = (error as any)?.context?.status;
    throw new Error(status === 401 ? "Wrong username or password" : "Login failed, please try again");
  }
  if (!data?.ok || !data?.token) {
    throw new Error(data?.error || "Invalid credentials");
  }

  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, data.username);
  localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
}

export async function adminChangePassword(username: string, currentPassword: string, newPassword: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke("admin-change-password", {
    body: { username, currentPassword, newPassword },
  });
  if (error) throw new Error(error.message || "Failed to change password");
  if (!data?.ok) throw new Error(data?.error || "Failed to change password");
}

export async function adminResetPassword(username: string, recoveryCode: string, newPassword: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke("admin-reset-password", {
    body: { username, recoveryCode, newPassword },
  });
  if (error) throw new Error(error.message || "Reset failed");
  if (!data?.ok) throw new Error(data?.error || "Reset failed");
}

export async function adminGenerateRecoveryCode(username: string, password: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke("admin-generate-recovery", {
    body: { username, password },
  });
  if (error) throw new Error(error.message || "Failed to generate code");
  if (!data?.ok || !data?.code) throw new Error(data?.error || "Failed to generate code");
  return data.code as string;
}
