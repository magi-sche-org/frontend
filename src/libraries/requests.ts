import { API_ENDPOINT } from "@/libraries/env";

const requests = async <T = unknown>(
  url: string,
  init?: RequestInit | undefined,
  type: "json" | "text" = "json",
): Promise<T> => {
  const req = await fetch(`${API_ENDPOINT}${url}`, {
    credentials: "include",
    ...init,
  });
  return (type === "json" ? await req.json() : await req.text()) as T;
};

export { requests };
