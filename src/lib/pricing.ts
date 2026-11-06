export interface PriceLike {
  price: number;
  is_on_sale?: boolean | null;
  sale_price?: number | null;
}

/** True when the product has an active, valid discounted price. */
export function hasSalePrice(p: PriceLike): boolean {
  return !!p.is_on_sale && typeof p.sale_price === "number" && p.sale_price > 0 && p.sale_price < p.price;
}

/** The price the customer actually pays. */
export function effectivePrice(p: PriceLike): number {
  return hasSalePrice(p) ? (p.sale_price as number) : p.price;
}
