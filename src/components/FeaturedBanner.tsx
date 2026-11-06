import { Link } from "react-router-dom";

const FeaturedBanner = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

        .fb-root {
          position: relative;
          background: #FAF7F2;
          overflow: hidden;
          padding: 0;
        }

        /* ── Full-width top border rule ── */
        .fb-top-rule {
          width: 100%;
          height: 1px;
          background: linear-gradient(to right, transparent, #C9A96E 20%, #C9A96E 80%, transparent);
          opacity: 0.4;
        }
        .fb-bottom-rule {
          width: 100%;
          height: 1px;
          background: linear-gradient(to right, transparent, #C9A96E 20%, #C9A96E 80%, transparent);
          opacity: 0.4;
        }

        /* ── Outer frame ── */
        .fb-frame {
          position: relative;
          margin: 0 2.5rem;
          border-left: 1px solid rgba(201,169,110,0.18);
          border-right: 1px solid rgba(201,169,110,0.18);
        }
        @media (max-width: 767px) { .fb-frame { margin: 0 1rem; } }

        /* ── Large ghost year watermark ── */
        .fb-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(8rem, 18vw, 16rem);
          font-weight: 300;
          color: #0D0D0D;
          opacity: 0.03;
          pointer-events: none;
          white-space: nowrap;
          user-select: none;
          letter-spacing: -0.04em;
          z-index: 0;
        }

        /* ── Three-column structure ── */
        .fb-columns {
          display: grid;
          grid-template-columns: 1fr 2px 1fr 2px 1fr;
          position: relative;
          z-index: 1;
          min-height: 420px;
        }
        @media (max-width: 900px) {
          .fb-columns {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
          }
          .fb-col-divider { display: none; }
        }

        .fb-col-divider {
          background: linear-gradient(to bottom, transparent, rgba(201,169,110,0.25) 20%, rgba(201,169,110,0.25) 80%, transparent);
          align-self: stretch;
        }

        /* ── Left col: stats/marks ── */
        .fb-col-left {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3.5rem 2.5rem;
          gap: 2rem;
        }
        @media (max-width: 900px) { .fb-col-left { padding: 3rem 1.5rem 1.5rem; flex-direction: row; flex-wrap: wrap; gap: 1.5rem; } }

        .fb-stat {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          opacity: 0;
          animation: fb-fadeUp 0.7s ease forwards;
        }
        .fb-stat:nth-child(1) { animation-delay: 0.1s; }
        .fb-stat:nth-child(2) { animation-delay: 0.2s; }
        .fb-stat:nth-child(3) { animation-delay: 0.3s; }

        .fb-stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.8rem;
          font-weight: 300;
          line-height: 1;
          color: #0D0D0D;
          letter-spacing: -0.02em;
        }
        .fb-stat-num em {
          font-style: italic;
          color: #C9A96E;
        }
        .fb-stat-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.55rem;
          font-weight: 300;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #8B8075;
        }
        .fb-stat-rule {
          width: 24px;
          height: 1px;
          background: #C9A96E;
          opacity: 0.5;
          margin-top: 0.4rem;
        }

        /* ── Center col: main content ── */
        .fb-col-center {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 4rem 3rem;
          position: relative;
        }
        @media (max-width: 900px) { .fb-col-center { padding: 1.5rem 1.5rem 2rem; } }

        /* Corner brackets inside center col */
        .fb-bracket {
          position: absolute;
          width: 20px;
          height: 20px;
          opacity: 0.35;
        }
        .fb-bracket-tl { top: 1.2rem; left: 1.2rem; border-top: 1px solid #C9A96E; border-left: 1px solid #C9A96E; }
        .fb-bracket-tr { top: 1.2rem; right: 1.2rem; border-top: 1px solid #C9A96E; border-right: 1px solid #C9A96E; }
        .fb-bracket-bl { bottom: 1.2rem; left: 1.2rem; border-bottom: 1px solid #C9A96E; border-left: 1px solid #C9A96E; }
        .fb-bracket-br { bottom: 1.2rem; right: 1.2rem; border-bottom: 1px solid #C9A96E; border-right: 1px solid #C9A96E; }

        .fb-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 1.8rem;
          opacity: 0;
          animation: fb-fadeUp 0.7s ease forwards 0.15s;
        }
        .fb-eyebrow-dash { width: 22px; height: 1px; background: #C9A96E; flex-shrink: 0; }
        .fb-eyebrow-text {
          font-family: 'Jost', sans-serif;
          font-size: 0.55rem;
          font-weight: 300;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #8B8075;
        }

        .fb-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.6rem, 4vw, 4rem);
          font-weight: 300;
          line-height: 0.92;
          letter-spacing: -0.01em;
          color: #0D0D0D;
          margin-bottom: 1.6rem;
          opacity: 0;
          animation: fb-fadeUp 0.8s ease forwards 0.28s;
        }
        .fb-headline em { font-style: italic; color: #C9A96E; }

        .fb-ornament {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1.8rem;
          opacity: 0;
          animation: fb-fadeUp 0.7s ease forwards 0.38s;
        }
        .fb-ornament-line { width: 36px; height: 1px; background: #E0D5C5; }
        .fb-ornament-diamond {
          width: 5px; height: 5px;
          border: 1px solid #C9A96E;
          transform: rotate(45deg);
          opacity: 0.7;
          flex-shrink: 0;
        }

        .fb-body {
          font-family: 'Jost', sans-serif;
          font-size: 0.78rem;
          font-weight: 200;
          line-height: 2;
          letter-spacing: 0.04em;
          color: #5A5248;
          max-width: 320px;
          margin-bottom: 2.5rem;
          opacity: 0;
          animation: fb-fadeUp 0.7s ease forwards 0.45s;
        }

        .fb-cta {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.9rem;
          padding: 0.85rem 2rem;
          background: #0D0D0D;
          color: #F0E6D3;
          font-family: 'Jost', sans-serif;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          text-decoration: none;
          overflow: hidden;
          transition: all 0.4s ease;
          opacity: 0;
          animation: fb-fadeUp 0.7s ease forwards 0.55s;
        }
        .fb-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #C9A96E;
          transform: translateX(-100%);
          transition: transform 0.4s ease;
        }
        .fb-cta:hover::before { transform: translateX(0); }
        .fb-cta:hover { color: #0D0D0D; }
        .fb-cta span { position: relative; z-index: 1; }
        .fb-cta-arrow {
          position: relative; z-index: 1;
          width: 14px; height: 1px;
          background: currentColor;
          flex-shrink: 0;
          transition: width 0.3s ease;
        }
        .fb-cta-arrow::after {
          content: '';
          position: absolute;
          right: 0; top: -3px;
          width: 5px; height: 5px;
          border-right: 1px solid currentColor;
          border-top: 1px solid currentColor;
          transform: rotate(45deg);
        }
        .fb-cta:hover .fb-cta-arrow { width: 22px; }

        /* ── Right col: pullquote + details ── */
        .fb-col-right {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3.5rem 2.5rem;
          gap: 2rem;
        }
        @media (max-width: 900px) { .fb-col-right { padding: 1.5rem 1.5rem 3rem; border-top: 1px solid rgba(201,169,110,0.15); } }

        .fb-pullquote {
          opacity: 0;
          animation: fb-fadeUp 0.7s ease forwards 0.35s;
        }
        .fb-quote-mark {
          font-family: 'Cormorant Garamond', serif;
          font-size: 4rem;
          font-weight: 300;
          line-height: 0.6;
          color: #C9A96E;
          opacity: 0.35;
          margin-bottom: 0.8rem;
          display: block;
        }
        .fb-quote-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem;
          font-style: italic;
          font-weight: 300;
          color: #3A3530;
          line-height: 1.65;
          letter-spacing: 0.01em;
        }
        .fb-quote-attr {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-top: 1.2rem;
        }
        .fb-quote-attr-line { width: 16px; height: 1px; background: #C9A96E; opacity: 0.5; }
        .fb-quote-attr-text {
          font-family: 'Jost', sans-serif;
          font-size: 0.55rem;
          font-weight: 300;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #8B8075;
        }

        .fb-detail-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          opacity: 0;
          animation: fb-fadeUp 0.7s ease forwards 0.5s;
        }
        .fb-detail-item {
          display: flex;
          align-items: flex-start;
          gap: 0.8rem;
        }
        .fb-detail-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #C9A96E;
          margin-top: 0.45rem;
          flex-shrink: 0;
        }
        .fb-detail-text {
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          font-weight: 300;
          line-height: 1.7;
          letter-spacing: 0.04em;
          color: #5A5248;
        }

        @keyframes fb-fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section className="fb-root">
        <div className="fb-top-rule" />

        <div className="fb-frame">
          <div className="fb-watermark">1982</div>

          <div className="fb-columns">

            {/* ── Left: stats ── */}
            <div className="fb-col-left">
              <div className="fb-stat">
                <span className="fb-stat-num">42<em>+</em></span>
                <span className="fb-stat-label">Years of craft</span>
                <div className="fb-stat-rule" />
              </div>
              <div className="fb-stat">
                <span className="fb-stat-num"><em>3</em>rd</span>
                <span className="fb-stat-label">Generation</span>
                <div className="fb-stat-rule" />
              </div>
              <div className="fb-stat">
                <span className="fb-stat-num">1<em>k</em></span>
                <span className="fb-stat-label">Curated pairs</span>
                <div className="fb-stat-rule" />
              </div>
            </div>

            <div className="fb-col-divider" />

            {/* ── Center: main ── */}
            <div className="fb-col-center">
              <div className="fb-bracket fb-bracket-tl" />
              <div className="fb-bracket fb-bracket-tr" />
              <div className="fb-bracket fb-bracket-bl" />
              <div className="fb-bracket fb-bracket-br" />

              <div className="fb-eyebrow">
                <div className="fb-eyebrow-dash" />
                <span className="fb-eyebrow-text">Our Philosophy</span>
                <div className="fb-eyebrow-dash" />
              </div>

              <h2 className="fb-headline">
                A Family<br />
                <em>Since 1982</em>
              </h2>

              <div className="fb-ornament">
                <div className="fb-ornament-line" />
                <div className="fb-ornament-diamond" />
                <div className="fb-ornament-line" />
              </div>

              <p className="fb-body">
                A family business guided by an eye for what feels right.
                Carried from one generation to the next — choosing carefully,
                thoughtfully, and never offering what feels ordinary.
              </p>

              <Link to="/about" className="fb-cta">
                <span>Discover More</span>
                <span className="fb-cta-arrow" />
              </Link>
            </div>

            <div className="fb-col-divider" />

            {/* ── Right: quote + values ── */}
            <div className="fb-col-right">
              <div className="fb-pullquote">
                <span className="fb-quote-mark">"</span>
                <p className="fb-quote-text">
                  That balance between familiarity and individuality is where Gary Shoes lives.
                </p>
                <div className="fb-quote-attr">
                  <div className="fb-quote-attr-line" />
                  <span className="fb-quote-attr-text">Gary, Founder</span>
                </div>
              </div>

              <div className="fb-detail-list">
                <div className="fb-detail-item">
                  <div className="fb-detail-dot" />
                  <span className="fb-detail-text">Handpicked from European ateliers</span>
                </div>
                <div className="fb-detail-item">
                  <div className="fb-detail-dot" />
                  <span className="fb-detail-text">Never mass-produced, always considered</span>
                </div>
                <div className="fb-detail-item">
                  <div className="fb-detail-dot" />
                  <span className="fb-detail-text">Rooted in Beirut, worn worldwide</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="fb-bottom-rule" />
      </section>
    </>
  );
};

export default FeaturedBanner;