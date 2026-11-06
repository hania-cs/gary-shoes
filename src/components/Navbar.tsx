import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import garyLogo from "@/assets/gary-logo-3d.webp";

const leftLinks = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
];

const rightLinks = [
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const allLinks = [...leftLinks, ...rightLinks];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

        .gary-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 50;
          background: rgba(250, 247, 242, 0.92);
          border-bottom: 1px solid rgba(201, 169, 110, 0.22);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          overflow: visible;
        }

        .gary-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          justify-items: center;
          height: 90px;
          padding: 0 3rem;
        }

        .gary-nav-left,
        .gary-nav-right {
          display: flex;
          align-items: center;
          width: 100%;
        }
        .gary-nav-left { justify-content: flex-start; padding-left: 2rem; }
        .gary-nav-right { justify-content: flex-end; padding-right: 2rem; }

        .gary-nav-link-wrap { display: flex; align-items: center; }

        .gary-nav-link {
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          font-weight: 300;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(90, 82, 72, 0.75);
          text-decoration: none;
          position: relative;
          padding-bottom: 2px;
          transition: color 0.3s ease;
          white-space: nowrap;
        }
        .gary-nav-link::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0;
          width: 0; height: 1px;
          background: #C9A96E;
          transition: width 0.35s ease;
        }
        .gary-nav-link:hover { color: rgba(13,13,13,0.9); }
        .gary-nav-link:hover::after { width: 100%; }
        .gary-nav-link.active { color: rgba(13,13,13,0.9); }
        .gary-nav-link.active::after { width: 100%; }

        .gary-dot {
          width: 3px; height: 3px;
          background: rgba(201, 169, 110, 0.4);
          transform: rotate(45deg);
          flex-shrink: 0;
          margin: 0 18px;
        }

        /* ── Center Logo ── */
        .gary-nav-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          padding: 0 2.5rem;
          position: relative;
          height: 90px;
          overflow: visible;
        }
        .gary-nav-logo-img {
          height: 110px;
          width: auto;
          display: block;
          filter: drop-shadow(0 4px 12px rgba(93,42,42,0.15));
          transition: filter 0.3s ease, transform 0.3s ease;
          position: relative;
          z-index: 51;
        }
        .gary-nav-logo:hover .gary-nav-logo-img {
          filter: drop-shadow(0 4px 14px rgba(93,42,42,0.2));
          transform: translateY(-1px);
        }

        .logo-divider {
          position: absolute;
          top: 50%;
          width: 1px;
          height: 28px;
          background: linear-gradient(to bottom, transparent, rgba(201,169,110,0.35), transparent);
          transform: translateY(-50%);
        }
        .logo-divider-left { left: 0; }
        .logo-divider-right { right: 0; }

        .nav-bottom-strip {
          height: 1px;
          background: linear-gradient(to right, transparent 0%, rgba(201,169,110,0.18) 20%, rgba(201,169,110,0.18) 80%, transparent 100%);
        }

        /* ── Mobile toggle ── */
        .gary-nav-toggle {
          display: none;
          position: absolute;
          right: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(201, 169, 110, 0.1);
          border: 1px solid rgba(201, 169, 110, 0.28);
          border-radius: 50%;
          color: rgba(58, 53, 48, 0.85);
          width: 34px; height: 34px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .gary-nav-toggle:hover {
          background: rgba(201, 169, 110, 0.2);
          border-color: rgba(201, 169, 110, 0.5);
        }

        /* ── Mobile dropdown ── */
        .gary-nav-mobile {
          background: rgba(250, 247, 242, 0.97);
          border-top: 1px solid rgba(201, 169, 110, 0.15);
          animation: navDrop 0.26s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes navDrop {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .gary-mobile-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 2rem;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 300;
          color: rgba(90, 82, 72, 0.7);
          text-decoration: none;
          border-bottom: 1px solid rgba(201, 169, 110, 0.1);
          transition: color 0.25s ease;
        }
        .gary-mobile-link:last-child { border-bottom: none; }
        .gary-mobile-link.active { color: #0D0D0D; font-style: italic; }
        .gary-mobile-link:hover { color: #0D0D0D; }

        .mobile-arrow {
          width: 18px; height: 1px;
          background: #C9A96E;
          position: relative;
          opacity: 0;
          transition: opacity 0.25s ease;
          flex-shrink: 0;
        }
        .mobile-arrow::after {
          content: '';
          position: absolute;
          right: 0; top: -3px;
          width: 6px; height: 6px;
          border-right: 1px solid #C9A96E;
          border-top: 1px solid #C9A96E;
          transform: rotate(45deg);
        }
        .gary-mobile-link.active .mobile-arrow,
        .gary-mobile-link:hover .mobile-arrow { opacity: 1; }

        @media (max-width: 640px) {
          .gary-nav-left, .gary-nav-right { display: none; }
          .gary-nav-inner {
            grid-template-columns: 1fr;
            justify-items: center;
            position: relative;
          }
          .logo-divider-left, .logo-divider-right { display: none; }
          .gary-nav-toggle { display: flex; }
          .gary-nav-logo-img { height: 95px; }
        }
      `}</style>

      <nav className="gary-nav">
        <div className="gary-nav-inner">

          {/* Left links */}
          <div className="gary-nav-left">
            {leftLinks.map((link, i) => (
              <div key={link.path} className="gary-nav-link-wrap">
                <Link
                  to={link.path}
                  className={`gary-nav-link${location.pathname === link.path ? " active" : ""}`}
                >
                  {link.label}
                </Link>
                {i < leftLinks.length - 1 && <div className="gary-dot" />}
              </div>
            ))}
          </div>

          {/* Center logo */}
          <Link to="/" className="gary-nav-logo">
            <div className="logo-divider logo-divider-left" />
            <img src={garyLogo} alt="Gary Shoes" className="gary-nav-logo-img" />
            <div className="logo-divider logo-divider-right" />
          </Link>

          {/* Right links */}
          <div className="gary-nav-right">
            {rightLinks.map((link, i) => (
              <div key={link.path} className="gary-nav-link-wrap">
                {i > 0 && <div className="gary-dot" />}
                <Link
                  to={link.path}
                  className={`gary-nav-link${location.pathname === link.path ? " active" : ""}`}
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            className="gary-nav-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={14} /> : <Menu size={14} />}
          </button>

        </div>
        <div className="nav-bottom-strip" />

        {/* Mobile dropdown */}
        {isOpen && (
          <div className="gary-nav-mobile">
            {allLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`gary-mobile-link${location.pathname === link.path ? " active" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
                <span className="mobile-arrow" />
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;