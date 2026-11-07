import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { apiFetch } from "../../api/client";
import "../Cart/Cart.css";
import "./Checkout.css";

// Same numbers as the cart page. The server recalculates everything itself, so this is only a preview.
const DISCOUNT_RATE = 0.2;
const DELIVERY_FEE = 15;

const Checkout = () => {
  const { user, authLoading } = useAuth();
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Pakistan",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (authLoading) return <div className="checkout_page"><p>Loading...</p></div>;
  if (!user) return <Navigate to="/login" state={{ from: "/checkout" }} replace />;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * DISCOUNT_RATE);
  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  const total = subtotal - discountAmount + deliveryFee;

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting || cart.length === 0) return;
    setError("");
    setSubmitting(true);

    try {
      const data = await apiFetch("/orders/checkout", { method: "POST", body: { shippingAddress: form } });
      await refreshCart(); // the server emptied the cart; mirror that on screen
      navigate("/orders", { state: { placedOrderId: data.order._id }, replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout_page">
        <h1 className="cart_main_heading">CHECKOUT</h1>
        <div className="empty_cart_msg">Your cart is empty. <Link to="/">Continue shopping</Link></div>
      </div>
    );
  }

  return (
    <div className="checkout_page">
      <div className="breadcrumb">
        <Link to="/">Home</Link> &gt; <Link to="/cart">Cart</Link> &gt; <span className="current">Checkout</span>
      </div>
      <h1 className="cart_main_heading">CHECKOUT</h1>

      <div className="cart_layout checkout_layout">
        <form className="cart_items_wrapper checkout_form" onSubmit={handleSubmit} id="checkout_form">
          <h3>Delivery details</h3>

          {error && <p className="checkout_error" role="alert">{error}</p>}

          <label className="checkout_field">
            <span>Full name</span>
            <input name="fullName" value={form.fullName} onChange={handleChange} required autoComplete="name" />
          </label>
          <label className="checkout_field">
            <span>Phone</span>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} required autoComplete="tel" />
          </label>
          <label className="checkout_field">
            <span>Address</span>
            <input name="address" value={form.address} onChange={handleChange} required autoComplete="street-address" />
          </label>
          <div className="checkout_row">
            <label className="checkout_field">
              <span>City</span>
              <input name="city" value={form.city} onChange={handleChange} required autoComplete="address-level2" />
            </label>
            <label className="checkout_field">
              <span>Postal code</span>
              <input name="postalCode" value={form.postalCode} onChange={handleChange} autoComplete="postal-code" />
            </label>
          </div>
          <label className="checkout_field">
            <span>Country</span>
            <input name="country" value={form.country} onChange={handleChange} autoComplete="country-name" />
          </label>

          <div className="checkout_payment">
            <strong>Payment:</strong> Cash on delivery
          </div>
        </form>

        <div className="order_summary_card">
          <h3>Order Summary</h3>
          {cart.map((item) => (
            <div className="summary_row" key={`${item.id}-${item.size}-${item.color}`}>
              <span className="label">{item.name} ({item.size}, {item.color}) × {item.quantity}</span>
              <span className="val bold">${item.price * item.quantity}</span>
            </div>
          ))}
          <hr className="summary_divider" />
          <div className="summary_row">
            <span className="label">Subtotal</span>
            <span className="val bold">${subtotal}</span>
          </div>
          <div className="summary_row">
            <span className="label">Discount (-20%)</span>
            <span className="val discount">-${discountAmount}</span>
          </div>
          <div className="summary_row">
            <span className="label">Delivery Fee</span>
            <span className="val bold">${deliveryFee}</span>
          </div>
          <hr className="summary_divider" />
          <div className="summary_row total_row">
            <span className="label">Total</span>
            <span className="val total_price">${total}</span>
          </div>

          <button className="checkout_btn" type="submit" form="checkout_form" disabled={submitting}>
            {submitting ? "Placing order..." : "Place Order"} <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
