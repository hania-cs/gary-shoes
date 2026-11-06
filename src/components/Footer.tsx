import { Link } from "react-router-dom";
import { Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";
import garyLogo from "@/assets/gary-logo-3d.webp";

const Footer = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

        .ft-root {
          position: relative;
          background: #F5F0E8;
          overflow: hidden;
        }

        /* Grain */
        .ft-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.5;
          z-index: 0;
        }

        /* Top gold border */
        .ft-root::after {
          content: '';
          position: absolute;
          top: 0;
          left: 8%;
          right: 8%;
          height: 1px;
          background: linear-gradient(to right, transparent, #6B5444 30%, #6B5444 70%, transparent);
          opacity: 0.4;
        }

        .ft-inner {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          margin: 0 auto;
          padding: 5rem 3rem 0;
        }
        @media (max-width: 767px) { .ft-inner { padding: 4rem 1.5rem 0; } }

        /* ── Main grid ── */
        .ft-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3.5rem;
          padding-bottom: 4rem;
        }
        @media (min-width: 768px) {
          .ft-grid {
            grid-template-columns: 1.2fr 1fr 1.2fr;
            gap: 4rem;
            align-items: start;
          }
        }

        /* ── Center brand col ── */
        .ft-brand-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          border-left: 1px solid rgba(201,169,110,0.18);
          border-right: 1px solid rgba(201,169,110,0.18);
          padding: 0 2rem;
        }
        @media (max-width: 767px) {
          .ft-brand-col {
            border: none;
            border-top: 1px solid rgba(201,169,110,0.18);
            border-bottom: 1px solid rgba(201,169,110,0.18);
            padding: 2rem 0;
          }
        }

        .ft-brand-medallion {
          position: relative;
          width: 190px;
          height: 190px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.4rem;
        }
        .ft-brand-medallion::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(201,169,110,0.28);
        }
        .ft-brand-medallion::after {
          content: '';
          position: absolute;
          inset: 14px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 70%);
        }

        .ft-brand-logo {
          height: 140px;
          width: auto;
          opacity: 0.92;
          filter: drop-shadow(0 8px 28px rgba(93,42,42,0.18));
          position: relative;
          z-index: 1;
        }

        .ft-social {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        .ft-social-link {
          width: 36px;
          height: 36px;
          border: 1px solid rgba(201,169,110,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8B8075;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .ft-social-link::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #6B5444;
          transform: translateY(100%);
          transition: transform 0.3s ease;
        }
        .ft-social-link:hover::before { transform: translateY(0); }
        .ft-social-link:hover { color: #FAF7F2; border-color: #6B5444; }
        .ft-social-link svg { position: relative; z-index: 1; }

        /* ── Column headings ── */
        .ft-col-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 300;
          color: #0D0D0D;
          letter-spacing: 0.02em;
          margin-bottom: 1.8rem;
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }
        .ft-col-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, rgba(201,169,110,0.4), transparent);
          max-width: 48px;
        }

        /* ── Links col ── */
        .ft-links {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }
        .ft-link {
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 300;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #5A5248;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          transition: color 0.3s ease, gap 0.3s ease;
        }
        .ft-link::before {
          content: '';
          width: 0;
          height: 1px;
          background: #6B5444;
          transition: width 0.3s ease;
          flex-shrink: 0;
        }
        .ft-link:hover { color: #0D0D0D; gap: 0.9rem; }
        .ft-link:hover::before { width: 12px; }

        /* ── Contact col ── */
        .ft-contacts {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }
        .ft-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 200;
          letter-spacing: 0.05em;
          line-height: 1.6;
          color: #5A5248;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .ft-contact-item:hover { color: #0D0D0D; }
        .ft-contact-icon {
          color: #6B5444;
          flex-shrink: 0;
          margin-top: 1px;
          opacity: 0.8;
        }

        /* ── Bottom bar ── */
        .ft-bottom {
          border-top: 1px solid rgba(201,169,110,0.2);
          padding: 1.8rem 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .ft-copy {
          font-family: 'Jost', sans-serif;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #A89E94;
        }
        .ft-copy a {
          color: inherit;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: color 0.3s ease, border-color 0.3s ease;
        }
        .ft-copy a:hover {
          color: #0D0D0D;
          border-bottom-color: rgba(107,84,68,0.5);
        }

        .ft-bottom-ornament {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .ft-orn-line {
          width: 32px;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(201,169,110,0.4));
        }
        .ft-orn-line.rev { background: linear-gradient(to left, transparent, rgba(201,169,110,0.4)); }
        .ft-orn-diamond {
          width: 4px;
          height: 4px;
          background: #6B5444;
          transform: rotate(45deg);
          opacity: 0.5;
        }
      `}</style>

      <footer className="ft-root">
        <div className="ft-inner">
          <div className="ft-grid">

            {/* Quick Links — left */}
            <div>
              <h4 className="ft-col-title">Quick Links</h4>
              <nav className="ft-links">
                {["Home", "Shop", "About", "Contact"].map((item) => (
                  <Link
                    key={item}
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="ft-link"
                  >
                    {item}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Brand — center */}
            <div className="ft-brand-col">
              <div className="ft-brand-medallion">
                <img loading="lazy" src={garyLogo} alt="Gary Shoes" className="ft-brand-logo" />
              </div>
              <div className="ft-social">
                <a href="https://facebook.com/GaryShoes" target="_blank" rel="noopener noreferrer" className="ft-social-link" aria-label="Facebook">
                  <Facebook size={15} />
                </a>
                <a href="https://instagram.com/garyshoeslb" target="_blank" rel="noopener noreferrer" className="ft-social-link" aria-label="Instagram">
                  <Instagram size={15} />
                </a>
              </div>
            </div>

            {/* Contact — right */}
            <div>
              <h4 className="ft-col-title">Get in Touch</h4>
              <div className="ft-contacts">
                <a href="tel:+96171009255" className="ft-contact-item">
                  <Phone size={14} className="ft-contact-icon" />
                  71 00 92 55
                </a>
                <a href="mailto:garyshoes@gmail.com" className="ft-contact-item">
                  <Mail size={14} className="ft-contact-icon" />
                  garyshoes@gmail.com
                </a>
                <a href="https://maps.app.goo.gl/m7hDL6cAuFVzvvz27" target="_blank" rel="noopener noreferrer" className="ft-contact-item">
                  <MapPin size={14} className="ft-contact-icon" />
                  Arax Street, Bourj Hammoud
                </a>
              </div>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="ft-bottom">
            <p className="ft-copy">
              © {new Date().getFullYear()}{" "}
              <a
                href="https://www.instagram.com/design_lab_lb"
                target="_blank"
                rel="noopener noreferrer"
              >
                coded by Design Lab
              </a>
              .
            </p>
            <div className="ft-bottom-ornament">
              <div className="ft-orn-line" />
              <div className="ft-orn-diamond" />
              <div className="ft-orn-line rev" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;