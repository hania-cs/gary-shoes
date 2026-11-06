import { } from "lucide-react";

const InstagramBanner = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

        .ig-root {
          position: relative;
          background: #FAF7F2;
          padding: 5rem 0;
          overflow: hidden;
          text-align: center;
        }

        .ig-root::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(201,169,110,0.10) 0%, transparent 70%);
          pointer-events: none;
        }

        .ig-inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Three pulse dots */
        .ig-dots {
          display: flex;
          gap: 6px;
          margin-bottom: 1.8rem;
        }
        .ig-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #C9A96E;
          opacity: 0.4;
        }
        .ig-dot:nth-child(2) { opacity: 0.7; }
        .ig-dot:nth-child(3) { opacity: 0.4; }

        /* Eyebrow */
        .ig-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          margin-bottom: 1.6rem;
        }
        .ig-eyebrow-dash {
          width: 28px;
          height: 1px;
          background: rgba(201,169,110,0.6);
        }
        .ig-eyebrow-text {
          font-family: 'Jost', sans-serif;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #8B8075;
        }

        /* Heading */
        .ig-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 4.5vw, 3.8rem);
          font-weight: 300;
          color: #0D0D0D;
          margin: 0 0 0.3rem;
          line-height: 1.1;
        }
        .ig-heading em {
          font-style: italic;
          color: #C9A96E;
        }

        /* Subtitle */
        .ig-sub {
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          font-weight: 300;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #8B8075;
          margin: 0 0 2.2rem;
        }

        /* CTA Button with fill-reveal on hover */
        .ig-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem;
          font-weight: 300;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #0D0D0D;
          text-decoration: none;
          padding: 0.75rem 2rem;
          border: 1px solid rgba(201,169,110,0.55);
          position: relative;
          overflow: hidden;
          transition: color 0.4s ease;
        }
        .ig-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #C9A96E;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.45s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .ig-btn:hover::before { transform: scaleX(1); }
        .ig-btn:hover { color: #fff; }
        .ig-btn span,
        .ig-btn-arrow { position: relative; z-index: 1; }
        .ig-btn-arrow {
          font-size: 0.85rem;
          transition: transform 0.3s ease;
        }
        .ig-btn:hover .ig-btn-arrow { transform: translateX(4px); }

        /* Bottom ornament */
        .ig-ornament {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-top: 2.8rem;
        }
        .ig-orn-line {
          width: 56px;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(201,169,110,0.5));
        }
        .ig-orn-line.rev {
          background: linear-gradient(to left, transparent, rgba(201,169,110,0.5));
        }
        .ig-orn-diamond {
          width: 5px;
          height: 5px;
          background: #C9A96E;
          transform: rotate(45deg);
          opacity: 0.55;
        }
      `}</style>

      <section className="ig-root">
        <div className="ig-inner">

          <div className="ig-dots">
            <div className="ig-dot" />
            <div className="ig-dot" />
            <div className="ig-dot" />
          </div>

          <div className="ig-eyebrow">
            <div className="ig-eyebrow-dash" />
            <span className="ig-eyebrow-text">New Arrivals</span>
            <div className="ig-eyebrow-dash" />
          </div>

          <h2 className="ig-heading">Discover the <em>Collection</em></h2>
          <p className="ig-sub">Crafted for every step</p>

          <a href="/shop" className="ig-btn">
            <span>Shop Now</span>
            <span className="ig-btn-arrow">→</span>
          </a>

          <div className="ig-ornament">
            <div className="ig-orn-line" />
            <div className="ig-orn-diamond" />
            <div className="ig-orn-line rev" />
          </div>

        </div>
      </section>
    </>
  );
};

export default InstagramBanner;