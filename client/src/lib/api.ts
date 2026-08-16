// In development the Vite dev server proxies /api to the backend, which keeps the
// auth cookie same-origin. In production the API base is supplied at build time.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";
