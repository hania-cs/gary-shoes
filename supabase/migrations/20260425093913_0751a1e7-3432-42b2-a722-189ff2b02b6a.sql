-- Re-grant table privileges to anon/authenticated (RLS still gates row access)
GRANT INSERT ON TABLE public.orders TO anon, authenticated;
GRANT INSERT ON TABLE public.order_items TO anon, authenticated;
GRANT SELECT ON TABLE public.products TO anon, authenticated;
GRANT SELECT ON TABLE public.categories TO anon, authenticated;

-- Recreate INSERT policies, explicitly naming anon and authenticated roles
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;

CREATE POLICY "Guests and users can insert orders"
  ON public.orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Guests and users can insert order items"
  ON public.order_items
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);