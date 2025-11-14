declare module "../config/api.js" {
  const API_BASE_URL: string;
  export default API_BASE_URL;

  export const API_ENDPOINTS: Record<string, string>;
}
