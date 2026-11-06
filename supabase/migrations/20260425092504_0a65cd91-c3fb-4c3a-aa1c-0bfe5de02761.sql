-- ============================================================
-- 1. Admin sessions table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '8 hours'),
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_token_hash ON public.admin_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON public.admin_sessions(expires_at);

ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
-- No policies: only service role (edge functions) can access.

-- ============================================================
-- 2. Session verify + refresh function (used by admin write functions)
--    Returns admin_id if valid, NULL otherwise. Refreshes last_active_at.
-- ============================================================
CREATE OR REPLACE FUNCTION public.verify_admin_session(_token TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_token_hash TEXT;
  v_admin_id UUID;
  v_inactivity_limit INTERVAL := interval '30 minutes';
BEGIN
  IF _token IS NULL OR length(_token) < 16 THEN
    RETURN NULL;
  END IF;

  v_token_hash := encode(extensions.digest(_token, 'sha256'), 'hex');

  -- Find session, check both absolute expiry and inactivity timeout
  SELECT admin_id INTO v_admin_id
  FROM public.admin_sessions
  WHERE token_hash = v_token_hash
    AND expires_at > now()
    AND last_active_at > (now() - v_inactivity_limit);

  IF v_admin_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Refresh activity
  UPDATE public.admin_sessions
  SET last_active_at = now()
  WHERE token_hash = v_token_hash;

  RETURN v_admin_id;
END;
$$;

-- ============================================================
-- 3. Create-session function (for admin-login)
-- ============================================================
CREATE OR REPLACE FUNCTION public.create_admin_session(
  _admin_id UUID,
  _token TEXT,
  _ip TEXT DEFAULT NULL,
  _user_agent TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_token_hash TEXT;
BEGIN
  v_token_hash := encode(extensions.digest(_token, 'sha256'), 'hex');

  -- Clean up any expired sessions for this admin while we're here (cheap)
  DELETE FROM public.admin_sessions
  WHERE admin_id = _admin_id AND expires_at < now();

  INSERT INTO public.admin_sessions (admin_id, token_hash, ip_address, user_agent)
  VALUES (_admin_id, v_token_hash, _ip, _user_agent);
END;
$$;

-- ============================================================
-- 4. Revoke-session function (for logout)
-- ============================================================
CREATE OR REPLACE FUNCTION public.revoke_admin_session(_token TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_token_hash TEXT;
BEGIN
  IF _token IS NULL THEN RETURN; END IF;
  v_token_hash := encode(extensions.digest(_token, 'sha256'), 'hex');
  DELETE FROM public.admin_sessions WHERE token_hash = v_token_hash;
END;
$$;

-- ============================================================
-- 5. Tighten RLS — drop overly-permissive policies
-- ============================================================

-- ORDERS: customers can place; only server (admin functions) can read/update
DROP POLICY IF EXISTS "Anyone can read orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;
-- Keep: "Anyone can insert orders" (customers need to place orders from public site)

-- ORDER_ITEMS: same — customers can insert during checkout, server reads
DROP POLICY IF EXISTS "Anyone can read order items" ON public.order_items;
-- Keep: "Anyone can insert order items"

-- PRODUCTS: keep public reads, drop public writes (must go through admin functions)
DROP POLICY IF EXISTS "Anyone can insert products" ON public.products;
DROP POLICY IF EXISTS "Anyone can update products" ON public.products;
DROP POLICY IF EXISTS "Anyone can delete products" ON public.products;
-- Keep: "Products are publicly readable"

-- CATEGORIES: keep public reads, drop public writes
DROP POLICY IF EXISTS "Anyone can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can update categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can delete categories" ON public.categories;
-- Keep: "Categories are publicly readable"

-- ============================================================
-- 6. Performance indexes on frequently-queried fields
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON public.categories(sort_order);