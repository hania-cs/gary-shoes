-- Add recovery_code_hash column
ALTER TABLE public.admin_users
ADD COLUMN IF NOT EXISTS recovery_code_hash text;

-- Function: change password (requires current password)
CREATE OR REPLACE FUNCTION public.change_admin_password(
  _username text,
  _current_password text,
  _new_password text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  _ok boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE username = _username
      AND password_hash = extensions.crypt(_current_password, password_hash)
  ) INTO _ok;

  IF NOT _ok THEN RETURN false; END IF;
  IF length(_new_password) < 6 THEN RETURN false; END IF;

  UPDATE public.admin_users
  SET password_hash = extensions.crypt(_new_password, extensions.gen_salt('bf'))
  WHERE username = _username;

  RETURN true;
END;
$$;

-- Function: reset password using recovery code
CREATE OR REPLACE FUNCTION public.reset_admin_password_with_code(
  _username text,
  _recovery_code text,
  _new_password text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  _ok boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE username = _username
      AND recovery_code_hash IS NOT NULL
      AND recovery_code_hash = extensions.crypt(_recovery_code, recovery_code_hash)
  ) INTO _ok;

  IF NOT _ok THEN RETURN false; END IF;
  IF length(_new_password) < 6 THEN RETURN false; END IF;

  UPDATE public.admin_users
  SET password_hash = extensions.crypt(_new_password, extensions.gen_salt('bf'))
  WHERE username = _username;

  RETURN true;
END;
$$;

-- Function: set a new recovery code hash (called from edge fn after verifying password)
CREATE OR REPLACE FUNCTION public.set_admin_recovery_code(
  _username text,
  _password text,
  _new_code text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  _ok boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE username = _username
      AND password_hash = extensions.crypt(_password, password_hash)
  ) INTO _ok;

  IF NOT _ok THEN RETURN false; END IF;

  UPDATE public.admin_users
  SET recovery_code_hash = extensions.crypt(_new_code, extensions.gen_salt('bf'))
  WHERE username = _username;

  RETURN true;
END;
$$;

-- Function: change username (requires current password)
CREATE OR REPLACE FUNCTION public.change_admin_username(
  _current_username text,
  _password text,
  _new_username text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  _ok boolean;
  _exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE username = _current_username
      AND password_hash = extensions.crypt(_password, password_hash)
  ) INTO _ok;

  IF NOT _ok THEN RETURN false; END IF;

  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE username = _new_username) INTO _exists;
  IF _exists THEN RETURN false; END IF;

  UPDATE public.admin_users SET username = _new_username WHERE username = _current_username;
  RETURN true;
END;
$$;