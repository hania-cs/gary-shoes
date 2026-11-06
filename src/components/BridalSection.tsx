import { Link } from "react-router-dom";
import bridalImg from "@/assets/bridal-collection.webp";

const BridalSection = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

        .br-root {
          position: relative;
          background: #FAF7F2;
          overflow: hidden;
        }
        .br-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
          opacity: 0.4;
        }

        .br-grid {
          display: grid;
          grid-template-columns: 1fr;
          min-height: 600px;
          position: relative;
          z-index: 2;
        }
        @media (max-width: 1023px) {
          .br-grid {
            grid-template-rows: 1fr;
          }
          .br-grid > * {
            grid-row: 1;
            grid-column: 1;
          }
        }
        @media (min-width: 1024px) {
          .br-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .br-image-wrap {
          position: relative;
          overflow: hidden;
          min-height: 500px;
          order: 1;
        }
        @media (min-width: 1024px) { .br-image-wrap { min-height: unset; } }

        .br-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transform: scale(1.04);
          transition: transform 1.2s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .br-image-wrap:hover img {
          transform: scale(1);
        }

        .br-image-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to left, transparent 60%, #FAF7F2 100%);
          pointer-events: none;
        }
        @media (max-width: 1023px) {
          .br-image-wrap::after {
            background: linear-gradient(to top, rgba(13,13,13,0.75) 0%, rgba(13,13,13,0.45) 40%, transparent 70%);
          }
        }

        .br-corner {
          position: absolute;
          width: 36px;
          height: 36px;
          z-index: 3;
        }
        .br-corner-tl {
          top: 1.5rem; left: 1.5rem;
          border-top: 1px solid #C9A96E;
          border-left: 1px solid #C9A96E;
          opacity: 0.6;
        }
        .br-corner-br {
          bottom: 1.5rem; right: 1.5rem;
          border-bottom: 1px solid #C9A96E;
          border-right: 1px solid #C9A96E;
          opacity: 0.6;
        }

        .br-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 2.5rem 1.5rem;
          order: 2;
          position: relative;
        }
        @media (max-width: 1023px) {
          .br-content {
            z-index: 4;
            justify-content: flex-end;
            padding: 2rem 1.5rem;
          }
          .br-content .br-eyebrow-text,
          .br-content .br-body { color: rgba(240,230,211,0.85); }
          .br-content .br-headline { color: #F0E6D3; }
          .br-content .br-headline em { color: #C9A96E; }
          .br-content .br-divider-line { background: rgba(224,213,197,0.4); }
        }
        @media (min-width: 768px) { .br-content { padding: 3rem 2rem; } }
        @media (min-width: 1024px) { .br-content { order: 1; padding: 5rem 5rem 5rem 4rem; } }

        .br-content::after {
          content: '';
          position: absolute;
          right: 0;
          top: 15%;
          bottom: 15%;
          width: 1px;
          background: linear-gradient(to bottom, transparent, #C9A96E 30%, #C9A96E 70%, transparent);
          opacity: 0.3;
          display: none;
        }
        @media (min-width: 1024px) { .br-content::after { display: block; } }

        .br-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          margin-bottom: 2rem;
          opacity: 0;
          animation: br-fadeUp 0.7s ease forwards 0.1s;
        }
        .br-eyebrow-dash {
          width: 28px; height: 1px;
          background: #C9A96E;
          flex-shrink: 0;
        }
        .br-eyebrow-text {
          font-family: 'Jost', sans-serif;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #8B8075;
        }

        .br-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 5vw, 4.8rem);
          font-weight: 300;
          line-height: 0.92;
          letter-spacing: -0.01em;
          color: #0D0D0D;
          margin-bottom: 2rem;
          opacity: 0;
          animation: br-fadeUp 0.8s ease forwards 0.25s;
        }
        .br-headline em {
          font-style: italic;
          font-weight: 300;
          color: #C9A96E;
        }

        .br-divider {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 2rem;
          opacity: 0;
          animation: br-fadeUp 0.7s ease forwards 0.4s;
        }
        .br-divider-line { width: 48px; height: 1px; background: #E0D5C5; }
        .br-divider-dot { width: 4px; height: 4px; border-radius: 50%; background: #C9A96E; opacity: 0.7; }

        .br-body {
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
          font-weight: 200;
          line-height: 2;
          letter-spacing: 0.04em;
          color: #5A5248;
          max-width: 380px;
          margin-bottom: 3rem;
          opacity: 0;
          animation: br-fadeUp 0.7s ease forwards 0.45s;
        }

        .br-cta {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.9rem;
          padding: 1rem 2.2rem;
          background: #0D0D0D;
          color: #F0E6D3;
          font-family: 'Jost', sans-serif;
          font-size: 0.6rem;
          font-weight: 300;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          text-decoration: none;
          align-self: flex-start;
          overflow: hidden;
          transition: all 0.4s ease;
          opacity: 0;
          animation: br-fadeUp 0.7s ease forwards 0.6s;
        }
        .br-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #2A2A2A;
          transform: translateX(-100%);
          transition: transform 0.4s ease;
        }
        .br-cta:hover::before { transform: translateX(0); }
        .br-cta span { position: relative; z-index: 1; }
        .br-cta-arrow {
          position: relative; z-index: 1;
          width: 16px; height: 1px;
          background: #C9A96E;
          flex-shrink: 0;
          transition: width 0.3s ease;
        }
        .br-cta-arrow::after {
          content: '';
          position: absolute;
          right: 0; top: -3px;
          width: 6px; height: 6px;
          border-right: 1px solid #C9A96E;
          border-top: 1px solid #C9A96E;
          transform: rotate(45deg);
        }
        .br-cta:hover .br-cta-arrow { width: 24px; }

        @keyframes br-fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section className="br-root">
        <div className="br-grid">
          {/* Content — left on desktop */}
          <div className="br-content">
            <div className="br-eyebrow">
              <div className="br-eyebrow-dash" />
              <span className="br-eyebrow-text">New Arrivals</span>
            </div>

            <h2 className="br-headline">
              Bridal
              <br />
              <em>Collection</em>
            </h2>

            <div className="br-divider">
              <div className="br-divider-line" />
              <div className="br-divider-dot" />
              <div className="br-divider-line" />
            </div>

            <p className="br-body">
              Walk down the aisle in timeless elegance. Our bridal collection features
              exquisite heels and sandals crafted for your most unforgettable day —
              designed with love, worn with grace.
            </p>

            <Link to="/shop?category=bridal" className="br-cta">
              <span>Shop Bridal</span>
              <span className="br-cta-arrow" />
            </Link>
          </div>

          {/* Image — right on desktop */}
          <div className="br-image-wrap">
            <div className="br-corner br-corner-tl" />
            <div className="br-corner br-corner-br" />
            <img src={bridalImg} alt="Bridal collection — white heels" loading="lazy" />
          </div>
        </div>
      </section>
    </>
  );
};

export default BridalSection;
