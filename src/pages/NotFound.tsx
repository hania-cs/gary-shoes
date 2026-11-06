import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

        .nf-root {
          min-height: 100vh;
          background: #FAF7F2;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        /* Noise texture */
        .nf-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
        }

        /* Radial gold glow */
        .nf-root::after {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 700px; height: 400px;
          background: radial-gradient(ellipse, rgba(107,84,68,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .nf-inner {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 2rem;
        }

        /* Giant ghost 404 */
        .nf-ghost {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(8rem, 22vw, 18rem);
          font-weight: 300;
          font-style: italic;
          line-height: 0.85;
          color: rgba(107,84,68,0.1);
          letter-spacing: -0.04em;
          user-select: none;
          margin-bottom: -1rem;
        }

        /* Eyebrow */
        .nf-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.9rem;
          margin-bottom: 1.6rem;
        }
        .nf-eyebrow-dash { width: 28px; height: 1px; background: #6B5444; }
        .nf-eyebrow-text {
          font-family: 'Jost', sans-serif;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #8B8075;
        }

        .nf-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 5vw, 4rem);
          font-weight: 300;
          line-height: 0.95;
          color: #0D0D0D;
          margin-bottom: 1.2rem;
        }
        .nf-heading em {
          font-style: italic;
          color: #6B5444;
        }

        .nf-sub {
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 200;
          letter-spacing: 0.08em;
          line-height: 1.9;
          color: #8B8075;
          max-width: 320px;
          margin: 0 auto 2.8rem;
        }

        /* Ornament */
        .nf-ornament {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          margin-bottom: 2.8rem;
        }
        .nf-orn-line {
          width: 40px; height: 1px;
          background: linear-gradient(to right, transparent, rgba(107,84,68,0.4));
        }
        .nf-orn-line.rev {
          background: linear-gradient(to left, transparent, rgba(107,84,68,0.4));
        }
        .nf-orn-diamond {
          width: 5px; height: 5px;
          background: #6B5444;
          transform: rotate(45deg);
          opacity: 0.55;
        }

        /* CTA button */
        .nf-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.9rem;
          padding: 1rem 2.4rem;
          border: 1px solid rgba(107,84,68,0.5);
          color: #50453A;
          font-family: 'Jost', sans-serif;
          font-size: 0.6rem;
          font-weight: 300;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          text-decoration: none;
          overflow: hidden;
          transition: color 0.4s ease, border-color 0.4s ease;
        }
        .nf-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #6B5444;
          transform: translateX(-100%);
          transition: transform 0.4s ease;
        }
        .nf-btn:hover::before { transform: translateX(0); }
        .nf-btn:hover { color: #0D0D0D; border-color: #6B5444; }
        .nf-btn span { position: relative; z-index: 1; }
        .nf-btn-arrow {
          position: relative; z-index: 1;
          width: 16px; height: 1px;
          background: #6B5444;
          flex-shrink: 0;
          transition: width 0.3s ease;
        }
        .nf-btn-arrow::after {
          content: '';
          position: absolute;
          right: 0; top: -3px;
          width: 6px; height: 6px;
          border-right: 1px solid #6B5444;
          border-top: 1px solid #6B5444;
          transform: rotate(45deg);
        }
        .nf-btn:hover .nf-btn-arrow { width: 24px; }
      `}</style>

      <div className="nf-root">
        <div className="nf-inner">
          <div className="nf-ghost">404</div>

          <div className="nf-eyebrow">
            <div className="nf-eyebrow-dash" />
            <span className="nf-eyebrow-text">Page Not Found</span>
            <div className="nf-eyebrow-dash" />
          </div>

          <h1 className="nf-heading">
            This Page Has<br /><em>Wandered Off</em>
          </h1>

          <div className="nf-ornament">
            <div className="nf-orn-line" />
            <div className="nf-orn-diamond" />
            <div className="nf-orn-line rev" />
          </div>

          <p className="nf-sub">
            The page you're looking for doesn't exist or may have moved. Let us guide you back.
          </p>

          <a href="/" className="nf-btn">
            <span>Return Home</span>
            <span className="nf-btn-arrow" />
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;