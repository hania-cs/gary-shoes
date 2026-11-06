import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { uploadProductImage, createProduct, CATEGORIES } from "@/lib/products";
import { toast } from "sonner";
import { Upload, X, ChevronDown, Check, Loader2 } from "lucide-react";

interface FileEntry {
  file: File;
  name: string;
  price: number;
  status: "pending" | "uploading" | "done" | "error";
  preview: string;
}

const BulkImport = ({ onClose }: { onClose: () => void }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [defaultPrice, setDefaultPrice] = useState(0);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const entries: FileEntry[] = Array.from(selectedFiles).map((file) => {
      const rawName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      return {
        file,
        name,
        price: defaultPrice,
        preview: URL.createObjectURL(file),
        status: "pending" as const,
      };
    });
    setFiles((prev) => [...prev, ...entries]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const updateFile = (index: number, updates: Partial<FileEntry>) => {
    setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, ...updates } : f)));
  };

  const applyPriceToAll = () => {
    setFiles((prev) => prev.map((f) => ({ ...f, price: defaultPrice })));
  };

  const handleImport = async () => {
    if (files.length === 0) return;
    setImporting(true);
    const total = files.length;
    setProgress({ done: 0, total });
    const finalCategory = category === "__custom__" ? customCategory : category;
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const entry = files[i];
      if (entry.status === "done") {
        setProgress((p) => ({ ...p, done: p.done + 1 }));
        continue;
      }
      updateFile(i, { status: "uploading" });
      try {
        const imageUrl = await uploadProductImage(entry.file);
        await createProduct({
          name: entry.name,
          price: entry.price,
          category: finalCategory,
          image_url: imageUrl,
          is_featured: false,
          is_on_sale: false,
        });
        updateFile(i, { status: "done" });
        successCount++;
      } catch (err: any) {
        updateFile(i, { status: "error" });
        console.error(`Failed to import ${entry.name}:`, err);
      }
      setProgress((p) => ({ ...p, done: p.done + 1 }));
    }

    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    toast.success(`Imported ${successCount} of ${total} products!`);
    setImporting(false);
  };

  return (
    <div className="ad-modal-backdrop">
      <div className="ad-modal" style={{ maxWidth: 700, maxHeight: "92vh" }}>
        <div className="ad-modal-corner ad-modal-corner-tl" />
        <div className="ad-modal-corner ad-modal-corner-br" />

        <div className="ad-modal-header">
          <h3 className="ad-modal-title">
            Bulk <em>Import</em>
          </h3>
          <button className="ad-modal-close" onClick={onClose} disabled={importing}>
            <X size={18} />
          </button>
        </div>

        {/* Settings row */}
        <div className="ad-field-row ad-field">
          <div>
            <label className="ad-label">Category for all *</label>
            <div className="ad-select-wrap">
              <select
                className="ad-select"
                value={category}
                onChange={(e) => {
                  const val = e.target.value;
                  setShowCustom(val === "__custom__");
                  setCategory(val);
                }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="__custom__">+ Custom Category</option>
              </select>
              <ChevronDown size={14} className="ad-select-icon" />
            </div>
          </div>
          <div>
            <label className="ad-label">Default Price ($)</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="number"
                min="0"
                step="0.01"
                className="ad-input"
                value={defaultPrice}
                onChange={(e) => setDefaultPrice(parseFloat(e.target.value) || 0)}
              />
              {files.length > 0 && (
                <button
                  type="button"
                  className="ad-upload-btn"
                  style={{ width: "auto", padding: "0.5rem 0.8rem", fontSize: "0.55rem" }}
                  onClick={applyPriceToAll}
                >
                  Apply All
                </button>
              )}
            </div>
          </div>
        </div>

        {showCustom && (
          <div className="ad-field">
            <label className="ad-label">Custom Category Name *</label>
            <input
              type="text"
              className="ad-input"
              placeholder="Enter category name"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
            />
          </div>
        )}

        {/* Drop zone */}
        <div
          className="ad-field"
          style={{ cursor: "pointer" }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleFiles(e.dataTransfer.files); }}
        >
          <div
            style={{
              border: "1px dashed rgba(201,169,110,0.4)",
              padding: "2rem",
              textAlign: "center",
              transition: "border-color 0.3s",
            }}
          >
            <Upload size={24} style={{ color: "#C9A96E", margin: "0 auto 0.8rem", display: "block" }} />
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.7rem",
              fontWeight: 300,
              color: "#8B8075",
              letterSpacing: "0.1em",
            }}>
              Click or drag & drop images here
            </p>
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.55rem",
              fontWeight: 200,
              color: "#8B8075",
              marginTop: "0.3rem",
            }}>
              Select multiple files at once · JPG, PNG, WebP
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "1rem" }}>
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.55rem",
              fontWeight: 300,
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              color: "#8B8075",
              marginBottom: "0.8rem",
            }}>
              {files.length} image{files.length !== 1 ? "s" : ""} selected
            </p>
            {files.map((entry, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  padding: "0.6rem 0",
                  borderBottom: "1px solid rgba(201,169,110,0.1)",
                }}
              >
                <img
                  src={entry.preview}
                  alt=""
                  style={{ width: 40, height: 40, objectFit: "cover", flexShrink: 0 }}
                />
                <input
                  className="ad-input"
                  style={{ flex: 1, padding: "0.4rem 0.6rem", fontSize: "0.7rem" }}
                  value={entry.name}
                  onChange={(e) => updateFile(i, { name: e.target.value })}
                  disabled={importing}
                />
                <input
                  type="number"
                  className="ad-input"
                  style={{ width: 80, padding: "0.4rem 0.6rem", fontSize: "0.7rem" }}
                  value={entry.price}
                  onChange={(e) => updateFile(i, { price: parseFloat(e.target.value) || 0 })}
                  disabled={importing}
                />
                {entry.status === "done" ? (
                  <Check size={16} style={{ color: "#5A8F5A", flexShrink: 0 }} />
                ) : entry.status === "uploading" ? (
                  <Loader2 size={16} style={{ color: "#C9A96E", flexShrink: 0, animation: "spin 1s linear infinite" }} />
                ) : entry.status === "error" ? (
                  <span style={{ color: "#9B3A3A", fontSize: "0.6rem", flexShrink: 0 }}>Failed</span>
                ) : (
                  <button
                    onClick={() => removeFile(i)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#8B8075", flexShrink: 0 }}
                    disabled={importing}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Progress bar */}
        {importing && (
          <div style={{ marginBottom: "1rem" }}>
            <div style={{
              height: 4,
              background: "rgba(201,169,110,0.15)",
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${(progress.done / progress.total) * 100}%`,
                background: "#C9A96E",
                transition: "width 0.3s ease",
              }} />
            </div>
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.6rem",
              color: "#8B8075",
              marginTop: "0.4rem",
              textAlign: "center",
            }}>
              {progress.done} / {progress.total} imported
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="ad-form-btns">
          <button
            type="button"
            className="ad-submit-btn"
            disabled={importing || files.length === 0 || (category === "__custom__" && !customCategory)}
            onClick={handleImport}
          >
            <span>{importing ? "Importing…" : `Import ${files.length} Product${files.length !== 1 ? "s" : ""}`}</span>
          </button>
          <button type="button" className="ad-cancel-btn" onClick={onClose} disabled={importing}>
            Cancel
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BulkImport;
