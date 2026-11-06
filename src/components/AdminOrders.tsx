import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchOrders, fetchOrderItems, updateOrderStatus } from "@/lib/orders";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Package } from "lucide-react";

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: fetchOrders,
  });

  const { data: orderItems = [] } = useQuery({
    queryKey: ["order-items", expandedOrder],
    queryFn: () => (expandedOrder ? fetchOrderItems(expandedOrder) : Promise.resolve([])),
    enabled: !!expandedOrder,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Status updated");
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <>
      <style>{`
        .ao-status-badge {
          font-family: 'Jost', sans-serif; font-size: 0.55rem; font-weight: 300;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 0.25rem 0.7rem; border: 1px solid rgba(201,169,110,0.3);
          white-space: nowrap;
        }
        .ao-status-pending { color: #C9A96E; border-color: rgba(201,169,110,0.4); }
        .ao-status-confirmed { color: #5A8F5A; border-color: rgba(90,143,90,0.4); }
        .ao-status-shipped { color: #5A7A8F; border-color: rgba(90,122,143,0.4); }
        .ao-status-delivered { color: #3A7A3A; border-color: rgba(58,122,58,0.4); }
        .ao-status-cancelled { color: #9B3A3A; border-color: rgba(155,58,58,0.3); }

        .ao-expand-btn {
          background: none; border: none; color: #8B8075; cursor: pointer;
          transition: color 0.25s;
        }
        .ao-expand-btn:hover { color: #3A3530; }

        .ao-detail-row {
          background: rgba(201,169,110,0.04);
        }
        .ao-detail-inner {
          padding: 1.2rem 2rem;
        }
        .ao-detail-label {
          font-family: 'Jost', sans-serif; font-size: 0.55rem; font-weight: 300;
          letter-spacing: 0.2em; text-transform: uppercase; color: #8B8075;
          margin-bottom: 0.3rem;
        }
        .ao-detail-value {
          font-family: 'Jost', sans-serif; font-size: 0.75rem; font-weight: 300; color: #0D0D0D;
          margin-bottom: 1rem;
        }
        .ao-items-list {
          list-style: none; padding: 0; margin: 0;
        }
        .ao-items-list li {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(201,169,110,0.08);
          font-family: 'Jost', sans-serif; font-size: 0.72rem; font-weight: 300; color: #3A3530;
        }
        .ao-items-list li:last-child { border-bottom: none; }

        .ao-status-select {
          font-family: 'Jost', sans-serif; font-size: 0.6rem; font-weight: 300;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 0.35rem 0.6rem;
          border: 1px solid rgba(201,169,110,0.3);
          background: transparent; color: #3A3530; cursor: pointer;
          outline: none;
        }
        .ao-status-select:focus { border-color: #C9A96E; }
      `}</style>

      {isLoading ? (
        <div className="ad-loading">Loading orders…</div>
      ) : orders.length === 0 ? (
        <div className="ad-empty">
          <Package size={44} />
          <h3>No orders yet</h3>
          <p>Orders will appear here when customers place them</p>
        </div>
      ) : (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <>
                  <tr key={order.id}>
                    <td>
                      <span className="ad-table-price">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td><span className="ad-table-name">{order.customer_name}</span></td>
                    <td><span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", fontWeight: 300, color: "#3A3530" }}>{order.customer_phone}</span></td>
                    <td><span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", fontWeight: 300, color: "#3A3530" }}>{order.customer_location}</span></td>
                    <td><span className="ad-table-price">${Number(order.total).toFixed(2)}</span></td>
                    <td>
                      <select
                        className="ao-status-select"
                        value={order.status}
                        onChange={(e) => statusMutation.mutate({ id: order.id, status: e.target.value })}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        className="ao-expand-btn"
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      >
                        {expandedOrder === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </td>
                  </tr>
                  {expandedOrder === order.id && (
                    <tr key={`detail-${order.id}`} className="ao-detail-row">
                      <td colSpan={7}>
                        <div className="ao-detail-inner">
                          {order.additional_notes && (
                            <>
                              <div className="ao-detail-label">Notes</div>
                              <div className="ao-detail-value">{order.additional_notes}</div>
                            </>
                          )}
                          <div className="ao-detail-label">Items</div>
                          <ul className="ao-items-list">
                            {orderItems.map((item) => (
                              <li key={item.id}>
                                <span>{item.product_name} × {item.quantity}</span>
                                <span>${(Number(item.product_price) * item.quantity).toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AdminOrders;
