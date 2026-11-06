import { useState } from "react";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { createOrder, sendWhatsAppOrder, orderFormSchema, DELIVERY_FEE, type OrderFormData } from "@/lib/orders";
import { toast } from "sonner";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, clearCart, totalItems, totalPrice, itemKey } = useCart();
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<OrderFormData>({
    customer_name: "",
    customer_phone: "",
    customer_location: "",
    additional_notes: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_name.trim() || !form.customer_phone.trim() || !form.customer_location.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    const check = orderFormSchema.safeParse(form);
    if (!check.success) {
      toast.error(check.error.issues[0]?.message || "Please check your details");
      return;
    }
    setSubmitting(true);
    try {
      // Open WhatsApp first (inside the tap) so it is never blocked,
      // then record the order in the background.
      sendWhatsAppOrder(form, items);
      createOrder(form, items).catch((e) => console.error("Order save failed:", e));
      toast.success("Order placed successfully!");
      clearCart();
      setStep("cart");
      setIsOpen(false);
      setForm({ customer_name: "", customer_phone: "", customer_location: "", additional_notes: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

        .cart-backdrop {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(10,8,6,0.5);
          backdrop-filter: blur(4px);
        }
        .cart-drawer {
          position: fixed; top: 0; right: 0; bottom: 0;
          z-index: 201;
          width: 100%; max-width: 440px;
          background: #FAF7F2;
          display: flex; flex-direction: column;
          animation: cart-slide 0.3s ease forwards;
          border-left: 1px solid rgba(201,169,110,0.2);
        }
        @keyframes cart-slide {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .cart-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.5rem 1.8rem;
          border-bottom: 1px solid rgba(201,169,110,0.15);
        }
        .cart-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem; font-weight: 300; color: #0D0D0D;
        }
        .cart-title em { font-style: italic; color: #C9A96E; }
        .cart-close {
          background: none; border: none; color: #8B8075;
          cursor: pointer; transition: color 0.25s;
        }
        .cart-close:hover { color: #0D0D0D; }

        .cart-body { flex: 1; overflow-y: auto; padding: 1.5rem 1.8rem; }

        .cart-item {
          display: flex; gap: 1rem; padding: 1rem 0;
          border-bottom: 1px solid rgba(201,169,110,0.1);
        }
        .cart-item-img {
          width: 64px; height: 64px; object-fit: contain; background: #F0EBE3; flex-shrink: 0;
        }
        .cart-item-info { flex: 1; min-width: 0; }
        .cart-item-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem; font-weight: 300; color: #0D0D0D;
          margin-bottom: 0.3rem;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .cart-item-price {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem; font-weight: 300; letter-spacing: 0.15em; color: #C9A96E;
        }
        .cart-qty {
          display: flex; align-items: center; gap: 0.6rem; margin-top: 0.5rem;
        }
        .cart-qty-btn {
          width: 26px; height: 26px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(201,169,110,0.3); background: none;
          color: #8B8075; cursor: pointer; transition: all 0.25s;
        }
        .cart-qty-btn:hover { border-color: #C9A96E; color: #3A3530; }
        .cart-qty-val {
          font-family: 'Jost', sans-serif; font-size: 0.75rem;
          font-weight: 300; color: #0D0D0D; min-width: 20px; text-align: center;
        }
        .cart-remove {
          background: none; border: none; color: #8B8075;
          cursor: pointer; margin-left: auto; align-self: flex-start;
          transition: color 0.25s;
        }
        .cart-remove:hover { color: #9B3A3A; }

        .cart-empty {
          text-align: center; padding: 4rem 0;
        }
        .cart-empty svg { color: rgba(201,169,110,0.3); margin: 0 auto 1rem; }
        .cart-empty p {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem; font-weight: 300; font-style: italic; color: #8B8075;
        }

        .cart-footer {
          padding: 1.5rem 1.8rem;
          border-top: 1px solid rgba(201,169,110,0.15);
        }
        .cart-total-row {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 1.2rem;
        }
        .cart-total-label {
          font-family: 'Jost', sans-serif; font-size: 0.6rem; font-weight: 300;
          letter-spacing: 0.3em; text-transform: uppercase; color: #8B8075;
        }
        .cart-total-val {
          font-family: 'Cormorant Garamond', serif; font-size: 1.5rem;
          font-weight: 300; color: #C9A96E;
        }

        .cart-checkout-btn {
          width: 100%; position: relative;
          padding: 1rem; border: 1px solid rgba(201,169,110,0.5);
          background: transparent; color: #3A3530;
          font-family: 'Jost', sans-serif; font-size: 0.6rem; font-weight: 300;
          letter-spacing: 0.3em; text-transform: uppercase;
          cursor: pointer; overflow: hidden;
          transition: color 0.35s, border-color 0.35s;
        }
        .cart-checkout-btn::before {
          content: ''; position: absolute; inset: 0;
          background: #C9A96E; transform: translateX(-100%);
          transition: transform 0.35s;
        }
        .cart-checkout-btn:hover::before { transform: translateX(0); }
        .cart-checkout-btn:hover { color: #0D0D0D; border-color: #C9A96E; }
        .cart-checkout-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .cart-checkout-btn span { position: relative; z-index: 1; }

        /* Checkout form */
        .cart-form-field { margin-bottom: 1.2rem; }
        .cart-form-label {
          display: block;
          font-family: 'Jost', sans-serif; font-size: 0.55rem; font-weight: 300;
          letter-spacing: 0.3em; text-transform: uppercase; color: #8B8075;
          margin-bottom: 0.5rem;
        }
        .cart-form-input, .cart-form-textarea {
          width: 100%; padding: 0.75rem 1rem;
          background: transparent;
          border: 1px solid rgba(201,169,110,0.25);
          font-family: 'Jost', sans-serif; font-size: 0.75rem; font-weight: 300;
          color: #0D0D0D; outline: none;
          transition: border-color 0.3s; box-sizing: border-box;
        }
        .cart-form-input:focus, .cart-form-textarea:focus { border-color: #C9A96E; }
        .cart-form-textarea { resize: none; }

        .cart-back-btn {
          background: none; border: none; color: #8B8075;
          font-family: 'Jost', sans-serif; font-size: 0.55rem; font-weight: 300;
          letter-spacing: 0.2em; text-transform: uppercase;
          cursor: pointer; margin-bottom: 1rem;
          display: inline-flex; align-items: center; gap: 0.5rem;
          transition: color 0.25s;
        }
        .cart-back-btn:hover { color: #3A3530; }
        .cart-back-btn::before {
          content: ''; width: 14px; height: 1px; background: currentColor;
        }
      `}</style>

      <div className="cart-backdrop" onClick={() => setIsOpen(false)} />
      <div className="cart-drawer">
        <div className="cart-header">
          <h2 className="cart-title">
            {step === "cart" ? <>Your <em>Cart</em></> : <>Your <em>Details</em></>}
          </h2>
          <button className="cart-close" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {step === "cart" ? (
          <>
            <div className="cart-body">
              {items.length === 0 ? (
                <div className="cart-empty">
                  <ShoppingBag size={40} />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => {
                  const key = itemKey(item);
                  const variantBits = [item.color, item.size ? `EU ${item.size}` : null].filter(Boolean);
                  return (
                  <div key={key} className="cart-item">
                    {item.image_url && (
                      <img loading="lazy" src={item.image_url} alt={item.name} className="cart-item-img" />
                    )}
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      {variantBits.length > 0 && (
                        <div style={{
                          fontFamily: "'Jost', sans-serif", fontSize: "0.6rem",
                          letterSpacing: "0.15em", color: "#8B8075", marginBottom: "0.3rem",
                          textTransform: "uppercase",
                        }}>
                          {variantBits.join(" · ")}
                        </div>
                      )}
                      <div className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                      <div className="cart-qty">
                        <button className="cart-qty-btn" onClick={() => updateQuantity(key, item.quantity - 1)}>
                          <Minus size={12} />
                        </button>
                        <span className="cart-qty-val">{item.quantity}</span>
                        <button className="cart-qty-btn" onClick={() => updateQuantity(key, item.quantity + 1)}>
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <button className="cart-remove" onClick={() => removeItem(key)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                  );
                })
              )}
            </div>
            {items.length > 0 && (
              <div className="cart-footer">
                <div style={{
                  fontFamily: "'Jost', sans-serif", fontSize: "0.65rem", fontWeight: 300,
                  letterSpacing: "0.1em", color: "#8B8075", textAlign: "center",
                  padding: "0.6rem", marginBottom: "0.9rem",
                  background: "rgba(201,169,110,0.08)",
                  border: "1px solid rgba(201,169,110,0.2)",
                }}>
                  Standard shipping fee: <strong style={{ color: "#C9A96E" }}>${DELIVERY_FEE.toFixed(2)}</strong> — added at checkout
                </div>
                <div className="cart-total-row">
                  <span className="cart-total-label">Subtotal ({totalItems} items)</span>
                  <span className="cart-total-val">${totalPrice.toFixed(2)}</span>
                </div>
                <button className="cart-checkout-btn" onClick={() => setStep("checkout")}>
                  <span>Proceed to Order</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
            <div className="cart-body">
              <button type="button" className="cart-back-btn" onClick={() => setStep("cart")}>
                Back to cart
              </button>
              <div className="cart-form-field">
                <label className="cart-form-label">Name *</label>
                <input className="cart-form-input" required value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
              </div>
              <div className="cart-form-field">
                <label className="cart-form-label">Phone Number *</label>
                <input className="cart-form-input" required type="tel" value={form.customer_phone}
                  onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} />
              </div>
              <div className="cart-form-field">
                <label className="cart-form-label">Location *</label>
                <input className="cart-form-input" required value={form.customer_location}
                  onChange={(e) => setForm({ ...form, customer_location: e.target.value })} />
              </div>
              <div className="cart-form-field">
                <label className="cart-form-label">Additional Notes</label>
                <textarea className="cart-form-textarea" rows={3} value={form.additional_notes}
                  onChange={(e) => setForm({ ...form, additional_notes: e.target.value })} />
              </div>
            </div>
            <div className="cart-footer">
              <div className="cart-total-row" style={{ marginBottom: "0.5rem" }}>
                <span className="cart-total-label">Subtotal</span>
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: "#3A3530" }}>
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="cart-total-row" style={{ marginBottom: "0.9rem" }}>
                <span className="cart-total-label">Standard Shipping Fee</span>
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: "#3A3530" }}>
                  ${DELIVERY_FEE.toFixed(2)}
                </span>
              </div>
              <div className="cart-total-row">
                <span className="cart-total-label">Total</span>
                <span className="cart-total-val">${(totalPrice + DELIVERY_FEE).toFixed(2)}</span>
              </div>
              <button type="submit" className="cart-checkout-btn" disabled={submitting}>
                <span>{submitting ? "Placing Order…" : "Place Order via WhatsApp"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
