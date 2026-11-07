import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductTile from "../ProductTile/ProductTile";
import { useProducts } from "../../context/ProductsContext";
import "../CategoryPage/CategoryPage.css";

const SearchPage = () => {
  const [params] = useSearchParams();
  const query = (params.get("q") || "").trim();
  const { products, loading, error, reloadProducts } = useProducts();

  const results = useMemo(() => {
    const needle = query.toLowerCase();
    if (!needle) return [];
    return products.filter((product) =>
      `${product.name} ${product.category} ${product.description || ""}`.toLowerCase().includes(needle)
    );
  }, [products, query]);

  return (
    <div className="category_page">
      <div className="breadcrumb">
        <span>Home</span> &gt; <span className="current">Search</span>
      </div>

      <div className="category_container">
        <main className="category_content">
          <div className="content_header">
            <h2>{query ? `Results for “${query}”` : "Search"}</h2>
            <div className="sorting_info">
              <span className="showing_text">{results.length} Products</span>
            </div>
          </div>

          <div className="shop_product_grid">
            {loading && <p className="products_message">Loading products...</p>}
            {!loading && error && (
              <p className="products_message" role="alert">
                {error} <button type="button" onClick={reloadProducts}>Try again</button>
              </p>
            )}
            {!loading && !error && !query && <p className="products_message">Type something in the search box above.</p>}
            {!loading && !error && query && results.length === 0 && (
              <p className="products_message">No products matched your search.</p>
            )}
            {!loading && !error && results.map((product) => <ProductTile key={product.id} product={product} />)}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
