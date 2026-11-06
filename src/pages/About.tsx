import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroShoes from "@/assets/hero-shoes.webp";

const About = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

        /* ── Shared ── */
        .ab-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.9rem;
          margin-bottom: 1.4rem;
        }
        .ab-eyebrow-dash { width: 28px; height: 1px; background: #6B5444; }
        .ab-eyebrow-text {
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
        .ab-hero {
          position: relative;
          background: #FAF7F2;
          padding: 10rem 0 6rem;
          text-align: center;
          overflow: hidden;
        }
        .ab-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; opacity: 0.4;
        }
        .ab-hero::after {
          content: '';
          position: absolute;
          top: 60%; left: 50%;
          transform: translate(-50%, -50%);
          width: 700px; height: 300px;
          background: radial-gradient(ellipse, rgba(107,84,68,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .ab-hero-inner {
          position: relative; z-index: 1;
        }
        .ab-hero h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3.5rem, 7vw, 7rem);
          font-weight: 300;
          line-height: 0.92;
          color: #0D0D0D;
          letter-spacing: -0.01em;
        }
        .ab-hero h1 em {
          font-style: italic;
          color: #6B5444;
        }
        .ab-hero-ornament {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          margin-top: 2rem;
        }
        .ab-orn-line {
          width: 56px; height: 1px;
          background: linear-gradient(to right, transparent, rgba(107,84,68,0.5));
        }
        .ab-orn-line.rev { background: linear-gradient(to left, transparent, rgba(107,84,68,0.5)); }
        .ab-orn-diamond {
          width: 5px; height: 5px;
          background: #6B5444;
          transform: rotate(45deg); opacity: 0.6;
        }

        /* ══════════════════════════════
           STORY
        ══════════════════════════════ */
        .ab-story {
          background: #FAF7F2;
          padding: 7rem 0;
        }
        .ab-story-grid {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
        }
        @media (min-width: 768px) { .ab-story-grid { padding: 0 3rem; gap: 4rem; } }
        @media (min-width: 1024px) {
          .ab-story-grid { grid-template-columns: 1fr 1fr; gap: 5rem; }
        }

        .ab-story h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 4vw, 3.8rem);
          font-weight: 300;
          line-height: 0.95;
          color: #0D0D0D;
          margin-bottom: 2rem;
        }
        .ab-story h2 em { font-style: italic; color: #6B5444; }

        .ab-story p {
          font-family: 'Jost', sans-serif;
          font-size: 0.78rem;
          font-weight: 200;
          line-height: 2;
          letter-spacing: 0.04em;
          color: #5A5248;
          margin-bottom: 1.2rem;
          max-width: 480px;
        }

        /* Brand panel */
        .ab-story-panel {
          position: relative;
          background: #F5F0E8;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ab-story-panel-inner {
          text-align: center;
          padding: 3rem;
        }
        .ab-story-quote {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.6rem, 2.8vw, 2.6rem);
          font-weight: 300;
          font-style: italic;
          color: #0D0D0D;
          line-height: 1.4;
          margin: 0 0 2.5rem;
          letter-spacing: -0.01em;
        }
        .ab-story-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          margin-bottom: 2.5rem;
        }
        .ab-story-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
        }
        .ab-story-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
        }
        .ab-story-stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 300;
          color: #6B5444;
          line-height: 1;
        }
        .ab-story-stat-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.55rem;
          font-weight: 300;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #8B8075;
        }
        .ab-story-stat-sep {
          width: 1px;
          height: 32px;
          background: rgba(107,84,68,0.3);
        }

        /* Gold corner brackets */
        .ab-img-corner {
          position: absolute;
          width: 32px; height: 32px;
        }
        .ab-img-corner-tl { top: -10px; left: -10px; border-top: 1px solid #6B5444; border-left: 1px solid #6B5444; }
        .ab-img-corner-br { bottom: -10px; right: -10px; border-bottom: 1px solid #6B5444; border-right: 1px solid #6B5444; }

        /* ══════════════════════════════
           VALUES
        ══════════════════════════════ */
        .ab-values {
          background: #F5F0E8;
          padding: 7rem 0;
          position: relative;
          overflow: hidden;
        }
        .ab-values::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; opacity: 0.4;
        }
        .ab-values-inner {
          position: relative; z-index: 1;
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        @media (min-width: 768px) { .ab-values-inner { padding: 0 3rem; } }

        .ab-values-header {
          text-align: center;
          margin-bottom: 5rem;
        }
        .ab-values-header h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.6rem, 4.5vw, 4.5rem);
          font-weight: 300;
          color: #0D0D0D;
          line-height: 0.95;
        }
        .ab-values-header h2 em { font-style: italic; color: #6B5444; }

        .ab-values-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2px;
        }
        @media (min-width: 768px) {
          .ab-values-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .ab-value-card {
          padding: 3.5rem 2.5rem;
          background: #FAF7F2;
          text-align: center;
          position: relative;
          transition: background 0.4s ease;
        }
        .ab-value-card:hover { background: #FDF9F4; }

        .ab-value-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 4rem;
          font-weight: 300;
          color: rgba(107,84,68,0.15);
          line-height: 1;
          position: absolute;
          top: 1.5rem; right: 1.8rem;
          letter-spacing: -0.02em;
        }

        .ab-value-icon {
          width: 8px; height: 8px;
          background: #6B5444;
          transform: rotate(45deg);
          margin: 0 auto 1.8rem;
          opacity: 0.7;
        }

        .ab-value-card h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 300;
          font-style: italic;
          color: #0D0D0D;
          margin-bottom: 1rem;
        }
        .ab-value-card p {
          font-family: 'Jost', sans-serif;
          font-size: 0.73rem;
          font-weight: 200;
          line-height: 1.9;
          letter-spacing: 0.04em;
          color: #5A5248;
          max-width: 260px;
          margin: 0 auto;
        }

        /* ══════════════════════════════
           CTA BANNER
        ══════════════════════════════ */
        .ab-cta {
          position: relative;
          padding: 9rem 0;
          overflow: hidden;
          text-align: center;
        }
        .ab-cta-bg {
          position: absolute;
          inset: 0;
        }
        .ab-cta-bg img {
          width: 100%; height: 100%;
          object-fit: cover;
        }
        .ab-cta-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(10, 8, 6, 0.62);
        }
        .ab-cta-inner {
          position: relative; z-index: 1;
        }
        .ab-cta-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.9rem;
          margin-bottom: 1.6rem;
        }
        .ab-cta-dash { width: 28px; height: 1px; background: rgba(107,84,68,0.6); }
        .ab-cta-eyebrow-text {
          font-family: 'Jost', sans-serif;
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(107,84,68,0.8);
        }
        .ab-cta h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 6vw, 5.5rem);
          font-weight: 300;
          color: #FAF7F2;
          line-height: 0.95;
          margin-bottom: 1.5rem;
        }
        .ab-cta h2 em { font-style: italic; color: #6B5444; }

        .ab-cta p {
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          font-weight: 200;
          letter-spacing: 0.08em;
          color: rgba(250,247,242,0.65);
          max-width: 360px;
          margin: 0 auto 3rem;
          line-height: 1.9;
        }

        .ab-cta-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.9rem;
          padding: 1rem 2.4rem;
          border: 1px solid rgba(107,84,68,0.6);
          color: #FAF7F2;
          font-family: 'Jost', sans-serif;
          font-size: 0.6rem;
          font-weight: 300;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          text-decoration: none;
          overflow: hidden;
          transition: color 0.4s ease;
        }
        .ab-cta-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #6B5444;
          transform: translateX(-100%);
          transition: transform 0.4s ease;
        }
        .ab-cta-btn:hover::before { transform: translateX(0); }
        .ab-cta-btn:hover { color: #0D0D0D; border-color: #6B5444; }
        .ab-cta-btn span { position: relative; z-index: 1; }
        .ab-cta-arrow {
          position: relative; z-index: 1;
          width: 16px; height: 1px;
          background: #6B5444;
          flex-shrink: 0;
          transition: width 0.3s ease;
        }
        .ab-cta-arrow::after {
          content: '';
          position: absolute;
          right: 0; top: -3px;
          width: 6px; height: 6px;
          border-right: 1px solid #6B5444;
          border-top: 1px solid #6B5444;
          transform: rotate(45deg);
        }
        .ab-cta-btn:hover .ab-cta-arrow { width: 24px; }
      `}</style>

      <div className="min-h-screen">
        <Navbar />

        {/* ── Hero ── */}
        <section className="ab-hero">
          <div className="ab-hero-inner">
            <div className="ab-eyebrow" style={{ justifyContent: 'center' }}>
              <div className="ab-eyebrow-dash" />
              <span className="ab-eyebrow-text">Our Story</span>
              <div className="ab-eyebrow-dash" />
            </div>
            <h1>About <em>Gary Shoes</em></h1>
            <div className="ab-hero-ornament">
              <div className="ab-orn-line" />
              <div className="ab-orn-diamond" />
              <div className="ab-orn-line rev" />
            </div>
          </div>
        </section>

        {/* ── Story ── */}
        <section className="ab-story">
          <div className="ab-story-grid">
            <div>
              <div className="ab-eyebrow">
                <div className="ab-eyebrow-dash" />
                <span className="ab-eyebrow-text">Est. 1982 · Bourj Hammoud</span>
              </div>
              <h2>
                A Family Business
                <br />
                <em>Since 1982</em>
              </h2>
              <p>
                A family business that began in 1982, guided by an eye for what feels right. Carried from one generation to the next, we've stayed true to our values and intentions by choosing carefully, thoughtfully, and never offering what feels ordinary.
              </p>
              <p>
                Our customers come to us for pieces that hold their own, that shift how an outfit feels, and how they carry themselves.
              </p>
              <p>
                That balance between familiarity and individuality is where Gary Shoes lives.
              </p>
            </div>

            {/* Brand panel — replaces image */}
            <div className="ab-story-panel">
              <div className="ab-img-corner ab-img-corner-tl" />
              <div className="ab-img-corner ab-img-corner-br" />
              <div className="ab-story-panel-inner">
                <p className="ab-story-quote">
                  "Chosen carefully,<br />thoughtfully, and never<br />ordinary."
                </p>
                <div className="ab-story-divider">
                  <div className="ab-orn-line" style={{ width: '40px' }} />
                  <div className="ab-orn-diamond" />
                  <div className="ab-orn-line rev" style={{ width: '40px' }} />
                </div>
                <div className="ab-story-stats">
                  <div className="ab-story-stat">
                    <span className="ab-story-stat-num">1982</span>
                    <span className="ab-story-stat-label">Est.</span>
                  </div>
                  <div className="ab-story-stat-sep" />
                  <div className="ab-story-stat">
                    <span className="ab-story-stat-num">40+</span>
                    <span className="ab-story-stat-label">Years of Craft</span>
                  </div>
                  <div className="ab-story-stat-sep" />
                  <div className="ab-story-stat">
                    <span className="ab-story-stat-num">BH</span>
                    <span className="ab-story-stat-label">Bourj Hammoud</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="ab-values">
          <div className="ab-values-inner">
            <div className="ab-values-header">
              <div className="ab-eyebrow" style={{ justifyContent: 'center' }}>
                <div className="ab-eyebrow-dash" />
                <span className="ab-eyebrow-text">Our Principles</span>
                <div className="ab-eyebrow-dash" />
              </div>
              <h2>What We <em>Stand For</em></h2>
            </div>
            <div className="ab-values-grid">
              {[
                { num: "01", title: "Quality",   desc: "Every pair is chosen with a clear point of view; how it feels, how it wears, and how it holds over time." },
                { num: "02", title: "Elegance",  desc: "We lean towards what lasts; shapes and finishes that feel current now, and still make sense later." },
                { num: "03", title: "Service",   desc: "We take a more considered approach; helping you find what fits naturally into how you already dress." },
              ].map((v) => (
                <div key={v.title} className="ab-value-card">
                  <div className="ab-value-num">{v.num}</div>
                  <div className="ab-value-icon" />
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="ab-cta">
          <div className="ab-cta-bg">
            <img loading="lazy" decoding="async" src={heroShoes} alt="" />
          </div>
          <div className="ab-cta-inner">
            <div className="ab-cta-eyebrow">
              <div className="ab-cta-dash" />
              <span className="ab-cta-eyebrow-text">Come See Us</span>
              <div className="ab-cta-dash" />
            </div>
            <h2>Visit Our <em>Boutique</em></h2>
            <p>Arax Street, Bourj Hammoud — Come discover our latest collection in person.</p>
            <a
              href="https://maps.app.goo.gl/m7hDL6cAuFVzvvz27"
              target="_blank"
              rel="noopener noreferrer"
              className="ab-cta-btn"
            >
              <span>Get Directions</span>
              <span className="ab-cta-arrow" />
            </a>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default About;