import { useState } from "react";
import { adminLogin, adminResetPassword } from "@/lib/adminAuth";
import { toast } from "sonner";

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [showForgot, setShowForgot] = useState(false);
  const [fpUsername, setFpUsername] = useState("");
  const [fpCode, setFpCode] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirm, setFpConfirm] = useState("");
  const [fpLoading, setFpLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast.error("Enter username and password");
      return;
    }
    setLoading(true);
    try {
      await adminLogin(username.trim(), password);
      toast.success("Welcome back");
      onSuccess();
    } catch (err: any) {
      toast.error(err?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fpUsername.trim() || !fpCode.trim() || !fpNewPassword) {
      toast.error("Fill in all fields");
      return;
    }
    if (fpNewPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (fpNewPassword !== fpConfirm) {
      toast.error("Passwords do not match");
      return;
    }
    setFpLoading(true);
    try {
      await adminResetPassword(fpUsername.trim(), fpCode.trim(), fpNewPassword);
      toast.success("Password reset. You can now sign in.");
      setShowForgot(false);
      setUsername(fpUsername.trim());
      setPassword("");
      setFpUsername(""); setFpCode(""); setFpNewPassword(""); setFpConfirm("");
    } catch (err: any) {
      toast.error(err?.message || "Reset failed");
    } finally {
      setFpLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

        .al-root {
          min-height: 100vh;
          background: #FAF7F2;
          font-family: 'Jost', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          position: relative;
          overflow: hidden;
        }
        .al-root::before {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.5;
        }

        .al-card {
          position: relative;
          width: 100%;
          max-width: 440px;
          background: #FAF7F2;
          border: 1px solid rgba(201,169,110,0.25);
          padding: 3.5rem 3rem;
        }
        @media (max-width: 600px) { .al-card { padding: 2.5rem 1.75rem; } }

        .al-corner { position: absolute; width: 24px; height: 24px; }
        .al-corner-tl { top: -1px; left: -1px; border-top: 1px solid #C9A96E; border-left: 1px solid #C9A96E; }
        .al-corner-br { bottom: -1px; right: -1px; border-bottom: 1px solid #C9A96E; border-right: 1px solid #C9A96E; }

        .al-eyebrow { display: inline-flex; align-items: center; gap: 0.9rem; margin-bottom: 1rem; }
        .al-eyebrow-dash { width: 28px; height: 1px; background: #C9A96E; }
        .al-eyebrow-text {
          font-size: 0.58rem; font-weight: 300; letter-spacing: 0.35em;
          text-transform: uppercase; color: #8B8075;
        }

        .al-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.25rem; font-weight: 300; line-height: 0.95;
          color: #0D0D0D; margin-bottom: 0.5rem;
        }
        .al-title em { font-style: italic; color: #C9A96E; }
        .al-sub {
          font-size: 0.7rem; font-weight: 300; letter-spacing: 0.05em;
          color: #8B8075; margin-bottom: 2.5rem;
        }

        .al-field { margin-bottom: 1.4rem; }
        .al-label {
          display: block; font-size: 0.55rem; font-weight: 300; letter-spacing: 0.3em;
          text-transform: uppercase; color: #8B8075; margin-bottom: 0.55rem;
        }
        .al-input {
          width: 100%; box-sizing: border-box;
          padding: 0.85rem 1rem;
          background: transparent;
          border: 1px solid rgba(201,169,110,0.25);
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem; font-weight: 300; color: #0D0D0D;
          outline: none; transition: border-color 0.3s ease;
        }
        .al-input:focus { border-color: #C9A96E; }

        .al-btn {
          width: 100%; position: relative;
          padding: 0.95rem 1.5rem; margin-top: 0.6rem;
          border: 1px solid rgba(201,169,110,0.5);
          background: transparent; color: #3A3530;
          font-size: 0.6rem; font-weight: 300; letter-spacing: 0.3em;
          text-transform: uppercase;
          cursor: pointer; overflow: hidden;
          transition: color 0.35s ease, border-color 0.35s ease;
        }
        .al-btn::before {
          content: ''; position: absolute; inset: 0;
          background: #C9A96E; transform: translateX(-100%);
          transition: transform 0.35s ease;
        }
        .al-btn:hover::before { transform: translateX(0); }
        .al-btn:hover { color: #0D0D0D; border-color: #C9A96E; }
        .al-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .al-btn span { position: relative; z-index: 1; }

        .al-link-btn {
          display: block; width: 100%; margin-top: 1rem; text-align: center;
          background: none; border: none; cursor: pointer;
          font-size: 0.55rem; font-weight: 300; letter-spacing: 0.3em;
          text-transform: uppercase; color: #8B8075;
          transition: color 0.3s ease;
        }
        .al-link-btn:hover { color: #C9A96E; }

        .al-back {
          display: block; margin-top: 1rem; text-align: center;
          font-size: 0.55rem; font-weight: 300; letter-spacing: 0.3em;
          text-transform: uppercase; color: #8B8075; text-decoration: none;
          transition: color 0.3s ease;
        }
        .al-back:hover { color: #3A3530; }

        .al-overlay {
          position: fixed; inset: 0; background: rgba(13,13,13,0.6);
          display: flex; align-items: center; justify-content: center;
          padding: 1.5rem; z-index: 100;
        }
        .al-help {
          font-size: 0.65rem; color: #8B8075; line-height: 1.6;
          margin-bottom: 1.5rem; font-weight: 300;
        }
      `}</style>

      <div className="al-root">
        <div className="al-card">
          <div className="al-corner al-corner-tl" />
          <div className="al-corner al-corner-br" />

          <div className="al-eyebrow">
            <div className="al-eyebrow-dash" />
            <span className="al-eyebrow-text">Restricted</span>
          </div>
          <h1 className="al-title">Admin <em>Access</em></h1>
          <p className="al-sub">Sign in to manage the collection.</p>

          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="al-field">
              <label className="al-label" htmlFor="al-user">Username</label>
              <input
                id="al-user" className="al-input" type="text" autoComplete="username"
                value={username} onChange={(e) => setUsername(e.target.value)} disabled={loading}
              />
            </div>
            <div className="al-field">
              <label className="al-label" htmlFor="al-pass">Password</label>
              <input
                id="al-pass" className="al-input" type="password" autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading}
              />
            </div>
            <button type="submit" className="al-btn" disabled={loading}>
              <span>{loading ? "Signing in…" : "Sign In"}</span>
            </button>
          </form>

          <button type="button" className="al-link-btn" onClick={() => setShowForgot(true)}>
            Forgot password?
          </button>
          <a href="/" className="al-back">← Back to Site</a>
        </div>

        {showForgot && (
          <div className="al-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowForgot(false); }}>
            <div className="al-card" style={{ maxWidth: 460 }}>
              <div className="al-corner al-corner-tl" />
              <div className="al-corner al-corner-br" />
              <div className="al-eyebrow">
                <div className="al-eyebrow-dash" />
                <span className="al-eyebrow-text">Recovery</span>
              </div>
              <h1 className="al-title">Reset <em>Password</em></h1>
              <p className="al-help">
                Enter your username, the recovery code you saved, and a new password.
              </p>

              <form onSubmit={handleForgotSubmit} autoComplete="off">
                <div className="al-field">
                  <label className="al-label">Username</label>
                  <input className="al-input" type="text" value={fpUsername}
                    onChange={(e) => setFpUsername(e.target.value)} disabled={fpLoading} />
                </div>
                <div className="al-field">
                  <label className="al-label">Recovery Code</label>
                  <input className="al-input" type="text" placeholder="XXXX-XXXX-XXXX-XXXX"
                    value={fpCode} onChange={(e) => setFpCode(e.target.value.toUpperCase())} disabled={fpLoading} />
                </div>
                <div className="al-field">
                  <label className="al-label">New Password</label>
                  <input className="al-input" type="password" value={fpNewPassword}
                    onChange={(e) => setFpNewPassword(e.target.value)} disabled={fpLoading} />
                </div>
                <div className="al-field">
                  <label className="al-label">Confirm Password</label>
                  <input className="al-input" type="password" value={fpConfirm}
                    onChange={(e) => setFpConfirm(e.target.value)} disabled={fpLoading} />
                </div>
                <button type="submit" className="al-btn" disabled={fpLoading}>
                  <span>{fpLoading ? "Resetting…" : "Reset Password"}</span>
                </button>
              </form>
              <button type="button" className="al-link-btn" onClick={() => setShowForgot(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
