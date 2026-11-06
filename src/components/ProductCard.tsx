import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { parseProductColors } from "@/lib/colors";
import { effectivePrice, hasSalePrice } from "@/lib/pricing";
import { Package, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    category: string;
    image_url: string | null;
    is_on_sale?: boolean | null;
    sale_price?: number | null;
    additional_images?: string[] | null;
    colors?: unknown;
    sizes?: string[] | null;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const colors = useMemo(() => parseProductColors(product.colors), [product.colors]);
  const [activeColorIdx, setActiveColorIdx] = useState<number | null>(null);
  const [currentImg, setCurrentImg] = useState(0);

  const baseImages: string[] = [
    ...(product.image_url ? [product.image_url] : []),
    ...(product.additional_images || []),
  ];

  const allImages =
    activeColorIdx !== null && colors[activeColorIdx]?.images.length
      ? colors[activeColorIdx].images
      : baseImages;

  const hasMultiple = allImages.length > 1;
  const safeIdx = currentImg % Math.max(allImages.length, 1);

  const isOutOfStock =
    colors.length > 0
      ? colors.every((c) => !c.sizes || c.sizes.length === 0)
      : !product.sizes || product.sizes.length === 0;
  const onSale = hasSalePrice(product);

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((p) => (p + 1) % allImages.length);
  };
  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((p) => (p - 1 + allImages.length) % allImages.length);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) {
      navigate(`/product/${product.id}`);
      return;
    }
    // If product has variants requiring selection, route to detail page instead
    if ((product.sizes && product.sizes.length > 0) || colors.length > 0) {
      navigate(`/product/${product.id}`);
      return;
    }
    addItem({
      product_id: product.id,
      name: product.name,
      price: effectivePrice(product),
      image_url: product.image_url,
    });
  };

  return (
    <article
      className="sh-card"
      onClick={() => navigate(`/product/${product.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/product/${product.id}`)}
    >
      <div className="sh-card-img">
        {product.is_on_sale && !isOutOfStock && <div className="sh-sale-tag">Sale</div>}
        {isOutOfStock && <div className="sh-oos-tag">Out of Stock</div>}

        {allImages.length > 0 ? (
          <img
            src={allImages[safeIdx]}
            alt={`${product.name} — ${product.category} footwear${activeColorIdx !== null ? ` in ${colors[activeColorIdx].name}` : ""}`}
            loading="lazy"
            width="1090"
            height="1090"
          />
        ) : (
          <div className="sh-card-placeholder">
            <Package size={40} />
          </div>
        )}

        <div className="sh-card-overlay" />
        <div className="sh-card-corner sh-card-corner-tl" />
        <div className="sh-card-corner sh-card-corner-br" />

        {hasMultiple && (
          <>
            <button className="sh-carousel-btn sh-carousel-prev" onClick={goPrev} aria-label="Previous image">
              <ChevronLeft size={14} />
            </button>
            <button className="sh-carousel-btn sh-carousel-next" onClick={goNext} aria-label="Next image">
              <ChevronRight size={14} />
            </button>
          </>
        )}

        {hasMultiple && (
          <div className="sh-carousel-dots">
            {allImages.map((_, i) => (
              <button
                key={i}
                className={`sh-carousel-dot${i === safeIdx ? " active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImg(i);
                }}
                aria-label={`View image ${i + 1}`}
              />
            ))}
          </div>
        )}

        <button
          className="sh-card-cart-btn"
          onClick={handleQuickAdd}
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingBag size={16} />
        </button>
      </div>
      <div className="sh-card-body">
        <h2 className="sh-card-name">{product.name}</h2>
        <div className="sh-card-price">
          {onSale ? (
            <>
              <span className="sh-price-old">${product.price.toFixed(2)}</span>
              <span className="sh-price-new">${(product.sale_price as number).toFixed(2)}</span>
            </>
          ) : (
            <>${product.price.toFixed(2)}</>
          )}
        </div>
        {colors.length > 0 && (
          <div className="sh-card-swatches" onClick={(e) => e.stopPropagation()}>
            {colors.map((c, i) => (
              <button
                key={`${c.name}-${i}`}
                type="button"
                className={`sh-swatch${activeColorIdx === i ? " active" : ""}`}
                style={{ background: c.hex }}
                title={c.name}
                aria-label={`View ${c.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveColorIdx(i === activeColorIdx ? null : i);
                  setCurrentImg(0);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
