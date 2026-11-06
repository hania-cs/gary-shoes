import { useState } from "react";
import { adminChangePassword, adminGenerateRecoveryCode, getAdminUsername } from "@/lib/adminAuth";
import { toast } from "sonner";
import { X, Copy, Check } from "lucide-react";

export default function SecuritySettings({ onClose }: { onClose: () => void }) {
  const username = getAdminUsername() || "";

  // Change password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cpLoading, setCpLoading] = useState(false);

  // Recovery code
  const [recoveryPassword, setRecoveryPassword] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [rcLoading, setRcLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return toast.error("Fill in all fields");
    if (newPassword.length < 6) return toast.error("New password must be at least 6 characters");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    setCpLoading(true);
    try {
      await adminChangePassword(username, currentPassword, newPassword);
      toast.success("Password updated");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.message || "Failed");
    } finally {
      setCpLoading(false);
    }
  };

  const handleGenerateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryPassword) return toast.error("Enter your password to confirm");
    setRcLoading(true);
    try {
      const code = await adminGenerateRecoveryCode(username, recoveryPassword);
      setGeneratedCode(code);
      setRecoveryPassword("");
      toast.success("New recovery code generated. Save it now!");
    } catch (err: any) {
      toast.error(err?.message || "Failed");
    } finally {
      setRcLoading(false);
    }
  };

  const copyCode = async () => {
    if (!generatedCode) return;
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <style>{`
        .ss-overlay {
          position: fixed; inset: 0; background: rgba(13,13,13,0.6);
          display: flex; align-items: flex-start; justify-content: center;
          padding: 4rem 1.5rem; z-index: 100; overflow-y: auto;
          font-family: 'Jost', sans-serif;
        }
        .ss-card {
          position: relative; width: 100%; max-width: 540px;
          background: #FAF7F2; border: 1px solid rgba(201,169,110,0.25);
          padding: 3rem 2.5rem;
        }
        .ss-close {
          position: absolute; top: 1rem; right: 1rem;
          background: none; border: none; cursor: pointer; color: #8B8075;
        }
        .ss-eyebrow { display: inline-flex; align-items: center; gap: 0.9rem; margin-bottom: 0.75rem; }
        .ss-eyebrow-dash { width: 28px; height: 1px; background: #C9A96E; }
        .ss-eyebrow-text {
          font-size: 0.58rem; font-weight: 300; letter-spacing: 0.35em;
          text-transform: uppercase; color: #8B8075;
        }
        .ss-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; font-weight: 300; line-height: 1; color: #0D0D0D;
          margin-bottom: 0.5rem;
        }
        .ss-title em { font-style: italic; color: #C9A96E; }
        .ss-sub {
          font-size: 0.7rem; font-weight: 300; color: #8B8075;
          margin-bottom: 2rem;
        }
        .ss-section {
          border-top: 1px solid rgba(201,169,110,0.2);
          padding-top: 2rem; margin-top: 2rem;
        }
        .ss-section:first-of-type { border-top: none; padding-top: 0; margin-top: 0; }
        .ss-section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.25rem; font-weight: 400; color: #0D0D0D;
          margin-bottom: 0.4rem;
        }
        .ss-section-help {
          font-size: 0.7rem; color: #8B8075; font-weight: 300;
          margin-bottom: 1.25rem; line-height: 1.6;
        }
        .ss-field { margin-bottom: 1rem; }
        .ss-label {
          display: block; font-size: 0.55rem; font-weight: 300; letter-spacing: 0.3em;
          text-transform: uppercase; color: #8B8075; margin-bottom: 0.5rem;
        }
        .ss-input {
          width: 100%; box-sizing: border-box;
          padding: 0.75rem 0.9rem; background: transparent;
          border: 1px solid rgba(201,169,110,0.25);
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem; font-weight: 300; color: #0D0D0D;
          outline: none; transition: border-color 0.3s;
        }
        .ss-input:focus { border-color: #C9A96E; }
        .ss-btn {
          position: relative; padding: 0.75rem 1.5rem;
          border: 1px solid rgba(201,169,110,0.5);
          background: transparent; color: #3A3530; cursor: pointer;
          font-size: 0.55rem; font-weight: 300; letter-spacing: 0.3em;
          text-transform: uppercase; overflow: hidden;
          transition: color 0.35s, border-color 0.35s;
        }
        .ss-btn::before {
          content: ''; position: absolute; inset: 0;
          background: #C9A96E; transform: translateX(-100%);
          transition: transform 0.35s;
        }
        .ss-btn:hover::before { transform: translateX(0); }
        .ss-btn:hover { color: #0D0D0D; border-color: #C9A96E; }
        .ss-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .ss-btn span { position: relative; z-index: 1; }

        .ss-code-box {
          background: #0D0D0D; color: #C9A96E;
          padding: 1.25rem; margin-top: 1rem;
          font-family: 'Jost', monospace; font-size: 1.1rem;
          letter-spacing: 0.2em; text-align: center;
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
        }
        .ss-code-box button {
          background: none; border: 1px solid #C9A96E; color: #C9A96E;
          padding: 0.5rem 0.75rem; cursor: pointer;
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
        }
        .ss-warn {
          background: rgba(201,169,110,0.1);
          border-left: 2px solid #C9A96E;
          padding: 0.75rem 1rem; margin-top: 1rem;
          font-size: 0.65rem; color: #3A3530; line-height: 1.6;
        }
      `}</style>

      <div className="ss-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="ss-card">
          <button className="ss-close" onClick={onClose}><X size={18} /></button>
          <div className="ss-eyebrow">
            <div className="ss-eyebrow-dash" />
            <span className="ss-eyebrow-text">Account</span>
          </div>
          <h2 className="ss-title">Security <em>Settings</em></h2>
          <p className="ss-sub">Signed in as <strong>{username}</strong></p>

          <div className="ss-section">
            <h3 className="ss-section-title">Change Password</h3>
            <p className="ss-section-help">Update your password. Minimum 6 characters.</p>
            <form onSubmit={handleChangePassword} autoComplete="off">
              <div className="ss-field">
                <label className="ss-label">Current Password</label>
                <input className="ss-input" type="password" value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)} disabled={cpLoading} />
              </div>
              <div className="ss-field">
                <label className="ss-label">New Password</label>
                <input className="ss-input" type="password" value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} disabled={cpLoading} />
              </div>
              <div className="ss-field">
                <label className="ss-label">Confirm New Password</label>
                <input className="ss-input" type="password" value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} disabled={cpLoading} />
              </div>
              <button type="submit" className="ss-btn" disabled={cpLoading}>
                <span>{cpLoading ? "Updating…" : "Update Password"}</span>
              </button>
            </form>
          </div>

          <div className="ss-section">
            <h3 className="ss-section-title">Recovery Code</h3>
            <p className="ss-section-help">
              If you forget your password, you can use a recovery code to reset it.
              Generate a new one anytime — the previous code will stop working. Save the
              new code somewhere safe (notes app, paper, etc.).
            </p>
            <form onSubmit={handleGenerateCode} autoComplete="off">
              <div className="ss-field">
                <label className="ss-label">Confirm Current Password</label>
                <input className="ss-input" type="password" value={recoveryPassword}
                  onChange={(e) => setRecoveryPassword(e.target.value)} disabled={rcLoading} />
              </div>
              <button type="submit" className="ss-btn" disabled={rcLoading}>
                <span>{rcLoading ? "Generating…" : "Generate New Code"}</span>
              </button>
            </form>

            {generatedCode && (
              <>
                <div className="ss-code-box">
                  <span>{generatedCode}</span>
                  <button type="button" onClick={copyCode}>
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <div className="ss-warn">
                  ⚠ Save this code now. For security, it will not be shown again.
                  Anyone with this code can reset your password.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
