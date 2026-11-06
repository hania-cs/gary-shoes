import heroBanner from "@/assets/desktop-hero-banner.webp";
import mobileBanner from "@/assets/mobile-hero-banner.webp";
import { Link } from "react-router-dom";

const HeroSection = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

      .hero-root {
        position: relative;
        margin-top: 90px;
        width: 100%;
        --header-height: 90px;
        height: calc(100vh - var(--header-height));
        height: calc(100svh - var(--header-height));
        display: flex; align-items: center;
        overflow: hidden;
        background: #EFEAE3;
        font-family: 'Jost', sans-serif;
        color: #4A3B30;
      }
      .hero-photo { position: absolute; inset: 0; overflow: hidden; }
      .hero-photo picture { position: relative; display: flex; justify-content: flex-end; width: 100%; height: 100%; }
      .hero-photo img {
        display: block; width: auto; max-width: 100%; height: 100%;
        object-fit: contain; object-position: right center;
        -webkit-mask-image: linear-gradient(to right, transparent 0, #000 22%); mask-image: linear-gradient(to right, transparent 0, #000 22%);
        animation: heroPhotoIn 1.2s ease-out both;
      }
      /* Cream fade only behind the text, stops before the model (~33% of width). */
      .hero-photo::after {
        content: ''; position: absolute; inset: 0 auto 0 0; width: 30%; pointer-events: none;
        background: linear-gradient(to right, rgba(239,234,227,.55), rgba(239,234,227,.2) 60%, rgba(239,234,227,0));
      }
      .hero-root::before {
        content: ''; position: absolute; inset: 0; z-index: 1; pointer-events: none; opacity: .03;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      }

      .hero-copy {
        position: absolute; z-index: 2;
        left: clamp(1.5rem, 5vw, 5rem); top: 46%; transform: translateY(-50%);
        max-width: 40vw;
      }
      .hero-kicker { display: flex; align-items: center; gap: 14px; margin: 0 0 22px; font-size: 11px; font-weight: 500; letter-spacing: .38em; text-transform: uppercase; color: #6B5444; animation: heroUp .8s ease-out .1s both; }
      .hero-kicker::before { content: ''; width: 36px; height: 1px; background: currentColor; }
      .hero-title {
        font-family: 'Cormorant Garamond', serif; font-weight: 300;
        font-size: clamp(48px, min(6.4vw, 10vh), 96px); line-height: .98; letter-spacing: -0.02em;
        color: #4A3B30; margin: 0;
      }
      .hero-title span { display: block; animation: heroUp .8s ease-out both; }
      .hero-title span:nth-child(1) { animation-delay: .2s; }
      .hero-title span:nth-child(2) { animation-delay: .32s; }
      .hero-title span:nth-child(3) { animation-delay: .44s; }
      .hero-title em { font-style: italic; font-weight: 400; color: #6B5444; padding-left: .6em; }
      .hero-eyebrow-line { display: none; width: 48px; height: 1px; background: rgba(74,59,48,.6); margin: 24px 0 14px; animation: heroUp .8s ease-out .56s both; }
      .hero-subtitle {
        margin: 0; font-size: 12px; font-weight: 500; letter-spacing: .28em; text-transform: uppercase;
        line-height: 1.8; color: #5C4B3E; margin-top: 26px; text-transform: none; letter-spacing: .02em; font-size: 15px; font-weight: 300; animation: heroUp .8s ease-out .62s both;
      }
      .hero-actions { display: flex; flex-wrap: nowrap; align-items: center; gap: 28px; margin-top: 40px; animation: heroUp .8s ease-out .76s both; }
      .hero-btn {
        display: inline-flex; align-items: center; gap: 14px; min-height: 48px; padding: 17px 34px;
        background: #2B211B; color: #F5EFE6; border-radius: 999px; box-shadow: 0 14px 30px -16px rgba(43,33,27,.6); text-decoration: none;
        font-size: 11px; font-weight: 500; letter-spacing: .26em; text-transform: uppercase;
        transition: background 300ms ease-out;
      }
      .hero-btn:hover { background: #4A3B30; box-shadow: 0 18px 34px -14px rgba(43,33,27,.55); }
      .hero-btn svg, .hero-link svg { transition: transform 300ms ease-out; }
      .hero-btn:hover svg { transform: translateX(6px); }
      .hero-link {
        position: relative; display: inline-flex; align-items: center; gap: 10px; min-height: 48px; padding: 0 30px;
        border: 1px solid rgba(74,59,48,.45); border-radius: 999px; transition: background 300ms, color 300ms;
        color: #4A3B30; text-decoration: none; font-size: 11px; font-weight: 500; letter-spacing: .26em; text-transform: uppercase;
      }
      .hero-link:hover { background: #4A3B30; color: #F5EFE6; }
      .hero-link:hover svg { transform: translate(3px, -3px); }
      .hero-btn:focus-visible, .hero-link:focus-visible { outline: 2px solid #4A3B30; outline-offset: 4px; }

      @keyframes heroUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
      @keyframes heroPhotoIn { from { opacity: 0; } to { opacity: 1; } }

      @media (min-width: 768px) and (max-width: 1023px) {
        .hero-kicker { display: flex; align-items: center; gap: 14px; margin: 0 0 22px; font-size: 11px; font-weight: 500; letter-spacing: .38em; text-transform: uppercase; color: #6B5444; animation: heroUp .8s ease-out .1s both; }
      .hero-kicker::before { content: ''; width: 36px; height: 1px; background: currentColor; }
      .hero-title { font-size: clamp(2.6rem, 6.4vw, 4rem); }
        .hero-copy { max-width: 30vw; }
        .hero-eyebrow-line { margin: 16px 0 10px; }
        .hero-subtitle { font-size: 10px; letter-spacing: .22em; }
        .hero-actions { flex-direction: column; align-items: flex-start; gap: 6px; margin-top: 20px; }
        .hero-btn { padding: 14px 22px; }
      }

      /* Phone: full photo on top (boots never cropped), text stacked below on cream. */
      @media (max-width: 767px), (max-width: 1100px) and (orientation: portrait) {
        .hero-root { height: auto; display: flex; flex-direction: column; align-items: stretch; }
        .hero-photo { position: relative; inset: auto; width: 100%; aspect-ratio: 16 / 9; }
        .hero-photo::after { display: none; }
        .hero-copy { position: static; transform: none; max-width: none; padding: 32px 24px 40px; background: #EFEAE3; }
        .hero-kicker { display: flex; align-items: center; gap: 14px; margin: 0 0 22px; font-size: 11px; font-weight: 500; letter-spacing: .38em; text-transform: uppercase; color: #6B5444; animation: heroUp .8s ease-out .1s both; }
      .hero-kicker::before { content: ''; width: 36px; height: 1px; background: currentColor; }
      .hero-title { font-size: clamp(2.6rem, 12vw, 3.4rem); }
        .hero-actions { flex-wrap: wrap; gap: 16px 24px; margin-top: 28px; }
      }

      /* Phones (portrait): banner fills the screen, headline over the wall, buttons on the floor strip. */
      @media (max-width: 767px) and (orientation: portrait) {
        .hero-root { height: calc(100svh - var(--header-height)); display: block; }
        .hero-photo { position: absolute; inset: 0; width: auto; aspect-ratio: auto; }
        .hero-photo img { width: 100%; object-fit: cover; object-position: center bottom; -webkit-mask-image: none; mask-image: none; }
        .hero-root::after {
          content: ''; position: absolute; inset: 0 0 auto 0; height: 62%; z-index: 1; pointer-events: none;
          background: linear-gradient(to bottom, rgba(240,235,228,.8), rgba(240,235,228,.4) 48%, rgba(240,235,228,0));
        }
        .hero-copy {
          position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between;
          max-width: none; background: none; transform: none;
          padding: clamp(14px, 4.5svh, 52px) clamp(20px, 6vw, 44px) clamp(16px, 4svh, 40px);
        }
        .hero-kicker { display: flex; align-items: center; gap: 14px; margin: 0 0 22px; font-size: 11px; font-weight: 500; letter-spacing: .38em; text-transform: uppercase; color: #6B5444; animation: heroUp .8s ease-out .1s both; }
      .hero-kicker::before { content: ''; width: 36px; height: 1px; background: currentColor; }
        .hero-title { font-size: 38px; }
        .hero-eyebrow-line { display: none; }
        .hero-subtitle { margin-top: 12px; font-size: 10px; letter-spacing: .2em; }
        .hero-actions { flex-wrap: wrap; gap: 12px 14px; margin-top: 0; }
        .hero-btn { padding: 13px 18px; font-size: 10px; letter-spacing: .18em; }
        .hero-link { font-size: 10px; letter-spacing: .18em; padding: 0 18px; min-height: 42px; background: rgba(245,239,230,.6); }
        .hero-kicker { font-size: 9px; margin-bottom: 12px; }
        .hero-subtitle { font-size: 13px; letter-spacing: .01em; }
      }

      @media (prefers-reduced-motion: reduce) {
        .hero-root *, .hero-root *::after { animation: none !important; transition: none !important; }
      }
      .hero-title { font-size: 64px; letter-spacing: 0; }
      .hero-title em { padding-left: 0; }
      @media (min-width: 768px) and (max-width: 1199px) {
        .hero-title { font-size: 48px; }
      }
      @media (max-width: 767px) {
        .hero-title { font-size: 38px; }
      }
      @media (max-width: 359px) {
        .hero-title { font-size: 32px; }
      }

      /* Short phones: compact text and a higher crop so the face stays clear. */
      @media (max-width: 767px) and (orientation: portrait) and (max-height: 700px) {
        .hero-photo img { object-position: center 88%; }
        .hero-copy { padding-top: clamp(28px, 7svh, 48px); padding-bottom: 14px; }
        .hero-kicker { display: none; }
        .hero-title { font-size: 34px; }
        .hero-subtitle { font-size: 13px; margin-top: 10px; }
        .hero-actions { gap: 8px 12px; }
        .hero-btn { padding: 11px 16px; min-height: 40px; }
        .hero-link { min-height: 38px; }
      }
    `}</style>

    <section className="hero-root" aria-labelledby="hero-title">
      <div className="hero-photo">
        <picture>
          <source media="(max-width: 767px) and (orientation: portrait)" srcSet={mobileBanner} />
          <img
            fetchPriority="high"
            src={heroBanner}
            width={1920}
            height={1080}
            alt="Gary Shoes Fall/Winter 2026 collection, model seated in a brown coat and olive boots"
          />
        </picture>
      </div>

      <div className="hero-copy">
        <div className="hero-lead">
        <p className="hero-kicker">Fall / Winter 2026</p>
        <h1 id="hero-title" className="hero-title">
          <span>A Different</span>
          <span>Kind of <em>Winter</em></span>
        </h1>
        <span className="hero-eyebrow-line" aria-hidden="true" />
        <p className="hero-subtitle">Discover the Fall/Winter 2026 collection</p>
        </div>
        <div className="hero-actions">
          <Link to="/shop" className="hero-btn">
            Explore Collection
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true"><path d="M0 5h15M11 1l4 4-4 4" stroke="currentColor" strokeWidth="1" /></svg>
          </Link>
          <Link to="/about" className="hero-link">
            Our Story
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M1 9L9 1M3 1h6v6" stroke="currentColor" strokeWidth="1" /></svg>
          </Link>
        </div>
      </div>

    </section>
  </>
);

export default HeroSection;
