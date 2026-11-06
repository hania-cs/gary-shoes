CREATE OR REPLACE FUNCTION public.verify_admin_session(_token text)
 RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  v_token_hash TEXT;
  v_admin_id UUID;
BEGIN
  IF _token IS NULL OR length(_token) < 16 THEN RETURN NULL; END IF;
  v_token_hash := encode(extensions.digest(_token, 'sha256'), 'hex');
  SELECT admin_id INTO v_admin_id FROM public.admin_sessions
  WHERE token_hash = v_token_hash AND last_active_at > (now() - interval '24 hours');
  IF v_admin_id IS NULL THEN RETURN NULL; END IF;
  UPDATE public.admin_sessions
  SET last_active_at = now(), expires_at = GREATEST(expires_at, now() + interval '24 hours')
  WHERE token_hash = v_token_hash;
  RETURN v_admin_id;
END;
$function$;