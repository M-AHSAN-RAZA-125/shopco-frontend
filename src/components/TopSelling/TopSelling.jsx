import React from "react";
import "../Cards/ProductCard.css";
import ViewBtn from "../ViewBtn/ViewBtn";
import ProductTile from "../ProductTile/ProductTile";
import { useProducts } from "../../context/ProductsContext";

const TopSelling = () => {
  const { products, loading, error, reloadProducts } = useProducts();
  // "Top selling" = best rated products (stable sort keeps the original order on ties)
  const topProducts = [...products].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0)).slice(0, 4);

  return (
    <section className="product_section">
      <h2 className="section_heading">TOP SELLING</h2>

      <div className="product_grid">
        {loading && <p className="products_message">Loading products...</p>}
        {!loading && error && (
          <p className="products_message" role="alert">
            {error}{" "}
            <button type="button" onClick={reloadProducts}>Try again</button>
          </p>
        )}
        {!loading && !error && products.length === 0 && (
          <p className="products_message">No products are available right now.</p>
        )}
        {!loading && !error && topProducts.map((product) => (
          <ProductTile key={product.id} product={product} />
        ))}
      </div>

      <ViewBtn />
    </section>
  );
};

export default TopSelling;