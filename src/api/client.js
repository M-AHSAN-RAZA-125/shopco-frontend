// One place that knows where the backend lives and how to talk to it.
//
// Local dev  : http://localhost:5000        (backend PORT in its .env)
// Production : VITE_API_URL if you set it (Netlify/Vercel env variable),
//              otherwise the Vercel backend below.
const DEFAULT_PROD_API = "https://shopco-backend-theta.vercel.app";

const configuredApiUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:5000" : DEFAULT_PROD_API);

// Accepts "http://host", "http://host/api" or "http://host/api/products" and always returns ".../api"
export const API_BASE_URL = (() => {
  const apiUrl = new URL(configuredApiUrl, window.location.origin);
  const segments = apiUrl.pathname.split("/").filter(Boolean);
  while (["api", "products"].includes(segments.at(-1)?.toLowerCase())) segments.pop();
  apiUrl.pathname = `/${[...segments, "api"].join("/")}`;
  apiUrl.search = "";
  apiUrl.hash = "";
  return apiUrl.toString().replace(/\/+$/, "");
})();

const TOKEN_KEY = "shopco_token";

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage blocked: user simply has to log in again next visit */
  }
};

const LOCAL_HOSTS = ["localhost", "127.0.0.1", "[::1]"];

// Product images:
//  - "/images/xyz.png" lives in this frontend's /public/images  -> keep it relative
//  - "https://..." (e.g. Cloudinary) used as is
//  - anything else relative is loaded from the backend
export const getImageUrl = (image) => {
  const imagePath = typeof image === "string" ? image : image?.url || image?.path;
  if (!imagePath) return "";
  if (imagePath.startsWith("/images/")) return imagePath;

  try {
    const apiOrigin = new URL(API_BASE_URL, window.location.origin).origin;
    const imageUrl = new URL(imagePath, `${apiOrigin}/`);
    if (!["http:", "https:"].includes(imageUrl.protocol)) return "";

    // An old absolute localhost URL saved in the DB must not be used on the live site.
    if (LOCAL_HOSTS.includes(imageUrl.hostname) && !LOCAL_HOSTS.includes(new URL(apiOrigin).hostname)) {
      return new URL(`${imageUrl.pathname}${imageUrl.search}${imageUrl.hash}`, `${apiOrigin}/`).href;
    }
    return imageUrl.href;
  } catch {
    return "";
  }
};

// fetch() wrapper: adds the JWT, parses JSON and turns API errors into Error(message).
export const apiFetch = async (path, { method = "GET", body, auth = true } = {}) => {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token = auth ? getToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw Object.assign(new Error("Cannot reach the server. Please check your connection and try again."), { status: 0 });
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    /* empty / non-JSON body */
  }

  if (!response.ok || payload?.success === false) {
    const message =
      payload?.errors?.[0]?.msg
        ? `${payload.errors[0].path ? `${payload.errors[0].path}: ` : ""}${payload.errors[0].msg}`
        : payload?.message || `Request failed (HTTP ${response.status}).`;
    throw Object.assign(new Error(message), { status: response.status });
  }

  return payload;
};
