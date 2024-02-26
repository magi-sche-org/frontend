export const API_ENDPOINT =
  process.env.NEXT_PUBLIC_API_ENDPOINT ??
  process.env.API_ENDPOINT ??
  "http://localhost:8080";

export const CALLBACK_URL_KEY = "redirect_url";
