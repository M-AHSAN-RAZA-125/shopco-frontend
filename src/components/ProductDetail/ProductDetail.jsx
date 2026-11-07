import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import ProductTabs from "../ProductTabs/ProductTabs";
import Cards from "../Cards/Cards";
import { useProducts } from "../../context/ProductsContext";
import "./ProductDetail.css";

const DEFAULT_SIZES = ["Small", "Medium", "Large", "X-Large"];
const DEFAULT_COLORS = ["Olive", "Teal", "Navy"];
// Swatch colours for the colour names stored in the database
const COLOR_HEX = { olive: "#4F533E", teal: "#2D4030", navy: "#31344F" };

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, loading, error, reloadProducts } = useProducts();

  // Interactive States
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("Large");
  const [quantity, setQuantity] = useState(1);
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);

  const product = products.find((item) => String(item.id) === String(id));

  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    setMainImage(product?.image || "");
  }, [product]);

  // New product opened -> reset the selectors to sensible defaults from the backend data
  useEffect(() => {
    if (!product) return;
    const list = product.sizes?.length ? product.sizes : DEFAULT_SIZES;
    setSelectedSize(list.includes("Large") ? "Large" : list[0]);
    setSelectedColor(0);
    setQuantity(1);
    setAddError("");
  }, [product]);

  if (!product) {
    if (loading) {
      return <div className="product_detail_message">Loading product...</div>;
    }

    if (error) {
      return (
        <div className="product_detail_message" role="alert">
          {error}{" "}
          <button type="button" onClick={reloadProducts}>Try again</button>
        </div>
      );
    }

    return (
      <div className="product_detail_message">
        <h2>Product Not Found!</h2>
      </div>
    );
  }

  const thumbnails = [product.image || "/images/product-placeholder.svg"];

  // Sizes / colours / stock come from the backend product (with the old defaults as fallback)
  const sizes = product.sizes?.length ? product.sizes : DEFAULT_SIZES;
  const colorNames = product.colors?.length ? product.colors : DEFAULT_COLORS;
  const colors = colorNames.map((name) => COLOR_HEX[name.toLowerCase()] || name.toLowerCase());
  const outOfStock = product.stock !== undefined && product.stock !== null && product.stock < 1;

  const handleAddToCart = async () => {
    if (adding) return;
    setAdding(true);
    setAddError("");
    // Logged in: saved on the server. Guest: saved in localStorage.
    const result = await addToCart(product, quantity, selectedSize, colorNames[selectedColor]);
    setAdding(false);
    if (result?.ok === false) {
      setAddError(result.message || "Could not add this item to your cart.");
      return;
    }
    navigate("/cart");
  };

  return (
    <div className="product_detail_page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>Home</span> &gt; <span>Shop</span> &gt; <span className="current">{product.name}</span>
      </div>

      <div className="product_main_section">
        {/* Left: Thumbnail Gallery */}
        <div className="gallery_container">
          <div className="thumbnail_list">
            {thumbnails.map((img, idx) => (
              <div
                key={idx}
                className={`thumb_box ${(mainImage || product.image) === img ? "active" : ""}`}
                onClick={() => setMainImage(img)}
              >
                <img
                  src={img}
                  alt={product.name}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = "/images/product-placeholder.svg";
                  }}
                />
              </div>
            ))}
          </div>

          <div className="main_image_box">
            <img
              src={mainImage || product.image || "/images/product-placeholder.svg"}
              alt={product.name}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = "/images/product-placeholder.svg";
              }}
            />
          </div>
        </div>

        {/* Right: Info & Selectors */}
        <div className="info_container">
          <h1 className="product_name">{product.name}</h1>
          {product.category && <p className="product_category">{product.category}</p>}
          
          <div className="rating_box">
            <span className="stars">★★★★☆</span>
            <span className="rating_score">{product.rating || "4.5"}/5</span>
          </div>

          <div className="price_box">
            <span className="current_price">${product.price}</span>
            {product.oldPrice && <span className="old_price">${product.oldPrice}</span>}
            {product.discount && <span className="discount_badge">{product.discount}</span>}
          </div>

          <p className="product_description">
            {product.description || "High quality custom fitted apparel made for daily style and ultimate comfort."}
          </p>

          <hr />

          {/* Color Selector */}
          <div className="option_section">
            <span className="option_label">Select Colors</span>
            <div className="color_picker">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`color_dot ${selectedColor === index ? "selected" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(index)}
                >
                  {selectedColor === index && <span className="check_icon">✓</span>}
                </div>
              ))}
            </div>
          </div>

          <hr />

          {/* Size Selector */}
          <div className="option_section">
            <span className="option_label">Choose Size</span>
            <div className="size_picker">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`size_btn ${selectedSize === size ? "active" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <hr />

          {/* Actions: Quantity + Add To Cart */}
          <div className="action_row">
            <div className="quantity_selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>

            <button className="add_to_cart_btn" onClick={handleAddToCart} disabled={adding || outOfStock}>
              {outOfStock ? "Out of Stock" : adding ? "Adding..." : "Add to Cart"}
            </button>
          </div>
          {addError && <p className="add_error" role="alert">{addError}</p>}
        </div>
      </div>

      <ProductTabs />
      <Cards title="YOU MIGHT ALSO LIKE" excludeId={product.id} limit={4} />
    </div>
  );
};

export default ProductDetail;