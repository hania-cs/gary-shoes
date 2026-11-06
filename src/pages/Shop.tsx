import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InstagramBanner from "@/components/InstagramBanner";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/lib/products";
import { fetchCategories, categorySlug } from "@/lib/categories";
import { Package } from "lucide-react";

// Every shop filter maps to exactly one catalog category, and its URL slug is
// derived from that category's name. A homepage link named "Boots" therefore
// lands on the shop's "Boots" category, "After Dark Selection" on the shop's
// "After Dark Selection" category, and so on.
const slugOf = (category: string) => categorySlug(category);

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  const { data: dbCategories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const allCategories = Array.from(new Set(["All", ...dbCategories.map((c) => c.name)]));

  const [activeCategory, setActiveCategory] = useState("All");

  // Sync active category from URL once categories are loaded
  useEffect(() => {
    if (!categoryParam) {
      setActiveCategory("All");
      return;
    }
    const match = allCategories.find((c) => slugOf(c) === categoryParam);
    setActiveCategory(match ?? "All");
  }, [categoryParam, dbCategories]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", activeCategory],
    queryFn: () => fetchProducts(activeCategory),
  });

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    if (cat === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: slugOf(cat) });
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Gary Shoes Shop",
    description: "Browse our curated collection of premium footwear including heels, ballerinas, mules, loafers and more.",
    url: "https://garyshoes.com/shop",
  };

  return (
    <>
      <Helmet>
        <title>Shop Premium Footwear — Gary Shoes</title>
        <meta name="description" content="Browse our curated collection of elegant heels, ballerinas, mules, loafers and more. Premium footwear at Gary Shoes, Bourj Hammoud, Lebanon." />
        <meta property="og:title" content="Shop — Gary Shoes" />
        <meta property="og:description" content="Discover premium footwear. Heels, ballerinas, mules & more." />
        <link rel="canonical" href="https://garyshoes.com/shop" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

        /* ── Shared ── */
        .sh-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.9rem;
          margin-bottom: 1.4rem;
        }
        .sh-eyebrow-dash { width: 28px; height: 1px; background: #6B5444; }
        .sh-eyebrow-text {
          font-family: 'Jost', sans-serif;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #8B8075;
        }

        /* ══════════════════════════════
           HERO
        ══════════════════════════════ */
        .sh-hero {
          position: relative;
          background: #FAF7F2;
          padding: 10rem 0 6rem;
          text-align: center;
          overflow: hidden;
        }
        .sh-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; opacity: 0.4;
        }
        .sh-hero::after {
          content: '';
          position: absolute;
          top: 60%; left: 50%;
          transform: translate(-50%, -50%);
          width: 700px; height: 300px;
          background: radial-gradient(ellipse, rgba(107,84,68,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .sh-hero-inner {
          position: relative; z-index: 1;
        }
        .sh-hero h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3.5rem, 7vw, 7rem);
          font-weight: 300;
          line-height: 0.92;
          color: #0D0D0D;
          letter-spacing: -0.01em;
        }
        .sh-hero h1 em {
          font-style: italic;
          color: #6B5444;
        }
        .sh-hero-ornament {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          margin-top: 2rem;
        }
        .sh-orn-line {
          width: 56px; height: 1px;
          background: linear-gradient(to right, transparent, rgba(107,84,68,0.5));
        }
        .sh-orn-line.rev { background: linear-gradient(to left, transparent, rgba(107,84,68,0.5)); }
        .sh-orn-diamond {
          width: 5px; height: 5px;
          background: #6B5444;
          transform: rotate(45deg); opacity: 0.6;
        }

        /* ══════════════════════════════
           FILTERS
        ══════════════════════════════ */
        .sh-filters {
          background: #FAF7F2;
          border-bottom: 1px solid rgba(107,84,68,0.2);
          position: sticky;
          top: 80px;
          z-index: 40;
        }
        .sh-filters::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; opacity: 0.3;
        }
        .sh-filters-inner {
          position: relative; z-index: 1;
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.2rem;
          overflow-x: auto;
          height: 64px;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .sh-filters-inner::-webkit-scrollbar { display: none; }
        @media (min-width: 768px) { .sh-filters-inner { padding: 0 3rem; gap: 2.5rem; } }

        .sh-filter-btn {
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem;
          font-weight: 400;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #8B8075;
          background: none;
          border: none;
          border-bottom: 1px solid transparent;
          padding-bottom: 2px;
          cursor: pointer;
          white-space: nowrap;
          transition: color 0.3s ease, border-color 0.3s ease;
        }
        .sh-filter-btn:hover {
          color: #50453A;
        }
        .sh-filter-btn.active {
          color: #50453A;
          border-bottom-color: #6B5444;
          font-weight: 500;
        }

        /* Sale badge on card */
        .sh-sale-tag {
          position: absolute;
          top: 10px; left: 10px;
          font-family: 'Jost', sans-serif;
          font-size: 0.5rem;
          font-weight: 400;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #FAF7F2;
          background: #9B3A3A;
          padding: 0.25rem 0.6rem;
          z-index: 2;
        }

        .sh-oos-tag {
          position: absolute;
          top: 10px; left: 10px;
          font-family: 'Jost', sans-serif;
          font-size: 0.5rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #50453A;
          background: #FAF7F2;
          border: 1px solid rgba(58,53,48,0.4);
          padding: 0.25rem 0.6rem;
          z-index: 2;
        }

        /* Divider dots between filters */
        .sh-filter-sep {
          width: 3px; height: 3px;
          background: rgba(107,84,68,0.35);
          transform: rotate(45deg);
          flex-shrink: 0;
        }

        /* ══════════════════════════════
           PRODUCTS SECTION
        ══════════════════════════════ */
        .sh-products {
          background: #FAF7F2;
          padding: 6rem 0 8rem;
        }
        .sh-products-inner {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        @media (min-width: 768px) { .sh-products-inner { padding: 0 3rem; } }

        /* Grid */
        .sh-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2px;
        }
        @media (min-width: 768px)  { .sh-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1200px) { .sh-grid { grid-template-columns: repeat(4, 1fr); } }

        /* Product Card */
        .sh-card {
          position: relative;
          background: #FAF7F2;
          cursor: pointer;
          overflow: hidden;
          transition: background 0.35s ease;
        }
        .sh-card:hover { background: #FDF9F4; }

        .sh-card-img {
          position: relative;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: #F0EBE3;
        }
        .sh-card-img img {
          width: 100%; height: 100%;
          object-fit: contain;
          display: block;
          transition: transform 0.7s ease;
        }
        .sh-card:hover .sh-card-img img {
          transform: none;
        }

        /* Hover overlay */
        .sh-card-overlay {
          position: absolute;
          inset: 0;
          background: rgba(10, 8, 6, 0);
          transition: background 0.4s ease;
          pointer-events: none;
        }
        .sh-card:hover .sh-card-overlay {
          background: rgba(10, 8, 6, 0.08);
        }

        /* Empty image placeholder */
        .sh-card-placeholder {
          width: 100%; height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sh-card-placeholder svg {
          color: rgba(107,84,68,0.3);
        }

        /* Gold corner brackets on hover */
        .sh-card-corner {
          position: absolute;
          width: 20px; height: 20px;
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .sh-card:hover .sh-card-corner { opacity: 1; }
        .sh-card-corner-tl { top: 8px; left: 8px; border-top: 1px solid #6B5444; border-left: 1px solid #6B5444; }
        .sh-card-corner-br { bottom: 8px; right: 8px; border-bottom: 1px solid #6B5444; border-right: 1px solid #6B5444; }

        /* Add to cart button */
        .sh-card-cart-btn {
          position: absolute;
          bottom: 12px; right: 12px;
          width: 36px; height: 36px;
          background: rgba(250,247,242,0.92);
          border: 1px solid rgba(107,84,68,0.4);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #50453A;
          opacity: 0; transform: translateY(8px);
          transition: opacity 0.3s ease, transform 0.3s ease, background 0.25s ease;
          z-index: 2;
        }
        .sh-card:hover .sh-card-cart-btn { opacity: 1; transform: translateY(0); }
        .sh-card-cart-btn:hover { background: #6B5444; color: #FAF7F2; }

        /* Carousel arrows */
        .sh-carousel-btn {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 28px; height: 28px; background: rgba(250,247,242,0.88);
          border: 1px solid rgba(107,84,68,0.3); display: flex;
          align-items: center; justify-content: center; cursor: pointer;
          color: #50453A; opacity: 0; z-index: 3;
          transition: opacity 0.3s, background 0.25s;
        }
        .sh-card:hover .sh-carousel-btn { opacity: 1; }
        .sh-carousel-btn:hover { background: #6B5444; color: #FAF7F2; }
        .sh-carousel-prev { left: 8px; }
        .sh-carousel-next { right: 8px; }

        /* Carousel dots */
        .sh-carousel-dots {
          position: absolute; bottom: 10px; left: 50%;
          transform: translateX(-50%); display: flex; gap: 5px; z-index: 3;
        }
        .sh-carousel-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(250,247,242,0.5); border: 1px solid rgba(107,84,68,0.4);
          cursor: pointer; padding: 0; transition: background 0.25s;
        }
        .sh-carousel-dot.active { background: #6B5444; }

        /* Card body */
        .sh-card-body {
          padding: 1rem 0.8rem 1.4rem;
          border-bottom: 1px solid rgba(107,84,68,0.12);
          border-left: 1px solid rgba(107,84,68,0.12);
          border-right: 1px solid rgba(107,84,68,0.12);
        }
        @media (min-width: 768px) { .sh-card-body { padding: 1.4rem 1.6rem 2rem; } }

        .sh-card-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 300;
          color: #0D0D0D;
          line-height: 1.2;
          margin-bottom: 0.4rem;
        }
        .sh-card-price {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          color: #6B5444;
          display: flex; gap: 0.6rem; align-items: baseline; flex-wrap: wrap;
        }
        .sh-price-old { text-decoration: line-through; color: #9A938A; }
        .sh-price-new { color: #9B3A3A; font-weight: 400; }

        /* Color swatches on card */
        .sh-card-swatches {
          display: flex; gap: 6px; margin-top: 0.7rem; flex-wrap: wrap;
        }
        .sh-swatch {
          width: 16px; height: 16px; border-radius: 50%;
          border: 1px solid rgba(107,84,68,0.3);
          padding: 0; cursor: pointer;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .sh-swatch:hover { transform: scale(1.15); border-color: #6B5444; }
        .sh-swatch.active {
          border-color: #6B5444;
          box-shadow: 0 0 0 1px #6B5444;
        }

        /* ── Skeleton loader ── */
        .sh-skeleton {
          background: #F0EBE3;
          animation: sh-pulse 1.6s ease-in-out infinite;
        }
        @keyframes sh-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .sh-skeleton-img {
          aspect-ratio: 1 / 1;
        }
        .sh-skeleton-body { padding: 1.4rem 1.6rem; }
        .sh-skeleton-line {
          height: 12px;
          background: #E8E2D8;
          margin-bottom: 0.6rem;
        }

        /* ── Empty state ── */
        .sh-empty {
          text-align: center;
          padding: 6rem 0;
          grid-column: 1 / -1;
        }
        .sh-empty-icon {
          width: 40px; height: 40px;
          margin: 0 auto 1.5rem;
          color: rgba(107,84,68,0.4);
        }
        .sh-empty h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 300;
          font-style: italic;
          color: #8B8075;
          margin-bottom: 0.7rem;
        }
        .sh-empty p {
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          font-weight: 200;
          letter-spacing: 0.1em;
          color: #8B8075;
        }
      `}</style>

      <div className="min-h-screen">
        <Navbar />

        {/* ── Hero ── */}
        <section className="sh-hero">
          <div className="sh-hero-inner">
            <div className="sh-eyebrow" style={{ justifyContent: "center" }}>
              <div className="sh-eyebrow-dash" />
              <span className="sh-eyebrow-text">Curated Collection</span>
              <div className="sh-eyebrow-dash" />
            </div>
            <h1>Our <em>Shop</em></h1>
            <div className="sh-hero-ornament">
              <div className="sh-orn-line" />
              <div className="sh-orn-diamond" />
              <div className="sh-orn-line rev" />
            </div>
          </div>
        </section>

        {/* ── Filters ── */}
        <section className="sh-filters">
          <div className="sh-filters-inner">
            {allCategories.map((cat, i) => (
              <span key={cat} style={{ display: "contents" }}>
                <button
                  onClick={() => handleCategoryClick(cat)}
                  className={`sh-filter-btn${activeCategory === cat ? " active" : ""}`}
                >
                  {cat}
                </button>
                {i < allCategories.length - 1 && (
                  <div className="sh-filter-sep" />
                )}
              </span>
            ))}
          </div>
        </section>

        {/* ── Products ── */}
        <section className="sh-products">
          <div className="sh-products-inner">
            <div className="sh-grid">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <div key={i}>
                      <div className="sh-skeleton sh-skeleton-img" />
                      <div className="sh-skeleton-body">
                        <div className="sh-skeleton-line" style={{ width: "70%" }} />
                        <div className="sh-skeleton-line" style={{ width: "30%" }} />
                      </div>
                    </div>
                  ))
                : products.length === 0
                ? (
                  <div className="sh-empty">
                    <Package className="sh-empty-icon" />
                    <h3>Nothing here yet</h3>
                    <p>Check back soon for new arrivals</p>
                  </div>
                )
                : products.map((product) => (
                    <ProductCard key={product.id} product={product as any} />
                  ))}
            </div>
          </div>
        </section>

        <InstagramBanner />
        <Footer />
      </div>
    </>
  );
};

export default Shop;