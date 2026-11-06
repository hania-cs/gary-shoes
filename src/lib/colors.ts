export interface ProductColor {
  name: string;
  hex: string;
  images: string[];
  sizes: string[];
}

export const PRESET_COLORS: { name: string; hex: string }[] = [
  { name: "Black", hex: "#0D0D0D" },
  { name: "White", hex: "#F5F0E8" },
  { name: "Nude", hex: "#E5C9A8" },
  { name: "Beige", hex: "#C9A96E" },
  { name: "Tan", hex: "#A67B4F" },
  { name: "Brown", hex: "#5A3A22" },
  { name: "Red", hex: "#9B1B1B" },
  { name: "Burgundy", hex: "#5C1A2A" },
  { name: "Pink", hex: "#E8A7B5" },
  { name: "Blue", hex: "#2A4A7C" },
  { name: "Navy", hex: "#1A2845" },
  { name: "Green", hex: "#3A5A3A" },
  { name: "Gold", hex: "#C9A96E" },
  { name: "Silver", hex: "#C0C0C0" },
];

export function parseProductColors(raw: unknown): ProductColor[] {
  if (!raw) return [];
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((c): c is Record<string, unknown> => typeof c === "object" && c !== null)
    .map((c) => ({
      name: String(c.name ?? ""),
      hex: String(c.hex ?? "#CCCCCC"),
      images: Array.isArray(c.images) ? c.images.filter((i): i is string => typeof i === "string") : [],
      sizes: Array.isArray(c.sizes) ? c.sizes.filter((s): s is string => typeof s === "string") : [],
    }))
    .filter((c) => c.name.trim().length > 0);
}
