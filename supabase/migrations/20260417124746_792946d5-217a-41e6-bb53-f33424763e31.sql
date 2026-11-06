-- 1. Add sizes column to products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS sizes text[] DEFAULT '{}'::text[];

-- 2. Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are publicly readable"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update categories"
  ON public.categories FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete categories"
  ON public.categories FOR DELETE
  USING (true);

-- Seed
INSERT INTO public.categories (name, sort_order) VALUES
  ('Heels', 1),
  ('Mini Heels', 2),
  ('Ballerinas', 3),
  ('Heel Sandals', 4),
  ('Mules', 5),
  ('Loafers', 6),
  ('Bridal', 7),
  ('Sale', 8)
ON CONFLICT (name) DO NOTHING;

-- 3. Admin users table (locked down — only service role / edge functions can access)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- No policies = no public access. Only service role (edge functions) can read/write.
