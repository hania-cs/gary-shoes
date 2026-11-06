const posts = [
  { type: "reel", video: "/v1.mov", cover: "/c3.webp" },
  { type: "post", image: "/insta1.webp" },
  { type: "reel", video: "/v2.mov", cover: "/c4.webp" },
  { type: "reel", video: "/v3.mp4", cover: "/c1.webp" },
  { type: "reel", video: "/v4.mp4", cover: "/c2.webp" },
  { type: "post", image: "/insta2.webp" },
];

const tiles = [
  { index: 0 },
  { index: 1 },
  { index: 2 },
  { index: 3 },
  { index: 4 },
  { index: 5 },
];

import { useState, useRef, useEffect } from "react";
import { Instagram } from "lucide-react";

const ReelIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: 11, height: 11 }} fill="white">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
  </svg>
);

const PlayIcon = () => (
  <svg width="14" height="16" viewBox="0 0 14 16" fill="white">
    <path d="M1 1l12 7L1 15V1z" />
  </svg>
);

const InstagramShop = () => {
  const [activePost, setActivePost] = useState(null);
  const videoRef = useRef(null);
  const progressInterval = useRef(null);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(true);

  const openModal = (index) => {
    const postIndex = tiles[index].index;
    setActivePost(postIndex);
    setProgress(0);
    setMuted(true);
  };

  const closeModal = () => {
    setActivePost(null);
    clearInterval(progressInterval.current);
    setProgress(0);
  };

  useEffect(() => {
    if (activePost === null) return;
    const post = posts[activePost];
    if (post.type !== "reel") return;
    const video = videoRef.current;
    if (!video) return;
    video.src = post.video;
    video.muted = true;
    video.play().catch(() => {});
    clearInterval(progressInterval.current);
    progressInterval.current = setInterval(() => {
      if (video.duration) setProgress((video.currentTime / video.duration) * 100);
    }, 200);
    return () => clearInterval(progressInterval.current);
  }, [activePost]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activePost !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activePost]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  const post = activePost !== null ? posts[activePost] : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

        @keyframes ig-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .ig-section {
          position: relative;
          background: #FAF7F2;
          padding: 7rem 0 8rem;
          font-family: 'Jost', sans-serif;
          overflow: hidden;
        }
        .ig-glow {
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 700px; height: 500px;
          background: radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .ig-inner {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 3rem;
        }
        @media (max-width: 767px) { .ig-inner { padding: 0 1rem; } }

        .ig-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 4rem;
        }
        .ig-icon-wrap {
          position: relative;
          width: 52px; height: 52px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.8rem;
        }
        .ig-icon-ring {
          position: absolute; inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(201,169,110,0.5);
          animation: ig-spin 12s linear infinite;
        }
        .ig-icon-ring::before {
          content: '';
          position: absolute;
          top: -2px; left: 50%;
          transform: translateX(-50%);
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #C9A96E;
        }
        .ig-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          margin-bottom: 1.4rem;
        }
        .ig-eyebrow-dash { width: 28px; height: 1px; background: #C9A96E; }
        .ig-eyebrow-text {
          font-size: 0.58rem;
          font-weight: 300;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #8B8075;
        }
        .ig-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.8rem, 5vw, 5rem);
          font-weight: 300;
          line-height: 0.95;
          color: #0D0D0D;
          letter-spacing: -0.01em;
          margin: 0 0 1rem;
        }
        .ig-headline em { font-style: italic; color: #C9A96E; }
        .ig-handle-link {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1rem, 2vw, 1.25rem);
          font-weight: 300;
          letter-spacing: 0.08em;
          color: #8B8075;
          text-decoration: none;
          position: relative;
          display: inline-block;
          transition: color 0.3s ease;
        }
        .ig-handle-link em { font-style: italic; color: #C9A96E; }
        .ig-handle-link::after {
          content: '';
          position: absolute;
          bottom: -4px; left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 100%; height: 1px;
          background: linear-gradient(to right, transparent, #C9A96E, transparent);
          transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          transform-origin: center;
        }
        .ig-handle-link:hover::after { transform: translateX(-50%) scaleX(1); }
        .ig-handle-link:hover { color: #3A3530; }
        .ig-ornament {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-top: 2rem;
          margin-bottom: 3.5rem;
        }
        .ig-orn-line { width: 48px; height: 1px; background: linear-gradient(to right, transparent, rgba(201,169,110,0.5)); }
        .ig-orn-line.rev { background: linear-gradient(to left, transparent, rgba(201,169,110,0.5)); }
        .ig-orn-diamond { width: 5px; height: 5px; background: #C9A96E; transform: rotate(45deg); opacity: 0.6; }

        /* ── Grid: 2 rows × 3 columns, portrait tiles ── */
        .ig-grid-wrap {
          max-width: 1100px;
          margin: 0 auto;
        }
        .ig-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        @media (max-width: 600px) {
          .ig-grid { gap: 3px; }
        }

        .ig-tile {
          position: relative;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          cursor: pointer;
          background: #EDE5D8;
          border-radius: 2px;
        }
        .ig-tile img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center center;
          display: block;
          transition: transform 0.6s cubic-bezier(0.23,1,0.32,1);
        }
        .ig-tile:hover img { transform: none; }
        .ig-tile-overlay {
          position: absolute; inset: 0;
          background: rgba(10,8,6,0);
          display: flex; align-items: center; justify-content: center;
          transition: background 0.3s ease;
        }
        .ig-tile:hover .ig-tile-overlay { background: rgba(10,8,6,0.12); }
        .ig-reel-badge {
          position: absolute; top: 10px; right: 10px;
          background: rgba(10,8,6,0.55);
          border-radius: 4px; padding: 3px 7px;
          display: flex; align-items: center; gap: 4px;
        }
        .ig-reel-badge span { font-size: 10px; font-weight: 300; letter-spacing: 0.08em; color: #fff; }

        /* ── Modal ── */
        .ig-modal-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.88);
          z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
        }
        .ig-modal {
          position: relative;
          width: 100%;
          max-width: 400px;
          max-height: 90vh;
          background: #000;
          border-radius: 6px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          aspect-ratio: 9 / 16;
        }
        .ig-modal-video-wrap {
          width: 100%; height: 100%;
          position: relative;
          display: flex; align-items: center; justify-content: center;
        }
        .ig-modal-video-wrap video {
          width: 100%; height: 100%;
          object-fit: cover;
        }
        .ig-modal-post-img {
          width: 100%; height: 100%;
          object-fit: contain;
          background: #111;
        }
        @media (max-width: 500px) {
          .ig-modal { max-width: 100%; height: 100svh; max-height: 100svh; border-radius: 0; aspect-ratio: unset; }
          .ig-modal-backdrop { padding: 0; }
        }
        .ig-vid-chrome-top {
          position: absolute; top: 0; left: 0; right: 0;
          padding: 12px 14px;
          display: flex; align-items: center; gap: 8px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.55), transparent);
          z-index: 2;
        }
        .ig-vid-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          background: linear-gradient(135deg, #C9A96E, #8B4513);
          border: 1.5px solid #fff; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 500; color: #fff;
        }
        .ig-vid-username { font-size: 12px; font-weight: 500; color: #fff; font-family: -apple-system, sans-serif; }
        .ig-vid-follow { font-size: 11px; color: rgba(255,255,255,0.8); font-family: -apple-system, sans-serif; cursor: pointer; }
        .ig-vid-chrome-bottom {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 14px;
          background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
          z-index: 2;
        }
        .ig-vid-actions { display: flex; gap: 14px; align-items: center; }
        .ig-vid-actions svg { width: 22px; height: 22px; fill: #fff; cursor: pointer; }
        .ig-vid-progress {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px; background: rgba(255,255,255,0.25); z-index: 3;
        }
        .ig-vid-progress-bar { height: 100%; background: #C9A96E; transition: width 0.3s linear; }
        .ig-modal-close {
          position: absolute; top: 12px; right: 12px;
          background: rgba(0,0,0,0.45); border: none; color: #fff;
          font-size: 18px; cursor: pointer; z-index: 10;
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
        }
      `}</style>

      <section className="ig-section">
        <div className="ig-glow" />
        <div className="ig-inner">

          {/* Header */}
          <div className="ig-header">
            <div className="ig-icon-wrap">
              <div className="ig-icon-ring" />
              <Instagram size={20} style={{ color: "#C9A96E", opacity: 0.9 }} />
            </div>
            <div className="ig-eyebrow">
              <div className="ig-eyebrow-dash" />
              <span className="ig-eyebrow-text">Follow Along</span>
              <div className="ig-eyebrow-dash" />
            </div>
            <h2 className="ig-headline">Instagram <em>Shop</em></h2>
            <a
              href="https://instagram.com/garyshoeslb"
              target="_blank"
              rel="noopener noreferrer"
              className="ig-handle-link"
            >
              <em>@</em>garyshoeslb
            </a>
            <div className="ig-ornament">
              <div className="ig-orn-line" />
              <div className="ig-orn-diamond" />
              <div className="ig-orn-line rev" />
            </div>
          </div>

          {/* Grid */}
          <div className="ig-grid-wrap">
            <div className="ig-grid">
              {tiles.map((tile, i) => {
                const p = posts[tile.index];
                const thumbSrc = p.type === "reel" ? p.cover : p.image;
                return (
                  <div key={i} className="ig-tile" onClick={() => openModal(i)}>
                    <img src={thumbSrc} alt={`Post ${i + 1}`} loading="lazy" />

                    {p.type === "reel" && (
                      <div className="ig-reel-badge">
                        <ReelIcon />
                        <span>Reel</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* Modal */}
      {activePost !== null && post && (
        <div
          className="ig-modal-backdrop"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="ig-modal">
            <button className="ig-modal-close" onClick={closeModal}>✕</button>

            {post.type === "reel" ? (
              <div className="ig-modal-video-wrap">
                <div className="ig-vid-chrome-top">
                  <div className="ig-vid-avatar">G</div>
                  <div>
                    <div className="ig-vid-username">garyshoes</div>
                    <div className="ig-vid-follow">Follow</div>
                  </div>
                </div>
                <video ref={videoRef} loop playsInline muted={muted} autoPlay />
                <div className="ig-vid-chrome-bottom">
                  <div className="ig-vid-actions">
                    <svg viewBox="0 0 24 24" onClick={toggleMute} style={{ cursor: "pointer" }}>
                      {muted
                        ? <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                        : <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                      }
                    </svg>
                  </div>
                </div>
                <div className="ig-vid-progress">
                  <div className="ig-vid-progress-bar" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : (
              <img className="ig-modal-post-img" src={post.image} alt="Post" loading="lazy" />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default InstagramShop;