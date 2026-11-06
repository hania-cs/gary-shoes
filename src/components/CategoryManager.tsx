import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCategories, createCategory, deleteCategory, reorderCategories } from "@/lib/categories";
import { toast } from "sonner";
import { X, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

export default function CategoryManager({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [newName, setNewName] = useState("");

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const addMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      setNewName("");
      toast.success("Category added");
    },
    onError: (e: any) => toast.error(e?.message || "Failed to add category"),
  });

  const deleteMut = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category removed");
    },
    onError: (e: any) => toast.error(e?.message || "Failed to remove"),
  });

  const reorderMut = useMutation({
    mutationFn: reorderCategories,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (e: any) => toast.error(e?.message || "Failed to reorder"),
  });

  const move = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= categories.length) return;
    const reordered = [...categories];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    reorderMut.mutate(reordered.map((c) => c.id));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      toast.error("Category already exists");
      return;
    }
    addMutation.mutate(name);
  };

  return (
    <div className="ad-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ad-modal" style={{ maxWidth: 480 }}>
        <div className="ad-modal-corner ad-modal-corner-tl" />
        <div className="ad-modal-corner ad-modal-corner-br" />

        <div className="ad-modal-header">
          <h3 className="ad-modal-title">Manage <em>Categories</em></h3>
          <button className="ad-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleAdd} className="ad-field">
          <label className="ad-label">New Category</label>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <input
              type="text"
              className="ad-input"
              placeholder="e.g. Boots"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={addMutation.isPending}
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              className="ad-add-btn"
              disabled={addMutation.isPending || !newName.trim()}
              style={{ padding: "0.8rem 1.2rem" }}
            >
              <Plus size={14} />
              <span>Add</span>
            </button>
          </div>
        </form>

        <div className="ad-field">
          <label className="ad-label">Existing Categories</label>
          {isLoading ? (
            <div style={{ fontSize: "0.7rem", color: "#8B8075", padding: "1rem 0" }}>Loading…</div>
          ) : categories.length === 0 ? (
            <div style={{ fontSize: "0.7rem", color: "#8B8075", padding: "1rem 0" }}>No categories yet.</div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {categories.map((c, i) => (
                <li
                  key={c.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                    padding: "0.65rem 0.9rem",
                    border: "1px solid rgba(201,169,110,0.2)",
                    fontSize: "0.78rem",
                    color: "#3A3530",
                    fontWeight: 300,
                  }}
                >
                  <span style={{ flex: 1 }}>{c.name}</span>
                  <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
                    <button
                      type="button"
                      className="ad-action-btn"
                      title="Move up"
                      disabled={i === 0 || reorderMut.isPending}
                      onClick={() => move(i, -1)}
                      style={{ opacity: i === 0 ? 0.3 : 1 }}
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      className="ad-action-btn"
                      title="Move down"
                      disabled={i === categories.length - 1 || reorderMut.isPending}
                      onClick={() => move(i, 1)}
                      style={{ opacity: i === categories.length - 1 ? 0.3 : 1 }}
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      type="button"
                      className="ad-action-btn danger"
                      title="Remove"
                      onClick={() => {
                        if (confirm(`Remove category "${c.name}"? Existing products keep their category label.`)) {
                          deleteMut.mutate(c.id);
                        }
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="ad-form-btns">
          <button type="button" className="ad-cancel-btn" onClick={onClose} style={{ marginLeft: "auto" }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
