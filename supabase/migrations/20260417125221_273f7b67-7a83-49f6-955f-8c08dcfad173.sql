CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.verify_admin_password(_username text, _password text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE username = _username
      AND password_hash = extensions.crypt(_password, password_hash)
  );
$$;

REVOKE ALL ON FUNCTION public.verify_admin_password(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.verify_admin_password(text, text) FROM anon;
REVOKE ALL ON FUNCTION public.verify_admin_password(text, text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.verify_admin_password(text, text) TO service_role;