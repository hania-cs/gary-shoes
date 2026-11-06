import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const CartIcon = () => {
  const { totalItems, setIsOpen } = useCart();

  return (
    <>
      <style>{`
        .cart-icon-btn {
          position: fixed;
          bottom: 100px;
          right: 24px;
          z-index: 100;
          width: 52px; height: 52px;
          border-radius: 50%;
          background: rgba(250,247,242,0.9);
          border: 1px solid rgba(201,169,110,0.35);
          backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: #3A3530;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }
        .cart-icon-btn:hover {
          border-color: #C9A96E;
          box-shadow: 0 6px 28px rgba(201,169,110,0.2);
        }
        .cart-badge {
          position: absolute;
          top: -4px; right: -4px;
          min-width: 20px; height: 20px;
          background: #C9A96E;
          color: #FAF7F2;
          font-family: 'Jost', sans-serif;
          font-size: 0.6rem;
          font-weight: 400;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          padding: 0 4px;
        }
      `}</style>
      <button className="cart-icon-btn" onClick={() => setIsOpen(true)} aria-label="Open cart">
        <ShoppingBag size={20} />
        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
      </button>
    </>
  );
};

export default CartIcon;
