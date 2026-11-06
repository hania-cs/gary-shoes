import { Link } from "react-router-dom";
import categoryHeels from "@/assets/category-heels.webp";
import categoryBoots from "@/assets/category-boots.webp";
import categoryBalletsLoafers from "@/assets/category-ballerinas.webp";

const categories = [
  { name: "Boots", image: categoryBoots, slug: "boots" },
  { name: "Heels", image: categoryHeels, slug: "heels" },
  { name: "Ballets & Loafers", image: categoryBalletsLoafers, slug: "ballets-loafers" },
];

const CategoryGrid = () => {
  return (
    <>
      <style>{`
        .cg-root {
          background: #FAF7F2;
          padding: 5rem 0 6.5rem;
        }

        .cg-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 3rem;
        }
        @media (max-width: 767px) { .cg-inner { padding: 0 1.25rem; } }

        /* ── Header ── */
        .cg-header { text-align: center; margin-bottom: 3.5rem; }
        .cg-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #8B8075;
          margin-bottom: 1rem;
        }
        .cg-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 4.5vw, 4rem);
          font-weight: 300;
          line-height: 1;
          color: #0D0D0D;
          letter-spacing: -0.01em;
        }
        .cg-headline em { font-style: italic; color: #6B5444; }

        /* ── Circles row ── */
        .cg-row-wrap {
          display: flex;
          justify-content: center;
          gap: clamp(2rem, 6vw, 5rem);
        }
        @media (max-width: 767px) {
          .cg-row-wrap { gap: 1.1rem; }
        }

        .cg-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.4rem;
          text-decoration: none;
          flex: 0 1 240px;
        }

        .cg-circle {
          width: 100%;
          max-width: 240px;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
          transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .cg-circle::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(201, 169, 110, 0);
          transform: scale(1);
          transition: border-color 0.4s ease, transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          pointer-events: none;
        }
        .cg-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .cg-item:hover .cg-circle { transform: translateY(-6px); }
        .cg-item:hover .cg-circle::after {
          border-color: rgba(201, 169, 110, 0.8);
          transform: scale(1.06);
        }
        .cg-item:hover .cg-circle img { transform: scale(1.06); }

        .cg-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.05rem, 1.8vw, 1.5rem);
          font-weight: 400;
          color: #0D0D0D;
          letter-spacing: 0.02em;
          text-align: center;
          line-height: 1.15;
          transition: color 0.3s ease, font-style 0.3s ease;
        }
        .cg-item:hover .cg-name { color: #6B5444; font-style: italic; }

        .cg-item:focus-visible {
          outline: 1px solid #6B5444;
          outline-offset: 6px;
          border-radius: 4px;
        }

        @media (max-width: 767px) {
          .cg-root { padding: 3.5rem 0 4rem; }
          .cg-header { margin-bottom: 2.25rem; }
          .cg-row-wrap {
            flex-wrap: wrap;
            row-gap: 2.25rem;
            column-gap: 1rem;
          }
          .cg-item { gap: 0.9rem; flex: 0 0 calc(50% - 0.5rem); }
          .cg-circle { max-width: none; }
          .cg-name { font-size: 1.35rem; letter-spacing: 0.03em; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cg-circle, .cg-circle::after, .cg-circle img, .cg-name { transition: none; }
        }
      `}</style>

      <section className="cg-root">
        <div className="cg-inner">

          <div className="cg-header">
            <p className="cg-eyebrow">Shop by Category</p>
            <h2 className="cg-headline">
              Our <em>Categories</em>
            </h2>
          </div>

          <div className="cg-row-wrap">
            {categories.map((cat) => (
              <Link key={cat.slug} to={`/shop?category=${cat.slug}`} className="cg-item">
                <span className="cg-circle">
                  <img src={cat.image} alt={cat.name} loading="lazy" />
                </span>
                <span className="cg-name">{cat.name}</span>
              </Link>
            ))}
          </div>

        </div>
      </section>
    </>
  );
};

export default CategoryGrid;
