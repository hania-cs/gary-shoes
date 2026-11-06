import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

        /* ── Shared ── */
        .ct-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.9rem;
          margin-bottom: 1.4rem;
        }
        .ct-eyebrow-dash { width: 28px; height: 1px; background: #6B5444; }
        .ct-eyebrow-text {
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
        .ct-hero {
          position: relative;
          background: #FAF7F2;
          padding: 10rem 0 5.5rem;
          text-align: center;
          overflow: hidden;
        }
        .ct-hero::before {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; opacity: 0.4;
        }
        .ct-hero::after {
          content: '';
          position: absolute;
          top: 65%; left: 50%;
          transform: translate(-50%, -50%);
          width: 600px; height: 250px;
          background: radial-gradient(ellipse, rgba(107,84,68,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .ct-hero-inner { position: relative; z-index: 1; }
        .ct-hero h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3.5rem, 7vw, 7rem);
          font-weight: 300;
          line-height: 0.92;
          color: #0D0D0D;
          letter-spacing: -0.01em;
        }
        .ct-hero h1 em { font-style: italic; color: #6B5444; }
        .ct-hero-ornament {
          display: flex; align-items: center; justify-content: center;
          gap: 0.8rem; margin-top: 2rem;
        }
        .ct-orn-line { width: 56px; height: 1px; background: linear-gradient(to right, transparent, rgba(107,84,68,0.5)); }
        .ct-orn-line.rev { background: linear-gradient(to left, transparent, rgba(107,84,68,0.5)); }
        .ct-orn-diamond { width: 5px; height: 5px; background: #6B5444; transform: rotate(45deg); opacity: 0.6; }

        /* ══════════════════════════════
           MAIN SECTION
        ══════════════════════════════ */
        .ct-main {
          background: #FAF7F2;
          padding: 7rem 0 8rem;
        }
        .ct-main-inner {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
        }
        @media (min-width: 768px) { .ct-main-inner { padding: 0 3rem; gap: 4rem; } }
        @media (min-width: 1024px) { .ct-main-inner { grid-template-columns: 1fr 1.2fr; gap: 6rem; } }

        /* ── Info col ── */
        .ct-info h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 3.5vw, 3.4rem);
          font-weight: 300;
          color: #0D0D0D;
          line-height: 0.95;
          margin-bottom: 1.6rem;
        }
        .ct-info h2 em { font-style: italic; color: #6B5444; }
        .ct-info-body {
          font-family: 'Jost', sans-serif;
          font-size: 0.76rem;
          font-weight: 200;
          line-height: 2;
          letter-spacing: 0.04em;
          color: #5A5248;
          max-width: 380px;
          margin-bottom: 3.5rem;
        }

        /* Contact items */
        .ct-items { display: flex; flex-direction: column; gap: 0; }
        .ct-item {
          display: flex;
          align-items: center;
          gap: 1.4rem;
          padding: 1.4rem 0;
          border-bottom: 1px solid #EDE5D8;
          text-decoration: none;
          transition: gap 0.3s ease;
          cursor: pointer;
        }
        .ct-item:first-child { border-top: 1px solid #EDE5D8; }
        .ct-item:hover { gap: 1.8rem; }

        .ct-item-icon-wrap {
          width: 42px; height: 42px;
          border: 1px solid rgba(107,84,68,0.35);
          display: flex; align-items: center; justify-content: center;
          color: #6B5444;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
          transition: color 0.3s ease, border-color 0.3s ease;
        }
        .ct-item-icon-wrap::before {
          content: '';
          position: absolute; inset: 0;
          background: #6B5444;
          transform: translateY(100%);
          transition: transform 0.35s ease;
        }
        .ct-item:hover .ct-item-icon-wrap::before { transform: translateY(0); }
        .ct-item:hover .ct-item-icon-wrap { color: #FAF7F2; border-color: #6B5444; }
        .ct-item-icon-wrap svg { position: relative; z-index: 1; }

        .ct-item-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.55rem;
          font-weight: 300;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #A89E94;
          margin-bottom: 0.25rem;
        }
        .ct-item-value {
          font-family: 'Jost', sans-serif;
          font-size: 0.78rem;
          font-weight: 300;
          letter-spacing: 0.05em;
          color: #1A1A1A;
        }

        /* Socials */
        .ct-socials {
          display: flex; gap: 0.8rem;
          margin-top: 2.5rem;
        }
        .ct-social {
          width: 38px; height: 38px;
          border: 1px solid rgba(107,84,68,0.35);
          display: flex; align-items: center; justify-content: center;
          color: #8B8075;
          text-decoration: none;
          overflow: hidden; position: relative;
          transition: color 0.3s ease, border-color 0.3s ease;
        }
        .ct-social::before {
          content: '';
          position: absolute; inset: 0;
          background: #6B5444;
          transform: translateY(100%);
          transition: transform 0.35s ease;
        }
        .ct-social:hover::before { transform: translateY(0); }
        .ct-social:hover { color: #FAF7F2; border-color: #6B5444; }
        .ct-social svg { position: relative; z-index: 1; }

        /* ── Form col ── */
        .ct-form-wrap {
          position: relative;
          padding: 2rem 1.5rem;
          background: #F5F0E8;
        }
        @media (min-width: 768px) { .ct-form-wrap { padding: 3.5rem; } }
        /* Gold corner brackets */
        .ct-form-corner {
          position: absolute;
          width: 24px; height: 24px;
        }
        .ct-form-corner-tl { top: -1px; left: -1px; border-top: 1px solid #6B5444; border-left: 1px solid #6B5444; }
        .ct-form-corner-br { bottom: -1px; right: -1px; border-bottom: 1px solid #6B5444; border-right: 1px solid #6B5444; }

        .ct-form-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 300;
          color: #0D0D0D;
          margin-bottom: 2.5rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        .ct-form-title::after {
          content: '';
          flex: 1; height: 1px;
          background: linear-gradient(to right, rgba(107,84,68,0.4), transparent);
        }
        .ct-form-title em { font-style: italic; color: #6B5444; }

        /* Field */
        .ct-field { margin-bottom: 1.5rem; }
        .ct-field-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.55rem;
          font-weight: 300;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #8B8075;
          display: block;
          margin-bottom: 0.6rem;
          transition: color 0.3s ease;
        }
        .ct-field-label.active { color: #6B5444; }

        .ct-input, .ct-textarea {
          width: 100%;
          padding: 0.85rem 1rem;
          background: #FAF7F2;
          border: 1px solid #DDD5C5;
          border-bottom: 2px solid #DDD5C5;
          font-family: 'Jost', sans-serif;
          font-size: 0.78rem;
          font-weight: 200;
          letter-spacing: 0.04em;
          color: #1A1A1A;
          outline: none;
          transition: border-color 0.3s ease;
          display: block;
        }
        .ct-input:focus, .ct-textarea:focus {
          border-color: #DDD5C5;
          border-bottom-color: #6B5444;
        }
        .ct-textarea { resize: none; }

        .ct-field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.2rem;
        }
        @media (max-width: 500px) { .ct-field-row { grid-template-columns: 1fr; } }

        .ct-submit {
          width: 100%;
          padding: 1.1rem;
          background: #0D0D0D;
          color: #F0E6D3;
          font-family: 'Jost', sans-serif;
          font-size: 0.6rem;
          font-weight: 300;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
          position: relative;
          overflow: hidden;
          transition: color 0.4s ease;
        }
        .ct-submit::before {
          content: '';
          position: absolute; inset: 0;
          background: #2A2A2A;
          transform: translateX(-100%);
          transition: transform 0.4s ease;
        }
        .ct-submit:hover::before { transform: translateX(0); }
        .ct-submit span { position: relative; z-index: 1; }
        .ct-submit-arrow {
          position: relative; z-index: 1;
          width: 16px; height: 1px;
          background: #6B5444; flex-shrink: 0;
          transition: width 0.3s ease;
        }
        .ct-submit-arrow::after {
          content: '';
          position: absolute;
          right: 0; top: -3px;
          width: 6px; height: 6px;
          border-right: 1px solid #6B5444;
          border-top: 1px solid #6B5444;
          transform: rotate(45deg);
        }
        .ct-submit:hover .ct-submit-arrow { width: 24px; }

        /* ══════════════════════════════
           MAP CTA
        ══════════════════════════════ */
        .ct-map {
          background: #F5F0E8;
          padding: 5rem 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .ct-map::before {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; opacity: 0.4;
        }
        .ct-map-inner { position: relative; z-index: 1; }
        .ct-map h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 3vw, 2.8rem);
          font-weight: 300;
          color: #0D0D0D;
          margin-bottom: 0.6rem;
        }
        .ct-map h3 em { font-style: italic; color: #6B5444; }
        .ct-map-sub {
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          font-weight: 200;
          letter-spacing: 0.12em;
          color: #8B8075;
          margin-bottom: 2.5rem;
        }
        .ct-map-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1rem 2.2rem;
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
        .ct-map-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: #6B5444;
          transform: translateX(-100%);
          transition: transform 0.4s ease;
        }
        .ct-map-btn:hover::before { transform: translateX(0); }
        .ct-map-btn:hover { color: #FAF7F2; border-color: #6B5444; }
        .ct-map-btn span { position: relative; z-index: 1; }
        .ct-map-btn svg { position: relative; z-index: 1; color: #6B5444; transition: color 0.3s ease; }
        .ct-map-btn:hover svg { color: #FAF7F2; }
      `}</style>

      <div className="min-h-screen">
        <Navbar />

        {/* Hero */}
        <section className="ct-hero">
          <div className="ct-hero-inner">
            <div className="ct-eyebrow" style={{ justifyContent: 'center' }}>
              <div className="ct-eyebrow-dash" />
              <span className="ct-eyebrow-text">We'd Love to Hear From You</span>
              <div className="ct-eyebrow-dash" />
            </div>
            <h1>Contact <em>Us</em></h1>
            <div className="ct-hero-ornament">
              <div className="ct-orn-line" />
              <div className="ct-orn-diamond" />
              <div className="ct-orn-line rev" />
            </div>
          </div>
        </section>

        {/* Main */}
        <section className="ct-main">
          <div className="ct-main-inner">

            {/* Info */}
            <div className="ct-info">
              <div className="ct-eyebrow">
                <div className="ct-eyebrow-dash" />
                <span className="ct-eyebrow-text">Reach Out</span>
              </div>
              <h2>Get in <em>Touch</em></h2>
              <p className="ct-info-body">
                Whether you have a question about our collection, need help finding the perfect pair, or just want to say hello — we're here for you.
              </p>

              <div className="ct-items">
                <a href="tel:+96171009255" className="ct-item">
                  <div className="ct-item-icon-wrap"><Phone size={16} /></div>
                  <div>
                    <div className="ct-item-label">Phone</div>
                    <div className="ct-item-value">71 00 92 55</div>
                  </div>
                </a>
                <a href="mailto:garyshoes@gmail.com" className="ct-item">
                  <div className="ct-item-icon-wrap"><Mail size={16} /></div>
                  <div>
                    <div className="ct-item-label">Email</div>
                    <div className="ct-item-value">garyshoes@gmail.com</div>
                  </div>
                </a>
                <a href="https://maps.app.goo.gl/m7hDL6cAuFVzvvz27" target="_blank" rel="noopener noreferrer" className="ct-item">
                  <div className="ct-item-icon-wrap"><MapPin size={16} /></div>
                  <div>
                    <div className="ct-item-label">Location</div>
                    <div className="ct-item-value">Arax Street, Bourj Hammoud</div>
                  </div>
                </a>
              </div>

              <div className="ct-socials">
                <a href="https://facebook.com/GaryShoes" target="_blank" rel="noopener noreferrer" className="ct-social" aria-label="Facebook">
                  <Facebook size={15} />
                </a>
                <a href="https://instagram.com/garyshoeslb" target="_blank" rel="noopener noreferrer" className="ct-social" aria-label="Instagram">
                  <Instagram size={15} />
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="ct-form-wrap">
              <div className="ct-form-corner ct-form-corner-tl" />
              <div className="ct-form-corner ct-form-corner-br" />

              <div className="ct-form-title">Send a <em>Message</em></div>

              <form onSubmit={handleSubmit}>
                <div className="ct-field-row">
                  <div className="ct-field">
                    <label className={`ct-field-label ${focused === 'name' ? 'active' : ''}`}>Name</label>
                    <input
                      type="text" required className="ct-input"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                    />
                  </div>
                  <div className="ct-field">
                    <label className={`ct-field-label ${focused === 'email' ? 'active' : ''}`}>Email</label>
                    <input
                      type="email" required className="ct-input"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                    />
                  </div>
                </div>
                <div className="ct-field">
                  <label className={`ct-field-label ${focused === 'subject' ? 'active' : ''}`}>Subject</label>
                  <input
                    type="text" required className="ct-input"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    onFocus={() => setFocused('subject')} onBlur={() => setFocused(null)}
                  />
                </div>
                <div className="ct-field">
                  <label className={`ct-field-label ${focused === 'message' ? 'active' : ''}`}>Message</label>
                  <textarea
                    required rows={6} className="ct-textarea"
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                  />
                </div>
                <button type="submit" className="ct-submit">
                  <span>Send Message</span>
                  <span className="ct-submit-arrow" />
                </button>
              </form>
            </div>

          </div>
        </section>

        {/* Map CTA */}
        <section className="ct-map">
          <div className="ct-map-inner">
            <div className="ct-eyebrow" style={{ justifyContent: 'center' }}>
              <div className="ct-eyebrow-dash" />
              <span className="ct-eyebrow-text">Visit Us</span>
              <div className="ct-eyebrow-dash" />
            </div>
            <h3>Find <em>Our Boutique</em></h3>
            <p className="ct-map-sub">Arax Street, Bourj Hammoud, Lebanon</p>
            <a href="https://maps.app.goo.gl/m7hDL6cAuFVzvvz27" target="_blank" rel="noopener noreferrer" className="ct-map-btn">
              <MapPin size={14} />
              <span>Open in Google Maps</span>
            </a>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Contact;