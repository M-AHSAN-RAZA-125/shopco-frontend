import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import "./Cart.css";

const Cart = () => {
  const { cart, cartError, cartBusy, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");

  // Calculations based on dynamic cart
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * 0.2); // 20% discount
  const deliveryFee = subtotal > 0 ? 15 : 0;
  const totalPrice = subtotal - discountAmount + deliveryFee;

  return (
    <div className="cart_page_container">
      <div className="breadcrumb">
        <span>Home</span> &gt; <span className="current">Cart</span>
      </div>

      <h1 className="cart_main_heading">YOUR CART</h1>

      {cartError && <div className="cart_error_msg" role="alert">{cartError}</div>}

      {cart.length === 0 ? (
        <div className="empty_cart_msg">Your cart is empty.</div>
      ) : (
        <div className="cart_layout">
          {/* Cart Items List */}
          <div className="cart_items_wrapper">
            {cart.map((item, index) => (
              <React.Fragment key={`${item.id}-${item.size}-${item.color}-${index}`}>
                <div className="cart_item_card">
                  <div className="item_img_box">
                    <img
                      src={item.image || "/images/product-placeholder.svg"}
                      alt={item.name}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/images/product-placeholder.svg";
                      }}
                    />
                  </div>

                  <div className="item_details">
                    <div className="item_header">
                      <h3 className="item_title">{item.name}</h3>
                      <button 
                        className="delete_icon_btn" 
                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                      >
                        🗑️
                      </button>
                    </div>

                    <p className="item_meta">Size: <span>{item.size}</span></p>
                    <p className="item_meta">Color: <span>{item.color}</span></p>

                    <div className="item_footer">
                      <span className="item_price">${item.price}</span>
                      <div className="quantity_counter">
                        <button onClick={() => updateQuantity(item.id, item.size, item.color, "decrease")}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.size, item.color, "increase")}>+</button>
                      </div>
                    </div>
                  </div>
                </div>
                {index < cart.length - 1 && <hr className="divider_line" />}
              </React.Fragment>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order_summary_card">
            <h3>Order Summary</h3>
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
              <span className="val total_price">${totalPrice}</span>
            </div>

            <div className="promo_box">
              <div className="input_wrapper">
                <span className="tag_icon">🏷️</span>
                <input 
                  type="text" 
                  placeholder="Add promo code" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
              </div>
              <button className="apply_btn">Apply</button>
            </div>

            <button
              className="checkout_btn"
              disabled={cartBusy}
              onClick={() => navigate(user ? "/checkout" : "/login", { state: { from: "/checkout" } })}
            >
              {user ? "Go to Checkout" : "Log in to Checkout"} <span>→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;