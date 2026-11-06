
-- Orders table
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_location text NOT NULL,
  additional_notes text,
  status text NOT NULL DEFAULT 'pending',
  total numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Order items table
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_price numeric NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Public insert (customers place orders)
CREATE POLICY "Anyone can insert orders" ON public.orders FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can read orders" ON public.orders FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can update orders" ON public.orders FOR UPDATE TO public USING (true);

CREATE POLICY "Anyone can insert order items" ON public.order_items FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can read order items" ON public.order_items FOR SELECT TO public USING (true);
