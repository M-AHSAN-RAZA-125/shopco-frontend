import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { API_BASE_URL, getImageUrl } from "../api/client";

const ProductsContext = createContext(null);
const PRODUCTS_API_URL = `${API_BASE_URL}/products?limit=100`;

const getProductList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.products)) return response.products;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.products)) return response.data.products;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data?.data?.products)) {
    return response.data.data.products;
  }
  throw new Error("The products API returned an unexpected response.");
};

const normalizeProduct = (product) => {
  const category = product.category?.name || product.categoryName || product.category || "";
  const image = product.image || product.images?.[0] || product.thumbnail || "";

  return {
    ...product,
    id: product._id || product.id,
    name: product.name || product.title || "Unnamed product",
    price: Number(product.price) || 0,
    category: typeof category === "string" ? category : "",
    image: getImageUrl(image),
  };
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(PRODUCTS_API_URL);
      if (!response.ok) {
        throw new Error(`Unable to load products (HTTP ${response.status}).`);
      }

      const payload = await response.json();
      setProducts(getProductList(payload).map(normalizeProduct));
    } catch (loadError) {
      setError(loadError.message || "Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <ProductsContext.Provider value={{ products, loading, error, reloadProducts: loadProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider.");
  }
  return context;
};
