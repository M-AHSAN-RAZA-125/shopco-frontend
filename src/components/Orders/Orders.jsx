import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiFetch, getImageUrl } from "../../api/client";
import "./Orders.css";

const Orders = () => {
  const { user, authLoading } = useAuth();
  const location = useLocation();
  const placedOrderId = location.state?.placedOrderId;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    apiFetch("/orders/my")
      .then((data) => {
        if (!cancelled) setOrders(data.orders || []);
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (authLoading) return <div className="orders_page"><p>Loading...</p></div>;
  if (!user) return <Navigate to="/login" state={{ from: "/orders" }} replace />;

  return (
    <div className="orders_page">
      <h1 className="orders_heading">MY ORDERS</h1>

      {placedOrderId && (
        <div className="orders_success" role="status">
          ✅ Thank you! Your order was placed successfully. You will pay cash on delivery.
        </div>
      )}

      {loading && <p>Loading your orders...</p>}
      {!loading && error && <p className="orders_error" role="alert">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p>You have no orders yet. <Link to="/">Start shopping</Link></p>
      )}

      {orders.map((order) => (
        <div className={`order_card ${order._id === placedOrderId ? "highlight" : ""}`} key={order._id}>
          <div className="order_top">
            <div>
              <strong>Order #{String(order._id).slice(-8).toUpperCase()}</strong>
              <span className="order_date">{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <span className={`order_status status_${order.status}`}>{order.status}</span>
          </div>

          {order.items.map((item, index) => (
            <div className="order_item" key={`${order._id}-${index}`}>
              <img
                src={getImageUrl(item.image) || "/images/product-placeholder.svg"}
                alt={item.name}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/images/product-placeholder.svg";
                }}
              />
              <div className="order_item_info">
                <span className="order_item_name">{item.name}</span>
                <span className="order_item_meta">{item.size} · {item.color} · Qty {item.quantity}</span>
              </div>
              <span className="order_item_price">${item.price * item.quantity}</span>
            </div>
          ))}

          <div className="order_bottom">
            <span>
              Deliver to: {order.shippingAddress.fullName}, {order.shippingAddress.address}, {order.shippingAddress.city}
            </span>
            <strong>Total: ${order.total}</strong>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
