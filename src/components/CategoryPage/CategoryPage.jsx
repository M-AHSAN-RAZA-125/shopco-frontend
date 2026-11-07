import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./CategoryPage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import ProductTile from "../ProductTile/ProductTile";
import { useProducts } from "../../context/ProductsContext";

// "Dress styles" on the home page are not product categories in the database,
// so each style shows the categories that belong to it.
const STYLE_CATEGORIES = {
    casual: ["t-shirts", "jeans", "shorts"],
    formal: ["shirts"],
    party: ["shirts", "jeans"],
    gym: ["t-shirts", "shorts"],
};

const SIDEBAR_CATEGORIES = ["T-shirts", "Shorts", "Shirts", "Hoodies", "Jeans"];

const CategoryPage = () => {
    const { categoryName } = useParams();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { products, loading, error, reloadProducts } = useProducts();

    const slug = (categoryName || "all").toLowerCase();
    const pageTitle = slug === "all"
        ? "All Products"
        : (categoryName || "").charAt(0).toUpperCase() + (categoryName || "").slice(1);

    const categoryProducts = useMemo(() => {
        if (slug === "all") return products;
        const wanted = STYLE_CATEGORIES[slug] || [slug];
        return products.filter((product) => wanted.includes(product.category.toLowerCase()));
    }, [products, slug]);

    return (
        <div className="category_page">
            <div className="breadcrumb">
                <span>Home</span> &gt; <span className="current">{pageTitle}</span>
            </div>

            <div className="category_container">
                {/* Mobile Filters Modal Overlay */}
                <aside className={`filters_sidebar ${isFilterOpen ? "open" : ""}`}>
                    <div className="filter_header">
                        <h3>Filters</h3>
                        {/* Mobile close button */}
                        <span className="close_btn" onClick={() => setIsFilterOpen(false)}>✕</span>
                    </div>
                    <hr />

                    <ul className="category_list">
                        {SIDEBAR_CATEGORIES.map((name) => (
                            <li key={name}>
                                <Link to={`/category/${name}`} className="category_link" onClick={() => setIsFilterOpen(false)}>
                                    {name} <span>›</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <hr />

                    <div className="filter_section">
                        <h4>Price</h4>
                        <input type="range" min="50" max="200" className="price_range" />
                        <div className="price_labels">
                            <span>$50</span>
                            <span>$200</span>
                        </div>
                    </div>
                    <hr />

                    <div className="filter_section">
                        <h4>Colors</h4>
                        <div className="color_options">
                            <span className="color_circle green"></span>
                            <span className="color_circle red"></span>
                            <span className="color_circle yellow"></span>
                            <span className="color_circle orange"></span>
                            <span className="color_circle cyan"></span>
                            <span className="color_circle blue"></span>
                            <span className="color_circle purple"></span>
                            <span className="color_circle pink"></span>
                            <span className="color_circle white"></span>
                            <span className="color_circle black"></span>
                        </div>
                    </div>
                    <hr />

                    <div className="filter_section">
                        <h4>Size</h4>
                        <div className="size_badges">
                            <span className="size_btn">XX-Small</span>
                            <span className="size_btn">X-Small</span>
                            <span className="size_btn">Small</span>
                            <span className="size_btn">Medium</span>
                            <span className="size_btn active">Large</span>
                            <span className="size_btn">X-Large</span>
                        </div>
                    </div>
                    <hr />

                    <button className="apply_filter_btn" onClick={() => setIsFilterOpen(false)}>
                        Apply Filter
                    </button>
                </aside>

                {/* Backdrop for closing modal when clicked outside */}
                {isFilterOpen && <div className="filter_backdrop" onClick={() => setIsFilterOpen(false)}></div>}

                {/* Right Products Content */}
                <main className="category_content">
                    <div className="content_header">
                        <h2>{pageTitle}</h2>
                        <div className="sorting_info">
                            <span className="showing_text">
                                Showing {categoryProducts.length ? `1-${categoryProducts.length}` : "0"} of {categoryProducts.length} Products
                            </span>

                            {/* Mobile Filter Toggle Button */}
                            <button className="mobile_filter_icon" onClick={() => setIsFilterOpen(true)}>
                                <span><FontAwesomeIcon icon={faFilter} /></span>
                            </button>
                        </div>
                    </div>

                    <div className="shop_product_grid">
                        {loading && <p className="products_message">Loading products...</p>}
                        {!loading && error && (
                            <p className="products_message" role="alert">
                                {error}{" "}
                                <button type="button" onClick={reloadProducts}>Try again</button>
                            </p>
                        )}
                        {!loading && !error && categoryProducts.length === 0 && (
                            <p className="products_message">No products found in this category.</p>
                        )}
                        {!loading && !error && categoryProducts.map((product) => (
                            <ProductTile key={product.id} product={product} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CategoryPage;