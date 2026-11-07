import React from "react";
import "./ProductCard.css";
import ViewBtn from "../ViewBtn/ViewBtn";
import ProductTile from "../ProductTile/ProductTile";
import { useProducts } from "../../context/ProductsContext";

const Cards = ({ title = "NEW ARRIVALS", limit = 4, excludeId }) => {
    const { products, loading, error, reloadProducts } = useProducts();
    const visibleProducts = products
        .filter((product) => String(product.id) !== String(excludeId))
        .slice(0, limit);

    return (
        <section className="product_section">
            <h2 className="section_heading">{title}</h2>

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
                {!loading && !error && visibleProducts.map((product) => (
                    <ProductTile key={product.id} product={product} />
                ))}
            </div>

            <ViewBtn />
        </section>
    );
};

export default Cards;