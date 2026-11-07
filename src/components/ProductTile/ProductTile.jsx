import React from "react";
import { Link } from "react-router-dom";
import "./ProductTile.css";

const ProductTile = ({ product }) => (
  <Link
    to={`/product/${product.id}`}
    className="product_tile_link"
    key={product.id}
  >
    <div className="product_card">
      <div className="card_img_wrapper">
        <img
          src={product.image || "/images/product-placeholder.svg"}
          alt={product.name}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = "/images/product-placeholder.svg";
          }}
        />
      </div>
      <h3 className="product_title">{product.name}</h3>
      {product.category && <p className="product_category">{product.category}</p>}
      <div className="product_rating">
        <span className="stars">★★★★☆</span>
        <span className="rating_num">{product.rating || "4.5"}/5</span>
      </div>
      <div className="product_price_box">
        <span className="current_price">${product.price}</span>
        {product.oldPrice && <span className="old_price">${product.oldPrice}</span>}
        {product.discount && <span className="discount_badge">{product.discount}</span>}
      </div>
    </div>
  </Link>
);

export default ProductTile;
