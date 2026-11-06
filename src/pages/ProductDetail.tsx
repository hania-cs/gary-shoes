import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { parseProductColors } from "@/lib/colors";
import { effectivePrice, hasSalePrice } from "@/lib/pricing";
import { toast } from "sonner";
import { Package, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColorIdx, setSelectedColorIdx] = useState<number | null>(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const colors = useMemo(() => parseProductColors((product as any)?.colors), [product]);
  const fallbackSizes: string[] = ((product as any)?.sizes as string[] | null) || [];

  // Sizes shown depend on selected color (per-color sizes). If no colors, use fallback.
  const sizes: string[] =
    colors.length > 0
      ? selectedColorIdx !== null
        ? colors[selectedColorIdx].sizes
        : []
      : fallbackSizes;

  const baseImages: string[] = product
    ? [
        ...(product.image_url ? [product.image_url] : []),
        ...((product as any).additional_images || []),
      ]
    : [];

  const allImages =
    selectedColorIdx !== null && colors[selectedColorIdx]?.images.length
      ? colors[selectedColorIdx].images
      : baseImages;

  const safeIdx = allImages.length ? currentImage % allImages.length : 0;
  const nextImage = () => setCurrentImage((p) => (p + 1) % allImages.length);
  const prevImage = () => setCurrentImage((p) => (p - 1 + allImages.length) % allImages.length);

  const isOutOfStock =
    colors.length > 0
      ? colors.every((c) => !c.sizes || c.sizes.length === 0)
      : fallbackSizes.length === 0;
  const isSelectedColorOOS =
    selectedColorIdx !== null &&
    (!colors[selectedColorIdx].sizes || colors[selectedColorIdx].sizes.length === 0);
  const onSale = product ? hasSalePrice(product) : false;
  const finalPrice = product ? effectivePrice(product) : 0;

  const handleAdd = () => {
    if (!product) return;
    if (isOutOfStock) {
      toast.error("This product is out of stock");
      return;
    }
    if (colors.length > 0 && selectedColorIdx === null) {
      toast.error("Please select a color");
      return;
    }
    if (isSelectedColorOOS) {
      toast.error("This color is out of stock");
      return;
    }
    if (sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    const colorName = selectedColorIdx !== null ? colors[selectedColorIdx].name : null;
    const colorImg = selectedColorIdx !== null ? colors[selectedColorIdx].images[0] : null;
    addItem({
      product_id: product.id,
      name: product.name,
      price: finalPrice,
      image_url: colorImg || product.image_url,
      size: selectedSize,
      color: colorName,
    });
  };

  const structuredData = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: allImages,
        offers: {
          "@type": "Offer",
          price: finalPrice,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        category: product.category,
      }
    : null;

  return (
    <>
      {product && (
        <Helmet>
          <title>{`${product.name} — Gary Shoes`}</title>
          <meta name="description" content={(product.description?.slice(0, 155)) || `Shop ${product.name} from Gary Shoes. Premium ${product.category} footwear. $${product.price.toFixed(2)}`} />
          <meta property="og:title" content={`${product.name} — Gary Shoes`} />
          <meta property="og:description" content={`Premium ${product.category} — $${product.price.toFixed(2)}`} />
          {allImages[0] && <meta property="og:image" content={allImages[0]} />}
          <link rel="canonical" href={`https://garyshoes.com/product/${product.id}`} />
          {structuredData && (
            <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
          )}
        </Helmet>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

        .pd-page { min-height: 100vh; background: #FAF7F2; }
        .pd-container { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem 4rem; }
        @media (min-width: 768px) { .pd-container { padding: 3rem 3rem 6rem; } }

        .pd-back {
          display: inline-flex; align-items: center; gap: 0.6rem;
          font-family: 'Jost', sans-serif; font-size: 0.6rem; font-weight: 300;
          letter-spacing: 0.25em; text-transform: uppercase; color: #8B8075;
          text-decoration: none; margin-bottom: 2rem; transition: color 0.3s;
        }
        .pd-back:hover { color: #50453A; }

        .pd-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media (min-width: 768px) { .pd-layout { grid-template-columns: 1fr 1fr; gap: 4rem; } }

        .pd-gallery { position: relative; }
        .pd-main-img {
          aspect-ratio: 1 / 1; width: 100%; object-fit: contain; display: block; background: #F0EBE3;
        }
        .pd-nav-btn {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 40px; height: 40px; background: rgba(250,247,242,0.9);
          border: 1px solid rgba(107,84,68,0.3); display: flex;
          align-items: center; justify-content: center; cursor: pointer;
          color: #50453A; transition: background 0.25s;
        }
        .pd-nav-btn:hover { background: #6B5444; color: #FAF7F2; }
        .pd-nav-prev { left: 12px; } .pd-nav-next { right: 12px; }

        .pd-thumbs { display: flex; gap: 8px; margin-top: 12px; overflow-x: auto; }
        .pd-thumb {
          width: 64px; height: 64px; flex-shrink: 0; object-fit: contain;
          cursor: pointer; border: 2px solid transparent;
          opacity: 0.6; transition: opacity 0.25s, border-color 0.25s;
        }
        .pd-thumb:hover, .pd-thumb.active { opacity: 1; border-color: #6B5444; }
        @media (min-width: 768px) { .pd-thumb { width: 80px; height: 80px; } }

        .pd-info { display: flex; flex-direction: column; justify-content: center; }
        .pd-category {
          font-family: 'Jost', sans-serif; font-size: 0.58rem; font-weight: 300;
          letter-spacing: 0.35em; text-transform: uppercase; color: #8B8075;
          margin-bottom: 1rem;
        }
        .pd-name {
          font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 300; color: #0D0D0D; line-height: 1.1; margin-bottom: 1rem;
        }
        .pd-price {
          font-family: 'Jost', sans-serif; font-size: 1.1rem; font-weight: 300;
          letter-spacing: 0.1em; color: #6B5444; margin-bottom: 2rem;
          display: flex; gap: 0.9rem; align-items: baseline; flex-wrap: wrap;
        }
        .pd-price-old { text-decoration: line-through; color: #9A938A; font-size: 0.95rem; }
        .pd-price-new { color: #9B3A3A; font-weight: 400; }
        .pd-sale-tag {
          display: inline-block; font-family: 'Jost', sans-serif; font-size: 0.55rem;
          font-weight: 400; letter-spacing: 0.15em; text-transform: uppercase;
          color: #FAF7F2; background: #9B3A3A; padding: 0.3rem 0.8rem; margin-bottom: 1.5rem;
        }

        /* Variant selectors */
        .pd-variant-block { margin-bottom: 1.6rem; }
        .pd-variant-label {
          display: block;
          font-family: 'Jost', sans-serif; font-size: 0.55rem; font-weight: 300;
          letter-spacing: 0.3em; text-transform: uppercase; color: #8B8075;
          margin-bottom: 0.7rem;
        }
        .pd-variant-label .pd-variant-value {
          color: #50453A; margin-left: 0.5rem; letter-spacing: 0.15em;
        }
        .pd-color-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .pd-color-swatch {
          width: 32px; height: 32px; border-radius: 50%;
          border: 1px solid rgba(107,84,68,0.4); padding: 0; cursor: pointer;
          transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
        }
        .pd-color-swatch:hover { transform: scale(1.08); border-color: #6B5444; }
        .pd-color-swatch.active {
          border-color: #6B5444; box-shadow: 0 0 0 2px #6B5444, inset 0 0 0 2px #FAF7F2;
        }

        .pd-size-row {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
          gap: 0.5rem;
        }
        .pd-size-btn {
          padding: 0.7rem 0.4rem; background: transparent;
          border: 1px solid rgba(107,84,68,0.3); color: #5A5248;
          font-family: 'Jost', sans-serif; font-size: 0.75rem; font-weight: 400;
          letter-spacing: 0.08em; cursor: pointer;
          transition: background 0.25s, color 0.25s, border-color 0.25s;
        }
        .pd-size-btn:hover { border-color: #6B5444; color: #50453A; }
        .pd-size-btn.active {
          background: #6B5444; border-color: #6B5444; color: #FAF7F2;
        }
        .pd-no-sizes {
          font-family: 'Jost', sans-serif; font-size: 0.65rem; font-weight: 300;
          letter-spacing: 0.15em; color: #8B8075; font-style: italic;
        }

        .pd-add-btn {
          display: inline-flex; align-items: center; gap: 0.8rem;
          padding: 1rem 2.5rem; border: 1px solid rgba(107,84,68,0.5);
          background: transparent; color: #50453A; font-family: 'Jost', sans-serif;
          font-size: 0.6rem; font-weight: 300; letter-spacing: 0.28em;
          text-transform: uppercase; cursor: pointer; position: relative; overflow: hidden;
          transition: color 0.35s, border-color 0.35s; align-self: flex-start;
        }
        .pd-add-btn::before {
          content: ''; position: absolute; inset: 0; background: #6B5444;
          transform: translateX(-100%); transition: transform 0.35s;
        }
        .pd-add-btn:hover::before { transform: translateX(0); }
        .pd-add-btn:hover { color: #0D0D0D; border-color: #6B5444; }
        .pd-add-btn span, .pd-add-btn svg { position: relative; z-index: 1; }

        .pd-description {
          margin-top: 2.4rem; padding-top: 1.8rem;
          border-top: 1px solid rgba(107,84,68,0.2);
          font-family: 'Jost', sans-serif; font-size: 0.85rem; font-weight: 300;
          line-height: 1.75; letter-spacing: 0.03em; color: #5A5248;
          max-width: 46ch; white-space: pre-wrap;
        }

        .pd-loading {
          text-align: center; padding: 8rem 0;
          font-family: 'Jost', sans-serif; font-size: 0.65rem;
          letter-spacing: 0.3em; text-transform: uppercase; color: #8B8075;
        }
      `}</style>

      <div className="pd-page">
        <Navbar />
        <div className="pd-container">
          <Link to="/shop" className="pd-back">← Back to Shop</Link>

          {isLoading ? (
            <div className="pd-loading">Loading…</div>
          ) : !product ? (
            <div className="pd-loading">Product not found</div>
          ) : (
            <article className="pd-layout" itemScope itemType="https://schema.org/Product">
              <div className="pd-gallery">
                {allImages.length > 0 ? (
                  <>
                    <img
                      src={allImages[safeIdx]}
                      alt={`${product.name} - image ${safeIdx + 1}`}
                      className="pd-main-img"
                      width="1090"
                      height="1090"
                      itemProp="image"
                    />
                    {allImages.length > 1 && (
                      <>
                        <button className="pd-nav-btn pd-nav-prev" onClick={prevImage} aria-label="Previous image">
                          <ChevronLeft size={18} />
                        </button>
                        <button className="pd-nav-btn pd-nav-next" onClick={nextImage} aria-label="Next image">
                          <ChevronRight size={18} />
                        </button>
                        <div className="pd-thumbs" role="list" aria-label="Product images">
                          {allImages.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt={`${product.name} thumbnail ${i + 1}`}
                              className={`pd-thumb${i === safeIdx ? " active" : ""}`}
                              onClick={() => setCurrentImage(i)}
                              loading="lazy"
                              role="listitem"
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="pd-main-img" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Package size={60} style={{ color: "rgba(107,84,68,0.3)" }} />
                  </div>
                )}
              </div>

              <div className="pd-info">
                <div className="pd-category">{product.category}</div>
                <h1 className="pd-name" itemProp="name">{product.name}</h1>
                {(product as any).is_on_sale && !isOutOfStock && <div className="pd-sale-tag">Sale</div>}
                {isOutOfStock && <div className="pd-sale-tag" style={{ background: "#50453A" }}>Out of Stock</div>}
                <div className="pd-price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                  {onSale ? (
                    <>
                      <span className="pd-price-old">${product.price.toFixed(2)}</span>
                      <span className="pd-price-new" itemProp="price">${finalPrice.toFixed(2)}</span>
                    </>
                  ) : (
                    <span itemProp="price">${product.price.toFixed(2)}</span>
                  )}
                  <meta itemProp="priceCurrency" content="USD" />
                </div>

                {colors.length > 0 && (
                  <div className="pd-variant-block">
                    <span className="pd-variant-label">
                      Color
                      {selectedColorIdx !== null && (
                        <span className="pd-variant-value">{colors[selectedColorIdx].name}</span>
                      )}
                    </span>
                    <div className="pd-color-row">
                      {colors.map((c, i) => (
                        <button
                          key={`${c.name}-${i}`}
                          type="button"
                          className={`pd-color-swatch${selectedColorIdx === i ? " active" : ""}`}
                          style={{ background: c.hex }}
                          aria-label={c.name}
                          title={c.name}
                          onClick={() => {
                            setSelectedColorIdx(i);
                            setSelectedSize(null);
                            setCurrentImage(0);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="pd-variant-block">
                  <span className="pd-variant-label">
                    Size (EU)
                    {selectedSize && <span className="pd-variant-value">{selectedSize}</span>}
                  </span>
                  {colors.length > 0 && selectedColorIdx === null ? (
                    <p className="pd-no-sizes">Select a color to see available sizes</p>
                  ) : sizes.length === 0 ? (
                    <p className="pd-no-sizes" style={{ color: "#9B3A3A", fontStyle: "normal", letterSpacing: "0.25em", textTransform: "uppercase" }}>Out of Stock</p>

                  ) : (
                    <div className="pd-size-row">
                      {sizes.map((s) => (
                        <button
                          type="button"
                          key={s}
                          className={`pd-size-btn${selectedSize === s ? " active" : ""}`}
                          onClick={() => setSelectedSize(s)}
                          aria-pressed={selectedSize === s}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  className="pd-add-btn"
                  onClick={handleAdd}
                  disabled={isOutOfStock || isSelectedColorOOS}
                  style={isOutOfStock || isSelectedColorOOS ? { opacity: 0.55, cursor: "not-allowed" } : undefined}
                >
                  <ShoppingBag size={16} />
                  <span>{isOutOfStock || isSelectedColorOOS ? "Out of Stock" : "Add to Cart"}</span>
                </button>

                {product.description && (
                  <div className="pd-description" itemProp="description">
                    {product.description}
                  </div>
                )}
              </div>
            </article>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ProductDetail;
